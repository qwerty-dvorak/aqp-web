-- Run once to set up the aproql database schema

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  google_id     VARCHAR(255) UNIQUE NOT NULL,
  email         VARCHAR(255) NOT NULL,
  name          VARCHAR(255),
  image         VARCHAR(512),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS query_history (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query           TEXT NOT NULL,
  dataset         VARCHAR(255) NOT NULL DEFAULT 'hits',
  accuracy_level  INTEGER,
  mode            VARCHAR(50),
  exact_time_ms   DOUBLE PRECISION,
  approx_time_ms  DOUBLE PRECISION,
  speedup         DOUBLE PRECISION,
  error_pct       DOUBLE PRECISION,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_user ON query_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_created ON query_history(created_at DESC);
