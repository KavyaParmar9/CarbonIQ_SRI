import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export type ParsedDataset = {
  rows: Array<Record<string, string | number | boolean | null | undefined>>;
  columns: string[];
};

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  return String(value).trim();
}

function sanitizeHeader(value: string, index: number): string {
  const baseValue = value.trim() || `Column ${index + 1}`;
  return baseValue.replace(/\s+/g, ' ');
}

function looksLikeHeader(row: Array<unknown>): boolean {
  const cells = row.map(normalizeCell).filter(Boolean);
  if (cells.length === 0) return false;

  const headerKeywords = [/year/i, /production|output|volume/i, /electric|power/i, /coal|diesel|gas|renewable/i, /emission|scope/i, /clinker|ratio/i, /steel|route/i];
  const keywordMatches = cells.filter((cell) => headerKeywords.some((pattern) => pattern.test(cell))).length;
  const nonNumericValues = cells.filter((cell) => !/^[-+]?\d+(\.\d+)?$/.test(cell) && !/^[A-Z]{2,4}$/.test(cell)).length;

  return keywordMatches >= 1 || nonNumericValues >= Math.max(2, Math.ceil(cells.length / 2));
}

function buildRowsFromSheet(rows: Array<Array<unknown>>): { columns: string[]; rows: Array<Record<string, string | number | boolean | null | undefined>> } {
  const headerIndex = rows.findIndex((row) => looksLikeHeader(row));
  if (headerIndex === -1) {
    throw new Error('No header row could be detected. Please upload a dataset with a clear header row.');
  }

  const rawHeaders = rows[headerIndex].map(normalizeCell);
  const headerValues = rawHeaders.map((value, index) => sanitizeHeader(value, index));
  const seen = new Map<string, number>();
  const columns = headerValues.map((header, index) => {
    const base = header || `Column ${index + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    if (count > 0) {
      return `${base} (${count + 1})`;
    }
    return base;
  });

  const duplicateHeaders = columns.filter((column, index) => columns.indexOf(column) !== index);
  if (duplicateHeaders.length > 0) {
    throw new Error('Duplicate column headers were detected. Please rename the columns before uploading.');
  }

  const dataRows = rows.slice(headerIndex + 1).filter((row) => row.some((cell) => normalizeCell(cell) !== ''));

  if (dataRows.length === 0) {
    throw new Error('The uploaded file contains headers but no data rows.');
  }

  const normalizedRows = dataRows.map((row) => {
    const record: Record<string, string | number | boolean | null | undefined> = {};
    columns.forEach((column, index) => {
      const value = row[index];
      record[column] = normalizeCell(value);
    });
    return record;
  });

  return { columns, rows: normalizedRows };
}

export async function parseUploadedFile(file: File): Promise<ParsedDataset> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    const text = await file.text();
    if (!text.trim()) {
      throw new Error('The selected file is empty. Please upload a CSV or XLSX file with a header row and data.');
    }

    const parsed = Papa.parse<string[]>(text, {
      skipEmptyLines: true,
      header: false,
    });

    if (parsed.errors?.length) {
      const message = parsed.errors[0]?.message ?? 'The CSV could not be parsed.';
      throw new Error(message);
    }

    const rows = (parsed.data ?? []) as Array<Array<string>>;
    if (rows.length === 0) {
      throw new Error('The selected file is empty. Please upload a CSV or XLSX file with a header row and data.');
    }

    const { columns, rows: normalizedRows } = buildRowsFromSheet(rows);
    return { rows: normalizedRows, columns };
  }

  if (extension === 'xlsx') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Array<unknown>>(sheet, { defval: '', header: 1 }) as Array<Array<unknown>>;
      if (!rows.length) {
        throw new Error('The selected workbook is empty. Please upload a workbook with a header row and data.');
      }
      const { columns, rows: normalizedRows } = buildRowsFromSheet(rows);
      return { rows: normalizedRows, columns };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The Excel file could not be read.';
      throw new Error(message.includes('Cannot read') ? 'The Excel workbook appears to be corrupted. Please upload a valid .xlsx file.' : message);
    }
  }

  throw new Error('Unsupported file type. Please upload a .csv or .xlsx file.');
}
