// Small helper utilities to support calculator results without inventing factors.
// Functions only compute equivalents when the caller provides reliable conversion factors.

export type EquivalentFactors = {
  kgCo2PerCarPerYear?: number; // e.g., average passenger car annual emissions in kg CO2
  kgCo2PerTreePerYear?: number; // sequestration per tree per year in kg CO2
  kgCo2PerKWh?: number; // kg CO2 per kWh
};

export function computeEquivalents(totalTonnes: number, factors?: EquivalentFactors) {
  if (!factors) return { available: false };
  const totalKg = totalTonnes * 1000;
  const result: any = { available: true };
  if (factors.kgCo2PerCarPerYear) {
    result.carsPerYear = totalKg / factors.kgCo2PerCarPerYear;
  }
  if (factors.kgCo2PerTreePerYear) {
    result.treesPerYear = totalKg / factors.kgCo2PerTreePerYear;
  }
  if (factors.kgCo2PerKWh) {
    result.equivalentKWh = totalKg / factors.kgCo2PerKWh;
  }
  return result;
}
