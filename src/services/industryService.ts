import { loadDataset } from './emissionService';
import { IndustryDataset } from './dataFetcher';

export type IndustryModel = {
  id: string;
  name: string;
  dataset: IndustryDataset | null;
  metrics: Record<string, any>;
};

export function loadIndustryModels() {
  const cement = loadDataset('cement.json');
  const steel = loadDataset('steel.json');
  const semiconductor = loadDataset('semiconductor.json');

  return [
    {
      id: 'cement',
      name: 'Cement',
      dataset: cement,
      metrics: cement ? { totalEmissions: cement.values.length } : {},
    },
    {
      id: 'steel',
      name: 'Steel',
      dataset: steel,
      metrics: steel ? { totalEmissions: steel.values.length } : {},
    },
    {
      id: 'semiconductor',
      name: 'Semiconductor',
      dataset: semiconductor,
      metrics: semiconductor ? { totalEmissions: semiconductor.values.length } : {},
    },
  ];
}
