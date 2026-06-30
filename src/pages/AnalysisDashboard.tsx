import { useMemo, useState, useEffect } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SectionHeading from '../components/SectionHeading';
import industryData from '../data/industryData.json';
import DataProvenance from '../components/DataProvenance';
import { loadLocalJson } from '../services/sourceService';

const industries = [
  { id: 'cement', label: 'Cement' },
  { id: 'steel', label: 'Steel' },
  { id: 'semiconductor', label: 'Semiconductor' },
];

const monthlyTrend = [
  { month: 'Jan', Cement: 110, Steel: 150, Semiconductor: 72 },
  { month: 'Feb', Cement: 105, Steel: 148, Semiconductor: 70 },
  { month: 'Mar', Cement: 107, Steel: 152, Semiconductor: 74 },
  { month: 'Apr', Cement: 102, Steel: 149, Semiconductor: 73 },
  { month: 'May', Cement: 108, Steel: 153, Semiconductor: 75 },
  { month: 'Jun', Cement: 104, Steel: 151, Semiconductor: 71 },
  { month: 'Jul', Cement: 101, Steel: 147, Semiconductor: 69 },
  { month: 'Aug', Cement: 99, Steel: 145, Semiconductor: 68 },
];

type BreakdownSlice = { name: string; value: number; color?: string };

export default function AnalysisDashboard() {
  const [activeIndustry, setActiveIndustry] = useState<'cement' | 'steel' | 'semiconductor'>('cement');
  const industry = useMemo(() => industryData.industries[activeIndustry], [activeIndustry]);
  const [prov, setProv] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchProv() {
      const mapping: Record<string, string> = {
        cement: 'cement.json',
        steel: 'steel.json',
        semiconductor: 'semiconductor.json',
      };
      const fname = mapping[activeIndustry];
      const json = await loadLocalJson(fname);
      if (!mounted) return;
      setProv(json?.meta ? { source: json.meta.source, dataset: json.name, lastUpdated: json.updatedAt || json.last_updated } : null);
    }
    fetchProv();
    return () => { mounted = false; };
  }, [activeIndustry]);

  const breakdownData = useMemo<BreakdownSlice[]>(() => {
    if ('breakdown' in industry && Array.isArray(industry.breakdown)) {
      return industry.breakdown;
    }

    if ('routes' in industry && Array.isArray(industry.routes)) {
      return industry.routes.map((route) => ({
        name: route.name,
        value: route.value,
      }));
    }

    return [];
  }, [industry]);

  return (
    <section className="space-y-10">
      <SectionHeading
        title="Analysis Dashboard"
        description="Track emissions, compare industry benchmarks, and uncover operational insights for carbon-intensive sectors."
      />

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-xl shadow-slate-950/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30">
        {industries.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveIndustry(item.id as 'cement' | 'steel' | 'semiconductor')}
            className={`rounded-full px-5 py-3 text-sm font-medium transition ${
              activeIndustry === item.id ? 'bg-brand-500 text-white shadow-glow' : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-950/30 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Industry pulse</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{industry.name} benchmark trend</h3>
            </div>
            <span className="rounded-full bg-slate-100/80 px-4 py-2 text-sm text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">Benchmark</span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Area
                  type="monotone"
                  dataKey={industry.name}
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
            <DataProvenance
              source={prov?.source}
              dataset={prov?.dataset}
              lastUpdated={prov?.lastUpdated}
              method={`Trend: ${industry.name} benchmark series from bundled dataset`}
              confidence={prov ? 'Derived from bundled dataset' : 'Dataset not currently available.'}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {industry.kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/80">
                <p className="text-sm text-slate-600 dark:text-slate-400">{kpi.label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-950/20 dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Benchmark comparison</p>
            <div className="h-[260px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryData.benchmarkComparison} margin={{ left: -24, right: 8, top: 6, bottom: 6 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Bar dataKey="current" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="benchmark" fill="#64748b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <DataProvenance
                source={prov?.source}
                dataset={prov?.dataset}
                lastUpdated={prov?.lastUpdated}
                method={`Benchmark comparison using bundled benchmarkComparison dataset`}
                confidence={prov ? 'Derived from bundled dataset' : 'Dataset not currently available.'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_0.9fr]">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-300">Emission breakdown</p>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={96}
                  paddingAngle={4}
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`slice-${index}`} fill={entry.color ?? ['#38bdf8', '#64748b', '#f97316'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              </PieChart>
            </ResponsiveContainer>
            <DataProvenance
              source={prov?.source}
              dataset={prov?.dataset}
              lastUpdated={prov?.lastUpdated}
              method={`Breakdown derived from industry dataset (routes/breakdown)`}
              confidence={prov ? 'Derived from bundled dataset' : 'Dataset not currently available.'}
            />
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-400">
            {breakdownData.map((slice) => (
              <div key={slice.name} className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: slice.color ?? '#38bdf8' }} />
                <span>{slice.name}</span>
                <span className="ml-auto font-semibold text-white">{slice.value}{industry.name === 'Steel' ? ' tCO₂/t' : '%'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-950/20 dark:border-slate-800/80 dark:bg-slate-900/90">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Industry insights</p>
          <div className="mt-6 space-y-4">
            {industry.insights.map((insight) => (
              <div key={insight} className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/90">
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
