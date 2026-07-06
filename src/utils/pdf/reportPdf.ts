import { jsPDF } from 'jspdf';
import type { ReportAnalysisResult } from '../../services/report/reportService';

type ExportPdfOptions = {
  filename?: string;
  companyName?: string;
  industryName?: string;
  reportingPeriod?: string;
  generatedAt?: string;
  chartRefs?: {
    productionTrend?: HTMLElement | null;
    emissionTrend?: HTMLElement | null;
    benchmark?: HTMLElement | null;
    scopeDistribution?: HTMLElement | null;
  };
};

async function renderChartToImage(element: HTMLElement | null): Promise<string | null> {
  if (!element) return null;
  try {
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2, backgroundColor: '#ffffff' });
    return dataUrl;
  } catch {
    return null;
  }
}

function addSectionTitle(pdf: jsPDF, title: string, y: number) {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text(title, 40, y);
  return y + 18;
}

function addBulletList(pdf: jsPDF, items: string[], startY: number, maxWidth: number) {
  let y = startY;
  items.forEach((item) => {
    const lines = pdf.splitTextToSize(item, maxWidth);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`• ${lines[0]}`, 48, y);
    if (lines.length > 1) {
      pdf.text(lines.slice(1).join(' '), 54, y + 10);
    }
    y += 16 + Math.max(0, lines.length - 1) * 10;
  });
  return y;
}

