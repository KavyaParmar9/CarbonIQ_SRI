import { useMemo } from 'react';

type FieldDefinition = { key: string; label: string };

type ColumnMappingPanelProps = {
  columns: string[];
  mappings: Record<string, string>;
  onChange: (field: string, value: string) => void;
  fields: FieldDefinition[];
};

export default function ColumnMappingPanel({ columns, mappings, onChange, fields }: ColumnMappingPanelProps) {
  const availableColumns = useMemo(() => columns.filter(Boolean), [columns]);
  const detectedFields = useMemo(() => fields.filter((field) => Boolean(mappings[field.key])), [fields, mappings]);
  const manualFields = useMemo(() => fields.filter((field) => !mappings[field.key]), [fields, mappings]);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg dark:border-slate-800/80 dark:bg-slate-900/90">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Column mapping</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Detected headers are mapped automatically. Only missing fields require manual selection.</p>
        </div>
      </div>

      {detectedFields.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-800/70 dark:bg-emerald-950/50">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Automatically detected</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {detectedFields.map((field) => (
              <span key={field.key} className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white">
                ✓ {field.label}: {mappings[field.key]}
              </span>
            ))}
          </div>
        </div>
      )}

      {manualFields.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {manualFields.map((field) => (
            <label key={field.key} className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                {field.label}
              </span>
              <select
                value={mappings[field.key] ?? ''}
                onChange={(event) => onChange(field.key, event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="">Select column</option>
                {availableColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

      {manualFields.length === 0 && detectedFields.length > 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-400">All required fields were detected from the uploaded header row.</p>
      )}
    </div>
  );
}
