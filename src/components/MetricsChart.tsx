import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions, ApexAxisChartSeries } from 'apexcharts';
import type { MetricSeries } from '../data';

interface MetricsChartProps {
  series: MetricSeries[];
  height?: number;
}

const Y_LABELS = ['Tdy', '0%', '$0', '$0', '0', '0', '0'];

export function MetricsChart({ series, height = 420 }: MetricsChartProps) {
  // Determine a shared dollar scale for Cost and CPA so CPA bars stay tiny.
  const dollarMax = useMemo(() => {
    const cost = series.find((s) => s.name === 'Cost');
    const cpa = series.find((s) => s.name === 'CPA');
    const values = [
      ...(cost?.data.map((d) => d.value) ?? []),
      ...(cpa?.data.map((d) => d.value) ?? []),
    ];
    return values.length ? Math.max(...values) : 1;
  }, [series]);

  const normalized = useMemo(
    () =>
      series.map((s) => {
        const scaleMax = s.name === 'CPA' || s.name === 'Cost' ? dollarMax : Math.max(...s.data.map((d) => d.value));
        const safeMax = scaleMax || 1;
        return {
          ...s,
          normalizedData: s.data.map((d) => ({
            x: d.date,
            y: (d.value / safeMax) * 100,
          })),
        };
      }),
    [dollarMax, series]
  );

  const apexSeries = useMemo(
    () =>
      normalized.map((s) => ({
        name: s.name,
        type: mapType(s.type),
        data: s.normalizedData,
        color: s.color,
      })),
    [normalized]
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
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 900,
          animateGradually: { enabled: true, delay: 120 },
          dynamicAnimation: { enabled: true, speed: 700 },
        },
        background: 'transparent',
        dropShadow: { enabled: false },
      },
      stroke: {
        curve: series.map((s) => (s.type === 'spline' ? 'smooth' : 'straight')),
        width: series.map((s) =>
          s.type === 'bar' ? 0 : s.type === 'spline' ? 4 : 2.5
        ),
      },
      fill: {
        type: series.map((s) => (s.type === 'area' ? 'solid' : 'solid')),
        opacity: series.map((s) => (s.type === 'area' ? 0.45 : 1)),
      },
      plotOptions: {
        bar: {
          columnWidth: '22%',
          borderRadius: 3,
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
        hover: { size: 8 },
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
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 6,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: '#6b7280', fontSize: '13px', fontWeight: 600 },
          offsetX: -18,
          formatter: (val: number) => formatYAxisLabel(val),
        },
      },
      grid: {
        borderColor: '#f3f4f6',
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { left: -10, right: 10 },
      },
      legend: { show: false },
      tooltip: {
        shared: true,
        intersect: false,
        custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
          const date = categories[dataPointIndex];
          const rows = series
            .map((s) => {
              const point = s.data[dataPointIndex];
              if (!point) return '';
              const formatted = formatTooltipValue(point.value, s.name);
              return `
                <div class="tooltip-row">
                  <span class="tooltip-dot" style="background:${s.color}"></span>
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
      <button className="chart-edit-btn" type="button" aria-label="Edit chart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="chart-inner">
        <ReactApexChart
          options={options}
          series={apexSeries as ApexAxisChartSeries}
          type="line"
          height={height}
        />
      </div>
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

function formatYAxisLabel(value: number): string {
  const idx = Math.round((value / 100) * (Y_LABELS.length - 1));
  const safeIdx = Math.max(0, Math.min(Y_LABELS.length - 1, idx));
  return Y_LABELS[Y_LABELS.length - 1 - safeIdx];
}

function formatTooltipValue(value: number, name: string): string {
  if (name === 'Conversions') return `${Math.round(value)}`;
  return `${value.toFixed(2)}`;
}
