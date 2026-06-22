export interface MetricPoint {
  date: string; // ISO date YYYY-MM-DD
  value: number;
}

export interface MetricSeries {
  name: string;
  type: 'area' | 'spline' | 'line' | 'bar';
  color: string;
  data: MetricPoint[];
}

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

function generateDates(days = 14): Date[] {
  const dates: Date[] = [];
  const today = new Date('2026-06-22');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d);
  }
  return dates;
}

export function generateSampleData(): MetricSeries[] {
  const dates = generateDates(14);

  const cost: MetricPoint[] = dates.map((date, i) => ({
    date: formatDate(date),
    value: Number((30 + Math.sin(i * 0.5) * 15 + i * 2.5).toFixed(2)),
  }));

  const cpa: MetricPoint[] = dates.map((date, i) => ({
    date: formatDate(date),
    value: Number((0.4 + Math.abs(Math.cos(i * 0.4)) * 0.6 + i * 0.02).toFixed(2)),
  }));

  const roi: MetricPoint[] = dates.map((date, i) => ({
    date: formatDate(date),
    value: Number((20 + Math.cos(i * 0.6) * 30 + i * 3).toFixed(2)),
  }));

  const conversions: MetricPoint[] = dates.map((date, i) => ({
    date: formatDate(date),
    value: Math.round(20 + Math.sin(i * 0.5) * 15 + i * 4),
  }));

  return [
    {
      name: 'Cost',
      type: 'area',
      color: '#FDE68A',
      data: cost,
    },
    {
      name: 'CPA',
      type: 'bar',
      color: '#3B82F6',
      data: cpa,
    },
    {
      name: 'ROI confirmed',
      type: 'spline',
      color: '#22C55E',
      data: roi,
    },
    {
      name: 'Conversions',
      type: 'line',
      color: '#A855F7',
      data: conversions,
    },
  ];
}
