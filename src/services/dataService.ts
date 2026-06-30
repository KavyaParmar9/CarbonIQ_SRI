import { buildLocalDatasets } from './dataFetcher';
import { calculateCementMetrics, calculateSemiconductorMetrics, calculateSteelMetrics } from './emissionService';

export async function refreshDataCache() {
  try {
    const datasets = await buildLocalDatasets();
    const cementMetrics = calculateCementMetrics(datasets.cement as any);
    const steelMetrics = calculateSteelMetrics(datasets.steel as any);
    const semiconductorMetrics = calculateSemiconductorMetrics(datasets.semiconductor as any);
    return { cementMetrics, steelMetrics, semiconductorMetrics };
  } catch (error) {
    console.error('Error refreshing data cache', error);
    return null;
  }
}
