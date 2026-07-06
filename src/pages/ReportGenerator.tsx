import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/report/UploadZone';
import ColumnMappingPanel from '../components/report/ColumnMappingPanel';
import { parseUploadedFile } from '../utils/parser/fileParser';
import { analyzeUploadedDataset, detectColumnMappings, getRequiredMappingFields, type ReportAnalysisResult, type ReportConfig, type SupportedIndustry } from '../services/report/reportService';
import { exportReportPdf } from '../utils/pdf/reportPdf';
import SectionHeading from '../components/SectionHeading';
import industryData from '../data/industryData.json';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ReportGeneratorProps = {
  setActivePage: (page: string) => void;
};

const industries: Array<{ id: SupportedIndustry; label: string }> = [
  { id: 'cement', label: 'Cement' },
  { id: 'steel', label: 'Steel' },
  { id: 'semiconductor', label: 'Semiconductor' },
];

const defaultConfig: ReportConfig = {
  industry: 'cement',
  scope: 'combined',
  emissionFactorMode: 'default',
};

export default function ReportGenerator({ setActivePage }: ReportGeneratorProps) {
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('Upload a historical operational dataset to start your sustainability report.');
  const [error, setError] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Array<Record<string, string | number | boolean | null | undefined>>>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<ReportConfig>(defaultConfig);
  const [report, setReport] = useState<ReportAnalysisResult | null>(null);
  const productionChartRef = useRef<HTMLDivElement | null>(null);
  const emissionChartRef = useRef<HTMLDivElement | null>(null);
  const benchmarkChartRef = useRef<HTMLDivElement | null>(null);
  const scopeChartRef = useRef<HTMLDivElement | null>(null);

  const handleFileSelected = async (file: File) => {
    setError('');
    setStatus('Parsing dataset...');
    setFileName(file.name);
    try {
      const parsed = await parseUploadedFile(file);
      setColumns(parsed.columns);
      setRows(parsed.rows);
      setStatus(`Loaded ${parsed.rows.length} rows from ${file.name}.`);
      const analysis = analyzeUploadedDataset(parsed.rows, { ...config, industry: config.industry });
      setReport(analysis);
    } catch (err) {
      setColumns([]);
      setRows([]);
      setReport(null);
      setError(err instanceof Error ? err.message : 'Unable to parse the selected file.');
      setStatus('The file could not be processed.');
    }
  };

  const mappedRows = useMemo(() => {
    if (!rows.length) return [];
    return rows.map((row) => {
      const mapped: Record<string, string | number | boolean | null | undefined> = {};
      Object.entries(mappings).forEach(([field, column]) => {
        if (column) {
          mapped[field] = row[column];
        }
      });
      return mapped;
    });
  }, [mappings, rows]);

  const analysis = useMemo(() => {
    if (!report) return null;
    return analyzeUploadedDataset(mappedRows.length ? mappedRows : rows, { ...config, industry: config.industry });
  }, [config, mappedRows, report, rows]);

  const handleMappingChange = (field: string, value: string) => {
    setMappings((current) => ({ ...current, [field]: value }));
  };

  const handleConfigChange = (updates: Partial<ReportConfig>) => {
    setConfig((current) => {
      const nextConfig = { ...current, ...updates };
      if (rows.length) {
        setReport(analyzeUploadedDataset(rows, nextConfig));
      }
      return nextConfig;
    });
  };

  const handleGeneratePdf = async () => {
    if (!analysis) return;
    await exportReportPdf(analysis, {
      filename: `${fileName || 'carboniq-report'}.pdf`,
      companyName: 'CarbonIQ Advisory',
      industryName: industryData.industries[config.industry]?.name ?? 'Industrial Operations',
      reportingPeriod: analysis.summary.yearsCovered.length > 1 ? `${analysis.summary.yearsCovered[0]}-${analysis.summary.yearsCovered[analysis.summary.yearsCovered.length - 1]}` : 'Selected period',
      chartRefs: {
        productionTrend: productionChartRef.current,
        emissionTrend: emissionChartRef.current,
        benchmark: benchmarkChartRef.current,
        scopeDistribution: scopeChartRef.current,
      },
    });
  };

  useEffect(() => {
    if (!columns.length) {
      setMappings({});
      return;
    }

    const fields = getRequiredMappingFields(config);
    const detected = detectColumnMappings(columns, fields);
    setMappings((current) => {
      const next = { ...current };
      Object.entries(detected).forEach(([field, column]) => {
        if (current[field] && columns.includes(current[field])) {
          next[field] = current[field];
        } else {
          next[field] = column;
        }
      });
      fields.forEach((field) => {
        if (!detected[field.key] && !current[field.key]) {
          delete next[field.key];
        }
      });
      return next;
    });
  }, [columns, config.industry, config.scope]);

  const mappingFields = useMemo(() => getRequiredMappingFields(config), [config.industry, config.scope]);
  const mappedFields = useMemo(() => mappingFields.filter((field) => Boolean(mappings[field.key])), [mappingFields, mappings]);
  const missingFields = useMemo(() => mappingFields.filter((field) => !mappings[field.key]), [mappingFields, mappings]);
  const configurationStatus = useMemo(() => {
    if (!analysis) return 'Awaiting upload';
    return missingFields.length === 0 ? 'Ready for Report ✓' : 'Manual mapping required';
  }, [analysis, missingFields.length]);

  return (
    <section className="space-y-8 sm:space-y-10">
      <SectionHeading
        title="Industrial Carbon Report Generator"
        description="Upload years of operational data, validate the structure, map columns, and generate a professional sustainability report in minutes."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Step 1</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Upload your dataset</h2>
            </div>
            <button type="button" onClick={() => setActivePage('dashboard')} className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200 sm:px-4">
              View benchmark dashboard
            </button>
          </div>
          <UploadZone onFileSelected={handleFileSelected} />
          {fileName && <p className="text-sm text-slate-600 dark:text-slate-400">Uploaded file: <span className="font-semibold text-slate-900 dark:text-white">{fileName}</span></p>}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-300">{status}</div>
          {error && <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/50 dark:text-rose-300">{error}</div>}
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white shadow-2xl sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-300">Industry context</p>
          <h3 className="mt-2 text-2xl font-semibold">Supported sectors and expected structure</h3>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">The generator accepts cement, steel, and semiconductor datasets with year-over-year operational inputs and will disable unsupported analytics rather than fail.</p>
          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            {industries.map((item) => (
              <button key={item.id} type="button" onClick={() => handleConfigChange({ industry: item.id })} className={`rounded-full px-4 py-2 text-sm font-medium ${config.industry === item.id ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-200'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {columns.length > 0 && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Step 2-4</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Configure the analysis</h3>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {config.industry === 'cement' && (
                <>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>Scope</span>
                    <select value={config.scope} onChange={(event) => handleConfigChange({ scope: event.target.value as ReportConfig['scope'] })} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
                      <option value="scope1">Scope 1</option>
                      <option value="scope2">Scope 2</option>
                      <option value="combined">Combined</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>Production Type</span>
                    <select value={config.productionType ?? 'cement'} onChange={(event) => handleConfigChange({ productionType: event.target.value as ReportConfig['productionType'] })} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
                      <option value="cement">Cement</option>
                      <option value="clinker">Clinker</option>
                    </select>
                  </label>
                </>
              )}
              {config.industry === 'steel' && (
                <>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>Route</span>
                    <select value={config.route ?? 'bf-bof'} onChange={(event) => handleConfigChange({ route: event.target.value as ReportConfig['route'] })} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
                      <option value="bf-bof">BF-BOF</option>
                      <option value="dri-eaf">DRI-EAF</option>
                      <option value="scrap-eaf">Scrap EAF</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>Scope</span>
                    <select value={config.scope} onChange={(event) => handleConfigChange({ scope: event.target.value as ReportConfig['scope'] })} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
                      <option value="scope1">Scope 1</option>
                      <option value="scope2">Scope 2</option>
                      <option value="combined">Combined</option>
                    </select>
                  </label>
                </>
              )}
              {config.industry === 'semiconductor' && (
                <>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>Scope</span>
                    <select value={config.scope} onChange={(event) => handleConfigChange({ scope: event.target.value as ReportConfig['scope'] })} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
                      <option value="scope1">Scope 1</option>
                      <option value="scope2">Scope 2</option>
                      <option value="scope3">Scope 3</option>
                      <option value="combined">Combined</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>Electricity Grid</span>
                    <input value={config.electricityGrid ?? ''} onChange={(event) => handleConfigChange({ electricityGrid: event.target.value })} placeholder="Optional" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" />
                  </label>
                </>
              )}
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Emission Factor</span>
                <select value={config.emissionFactorMode} onChange={(event) => handleConfigChange({ emissionFactorMode: event.target.value as ReportConfig['emissionFactorMode'] })} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
                  <option value="default">Default</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              {config.emissionFactorMode === 'custom' && (
                <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <span>Custom factor</span>
                  <input type="number" step="0.01" value={config.customEmissionFactor ?? ''} onChange={(event) => handleConfigChange({ customEmissionFactor: Number(event.target.value) })} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" />
                </label>
              )}
            </div>
          </div>
          <ColumnMappingPanel columns={columns} mappings={mappings} onChange={handleMappingChange} fields={mappingFields} />

          {analysis && (
            <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Configuration summary</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Ready for analytics and PDF generation</h3>
                </div>
                <div className={`rounded-full px-3 py-1 text-sm font-semibold ${missingFields.length === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'}`}>
                  {configurationStatus}
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Industry</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">{industryData.industries[config.industry]?.name ?? config.industry}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Analysis type</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">{config.scope}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Detected years</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">{analysis.summary.yearsCovered.join(', ') || 'N/A'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Rows</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">{analysis.summary.rowCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Mapped columns</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{mappedFields.map((field) => field.label).join(', ') || 'None'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-sm text-slate-500">Missing columns</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{missingFields.map((field) => field.label).join(', ') || 'None'}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Benchmark dataset: {industryData.industries[config.industry]?.name ?? 'Industry benchmark'}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Selected emission factor: {config.emissionFactorMode}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Status: {configurationStatus}</span>
              </div>
            </div>
          )}

          {analysis && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Dataset summary</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Operational profile</h3>
                    </div>
                    <button type="button" onClick={handleGeneratePdf} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400">
                      Download PDF report
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-sm text-slate-500">Rows</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{analysis.summary.rowCount}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-sm text-slate-500">Years covered</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{analysis.summary.yearsCovered.join(', ') || 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-sm text-slate-500">Detected columns</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{analysis.summary.detectedColumns.join(', ')}</p>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">
                    <p className="font-semibold text-slate-900 dark:text-white">Validation notes</p>
                    {analysis.summary.warnings.length === 0 ? <p className="text-sm text-slate-600 dark:text-slate-400">No critical warnings detected.</p> : analysis.summary.warnings.map((warning) => <p key={warning} className="text-sm text-amber-700 dark:text-amber-400">• {warning}</p>)}
                    <p className="text-sm text-slate-600 dark:text-slate-400">Duplicate rows: {analysis.summary.duplicateRows}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Detected industry: {analysis.summary.industry}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Analytics dashboard</p>
                  <div ref={productionChartRef} className="mt-4 h-72 min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analysis.analytics.productionTrend} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#94a3b8" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="production" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Trend comparison</p>
                  <div ref={emissionChartRef} className="mt-4 h-72 min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analysis.analytics.yearwiseComparison} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#94a3b8" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip />
                        <Bar dataKey="production" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="emissions" fill="#64748b" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Benchmark comparison</p>
                  <div ref={benchmarkChartRef} className="mt-4 h-72 min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ name: analysis.analytics.benchmarkComparison.label, value: 100 }]} dataKey="value" innerRadius={50} outerRadius={90} fill="#38bdf8">
                          <Cell fill={analysis.analytics.benchmarkComparison.label === 'Below Benchmark' ? '#16a34a' : analysis.analytics.benchmarkComparison.label === 'Above Benchmark' ? '#dc2626' : '#f59e0b'} />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Current value: {analysis.analytics.benchmarkComparison.currentValue.toFixed(2)} vs benchmark {analysis.analytics.benchmarkComparison.benchmarkValue.toFixed(2)}.</p>
                </div>
              </div>

              {analysis.analytics.scopeDistribution.length > 0 && (
                <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Scope distribution</p>
                  <div ref={scopeChartRef} className="mt-4 h-72 min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={analysis.analytics.scopeDistribution} dataKey="value" innerRadius={50} outerRadius={90} fill="#38bdf8">
                          {analysis.analytics.scopeDistribution.map((entry) => (
                            <Cell key={entry.name} fill={entry.name === 'Scope 1' ? '#38bdf8' : entry.name === 'Scope 2' ? '#64748b' : '#f59e0b'} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Automatic insights</p>
                  <div className="mt-4 space-y-3">
                    {analysis.insights.map((insight) => (
                      <div key={insight.title} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                        <p className="font-semibold text-slate-900 dark:text-white">{insight.title}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{insight.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/90">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Recommendations</p>
                  <div className="mt-4 space-y-3">
                    {analysis.recommendations.map((recommendation) => (
                      <div key={recommendation.title} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                        <p className="font-semibold text-slate-900 dark:text-white">{recommendation.title}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{recommendation.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
