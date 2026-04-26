import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { usePlatformChart, type PlatformDataItem } from '../hooks/usePlatformChart';
import { Card, Button } from './_common';
import { formatCurrency, formatNumber } from '../utils/metrics';
import type { MetricKey } from '../types/dashboard';
import { METRIC_OPTIONS } from '../constants/dashboard';

function formatValue(value: number, metric: MetricKey): string {
  return metric === 'cost' ? formatCurrency(value) : formatNumber(value);
}

function CustomTooltip({
  active,
  payload,
  metric,
}: {
  active?: boolean;
  payload?: { payload: PlatformDataItem }[];
  metric: MetricKey;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border-none bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-gray-800">{item.platform}</p>
      <p className="text-sm text-gray-600">{formatValue(item.value, metric)}</p>
      <p className="text-xs text-gray-400">{item.percentage.toFixed(1)}%</p>
    </div>
  );
}

export default function PlatformChart() {
  const { platformData, activeMetric, setActiveMetric, togglePlatform } = usePlatformChart();

  const activePlatforms = platformData.filter((d) => d.isActive).map((d) => d.platform);
  const hasData = platformData.some((d) => d.value > 0);

  return (
    <Card
      title="플랫폼별 성과"
      headerAction={
        <div className="flex flex-wrap gap-2">
          {METRIC_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              variant={activeMetric === opt.key ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setActiveMetric(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      }
    >
      <div className="flex items-center gap-6 p-6">
        <div className="h-44 w-44 shrink-0">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  dataKey="value"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={2}
                  onClick={(data) => togglePlatform((data as unknown as PlatformDataItem).platform)}
                  style={{ cursor: 'pointer' }}
                  strokeWidth={0}
                >
                  {platformData.map((entry) => (
                    <Cell key={entry.platform} fill={entry.color} opacity={entry.isActive ? 1 : 0.18} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip metric={activeMetric} />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-300">데이터 없음</div>
          )}
        </div>

        <div className="flex-1 space-y-1 overflow-auto">
          {platformData.map((item) => (
            <button
              key={item.platform}
              onClick={() => togglePlatform(item.platform)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-gray-50 ${
                !item.isActive ? 'opacity-35' : ''
              }`}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="w-14 text-sm font-medium text-gray-700">{item.platform}</span>
              <span className="flex-1 text-sm font-semibold text-gray-900">
                {formatValue(item.value, activeMetric)}
              </span>
              <span className="text-xs text-gray-400">({item.percentage.toFixed(1)}%)</span>
            </button>
          ))}

          <p className="px-3 pt-1 text-xs text-gray-400">
            선택: {activePlatforms.length > 0 ? activePlatforms.join(', ') : '없음'}
          </p>
        </div>
      </div>
    </Card>
  );
}
