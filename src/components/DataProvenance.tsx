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
    <div className="mt-3 rounded-md border border-slate-200/80 bg-white/90 p-3 text-xs text-slate-600">
      <div className="flex flex-wrap gap-3">
        <div><strong>Source:</strong> {source ?? 'Dataset not currently available.'}</div>
        <div><strong>Dataset:</strong> {dataset ?? 'Dataset not currently available.'}</div>
        <div><strong>Last Updated:</strong> {lastUpdated ?? 'Unknown'}</div>
      </div>
      <div className="mt-2">
        <div><strong>Calculation Method:</strong> {method ?? 'Not specified'}</div>
        <div className="mt-1"><strong>Confidence:</strong> {confidence ?? 'Dataset not currently available.'}</div>
      </div>
    </div>
  );
}
