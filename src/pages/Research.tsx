import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { cbamFormula, cbamResearch } from '../data/cbam';

const sectionLinks = [
  { id: 'project-overview', label: 'Project Overview' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'data-sources', label: 'Data Sources' },
  { id: 'dataset-summary', label: 'Dataset Summary' },
  { id: 'mathematical-models', label: 'Mathematical Models' },
  { id: 'cbam-overview', label: 'CBAM Overview' },
  { id: 'papers', label: 'Research Papers' },
  { id: 'references', label: 'References' },
];

const sourceCards = [
  {
    title: 'Our World in Data',
    usage: 'Global CO₂ emissions benchmarking',
    status: 'Integrated',
    year: '2024',
  },
  {
    title: 'IEA Cement Benchmarks',
    usage: 'Cement emission intensities and process shares',
    status: 'Integrated',
    year: '2024',
  },
  {
    title: 'GCCA Steel Emissions',
    usage: 'Steel route factors and trade exposure',
    status: 'Integrated',
    year: '2024',
  },
];

const references = [
  { source: 'IEA', usedFor: 'Cement and process factor benchmarks' },
  { source: 'GCCA', usedFor: 'Steel route emissions and export exposure' },
  { source: 'Our World in Data', usedFor: 'Global emissions trends and country comparisons' },
  { source: 'IPCC', usedFor: 'Methodology guidance and uncertainty framing' },
];

export default function Research() {
  const [openPaper, setOpenPaper] = useState<string | null>(cbamResearch[0]?.title ?? null);

  return (
    <section className="space-y-10 scroll-smooth">
      <SectionHeading
        title="Research"
        description="A single research page for methodologies, data provenance, models, CBAM, papers, and references."
      />

      <div className="grid gap-8 xl:grid-cols-[0.28fr_0.72fr]">
        <aside className="hidden xl:block sticky top-24 space-y-6 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-950/10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Contents</p>
          <nav className="space-y-2 text-sm">
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="block rounded-2xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">
            <p className="font-semibold">Research structure</p>
            <p className="mt-2">Use the left navigation to jump between the overview, methodology, sources, models, and references.</p>
          </div>
        </aside>

        <div className="space-y-10">
          <div className="xl:hidden rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Jump to section</p>
            <div className="mt-3 grid gap-2">
              {sectionLinks.map((link) => (
                <a
                  key={`mobile-${link.id}`}
                  href={`#${link.id}`}
                  className="block rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <section id="project-overview" className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Project Overview</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">A research-focused carbon analytics platform</h2>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
              CarbonIQ is built for analysts, policymakers, and industrial decision makers who need transparent models, verifiable data, and clear provenance.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Scope</p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">Cement, steel, semiconductor</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Output</p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">Emissions analytics & models</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Evidence</p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">Data provenance and references</p>
              </div>
            </div>
          </section>

          <section id="methodology" className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Methodology</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">A consistent, transparent modeling approach</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                <p>Models are structured around a combination of activity data, emission factors, and material-specific route parameters.</p>
                <p>Each industry model preserves data provenance by linking results to the underlying dataset metadata and method notes.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Key steps</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>• Collect benchmark emissions and process data from trusted sources.</li>
                  <li>• Normalize values to common units and production basis.</li>
                  <li>• Apply route-specific factors for steel, cement shares, and semiconductor energy intensity.</li>
                  <li>• Surface uncertainty as method confidence rather than invented precision.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="data-sources" className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Data Sources</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Source cards for integrated datasets</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {sourceCards.map((source) => (
                <div key={source.title} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-950/80">
                  <p className="text-sm uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{source.title}</p>
                  <p className="mt-3 text-base font-semibold text-slate-900 dark:text-white">Used for</p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{source.usage}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <p><strong>Status:</strong> {source.status}</p>
                    <p><strong>Last updated:</strong> {source.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="dataset-summary" className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Dataset Summary</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Key files powering the analysis</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">cement.json</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Contains cement emission intensity, process/fuel split, and validation metadata.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">steel.json</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Contains route factor data for BF-BOF, DRI-EAF, and Scrap EAF steel pathways.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">semiconductor.json</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Contains energy-to-emissions conversion factors and scope breakdown assumptions.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">industryData.json</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Aggregated industry defaults used by the calculator and dashboard metrics.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-sm text-slate-700 dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-300">
              <p className="font-semibold">Explore datasets</p>
              <p className="mt-2">Use the Dataset Explorer page for row previews, filtering, and downloads of available JSON and CSV files.</p>
            </div>
          </section>

          <section id="mathematical-models" className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Mathematical Models</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Core emissions equations</h2>
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <h3 className="font-semibold">Emission Formula</h3>
                <p className="mt-2">Emission = Activity Data × Emission Factor</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <h3 className="font-semibold">Weighted Emission Factor</h3>
                <p className="mt-2">Weighted factor = ∑(route share × route factor)</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <h3 className="font-semibold">Difference-in-Differences</h3>
                <p className="mt-2">Used for comparative insights when benchmarking two time periods or routes.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
                <h3 className="font-semibold">CBAM Formula</h3>
                <p className="mt-2">CBAM = max(0, (Embedded Emissions × Carbon Price) - Free Allocation)</p>
              </div>
            </div>
          </section>

          <section id="cbam-overview" className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">CBAM Overview</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How CBAM is reflected in the analysis</h2>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
              The CBAM overview explains how embedded emissions, carbon price, and free allocation interact to create a policy-relevant tariff estimate.
            </p>
            <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/80">
              <p className="font-semibold">Formula</p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">CBAM = max(0, (Embedded Emissions × Carbon Price) - Free Allocation)</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Embedded Emissions: scope 1 + scope 2 emissions attributed to goods.</li>
                <li>• Carbon Price: policy-specific price per tonne of CO₂e.</li>
                <li>• Free Allocation: transitional relief for eligible sectors.</li>
              </ul>
            </div>
          </section>

          <section id="papers" className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Research Papers</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Paper summaries and learnings</h2>
            <div className="space-y-4">
              {cbamResearch.map((paper) => (
                <div key={paper.title} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/80">
                  <button
                    onClick={() => setOpenPaper(openPaper === paper.title ? null : paper.title)}
                    className="flex w-full items-center justify-between text-left text-base font-semibold text-slate-900 dark:text-white"
                  >
                    <span>{paper.title}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{openPaper === paper.title ? '▼' : '▶'}</span>
                  </button>
                  {openPaper === paper.title && (
                    <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                      <p><strong>Objective:</strong> Explain policy exposure and alignment for industrial exporters under carbon border adjustment mechanisms.</p>
                      <p><strong>Dataset:</strong> Benchmark emissions, energy intensity, and trade flows for heavy industry / semiconductor supply chains.</p>
                      <p><strong>Methodology:</strong> Comparative case analysis with emission factor normalization and route-specific modeling.</p>
                      <p><strong>Findings:</strong> Higher emissions intensity raises CBAM exposure, while lower-carbon routes improve competitiveness.</p>
                      <p><strong>Limitations:</strong> Data availability varies by region and sector; findings are illustrative pending additional granular trade data.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="references" className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">References</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Core sources and citations</h2>
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
              <table className="min-w-full text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-950/80 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Used For</th>
                  </tr>
                </thead>
                <tbody>
                  {references.map((ref) => (
                    <tr key={ref.source} className="border-t border-slate-100 dark:border-slate-800/70">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{ref.source}</td>
                      <td className="px-4 py-3">{ref.usedFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
