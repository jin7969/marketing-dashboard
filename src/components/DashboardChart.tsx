import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useDashboardData } from '../hooks/useDashboardData';
import { formatNumber } from '../utils/metrics';

type MetricKey = 'impressions' | 'clicks' | 'conversions' | 'cost';

interface MetricOption {
  label: string;
  key: MetricKey;
  color: string;
}

const METRIC_OPTIONS: MetricOption[] = [
  { label: '노출수', key: 'impressions', color: '#8884d8' },
  { label: '클릭수', key: 'clicks', color: '#82ca9d' },
  { label: '전환수', key: 'conversions', color: '#ffc658' },
  { label: '비용', key: 'cost', color: '#ff7300' },
];

export default function DashboardChart() {
  const { stats } = useDashboardData();
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(['impressions', 'clicks']);

  // 1. 날짜별 데이터 합산 가공
  const chartData = useMemo(() => {
    const dailyMap = new Map<string, Record<MetricKey, number>>();

    stats.forEach((stat) => {
      const date = stat.date;
      const current = dailyMap.get(date) || {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
      };

      dailyMap.set(date, {
        impressions: current.impressions + (stat.impressions || 0),
        clicks: current.clicks + (stat.clicks || 0),
        conversions: current.conversions + (stat.conversions || 0),
        cost: current.cost + (stat.cost || 0),
      });
    });

    return Array.from(dailyMap.entries())
      .map(([date, values]) => ({
        date,
        displayDate: format(parseISO(date), 'MM.dd'),
        ...values,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [stats]);

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) => {
      if (prev.includes(key)) {
        // 최소 1개는 선택되어 있어야 함
        if (prev.length <= 1) return prev;
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  return (
    <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-lg font-semibold text-gray-900">일별 추이</h2>

        {/* 메트릭 토글 버튼 */}
        <div className="flex flex-wrap gap-2">
          {METRIC_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => toggleMetric(option.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                activeMetrics.includes(option.key)
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-100 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {METRIC_OPTIONS.map((option) => (
                  <linearGradient key={option.key} id={`color${option.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={option.color} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={option.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value, name) => [formatNumber(value as number), name]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {METRIC_OPTIONS.map(
                (option) =>
                  activeMetrics.includes(option.key) && (
                    <Area
                      key={option.key}
                      type="monotone"
                      dataKey={option.key}
                      name={option.label}
                      stroke={option.color}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#color${option.key})`}
                      animationDuration={1000}
                    />
                  ),
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            해당 조건에 맞는 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
