import os
import re
import time
import threading
from pathlib import Path
from contextlib import asynccontextmanager

import duckdb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DATA_DIR = os.environ.get(
    "APROQL_DATA_DIR",
    str(Path(__file__).resolve().parent / "data"),
)
EXTENSION_PATH = os.environ.get("APROQL_EXTENSION_PATH", "")

# Sample percentages to benchmark across (low → high accuracy)
SAMPLE_LEVELS = [1, 5, 10, 25, 50, 75, 100]

# ---------------------------------------------------------------------------
# DuckDB state
# ---------------------------------------------------------------------------
_conn: duckdb.DuckDBPyConnection | None = None
_loaded: set[str] = set()
_lock = threading.Lock()


def _get_conn() -> duckdb.DuckDBPyConnection:
    global _conn
    if _conn is None:
        _conn = duckdb.connect()
        if EXTENSION_PATH:
            try:
                _conn.execute(f"LOAD '{EXTENSION_PATH}'")
                print(f"[aproql] extension loaded from {EXTENSION_PATH}")
            except Exception as e:
                print(f"[aproql] extension load skipped: {e}")
    return _conn


def _ensure_dataset(name: str) -> None:
    if name in _loaded:
        return
    conn = _get_conn()
    for ext, reader in ((".parquet", "read_parquet"), (".csv", "read_csv_auto")):
        path = os.path.join(DATA_DIR, f"{name}{ext}")
        if os.path.isfile(path):
            conn.execute(
                f'CREATE TABLE IF NOT EXISTS "{name}" AS SELECT * FROM {reader}(\'{path}\')'
            )
            _loaded.add(name)
            count = conn.sql(f'SELECT COUNT(*) FROM "{name}"').fetchone()[0]
            print(f"[aproql] loaded {name} ({count:,} rows)")
            return

    available = [
        p.stem for p in Path(DATA_DIR).glob("*")
        if p.suffix in (".parquet", ".csv")
    ] if Path(DATA_DIR).is_dir() else []
    raise HTTPException(
        404,
        f"Dataset '{name}' not found in {DATA_DIR}. "
        f"Available: {', '.join(available) or '(none)'}",
    )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _rewrite_for_sample(sql: str, table: str, pct: float) -> str:
    """Wrap the table reference in a sampled subquery.

    E.g. ``FROM bench GROUP BY …``
      →  ``FROM (SELECT * FROM "bench" TABLESAMPLE SYSTEM(10 PERCENT)) AS bench …``
    Using a subquery avoids parse errors with GROUP BY / ORDER BY / WHERE.
    """
    pattern = re.compile(rf"(FROM|JOIN)\s+{re.escape(table)}\b", re.IGNORECASE)
    subquery = (
        rf'\1 (SELECT * FROM "{table}" TABLESAMPLE SYSTEM({pct} PERCENT)) AS {table}'
    )
    return pattern.sub(subquery, sql, count=1)


def _extract_scalar(rows: list, ncols: int) -> float:
    """Get the primary numeric value from a result set."""
    if not rows:
        return 0.0
    for ci in range(ncols - 1, -1, -1):
        v = rows[0][ci]
        if v is not None:
            try:
                return float(v)
            except (TypeError, ValueError):
                continue
    return 0.0


def _error_pct(approx: float, exact: float) -> float:
    if exact == 0:
        return 0.0 if approx == 0 else 100.0
    return round(abs(approx - exact) / abs(exact) * 100, 2)


# ---------------------------------------------------------------------------
# Request model
# ---------------------------------------------------------------------------
class QueryRequest(BaseModel):
    query: str
    dataset: str = "hits"
    accuracyLevel: int = 90
    mode: str = "both"


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[aproql] data_dir = {DATA_DIR}")
    if not Path(DATA_DIR).is_dir():
        print("[aproql] WARNING: data directory does not exist — create it and add .parquet/.csv files")
    yield
    global _conn
    if _conn:
        _conn.close()
        _conn = None


app = FastAPI(title="aproql", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/query")
def run_query(req: QueryRequest):
    sql = req.query.strip()
    if not sql:
        raise HTTPException(400, "Query string is required")

    dataset = req.dataset.lower().strip()

    with _lock:
        _ensure_dataset(dataset)
        conn = _get_conn()

        # ---- Exact query (100% of data — ground truth) ----
        t0 = time.perf_counter()
        try:
            exact_rel = conn.sql(sql)
            exact_cols = exact_rel.columns
            exact_rows = exact_rel.fetchall()
        except Exception as e:
            raise HTTPException(400, f"Query error: {e}")
        exact_ms = round((time.perf_counter() - t0) * 1000, 1)

        ncols = len(exact_cols)
        exact_val = _extract_scalar(exact_rows, ncols)

        # ---- Run at each sample level ----
        runs: list[dict] = []
        for pct in SAMPLE_LEVELS:
            if pct >= 100:
                # 100% = exact query, already timed above
                runs.append({
                    "samplePercent": 100,
                    "time": exact_ms,
                    "error": 0.0,
                    "accuracy": 100.0,
                })
                continue

            approx_sql = _rewrite_for_sample(sql, dataset, pct)
            t1 = time.perf_counter()
            try:
                approx_rel = conn.sql(approx_sql)
                approx_rows = approx_rel.fetchall()
            except Exception as e:
                print(f"[aproql] sample {pct}% failed: {e}")
                continue
            run_ms = round((time.perf_counter() - t1) * 1000, 1)

            if not approx_rows:
                # System sampling returned 0 rows — skip this level
                continue

            approx_val = _extract_scalar(approx_rows, ncols)
            err = _error_pct(approx_val, exact_val)

            runs.append({
                "samplePercent": pct,
                "time": run_ms,
                "error": err,
                "accuracy": round(100 - err, 2),
            })

    return {
        "exactTime": exact_ms,
        "exactResult": exact_val,
        "runs": runs,
        "dataset": dataset,
    }


@app.get("/api/datasets")
def list_datasets():
    dp = Path(DATA_DIR)
    if not dp.is_dir():
        return {"datasets": [], "dataDir": DATA_DIR, "error": "Data directory not found"}

    datasets = []
    for p in sorted(dp.glob("*")):
        if p.suffix not in (".parquet", ".csv"):
            continue
        name = p.stem
        if re.match(r".+_\d+pct$", name):
            continue
        datasets.append({
            "name": name,
            "file": p.name,
            "sizeMB": round(p.stat().st_size / 1_048_576, 1),
        })
    return {"datasets": datasets, "dataDir": DATA_DIR}


@app.get("/api/datasets/{name}/columns")
def dataset_columns(name: str):
    dataset = name.lower().strip()
    with _lock:
        _ensure_dataset(dataset)
        conn = _get_conn()
        rel = conn.sql(f'SELECT * FROM "{dataset}" LIMIT 0')
        cols = [
            {"name": c, "type": str(t)}
            for c, t in zip(rel.columns, rel.types)
        ]
    return {"dataset": dataset, "columns": cols}
