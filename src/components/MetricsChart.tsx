import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions, ApexAxisChartSeries } from 'apexcharts';
import type { MetricSeries } from '../data';

interface MetricsChartProps {
  series: MetricSeries[];
  title?: string;
  height?: number;
}

export function MetricsChart({ series, height = 420 }: MetricsChartProps) {
  const apexSeries = useMemo(
    () =>
      series.map((s) => ({
        name: s.name,
        type: mapType(s.type),
        data: s.data.map((p) => ({ x: p.date, y: p.value })),
        color: s.color,
      })),
    [series]
  );

  const categories = useMemo(
    () => series[0]?.data.map((p) => p.date) ?? [],
    [series]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        height,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 600,
        },
        background: 'transparent',
        dropShadow: { enabled: false },
      },
      stroke: {
        curve: series.map((s) => (s.type === 'spline' ? 'smooth' : 'straight')),
        width: series.map((s) => (s.type === 'bar' ? 0 : s.type === 'spline' ? 3 : 2)),
      },
      fill: {
        type: series.map((s) => (s.type === 'area' ? 'solid' : 'solid')),
        opacity: series.map((s) => (s.type === 'area' ? 0.45 : 1)),
      },
      plotOptions: {
        bar: {
          columnWidth: '20%',
          borderRadius: 4,
        },
      },
      markers: {
        size: series.map((s) =>
          s.type === 'bar' ? 0 : s.name === 'Conversions' ? 5 : 4
        ),
        shape: series.map((s) =>
          s.name === 'Conversions' ? 'square' : 'circle'
        ),
        strokeWidth: 2,
        strokeColors: '#fff',
        hover: { size: 7 },
      },
      xaxis: {
        categories,
        tooltip: { enabled: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          stroke: { color: '#d1d5db', width: 1, dashArray: 4 },
        },
        labels: {
          style: { colors: '#6b7280', fontSize: '11px' },
          hideOverlappingLabels: true,
          trim: true,
        },
      },
      yaxis: series.map((s, index) => ({
        seriesName: s.name,
        opposite: false,
        floating: false,
        offsetX: -index * 42,
        decimalsInFloat: s.name === 'Conversions' ? 0 : 2,
        axisBorder: { show: index === 0, color: '#e5e7eb' },
        axisTicks: { show: false },
        labels: {
          style: { colors: '#6b7280', fontSize: '11px' },
          formatter: (val: number) => formatYAxisLabel(val, s.name),
        },
        title: {
          text: index === 0 ? 'Tdy' : undefined,
          style: { color: '#374151', fontSize: '12px', fontWeight: 600 },
          offsetX: 8,
        },
      })),
      grid: {
        borderColor: '#f3f4f6',
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { left: 10, right: 10 },
      },
      legend: { show: false },
      tooltip: {
        shared: true,
        intersect: false,
        custom: ({ dataPointIndex, w }: { dataPointIndex: number; w: any }) => {
          const date = w.globals.labels[dataPointIndex] as string;
          const rows = w.config.series
            .map((s: any, i: number) => {
              const val = w.globals.series[i][dataPointIndex] as number | null;
              if (val == null) return '';
              const color = s.color as string;
              const formatted = formatTooltipValue(val, s.name);
              return `
                <div class="tooltip-row">
                  <span class="tooltip-dot" style="background:${color}"></span>
                  <span class="tooltip-name">${s.name}:</span>
                  <span class="tooltip-value">${formatted}</span>
                </div>
              `;
            })
            .join('');
          return `
            <div class="custom-tooltip">
              <div class="tooltip-date">${date}</div>
              ${rows}
            </div>
          `;
        },
      },
      dataLabels: { enabled: false },
      colors: series.map((s) => s.color),
      theme: { mode: 'light' },
    }),
    [categories, height, series]
  );

  return (
    <div className="metrics-chart-card">
      <ReactApexChart
        options={options}
        series={apexSeries as ApexAxisChartSeries}
        type="line"
        height={height}
      />
    </div>
  );
}

function mapType(type: MetricSeries['type']): 'area' | 'line' | 'bar' {
  switch (type) {
    case 'spline':
      return 'line';
    case 'bar':
      return 'bar';
    case 'area':
      return 'area';
    case 'line':
    default:
      return 'line';
  }
}

function formatYAxisLabel(value: number, name: string): string {
  if (name === 'ROI confirmed') return `${value.toFixed(0)}%`;
  if (name === 'Cost' || name === 'CPA') return `$${value.toFixed(0)}`;
  return String(Math.round(value));
}

function formatTooltipValue(value: number, name: string): string {
  if (name === 'ROI confirmed') return `${value.toFixed(2)}`;
  if (name === 'Cost' || name === 'CPA') return `${value.toFixed(2)}`;
  return `${Math.round(value)}`;
}
