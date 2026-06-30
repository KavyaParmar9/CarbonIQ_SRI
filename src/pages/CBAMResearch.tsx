import SectionHeading from '../components/SectionHeading';
import { cbamFormula, cbamFindings, cbamResearch } from '../data/cbam';

export default function CBAMResearch() {
  return (
    <section className="space-y-10">
      <SectionHeading title="CBAM Research" description="Explore the latest carbon border adjustment findings, formulas, and sector-specific implications for global exporters." />

      <div className="grid gap-6 lg:grid-cols-2">
        {cbamResearch.map((paper) => (
          <article key={paper.title} className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-950/30 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Research paper</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{paper.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{paper.authors}</p>
            <p className="mt-5 text-sm leading-7 text-slate-700 dark:text-slate-300">{paper.summary}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-950/30 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Formula display</p>
          <h3 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{cbamFormula.label}</h3>
          <p className="mt-4 rounded-3xl bg-slate-50 p-6 text-lg font-semibold leading-relaxed text-slate-900 dark:bg-slate-950/80 dark:text-white">
            {cbamFormula.formula}
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            {cbamFormula.notes.map((note) => (
              <p key={note}>• {note}</p>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {cbamFindings.map((finding) => (
            <div key={finding.label} className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-6 shadow-xl shadow-slate-950/20 dark:border-slate-800/80 dark:bg-slate-950/80 dark:shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Finding</p>
              <p className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{finding.label}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{finding.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
