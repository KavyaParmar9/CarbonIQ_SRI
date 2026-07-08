import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';

type HomeProps = {
  setActivePage: (page: string) => void;
};

const stats = [
  { label: 'Projected CO₂ savings', value: '4.9 Mt' },
  { label: 'Climate risk mitigated', value: '70%' },
  { label: 'Benchmark coverage', value: '92%' },
];

const features = [
  { title: 'Real-time emissions analysis', description: 'Integrate plant data, fuel composition, and operational metrics with research benchmarks.' },
  { title: 'Cross-sector comparison', description: 'Compare emissions performance across cement, steel, and semiconductor manufacturing.' },
  { title: 'Carbon research support', description: 'Support for CBAM analysis, emissions forecasting, and decarbonization scenario modeling.' },
];

export default function Home({ setActivePage }: HomeProps) {
  return (
    <section className="space-y-8 sm:space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <span className="inline-flex rounded-full bg-brand-500/10 px-4 py-1 text-sm font-semibold text-brand-600 dark:text-brand-200 dark:bg-brand-500/15">
          Sustainability analytics for industrial leaders
        </span>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            CarbonIQ: carbon analytics for industrial research.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            A comprehensive research platform for exploring emissions data across cement, steel, and semiconductor sectors. Combine benchmarking, real-time analysis, and scenario planning to understand industrial decarbonization pathways.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActivePage('dashboard')}
            className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400"
          >
            Explore dashboard
          </button>
          <button
            type="button"
            onClick={() => setActivePage('calculator')}
            className="rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
          >
            Launch calculator
          </button>
        </div>
      </motion.div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-950/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/50">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Performance snapshot</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Global industrial comparison</p>
          </div>
          <span className="rounded-full bg-slate-200/70 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800/70 dark:text-slate-300">Live</span>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/70">
              <p className="text-sm text-slate-600 dark:text-slate-400">Cement emissions intensity</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">375 kWh/t</p>
            </div>
            <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/70">
              <p className="text-sm text-slate-600 dark:text-slate-400">Steel low-carbon output</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">34%</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Emission reduction target</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold text-slate-900 dark:text-white">2032</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Net-zero trajectory horizon</p>
              </div>
              <div className="h-3 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-4/5 rounded-full bg-brand-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionHeading
        title="Industrial decarbonization research"
        description="CarbonIQ combines emissions analysis, cross-sector benchmarking, and CBAM research support into a comprehensive research platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-950/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-950/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/40">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Platform capabilities</h2>
          <div className="mt-6 space-y-3 sm:space-y-4">
            {features.map((item) => (
              <div key={item.title} className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/75">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-950/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/40">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Research overview</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">CBAM & low-carbon industrial research</h3>
            </div>
            <span className="rounded-full bg-slate-200/70 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800/70 dark:text-slate-300">Sector pulse</span>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/70">
              <p className="text-sm text-slate-600 dark:text-slate-400">Cement decarbonization</p>
              <p className="mt-2 text-base leading-7 text-slate-700 dark:text-slate-200">AI-enabled clinker optimization reduces CO₂ footprint while preserving output quality and compliance readiness.</p>
            </div>
            <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/70">
              <p className="text-sm text-slate-600 dark:text-slate-400">Semiconductor supply chains</p>
              <p className="mt-2 text-base leading-7 text-slate-700 dark:text-slate-200">Low-carbon materials and renewable energy procurement are the highest impact levers for fabs targeting CBAM alignment.</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
