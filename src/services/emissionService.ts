import fs from 'fs';
import path from 'path';
import { IndustryDataset } from './dataFetcher';

const dataFolder = path.resolve(process.cwd(), 'data');

export function loadDataset(filename: string): IndustryDataset | null {
  const filepath = path.join(dataFolder, filename);
  if (!fs.existsSync(filepath)) {
    return null;
  }
  const file = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(file) as IndustryDataset;
}

export function calculateCementMetrics(dataset: IndustryDataset) {
  const values = dataset.values;
  const totals = values.reduce(
    (acc, row) => {
      acc.emissions += Number(row.cement_co2) || 0;
      return acc;
    },
    { emissions: 0 }
  );

  return {
    totalEmissions: totals.emissions,
    intensity: 0.55,
    processShare: 65,
    fuelShare: 35,
    thermalEnergy: 3.5,
    electricityIntensity: 91,
    trend: values.slice(-12),
  };
}

export function calculateSteelMetrics(dataset: IndustryDataset) {
  const values = dataset.values;
  const totals = values.reduce(
    (acc, row) => {
      acc.emissions += Number(row.ghg_excluding_lucf) || 0;
      return acc;
    },
    { emissions: 0 }
  );

  return {
    totalEmissions: totals.emissions,
    routeIntensities: {
      bfBof: 2.33,
      driEaf: 1.4,
      scrapEaf: 0.7,
    },
    trend: values.slice(-12),
  };
}

export function calculateSemiconductorMetrics(dataset: IndustryDataset) {
  const values = dataset.values;
  const totals = values.reduce(
    (acc, row) => {
      acc.energyPerCapita += Number(row.energy_per_capita) || 0;
      acc.co2 += Number(row.co2) || 0;
      return acc;
    },
    { energyPerCapita: 0, co2: 0 }
  );

  return {
    totalEnergy: totals.energyPerCapita,
    totalEmissions: totals.co2,
    factor: 0.82,
    scope1: 20,
    scope2: 80,
    trend: values.slice(-12),
  };
}
