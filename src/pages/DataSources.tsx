import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';

type DatasetMeta = {
  name?: string;
  updatedAt?: string;
  meta?: { source?: string; description?: string };
};

const potentialFiles = [
  'cement.json',
  'steel.json',
  'semiconductor.json',
  'cbam.json',
  'industryData.json',
];

export default function DataSources() {
  const [results, setResults] = useState<Record<string, DatasetMeta | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const entries: Record<string, DatasetMeta | null> = {};
      await Promise.all(
        potentialFiles.map(async (fname) => {
          try {
            const res = await fetch(`/data/${fname}`);
            if (!res.ok) {
              entries[fname] = null;
              return;
            }
            const json = await res.json();
            entries[fname] = {
              name: json.name || json.title || fname,
              updatedAt: json.updatedAt || json.last_updated || null,
              meta: json.meta || json.metadata || null,
            };
          } catch (e) {
            entries[fname] = null;
          }
        })
      );
      if (mounted) {
        setResults(entries);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <SectionHeading
        title="Research Data Sources"
        description="Overview of bundled datasets and their provenance. Files are loaded from the project's `/public/data` folder when available."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading && <div className="p-6">Loading datasets…</div>}

        {!loading &&
          potentialFiles.map((file) => {
            const meta = results[file];
            return (
              <div key={file} className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm break-words">
                <h4 className="text-lg font-semibold text-slate-900">{file.replace('.json', '')}</h4>
                {meta === null ? (
                  <p className="mt-2 text-sm text-slate-600">Dataset not currently available.</p>
                ) : (
                  <div className="mt-3 text-sm text-slate-700">
                    <p><strong>Name:</strong> {meta.name ?? '—'}</p>
                    <p><strong>Updated:</strong> {meta.updatedAt ?? 'Dataset not currently available.'}</p>
                    <p className="mt-2"><strong>Source:</strong> {meta.meta?.source ?? 'Dataset metadata unavailable.'}</p>
                    <p className="mt-2 text-sm text-slate-600">{meta.meta?.description ?? ''}</p>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="mt-6 text-sm text-slate-500">
        <p>Notes:</p>
        <ul className="list-disc pl-5">
          <li>Only datasets included in <code>public/data</code> are shown here.</li>
          <li>If a dataset is missing, add the JSON/CSV to <code>public/data</code> and it will appear here.</li>
        </ul>
      </div>
    </section>
  );
}
