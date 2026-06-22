export interface MetricPoint {
  date: string; // displayed as-is in tooltip and on x-axis
  value: number;
}

export interface MetricSeries {
  name: string;
  type: 'area' | 'spline' | 'line' | 'bar';
  color: string;
  data: MetricPoint[];
}

export function generateSampleData(): MetricSeries[] {
  // Values taken from the reference GIF (10.06.2026 – 14.06.2026)
  const dates = ['10.06.2026', '11.06.2026', '12.06.2026', '13.06.2026', '14.06.2026'];

  const cost = [2.04, 25.85, 44.36, 55.65, 63.75];
  const cpa = [0.68, 0.86, 1.23, 0.79, 0.71];
  const roi = [610.78, 180.5, 161.47, 56.33, 357.25];
  const conversions = [3, 30, 36, 70, 90];

  const toPoints = (values: number[]) =>
    values.map((value, i) => ({ date: dates[i], value }));

  return [
    { name: 'Cost', type: 'area', color: '#FDE68A', data: toPoints(cost) },
    { name: 'CPA', type: 'bar', color: '#3B82F6', data: toPoints(cpa) },
    { name: 'ROI confirmed', type: 'spline', color: '#22C55E', data: toPoints(roi) },
    { name: 'Conversions', type: 'line', color: '#A855F7', data: toPoints(conversions) },
  ];
}
