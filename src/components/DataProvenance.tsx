import React from 'react';

type Provenance = {
  source?: string | null;
  dataset?: string | null;
  lastUpdated?: string | null;
  method?: string | null;
  confidence?: string | null;
};

export default function DataProvenance({
  source,
  dataset,
  lastUpdated,
  method,
  confidence,
}: Provenance) {
  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-300">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white">Dataset Information</h4>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">Provenance</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1 break-words">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Source</p>
          <p className="font-medium text-slate-900 dark:text-white">{source ?? 'Dataset not currently available.'}</p>
        </div>
        <div className="space-y-1 break-words">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Dataset</p>
          <p className="font-medium text-slate-900 dark:text-white">{dataset ?? 'Dataset not currently available.'}</p>
        </div>
        <div className="space-y-1 break-words">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Last Updated</p>
          <p className="font-medium text-slate-900 dark:text-white">{lastUpdated ?? 'Unknown'}</p>
        </div>
        <div className="space-y-1 break-words">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Calculation Method</p>
          <p className="font-medium text-slate-900 dark:text-white">{method ?? 'Not specified'}</p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 text-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Confidence</p>
        <p className="mt-1 font-medium text-slate-900 dark:text-white">{confidence ?? 'Dataset not currently available.'}</p>
      </div>
    </div>
  );
}
