import { ChangeEvent, DragEvent, useRef, useState } from 'react';

type UploadZoneProps = {
  onFileSelected: (file: File) => void;
  acceptedTypes?: string;
  label?: string;
};

export default function UploadZone({ onFileSelected, acceptedTypes = '.csv,.xlsx', label = 'Drop your industrial dataset here' }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    onFileSelected(file);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const onBrowse = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={onDrop}
      className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${isDragging ? 'border-brand-500 bg-brand-500/10' : 'border-slate-300 bg-white/70 dark:border-slate-700 dark:bg-slate-900/70'}`}
    >
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{label}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Upload historical operational data in CSV or Excel format. The report generator runs entirely in your browser.</p>
      <button type="button" onClick={() => inputRef.current?.click()} className="mt-6 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400">
        Browse file
      </button>
      <input ref={inputRef} type="file" accept={acceptedTypes} onChange={onBrowse} className="hidden" />
      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Supported: {acceptedTypes}</p>
    </div>
  );
}
