import { describe, expect, it } from 'vitest';
import { analyzeUploadedDataset, detectColumnMappings, getRequiredMappingFields } from './reportService';

describe('analyzeUploadedDataset', () => {
  it('builds summary, insights, and recommendations from uploaded rows', () => {
    const result = analyzeUploadedDataset(
      [
        { Year: 2012, Production: 100, Electricity: 50, Coal: 20, Diesel: 5, 'Natural Gas': 10, 'Renewable Energy': 5, 'Direct Emissions': 12, 'Indirect Emissions': 8, Scope1: 10, Scope2: 6, Scope3: 4, 'Clinker Ratio': 0.72, 'Steel Route': 'BF-BOF' },
        { Year: 2022, Production: 118, Electricity: 45, Coal: 18, Diesel: 4, 'Natural Gas': 9, 'Renewable Energy': 12, 'Direct Emissions': 10, 'Indirect Emissions': 7, Scope1: 8, Scope2: 5, Scope3: 4, 'Clinker Ratio': 0.68, 'Steel Route': 'BF-BOF' },
      ],
      {
        industry: 'cement',
        scope: 'combined',
        emissionFactorMode: 'default',
      }
    );

    expect(result.summary.rowCount).toBe(2);
    expect(result.summary.yearsCovered).toEqual([2012, 2022]);
    expect(result.summary.detectedColumns).toContain('Year');
    expect(result.insights.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.analytics.benchmarkComparison.label).toMatch(/Below|Near|Above/);
  });

  it('detects required columns for cement mapping without exposing unrelated fields', () => {
    const fields = getRequiredMappingFields({ industry: 'cement', scope: 'combined', emissionFactorMode: 'default' });
    const mappings = detectColumnMappings(['Year', 'Production', 'Electricity', 'Coal', 'Direct Emissions', 'Indirect Emissions', 'Clinker Ratio'], fields);

    expect(fields.map((field) => field.key)).toEqual(['year', 'production', 'electricity', 'coal', 'directEmissions', 'indirectEmissions', 'clinkerRatio']);
    expect(mappings.year).toBe('Year');
    expect(mappings.production).toBe('Production');
    expect(mappings.electricity).toBe('Electricity');
    expect(mappings.directEmissions).toBe('Direct Emissions');
    expect(mappings.indirectEmissions).toBe('Indirect Emissions');
  });
});
