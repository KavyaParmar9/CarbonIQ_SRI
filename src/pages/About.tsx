import SectionHeading from '../components/SectionHeading';

export default function About() {
  return (
    <section className="space-y-8 sm:space-y-10">
      <SectionHeading title="About CarbonIQ" description="A modern enterprise platform for quantitative carbon analytics across cement, steel, and semiconductor industries." />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-950/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30">
          <h3 className="text-xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-2xl">Purpose-built for low-carbon transformation.</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
            CarbonIQ is designed to give sustainability officers, operations leaders, and carbon risk teams a single source of truth for emissions strategy. Our enterprise UX unifies benchmark tracking, emissions forecasting, and CBAM scenario planning.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <li>• Coordinated insights for cement, steel, and semiconductor production.</li>
            <li>• Executive-ready analytics with actionable KPI summaries.</li>
            <li>• Research-backed CBAM exposure and tariff modeling.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-950/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Design ethos</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
            Built for modern enterprise workflows, CarbonIQ combines a Bloomberg-style data-rich palette with sleek dark/light theming for presentation-ready dashboards and stakeholder communication.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/80">
              <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Mission</p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Accelerate decarbonization with trusted analytics.</p>
            </div>
            <div className="rounded-3xl bg-slate-50/90 p-5 dark:bg-slate-950/80">
              <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Vision</p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Enable industry leaders to make net-zero decisions with confidence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
