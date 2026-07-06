import { useEffect, useMemo, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { loadLocalJson, loadLocalText } from '../services/sourceService';
import { summarizeJsonDataset } from '../services/analysisService';

type FileEntry = {
  name: string;
  url: string;
  type: 'json' | 'csv' | 'other';
};

export default function DatasetExplorer() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<FileEntry | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonSummary, setJsonSummary] = useState<any | null>(null);

  // CSV specific
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvPage, setCsvPage] = useState(1);
  const pageSize = 20;
  const [csvFilter, setCsvFilter] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  useEffect(() => {
    // Discover some common dataset files placed in public/data
    const known = [
      'cement.json',
      'steel.json',
      'semiconductor.json',
      'cbam.json',
      'industryData.json',
    ];

    const discovered: FileEntry[] = known.map((name) => ({
      name,
      url: `/data/${name}`,
      type: name.endsWith('.json') ? 'json' : name.endsWith('.csv') ? 'csv' : 'other',
    }));

    setFiles(discovered);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, query]);

  async function loadPreview(file: FileEntry) {
    setSelected(file);
    setPreviewText(null);
    setLoading(true);
    try {
      if (file.type === 'json') {
        const json = await loadLocalJson(file.name);
        if (!json) {
          setPreviewText('Dataset not currently available.');
          setJsonSummary(null);
          setLoading(false);
          return;
        }
        setJsonSummary(summarizeJsonDataset(json));
        setPreviewText(JSON.stringify(json, null, 2));
      } else if (file.type === 'csv') {
        const txt = await loadLocalText(file.name);
        if (!txt) {
          setPreviewText('Dataset not currently available.');
          setCsvRows([]);
          setCsvHeaders([]);
          setLoading(false);
          return;
        }
        const lines = txt.split('\n').map((l) => l.replace(/\r$/, ''));
        const headers = lines[0].split(',').map((h) => h.trim());
        const rows = lines.slice(1).map((line) => {
          const cells = line.split(',');
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => (obj[h] = cells[i] ?? ''));
          return obj;
        }).filter((r) => Object.keys(r).length > 0);
        setCsvHeaders(headers);
        setCsvRows(rows);
        setCsvPage(1);
        setSelectedColumn(null);
        setPreviewText(`CSV loaded: ${rows.length} rows, ${headers.length} columns`);
      } else {
        setPreviewText('Preview not supported for this file type.');
      }
    } catch (e) {
      setPreviewText('Failed to load preview.');
    } finally {
      setLoading(false);
    }
  }

  const filteredCsvRows = useMemo(() => {
    if (!csvFilter) return csvRows;
    const q = csvFilter.toLowerCase();
    return csvRows.filter((r) => csvHeaders.some((h) => (r[h] || '').toLowerCase().includes(q)));
  }, [csvRows, csvFilter, csvHeaders]);

  const pageCount = Math.max(1, Math.ceil(filteredCsvRows.length / pageSize));
  const csvPageRows = filteredCsvRows.slice((csvPage - 1) * pageSize, csvPage * pageSize);

  return (
    <section className="space-y-8">
      <SectionHeading title="Dataset Explorer" description="Search, preview, and download datasets bundled with the project." />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search datasets (name)..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div className="mt-4 space-y-3">
            {filtered.map((f) => (
              <div key={f.name} className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-sm text-slate-600">{f.type.toUpperCase()}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="rounded-md border px-3 py-1 text-sm"
                    onClick={() => loadPreview(f)}
                  >
                    Preview
                  </button>
                  <a className="rounded-md border px-3 py-1 text-sm" href={f.url} download>
                    Download
                  </a>
                </div>
              </div>
            ))}

            {filtered.length === 0 && <div className="p-4 text-sm text-slate-600">No datasets match your search.</div>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-lg font-semibold">Preview</h4>
            <div className="text-sm text-slate-500">{selected?.name ?? 'No file selected'}</div>
          </div>

          <div className="min-h-[320px] overflow-auto rounded-md bg-slate-50 p-3 text-sm">
            {loading && <div>Loading preview…</div>}

            {!loading && selected?.type === 'json' && jsonSummary && (
              <div>
                <div className="mb-3">
                  <strong>Rows:</strong> {jsonSummary.rowCount ?? '—'}
                  {jsonSummary.name && <span className="ml-3">• <strong>Name:</strong> {jsonSummary.name}</span>}
                </div>
                <div className="mb-2 text-sm text-slate-700">Sample:</div>
                <pre className="whitespace-pre-wrap bg-white p-2 rounded">{JSON.stringify(jsonSummary.sample, null, 2)}</pre>
                <div className="mt-3 text-sm text-slate-600">Full JSON preview:</div>
                <pre className="whitespace-pre-wrap mt-2">{previewText}</pre>
              </div>
            )}

            {!loading && selected?.type === 'csv' && (
              <div>
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input value={csvFilter} onChange={(e) => { setCsvFilter(e.target.value); setCsvPage(1); }} placeholder="Filter rows (any column)..." className="flex-1 rounded-md border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-950" />
                </div>

                <div className="mb-2 text-sm text-slate-700">Columns:</div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {csvHeaders.map((h) => (
                    <button key={h} onClick={() => setSelectedColumn(h)} className={`rounded-md border px-2 py-1 text-sm ${selectedColumn === h ? 'bg-slate-200' : ''}`}>{h}</button>
                  ))}
                </div>

                {selectedColumn && (
                  <div className="mb-3">
                    <div className="text-sm text-slate-700">Sample values for <strong>{selectedColumn}</strong>:</div>
                    <div className="mt-2 space-y-1 text-xs">
                      {filteredCsvRows.slice(0, 20).map((r, i) => (
                        <div key={i} className="truncate">{r[selectedColumn] ?? ''}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-2 text-sm text-slate-700">Rows (page {csvPage} of {pageCount})</div>
                <div className="overflow-x-auto rounded border border-slate-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        {csvHeaders.map((h) => (
                          <th key={h} className="px-2 py-1 text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPageRows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-t">
                          {csvHeaders.map((h) => (
                            <td key={h} className="px-2 py-1">{row[h]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button disabled={csvPage <= 1} onClick={() => setCsvPage((p) => Math.max(1, p - 1))} className="rounded-md border px-2 py-1">Prev</button>
                  <button disabled={csvPage >= pageCount} onClick={() => setCsvPage((p) => Math.min(pageCount, p + 1))} className="rounded-md border px-2 py-1">Next</button>
                  <div className="text-sm text-slate-600 ml-auto">{filteredCsvRows.length} rows</div>
                </div>
              </div>
            )}

            {!loading && !previewText && selected == null && (
              <div className="text-slate-600">Select a dataset to preview its first rows or JSON structure.</div>
            )}

            {!loading && previewText && selected?.type === 'other' && (
              <pre className="whitespace-pre-wrap">{previewText}</pre>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-500">
        <p>Tips: Bundled datasets live in <code>public/data</code>. Add CSV or JSON files to make them available here.</p>
      </div>
    </section>
  );
}
