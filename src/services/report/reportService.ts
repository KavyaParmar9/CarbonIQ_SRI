import industryData from '../../data/industryData.json';
import { steelRoutes } from '../../data/calculator';

export type SupportedIndustry = 'cement' | 'steel' | 'semiconductor';
export type ReportScope = 'scope1' | 'scope2' | 'scope3' | 'combined';
export type CementProductionType = 'cement' | 'clinker';
export type SteelRoute = 'bf-bof' | 'dri-eaf' | 'scrap-eaf';

export type ReportConfig = {
  industry: SupportedIndustry;
  scope: ReportScope;
  productionType?: CementProductionType;
  route?: SteelRoute;
  electricityGrid?: string;
  emissionFactorMode: 'default' | 'custom';
  customEmissionFactor?: number;
};

export type ReportRow = Record<string, string | number | boolean | null | undefined>;

export type DatasetSummary = {
  rowCount: number;
  yearsCovered: number[];
  detectedColumns: string[];
  missingValues: Record<string, number>;
  duplicateRows: number;
  industry: SupportedIndustry | 'unknown';
  warnings: string[];
};

export type BenchmarkComparison = {
  label: 'Below Benchmark' | 'Near Benchmark' | 'Above Benchmark';
  benchmarkValue: number;
  currentValue: number;
  difference: number;
};

export type ReportAnalytics = {
  productionTrend: Array<{ year: number; production: number }>;
  emissionTrend: Array<{ year: number; emissions: number }>;
  energyTrend: Array<{ year: number; energy: number }>;
  emissionIntensity: Array<{ year: number; intensity: number }>;
  energyIntensity: Array<{ year: number; intensity: number }>;
  scopeDistribution: Array<{ name: string; value: number }>;
  yearwiseComparison: Array<{ year: number; production: number; emissions: number }>;
  growthRate: number;
  benchmarkComparison: BenchmarkComparison;
};

export type ReportInsight = {
  title: string;
  detail: string;
};

export type ReportRecommendation = {
  title: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
};

export type ReportAnalysisResult = {
  summary: DatasetSummary;
  analytics: ReportAnalytics;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
};

export type MappingFieldDefinition = {
  key: string;
  label: string;
};

const columnAliases: Record<string, string[]> = {
  year: ['year', 'yearly'],
  production: ['production', 'output', 'volume'],
  electricity: ['electricity', 'grid power', 'power consumption'],
  coal: ['coal', 'coal used', 'coal consumption'],
  diesel: ['diesel', 'diesel used'],
  naturalGas: ['natural gas', 'gas', 'naturalgas'],
  renewableEnergy: ['renewable energy', 'renewables', 'renewable'],
  directEmissions: ['direct emissions', 'scope1', 'scope 1'],
  indirectEmissions: ['indirect emissions', 'scope2', 'scope 2'],
  scope1: ['scope1', 'scope 1', 'direct emissions'],
  scope2: ['scope2', 'scope 2', 'indirect emissions'],
  scope3: ['scope3', 'scope 3'],
  clinkerRatio: ['clinker ratio', 'clinker'],
  steelRoute: ['steel route', 'route'],
};

