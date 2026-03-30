import { NextRequest, NextResponse } from 'next/server';
import queriesData from '@/data/queries.json';
import { recommend } from '@/lib/recommend';

interface RawTableRow {
  category: string;
  exact: number;
  approx: number;
  error: number;
}

interface RawQuery {
  id: string;
  name: string;
  sql: string;
  exactTime: number;
  approxTime: number;
  exactResult: number;
  approxResult: number;
  tableRows: RawTableRow[];
}

interface DatasetEntry {
  description: string;
  columns: string[];
  queries: RawQuery[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, mode, accuracyLevel, dataset } = body as {
      query: string;
      mode: string;
      accuracyLevel: number;
      dataset: string;
    };

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query string is required' },
        { status: 400 }
      );
    }

    const datasetName = (dataset || 'hits').toLowerCase().trim();
    const datasets = queriesData.datasets as Record<string, DatasetEntry>;
    const selectedDataset = datasets[datasetName];

    if (!selectedDataset) {
      return NextResponse.json(
        {
          error: `Dataset "${datasetName}" not found. Available: ${Object.keys(datasets).join(', ')}`,
        },
        { status: 404 }
      );
    }

    // Simulate processing delay (200-600ms server-side)
    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 400)
    );

    // Pick a query from the dataset based on a hash of the input query
    const queries = selectedDataset.queries;
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      hash = ((hash << 5) - hash + query.charCodeAt(i)) | 0;
    }
    const index = Math.abs(hash) % queries.length;
    const selected = queries[index];

    // Apply accuracy level scaling — higher accuracy → less error, slower approx time
    const accuracyFactor = accuracyLevel / 100; // 0.5 – 1.0
    const errorScale = 1.5 - accuracyFactor; // 1.0 – 0.5
    const timeScale = 0.5 + accuracyFactor * 0.5; // 0.75 – 1.0

    const adjustedApproxTime = Math.round(selected.approxTime * timeScale);
    const speedup = parseFloat(
      (selected.exactTime / adjustedApproxTime).toFixed(1)
    );

    const adjustedTableRows = selected.tableRows.map((row: RawTableRow) => ({
      ...row,
      error: parseFloat((row.error * errorScale).toFixed(2)),
      approx: Math.round(
        row.exact *
          (1 +
            (row.approx >= row.exact ? 1 : -1) *
              ((row.error * errorScale) / 100))
      ),
    }));

    const totalError = parseFloat(
      (
        adjustedTableRows.reduce(
          (sum: number, r: RawTableRow) => sum + r.error,
          0
        ) / adjustedTableRows.length
      ).toFixed(2)
    );

    const adjustedApproxResult = Math.round(
      selected.exactResult *
        (1 +
          (selected.approxResult >= selected.exactResult ? 1 : -1) *
            (totalError / 100))
    );

    const recommendation = recommend(speedup, accuracyLevel, totalError);

    return NextResponse.json({
      exactTime: selected.exactTime,
      approxTime: adjustedApproxTime,
      speedup,
      exactResult: selected.exactResult,
      approxResult: adjustedApproxResult,
      error: totalError,
      tableRows: adjustedTableRows,
      recommendation,
      source: selected.name,
      dataset: datasetName,
      datasetDescription: selectedDataset.description,
    });
  } catch (error) {
    console.error('Query API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const datasets = queriesData.datasets as Record<string, DatasetEntry>;
  return NextResponse.json({
    datasets: Object.entries(datasets).map(([name, ds]) => ({
      name,
      description: ds.description,
      columns: ds.columns,
      queryCount: ds.queries.length,
    })),
  });
}
