import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboardChart } from '../hooks/useDashboardChart';
import { formatNumber } from '../utils/metrics';
import { Card, Button } from './_common';
import { METRIC_OPTIONS } from '../constants/dashboard';

export default function DashboardChart() {
  const { chartData, activeMetrics, toggleMetric } = useDashboardChart();

  return (
    <Card
      className="mb-8"
      title="일별 추이"
      headerAction={
        <div className="flex flex-wrap gap-2">
          {METRIC_OPTIONS.map((option) => (
            <Button
              key={option.key}
              variant={activeMetrics.includes(option.key) ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => toggleMetric(option.key)}
              className={activeMetrics.includes(option.key) ? 'ring-1 ring-blue-200' : ''}
            >
              {option.label}
            </Button>
          ))}
        </div>
      }
    >
      <div className="h-100 w-full p-6">
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
    </Card>
  );
}