function normalizeColumnName(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function findColumnName(columns: string[], aliases: string[]): string | null {
  const normalizedColumns = columns.map((column) => normalizeColumnName(column));
  for (const alias of aliases) {
    const index = normalizedColumns.findIndex((column) => column === normalizeColumnName(alias));
    if (index >= 0) return columns[index];
  }
  return null;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/,/g, ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function computeDuplicateRows(rows: ReportRow[]): number {
  const signatures = rows.map((row) => JSON.stringify(row));
  const unique = new Set(signatures);
  return Math.max(0, signatures.length - unique.size);
}

function computeGrowthRate(rows: ReportRow[], productionColumn: string | null): number {
  if (!productionColumn || rows.length < 2) return 0;
  const first = toNumber(rows[0][productionColumn]);
  const last = toNumber(rows[rows.length - 1][productionColumn]);
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
}

export function getRequiredMappingFields(config: ReportConfig): MappingFieldDefinition[] {
  const baseFields: MappingFieldDefinition[] = [
    { key: 'year', label: 'Year' },
    { key: 'production', label: 'Production' },
  ];

  if (config.industry === 'cement') {
    return [
      ...baseFields,
      { key: 'electricity', label: 'Electricity' },
      { key: 'coal', label: 'Coal' },
      { key: 'directEmissions', label: 'Direct Emissions' },
      { key: 'indirectEmissions', label: 'Indirect Emissions' },
      { key: 'clinkerRatio', label: 'Clinker Ratio' },
    ];
  }

  if (config.industry === 'steel') {
    return [
      ...baseFields,
      { key: 'electricity', label: 'Electricity' },
      { key: 'coal', label: 'Coal' },
      { key: 'directEmissions', label: 'Direct Emissions' },
      { key: 'indirectEmissions', label: 'Indirect Emissions' },
    ];
  }

  return [
    ...baseFields,
    { key: 'electricity', label: 'Electricity' },
    { key: 'directEmissions', label: 'Direct Emissions' },
    { key: 'indirectEmissions', label: 'Indirect Emissions' },
  ];
}

export function detectColumnMappings(columns: string[], fields: MappingFieldDefinition[]): Record<string, string> {
  const mappings: Record<string, string> = {};
  fields.forEach((field) => {
    const match = findColumnName(columns, columnAliases[field.key]);
    if (match) {
      mappings[field.key] = match;
    }
  });
  return mappings;
}

function createBenchmarkComparison(currentValue: number, benchmarkValue: number): BenchmarkComparison {
  const difference = currentValue - benchmarkValue;
  if (difference < -0.05) return { label: 'Below Benchmark', benchmarkValue, currentValue, difference };
  if (difference > 0.05) return { label: 'Above Benchmark', benchmarkValue, currentValue, difference };
  return { label: 'Near Benchmark', benchmarkValue, currentValue, difference };
}

function resolveScopeValue(row: ReportRow, config: ReportConfig, columns: { scope1Column: string | null; scope2Column: string | null; scope3Column: string | null; directEmissionsColumn: string | null; indirectEmissionsColumn: string | null }) {
  const { scope1Column, scope2Column, scope3Column, directEmissionsColumn, indirectEmissionsColumn } = columns;
  switch (config.scope) {
    case 'scope1':
      return toNumber(scope1Column ? row[scope1Column] : directEmissionsColumn ? row[directEmissionsColumn] : 0);
    case 'scope2':
      return toNumber(scope2Column ? row[scope2Column] : indirectEmissionsColumn ? row[indirectEmissionsColumn] : 0);
    case 'scope3':
      return toNumber(scope3Column ? row[scope3Column] : 0);
    default:
      return toNumber(directEmissionsColumn ? row[directEmissionsColumn] : scope1Column ? row[scope1Column] : 0) + toNumber(indirectEmissionsColumn ? row[indirectEmissionsColumn] : scope2Column ? row[scope2Column] : 0) + toNumber(scope3Column ? row[scope3Column] : 0);
  }
}

function resolveBenchmarkValue(config: ReportConfig): number {
  if (config.industry === 'steel') {
    const matchedRoute = steelRoutes.find((route) => route.id === (config.route ?? 'bf-bof'));
    return matchedRoute?.factor ?? 2.33;
  }
  if (config.industry === 'cement') {
    return Number(industryData.industries.cement.emissionIntensity ?? 0.55);
  }
  return Number(industryData.industries.semiconductor.factor ?? 0.82);
}

function resolveEmissionFactor(config: ReportConfig): number {
  if (config.emissionFactorMode === 'custom' && (config.customEmissionFactor ?? 0) > 0) {
    return config.customEmissionFactor ?? 1;
  }
  return 1;
}

export function analyzeUploadedDataset(rows: ReportRow[], config: ReportConfig): ReportAnalysisResult {
  const normalizedRows = rows.filter((row) => row && typeof row === 'object');
  const detectedColumns = Object.keys(normalizedRows[0] ?? {}).filter(Boolean);
  const yearColumn = findColumnName(detectedColumns, columnAliases.year);
  const productionColumn = findColumnName(detectedColumns, columnAliases.production);
  const electricityColumn = findColumnName(detectedColumns, columnAliases.electricity);
  const coalColumn = findColumnName(detectedColumns, columnAliases.coal);
  const dieselColumn = findColumnName(detectedColumns, columnAliases.diesel);
  const naturalGasColumn = findColumnName(detectedColumns, columnAliases.naturalGas);
  const renewableEnergyColumn = findColumnName(detectedColumns, columnAliases.renewableEnergy);
  const directEmissionsColumn = findColumnName(detectedColumns, columnAliases.directEmissions);
  const indirectEmissionsColumn = findColumnName(detectedColumns, columnAliases.indirectEmissions);
  const scope1Column = findColumnName(detectedColumns, columnAliases.scope1);
  const scope2Column = findColumnName(detectedColumns, columnAliases.scope2);
  const scope3Column = findColumnName(detectedColumns, columnAliases.scope3);
  const clinkerRatioColumn = findColumnName(detectedColumns, columnAliases.clinkerRatio);

  const summary: DatasetSummary = {
    rowCount: normalizedRows.length,
    yearsCovered: normalizedRows
      .map((row) => (yearColumn ? toNumber(row[yearColumn]) : 0))
      .filter((year) => year > 0)
      .sort((a, b) => a - b),
    detectedColumns,
    missingValues: {
      Year: normalizedRows.filter((row) => (yearColumn ? toNumber(row[yearColumn]) === 0 : true)).length,
      Production: normalizedRows.filter((row) => (productionColumn ? toNumber(row[productionColumn]) === 0 : true)).length,
      Electricity: normalizedRows.filter((row) => (electricityColumn ? toNumber(row[electricityColumn]) === 0 : true)).length,
      Coal: normalizedRows.filter((row) => (coalColumn ? toNumber(row[coalColumn]) === 0 : true)).length,
      Diesel: normalizedRows.filter((row) => (dieselColumn ? toNumber(row[dieselColumn]) === 0 : true)).length,
      'Natural Gas': normalizedRows.filter((row) => (naturalGasColumn ? toNumber(row[naturalGasColumn]) === 0 : true)).length,
      'Renewable Energy': normalizedRows.filter((row) => (renewableEnergyColumn ? toNumber(row[renewableEnergyColumn]) === 0 : true)).length,
      'Direct Emissions': normalizedRows.filter((row) => (directEmissionsColumn ? toNumber(row[directEmissionsColumn]) === 0 : true)).length,
      'Indirect Emissions': normalizedRows.filter((row) => (indirectEmissionsColumn ? toNumber(row[indirectEmissionsColumn]) === 0 : true)).length,
      Scope1: normalizedRows.filter((row) => (scope1Column ? toNumber(row[scope1Column]) === 0 : true)).length,
      Scope2: normalizedRows.filter((row) => (scope2Column ? toNumber(row[scope2Column]) === 0 : true)).length,
      Scope3: normalizedRows.filter((row) => (scope3Column ? toNumber(row[scope3Column]) === 0 : true)).length,
    },
    duplicateRows: computeDuplicateRows(normalizedRows),
    industry: config.industry,
    warnings: [],
  };

  if (!yearColumn) summary.warnings.push('Year column was not detected.');
  if (!productionColumn) summary.warnings.push('Production column was not detected.');
  if (!electricityColumn && config.industry === 'semiconductor') summary.warnings.push('Electricity data is needed for semiconductor analysis.');
  if (!directEmissionsColumn && !scope1Column && (config.scope === 'scope1' || config.scope === 'combined')) summary.warnings.push('Direct emissions or scope 1 data was not detected.');
  if (!indirectEmissionsColumn && !scope2Column && (config.scope === 'scope2' || config.scope === 'combined')) summary.warnings.push('Indirect emissions or scope 2 data was not detected.');
  if (!scope3Column && config.scope === 'scope3') summary.warnings.push('Scope 3 data was not detected.');
  if (summary.rowCount === 0) summary.warnings.push('No data rows were found.');

  const sortedRows = [...normalizedRows].sort((left, right) => toNumber(left[yearColumn ?? '']) - toNumber(right[yearColumn ?? '']));

  const productionTrend = sortedRows.map((row) => ({
    year: toNumber(row[yearColumn ?? '']),
    production: toNumber(productionColumn ? row[productionColumn] : 0),
  })).filter((item) => item.year > 0);

  const emissionFactor = resolveEmissionFactor(config);
  const emissionTrend = sortedRows.map((row) => ({
    year: toNumber(row[yearColumn ?? '']),
    emissions: resolveScopeValue(row, config, { scope1Column, scope2Column, scope3Column, directEmissionsColumn, indirectEmissionsColumn }) * emissionFactor,
  })).filter((item) => item.year > 0);

  const energyTrend = sortedRows.map((row) => ({
    year: toNumber(row[yearColumn ?? '']),
    energy: config.industry === 'semiconductor'
      ? toNumber(electricityColumn ? row[electricityColumn] : 0)
      : toNumber(electricityColumn ? row[electricityColumn] : 0) + toNumber(coalColumn ? row[coalColumn] : 0) + toNumber(dieselColumn ? row[dieselColumn] : 0) + toNumber(naturalGasColumn ? row[naturalGasColumn] : 0),
  })).filter((item) => item.year > 0);

  const emissionIntensity = sortedRows.map((row) => ({
    year: toNumber(row[yearColumn ?? '']),
    intensity: productionColumn && toNumber(row[productionColumn]) > 0
      ? (resolveScopeValue(row, config, { scope1Column, scope2Column, scope3Column, directEmissionsColumn, indirectEmissionsColumn }) * emissionFactor) / toNumber(row[productionColumn])
      : 0,
  })).filter((item) => item.year > 0);

  const energyIntensity = sortedRows.map((row) => ({
    year: toNumber(row[yearColumn ?? '']),
    intensity: productionColumn && toNumber(row[productionColumn]) > 0
      ? (config.industry === 'semiconductor'
        ? toNumber(electricityColumn ? row[electricityColumn] : 0)
        : toNumber(electricityColumn ? row[electricityColumn] : 0) + toNumber(coalColumn ? row[coalColumn] : 0) + toNumber(dieselColumn ? row[dieselColumn] : 0) + toNumber(naturalGasColumn ? row[naturalGasColumn] : 0)) / toNumber(row[productionColumn])
      : 0,
  })).filter((item) => item.year > 0);

  const scopeDistribution = [
    { name: 'Scope 1', value: toNumber(scope1Column ? sortedRows[sortedRows.length - 1]?.[scope1Column] : 0) },
    { name: 'Scope 2', value: toNumber(scope2Column ? sortedRows[sortedRows.length - 1]?.[scope2Column] : 0) },
    { name: 'Scope 3', value: toNumber(scope3Column ? sortedRows[sortedRows.length - 1]?.[scope3Column] : 0) },
  ].filter((item) => item.value > 0);

  const yearwiseComparison = productionTrend.map((item, index) => ({
    year: item.year,
    production: item.production,
    emissions: emissionTrend[index]?.emissions ?? 0,
  }));

  const growthRate = computeGrowthRate(sortedRows, productionColumn ?? null);
  const benchmarkValue = resolveBenchmarkValue(config);
  const benchmarkComparison = createBenchmarkComparison(
    emissionIntensity[emissionIntensity.length - 1]?.intensity ?? 0,
    benchmarkValue
  );

  const insights: ReportInsight[] = [];
  const recommendations: ReportRecommendation[] = [];

  if (productionTrend.length >= 2) {
    const firstProduction = productionTrend[0].production;
    const lastProduction = productionTrend[productionTrend.length - 1].production;
    if (firstProduction > 0) {
      const delta = ((lastProduction - firstProduction) / firstProduction) * 100;
      insights.push({
        title: 'Production trend',
        detail: `Production ${delta >= 0 ? 'increased' : 'decreased'} by ${Math.abs(delta).toFixed(1)}% over the selected period.`,
      });
    }
  }

  if (emissionIntensity.length >= 2) {
    const firstIntensity = emissionIntensity[0].intensity;
    const lastIntensity = emissionIntensity[emissionIntensity.length - 1].intensity;
    if (firstIntensity > 0) {
      const delta = ((lastIntensity - firstIntensity) / firstIntensity) * 100;
      insights.push({
        title: 'Emission intensity',
        detail: `Emission intensity ${delta <= 0 ? 'decreased' : 'increased'} by ${Math.abs(delta).toFixed(1)}%.`,
      });
    }
  }

  if (energyTrend.length >= 2) {
    const firstEnergy = energyTrend[0].energy;
    const lastEnergy = energyTrend[energyTrend.length - 1].energy;
    if (firstEnergy > 0) {
      const delta = ((lastEnergy - firstEnergy) / firstEnergy) * 100;
      insights.push({
        title: 'Energy consumption',
        detail: `Energy consumption ${delta <= 0 ? 'decreased' : 'increased'} by ${Math.abs(delta).toFixed(1)}%.`,
      });
    }
  }

  if (renewableEnergyColumn) {
    const renewableValue = toNumber(sortedRows[sortedRows.length - 1]?.[renewableEnergyColumn]);
    const initialRenewableValue = toNumber(sortedRows[0]?.[renewableEnergyColumn]);
    if (renewableValue > initialRenewableValue) {
      insights.push({
        title: 'Renewable energy share',
        detail: 'Renewable energy contribution increased over the dataset period.',
      });
    }
  }

  if (emissionTrend.length >= 2) {
    const maxEntry = emissionTrend.reduce((max, item) => item.emissions > max.emissions ? item : max, emissionTrend[0]);
    const minEntry = emissionTrend.reduce((min, item) => item.emissions < min.emissions ? item : min, emissionTrend[0]);
    insights.push({
      title: 'Peak emissions',
      detail: `Peak emissions occurred in ${maxEntry.year}.`,
    });
    insights.push({
      title: 'Lowest emissions',
      detail: `Lowest emissions occurred in ${minEntry.year}.`,
    });
  }

  if (clinkerRatioColumn) {
    const latestClinker = toNumber(sortedRows[sortedRows.length - 1]?.[clinkerRatioColumn]);
    if (latestClinker > 0.7) {
      recommendations.push({
        title: 'High clinker ratio detected',
        detail: 'Clinker ratio remains elevated and warrants process optimization.',
        severity: 'high',
      });
    }
  }

  if (coalColumn) {
    const latestCoal = toNumber(sortedRows[sortedRows.length - 1]?.[coalColumn]);
    if (latestCoal > 0) {
      recommendations.push({
        title: 'Coal dependency detected',
        detail: 'Coal intensity remains material; consider alternative fuels and efficiency improvements.',
        severity: 'medium',
      });
    }
  }

  if (electricityColumn && emissionIntensity.length > 0) {
    const latestIntensity = emissionIntensity[emissionIntensity.length - 1].intensity;
    if (latestIntensity > benchmarkValue) {
      recommendations.push({
        title: 'High electricity emissions detected',
        detail: 'Electricity-related emissions are above the reference benchmark and should be targeted.',
        severity: 'high',
      });
    }
  }

  if (renewableEnergyColumn) {
    const latestRenewable = toNumber(sortedRows[sortedRows.length - 1]?.[renewableEnergyColumn]);
    const firstRenewable = toNumber(sortedRows[0]?.[renewableEnergyColumn]);
    if (latestRenewable <= firstRenewable) {
      recommendations.push({
        title: 'Low renewable share',
        detail: 'Renewable energy contribution is not increasing; consider procurement or onsite generation.',
        severity: 'medium',
      });
    }
  }

  return {
    summary,
    analytics: {
      productionTrend,
      emissionTrend,
      energyTrend,
      emissionIntensity,
      energyIntensity,
      scopeDistribution,
      yearwiseComparison,
      growthRate,
      benchmarkComparison,
    },
    insights,
    recommendations,
  };
}
