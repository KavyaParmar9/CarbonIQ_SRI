// Lightweight dataset summaries for UI previews and basic EDA

export function summarizeJsonDataset(dataset: any) {
  if (!dataset) return { available: false };
  const summary: any = { available: true };
  if (Array.isArray(dataset.values)) {
    summary.rowCount = dataset.values.length;
    summary.sample = dataset.values.slice(0, 3);
  } else if (Array.isArray(dataset)) {
    summary.rowCount = dataset.length;
    summary.sample = dataset.slice(0, 3);
  } else {
    summary.rowCount = 0;
    summary.sample = dataset;
  }

  if (dataset.meta) summary.meta = dataset.meta;
  if (dataset.name) summary.name = dataset.name;
  return summary;
}
