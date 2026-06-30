export const industryKpis = {
  cement: [
    { label: 'Annual CO₂', value: '1.4 Mt', change: '-12%' },
    { label: 'Energy Intensity', value: '375 kWh/t', change: '-8%' },
    { label: 'Capture Potential', value: '42%', change: '+5%' },
  ],
  steel: [
    { label: 'Annual CO₂', value: '2.8 Mt', change: '-9%' },
    { label: 'Energy Intensity', value: '520 kWh/t', change: '-6%' },
    { label: 'Low-Carbon Output', value: '34%', change: '+7%' },
  ],
  semiconductor: [
    { label: 'Annual CO₂', value: '0.9 Mt', change: '-14%' },
    { label: 'Energy Intensity', value: '270 kWh/t', change: '-10%' },
    { label: 'Water Use', value: '120 L/unit', change: '-4%' },
  ],
};

export const emissionsChart = [
  { month: 'Jan', cement: 86, steel: 130, semiconductor: 58 },
  { month: 'Feb', cement: 79, steel: 124, semiconductor: 62 },
  { month: 'Mar', cement: 92, steel: 141, semiconductor: 68 },
  { month: 'Apr', cement: 101, steel: 148, semiconductor: 72 },
  { month: 'May', cement: 108, steel: 151, semiconductor: 77 },
  { month: 'Jun', cement: 96, steel: 143, semiconductor: 69 },
  { month: 'Jul', cement: 91, steel: 137, semiconductor: 65 },
  { month: 'Aug', cement: 85, steel: 128, semiconductor: 60 },
];

export const industryBenchmarks = [
  { name: 'Cement', current: 110, benchmark: 95 },
  { name: 'Steel', current: 150, benchmark: 128 },
  { name: 'Semiconductor', current: 72, benchmark: 60 },
];

export const insightCards = [
  {
    title: 'Carbon intensity trajectory',
    description: 'Forecasted emissions intensity approaches net-zero path by 2032 with advanced capture and low-carbon feedstocks.',
  },
  {
    title: 'CBAM readiness score',
    description: 'Supply chain assessments show 83% compliance readiness across core export channels.',
  },
  {
    title: 'Circular materials uplift',
    description: 'Recycled feedstock programs can reduce scope 3 exposure by 18% for cement and steel segments.',
  },
];
