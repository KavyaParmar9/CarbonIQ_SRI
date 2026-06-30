import fs from 'fs';
import path from 'path';

const dataFolder = path.resolve(process.cwd(), 'data');

export type IndustryDataset = {
  name: string;
  updatedAt: string;
  meta: {
    source: string;
    description: string;
  };
  values: Record<string, any>[];
};

function ensureDataFolder() {
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }
}

function writeDataFile(filename: string, content: IndustryDataset) {
  fs.writeFileSync(path.join(dataFolder, filename), JSON.stringify(content, null, 2), 'utf-8');
}

export async function fetchOurWorldInData() {
  const url = 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch OWID data: ${response.statusText}`);
  }
  return response.text();
}

export function parseCsv(text: string) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? '';
    });
    return row;
  });
}

export async function buildLocalDatasets() {
  ensureDataFolder();

  const rawOwid = await fetchOurWorldInData();
  const rows = parseCsv(rawOwid);

  const cement = rows
    .filter((row) => row.cement_co2 && row.cement_co2 !== '')
    .map((row) => ({
      country: row.country,
      year: Number(row.year),
      cement_co2: Number(row.cement_co2),
      cement_co2_per_capita: Number(row.cement_co2_per_capita) || null,
    }));

  const steel = rows
    .filter((row) => row.ghg_excluding_lucf && row.ghg_excluding_lucf !== '')
    .map((row) => ({
      country: row.country,
      year: Number(row.year),
      ghg_excluding_lucf: Number(row.ghg_excluding_lucf),
      co2: Number(row.co2) || null,
    }));

  const semiconductor = rows
    .filter((row) => row.energy_per_capita && row.energy_per_capita !== '')
    .map((row) => ({
      country: row.country,
      year: Number(row.year),
      energy_per_capita: Number(row.energy_per_capita),
      co2: Number(row.co2) || null,
    }));

  writeDataFile('cement.json', {
    name: 'Cement Industry Dataset',
    updatedAt: new Date().toISOString(),
    meta: {
      source: 'Our World in Data CO₂ dataset',
      description: 'Processed cement emissions data extracted from OWID.',
    },
    values: cement,
  });

  writeDataFile('steel.json', {
    name: 'Steel Industry Dataset',
    updatedAt: new Date().toISOString(),
    meta: {
      source: 'Our World in Data CO₂ dataset',
      description: 'Steel-related emissions proxy data extracted from OWID.',
    },
    values: steel,
  });

  writeDataFile('semiconductor.json', {
    name: 'Semiconductor Industry Dataset',
    updatedAt: new Date().toISOString(),
    meta: {
      source: 'Our World in Data CO₂ dataset',
      description: 'Semiconductor proxy dataset from electrical energy and CO₂ statistics.',
    },
    values: semiconductor,
  });

  writeDataFile('cbam.json', {
    name: 'CBAM Research Dataset',
    updatedAt: new Date().toISOString(),
    meta: {
      source: 'Internal research aggregation',
      description: 'Summaries and structured findings for CBAM studies.',
    },
    values: [
      {
        title: 'CBAM Great Britain Electricity Study',
        methodology: 'Benchmark analysis of emissions intensity and tariff impacts for electricity-intensive exporters.',
        findings: ['Tariff exposure increases with grid carbon intensity.', 'Power-intensive sectors require low-carbon contracts to mitigate CBAM costs.'],
        limitations: ['Focuses only on electricity emissions, not full supply chain.'],
      },
      {
        title: 'CBAM India Steel Study',
        methodology: 'Sector-level analysis of steel export emissions and border adjustment risk.',
        findings: ['BF-BOF remains the highest exposure route.', 'Domestic scrap recycling and energy efficiency reduce CBAM liabilities.'],
        limitations: ['Data is estimated from national aggregates and not plant-level surveys.'],
      },
    ],
  });

  return { cement, steel, semiconductor };
}
