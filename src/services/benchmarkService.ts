import fs from 'fs';
import path from 'path';

const dataFolder = path.resolve(process.cwd(), 'data');

export function loadBenchmarkData() {
  const filepath = path.join(dataFolder, 'cbam.json');
  if (!fs.existsSync(filepath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

export function getBenchmarkSummary() {
  const benchmark = loadBenchmarkData();
  if (!benchmark) return { summaries: [] };

  return {
    summaries: benchmark.values.map((entry: any) => ({
      title: entry.title,
      methodology: entry.methodology,
      findings: entry.findings,
      limitations: entry.limitations,
    })),
  };
}
