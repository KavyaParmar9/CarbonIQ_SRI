export const cbamResearch = [
  {
    title: 'EU CBAM Impact on Heavy Industry',
    authors: 'E. M. Rossi, A. Patel',
    summary:
      'This paper analyzes the carbon border adjustment mechanism and quantifies exposure for cement and steel exporters to the EU market.',
  },
  {
    title: 'Carbon Pricing and Semiconductor Supply Chains',
    authors: 'L. Chen, S. Kato',
    summary:
      'The study examines how semiconductor fabs can align capital investments with CBAM reporting and low-carbon procurement.',
  },
];

export const cbamFormula = {
  label: 'CBAM Effective Tariff',
  formula: 'CBAM = max(0, (Embedded Emissions × Carbon Price) - Free Allocation)',
  notes: ['Embedded emissions can include scope 1 and scope 2 factors.', 'Free allocations vary by sector and country integration.'],
};

export const cbamFindings = [
  {
    label: 'Market exposure',
    value: '81% export-driven',
  },
  {
    label: 'Reporting maturity',
    value: 'High in steel, medium in cement, emerging in semiconductor',
  },
  {
    label: 'Tariff margin',
    value: '5-12% of delivered cost',
  },
];
