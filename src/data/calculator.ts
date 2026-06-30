export type CalculatorConfig = {
  id: 'cement' | 'steel' | 'semiconductor';
  label: string;
  description: string;
  inputs: Array<{ label: string; key: string; placeholder: string }>; 
};

export const calculators: CalculatorConfig[] = [
  {
    id: 'cement',
    label: 'Cement',
    description: 'Compute total, process, and fuel emissions with cement production inputs.',
    inputs: [{ label: 'Cement production (tonnes)', key: 'production', placeholder: '100000' }],
  },
  {
    id: 'steel',
    label: 'Steel',
    description: 'Estimate steel emissions based on production and route selection.',
    inputs: [{ label: 'Steel production (tonnes)', key: 'production', placeholder: '100000' }],
  },
  {
    id: 'semiconductor',
    label: 'Semiconductor',
    description: 'Calculate semiconductor emissions from electricity consumption.',
    inputs: [{ label: 'Electricity consumption (kWh)', key: 'electricity', placeholder: '100000' }],
  },
];

export const steelRoutes = [
  { id: 'bf-bof', label: 'BF-BOF', factor: 2.33 },
  { id: 'dri-eaf', label: 'DRI-EAF', factor: 1.4 },
  { id: 'scrap-eaf', label: 'Scrap EAF', factor: 0.7 },
];