export async function exportReportPdf(report: ReportAnalysisResult, options: ExportPdfOptions = {}) {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;
  let y = 60;

  const filename = options.filename ?? 'carboniq-industrial-report.pdf';
  const companyName = options.companyName ?? 'CarbonIQ Advisory';
  const industryName = options.industryName ?? 'Industrial Operations';
  const reportingPeriod = options.reportingPeriod ?? 'Selected period';
  const generatedAt = options.generatedAt ?? new Date().toLocaleDateString();

  pdf.setFillColor(16, 24, 39);
  pdf.rect(0, 0, pageWidth, 120, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text('CarbonIQ', margin, 42);
  pdf.setFontSize(16);
  pdf.text('Industrial Sustainability Report', margin, 70);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`${companyName} • ${industryName}`, margin, 92);
  pdf.text(`Reporting Period: ${reportingPeriod} • Generated: ${generatedAt}`, margin, 110);
  pdf.setTextColor(0, 0, 0);

  y = 150;
  y = addSectionTitle(pdf, 'Executive Summary', y);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10.5);
  const summaryLines = [
    `This report summarizes ${report.summary.rowCount} rows across ${report.summary.yearsCovered.length} annual observations for ${industryName.toLowerCase()}.`,
    `The dataset includes ${report.summary.detectedColumns.join(', ')} and was assessed against the selected benchmark profile.`,
    `The analysis indicates ${report.analytics.benchmarkComparison.label.toLowerCase()} performance relative to the current benchmark baseline.`,
  ];
  summaryLines.forEach((line) => {
    const wrapped = pdf.splitTextToSize(line, maxWidth);
    pdf.text(wrapped, margin, y);
    y += 14 + Math.max(0, wrapped.length - 1) * 8;
  });

  y += 8;
  y = addSectionTitle(pdf, 'Dataset Summary', y);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10.5);
  const datasetSummary = [
    `Years covered: ${report.summary.yearsCovered.join(', ') || 'N/A'}`,
    `Rows processed: ${report.summary.rowCount}`,
    `Duplicate rows: ${report.summary.duplicateRows}`,
    `Warnings: ${report.summary.warnings.length > 0 ? report.summary.warnings.join('; ') : 'None'}`,
  ];
  datasetSummary.forEach((line) => {
    pdf.text(line, margin, y);
    y += 14;
  });

  y += 10;
  y = addSectionTitle(pdf, 'Industry Overview', y);
  const industryText = `Operational trends suggest ${report.insights[0]?.detail ?? 'stable performance'} and ${report.recommendations[0]?.detail ?? 'targeted efficiency opportunities'}.`;
  const wrappedIndustryText = pdf.splitTextToSize(industryText, maxWidth);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10.5);
  pdf.text(wrappedIndustryText, margin, y);
  y += 24 + Math.max(0, wrappedIndustryText.length - 1) * 8;

  pdf.addPage();
  y = 60;

  y = addSectionTitle(pdf, 'Chart Analysis', y);
  const chartImage = await renderChartToImage(options.chartRefs?.productionTrend ?? null);
  if (chartImage) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Production Trend', margin, y);
    pdf.addImage(chartImage, 'PNG', margin, y + 8, 240, 120);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    const productionInterpretation = report.insights.find((item) => item.title.toLowerCase().includes('production'))?.detail ?? 'Production trend is summarized from the uploaded dataset.';
    pdf.text(pdf.splitTextToSize(productionInterpretation, maxWidth - 260), margin + 260, y + 20);
    y += 150;
  }

  const emissionImage = await renderChartToImage(options.chartRefs?.emissionTrend ?? null);
  if (emissionImage) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Emission Trend', margin, y);
    pdf.addImage(emissionImage, 'PNG', margin, y + 8, 240, 120);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    const emissionInterpretation = report.insights.find((item) => item.title.toLowerCase().includes('emission'))?.detail ?? 'Emission trend is derived from the selected scope and benchmark configuration.';
    pdf.text(pdf.splitTextToSize(emissionInterpretation, maxWidth - 260), margin + 260, y + 20);
    y += 150;
  }

  if (y > pageHeight - 120) {
    pdf.addPage();
    y = 60;
  }

  const benchmarkImage = await renderChartToImage(options.chartRefs?.benchmark ?? null);
  if (benchmarkImage) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Benchmark Comparison', margin, y);
    pdf.addImage(benchmarkImage, 'PNG', margin, y + 8, 240, 120);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    const benchmarkInterpretation = `Current intensity is ${report.analytics.benchmarkComparison.currentValue.toFixed(2)} versus a benchmark of ${report.analytics.benchmarkComparison.benchmarkValue.toFixed(2)}.`;
    pdf.text(pdf.splitTextToSize(benchmarkInterpretation, maxWidth - 260), margin + 260, y + 20);
    y += 150;
  }

  const scopeImage = await renderChartToImage(options.chartRefs?.scopeDistribution ?? null);
  if (scopeImage) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Scope Distribution', margin, y);
    pdf.addImage(scopeImage, 'PNG', margin, y + 8, 240, 120);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    const scopeInterpretation = report.analytics.scopeDistribution.length > 0 ? `The latest period is concentrated in ${report.analytics.scopeDistribution.map((item) => item.name).join(', ')}.` : 'Scope distribution is based on the uploaded data.';
    pdf.text(pdf.splitTextToSize(scopeInterpretation, maxWidth - 260), margin + 260, y + 20);
    y += 150;
  }

  if (y > pageHeight - 120) {
    pdf.addPage();
    y = 60;
  }

  y = addSectionTitle(pdf, 'Automatic Insights', y);
  y = addBulletList(pdf, report.insights.map((insight) => `${insight.title}: ${insight.detail}`), y, maxWidth);
  y += 12;
  y = addSectionTitle(pdf, 'Recommendations', y);
  y = addBulletList(pdf, report.recommendations.map((recommendation) => `${recommendation.title}: ${recommendation.detail}`), y, maxWidth);
  y += 12;
  y = addSectionTitle(pdf, 'Appendix', y);
  const appendixLines = [
    'Dataset citations are derived from the uploaded operational records and benchmark inputs.',
    'All interpretations are based on observed trends and calculated benchmarks only.',
  ];
  y = addBulletList(pdf, appendixLines, y, maxWidth);

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(9);
  pdf.text(`Generated by CarbonIQ • Page 1 of 1`, margin, pageHeight - 24);
  pdf.save(filename);
}
