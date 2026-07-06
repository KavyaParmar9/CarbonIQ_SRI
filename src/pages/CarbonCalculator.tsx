import { useMemo, useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import { calculators, steelRoutes } from '../data/calculator';
import industryData from '../data/industryData.json';
import DataProvenance from '../components/DataProvenance';
import { loadLocalJson } from '../services/sourceService';

type CalculatorInputs = Record<string, number>;

type RouteOption = 'bf-bof' | 'dri-eaf' | 'scrap-eaf';

const routeDescriptions: Record<RouteOption, string> = {
  'bf-bof': 'BF-BOF stands for Blast Furnace - Basic Oxygen Furnace, the traditional primary steelmaking route.',
  'dri-eaf': 'DRI-EAF stands for Direct Reduced Iron - Electric Arc Furnace, a lower-carbon primary steel route.',
  'scrap-eaf': 'Scrap EAF stands for Scrap Electric Arc Furnace, the lowest-carbon recycled steel route.',
};

const initialValues: CalculatorInputs = {
  production: 100000,
  electricity: 100000,
};

const computeResults = (
  id: string,
  values: CalculatorInputs,
  route: RouteOption
) => {
  if (id === 'cement') {
    const production = values.production || 0;
    const total = production * industryData.industries.cement.emissionIntensity;
    const process = (total * industryData.industries.cement.processShare) / 100;
    const fuel = (total * industryData.industries.cement.fuelShare) / 100;
    return { total, process, fuel };
  }

  if (id === 'steel') {
    const production = values.production || 0;
    const selectedRoute = steelRoutes.find((item) => item.id === route);
    const total = production * (selectedRoute?.factor ?? 2.33);
    return { total, route: selectedRoute?.label ?? 'BF-BOF' };
  }

  if (id === 'semiconductor') {
    const electricity = values.electricity || 0;
    const totalKg = electricity * industryData.industries.semiconductor.factor;
    const total = totalKg / 1000;
    const scope1 = (total * industryData.industries.semiconductor.scope1) / 100;
    const scope2 = (total * industryData.industries.semiconductor.scope2) / 100;
    return { total, scope1, scope2 };
  }

  return { total: 0 };
};

export default function CarbonCalculator() {
  const [activeCalculator, setActiveCalculator] = useState<'cement' | 'steel' | 'semiconductor'>('cement');
  const [inputValues, setInputValues] = useState<CalculatorInputs>(initialValues);
  const [steelRoute, setSteelRoute] = useState<RouteOption>('bf-bof');
  const [prov, setProv] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchProv() {
      const mapping: Record<string, string> = {
        cement: 'cement.json',
        steel: 'steel.json',
        semiconductor: 'semiconductor.json',
      };
      const fname = mapping[activeCalculator];
      const json = await loadLocalJson(fname);
      if (!mounted) return;
      setProv(json?.meta ? { source: json.meta.source, dataset: json.name, lastUpdated: json.updatedAt || json.last_updated } : null);
    }
    fetchProv();
    return () => { mounted = false; };
  }, [activeCalculator]);

  const results = useMemo(
    () => computeResults(activeCalculator, inputValues, steelRoute),
    [activeCalculator, inputValues, steelRoute]
  );

  return (
    <section className="space-y-8 sm:space-y-10">
      <SectionHeading
        title="Carbon Calculator"
        description="Estimate emissions for cement, steel, and semiconductor production using structured models and modern visual outputs."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_0.55fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-xl shadow-slate-950/30 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Calculator selector</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Choose an industrial model</h3>
            </div>
            <div className="rounded-full bg-slate-100/80 px-4 py-2 text-sm text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">Active model</div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            {calculators.map((calculator) => (
              <button
                key={calculator.id}
                onClick={() => setActiveCalculator(calculator.id as 'cement' | 'steel' | 'semiconductor')}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  activeCalculator === calculator.id
                    ? 'border-brand-500 bg-brand-500/10 text-white'
                    : 'border-slate-300 bg-white/90 text-slate-800 hover:border-slate-500 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-300'
                }`}
              >
                {calculator.label}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-6">
            {calculators
              .filter((calculator) => calculator.id === activeCalculator)
              .map((calculator) => (
                <div key={calculator.id}>
                  <p className="text-lg font-semibold text-white">{calculator.label} calculator</p>
                  <p className="mt-2 text-sm text-slate-400">{calculator.description}</p>

                  <div className="mt-6 space-y-4">
                    {calculator.id === 'steel' && (
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-3">
                          {steelRoutes.map((route) => (
                            <button
                              key={route.id}
                              onClick={() => setSteelRoute(route.id as RouteOption)}
                              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                                steelRoute === route.id
                                  ? 'border-brand-500 bg-brand-500/20 text-slate-900 dark:text-white'
                                  : 'border-slate-300 bg-white/90 text-slate-800 hover:border-slate-500 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-300'
                              }`}
                            >
                              {route.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {routeDescriptions[steelRoute]}
                        </p>
                      </div>
                    )}

                    {calculator.inputs.map((input) => (
                      <label key={input.key} className="grid gap-2 text-sm text-slate-900 dark:text-slate-200">
                        <span>{input.label}</span>
                        <input
                          type="number"
                          value={inputValues[input.key] || ''}
                          onChange={(event) =>
                            setInputValues((current) => ({
                              ...current,
                              [input.key]: Number(event.target.value),
                            }))
                          }
                          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500 dark:border-slate-700/80 dark:bg-slate-950/90 dark:text-slate-100"
                          placeholder={input.placeholder}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-xl shadow-slate-950/30 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30 sm:p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Calculator results</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{results.total?.toFixed(2) ?? '0.00'}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Total emissions{activeCalculator === 'semiconductor' ? ' (tonnes CO₂e)' : ' (tonnes CO₂)'}</p>
          </div>

          <div className="grid gap-4">
            {activeCalculator === 'cement' && (
              <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/80">
                <p className="text-sm text-slate-600 dark:text-slate-400">Breakdown</p>
                <div className="mt-4 space-y-3 text-sm text-slate-800 dark:text-slate-200">
                  <div className="flex justify-between">
                    <span>Process emissions</span>
                    <span>{results.process?.toFixed(2)} tCO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel emissions</span>
                    <span>{results.fuel?.toFixed(2)} tCO₂</span>
                  </div>
                </div>
              </div>
            )}

            {activeCalculator === 'steel' && (
              <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/80">
                <p className="text-sm text-slate-600 dark:text-slate-400">Selected route</p>
                <div className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{results.route}</div>
              </div>
            )}

            {activeCalculator === 'semiconductor' && (
              <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/80">
                <p className="text-sm text-slate-600 dark:text-slate-400">Scope contributions</p>
                <div className="mt-4 space-y-3 text-sm text-slate-800 dark:text-slate-200">
                  <div className="flex justify-between">
                    <span>Scope 1</span>
                    <span>{results.scope1?.toFixed(2)} tCO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scope 2</span>
                    <span>{results.scope2?.toFixed(2)} tCO₂e</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DataProvenance
            source={prov?.source}
            dataset={prov?.dataset}
            lastUpdated={prov?.lastUpdated}
            method={
              activeCalculator === 'cement'
                ? 'Total = production × emissionIntensity (from industryData)'
                : activeCalculator === 'steel'
                ? `Total = production × route factor (${steelRoute})`
                : activeCalculator === 'semiconductor'
                ? 'Total = electricity × factor / 1000'
                : undefined
            }
            confidence={prov ? 'Derived from bundled dataset' : 'Dataset not currently available.'}
          />
        </aside>
      </div>
    </section>
  );
}
