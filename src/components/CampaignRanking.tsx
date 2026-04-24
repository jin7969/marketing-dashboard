import { useCampaignRanking } from '../hooks/useCampaignRanking';
import { Card, Button } from './_common';
import { formatCurrency } from '../utils/metrics';
import type { Platform, RankingMetricKey } from '../types/dashboard';

const METRIC_OPTIONS: { key: RankingMetricKey; label: string }[] = [
  { key: 'roas', label: 'ROAS' },
  { key: 'ctr', label: 'CTR' },
  { key: 'cpc', label: 'CPC' },
];

const PLATFORM_COLORS: Record<Platform, string> = {
  Google: 'bg-blue-100 text-blue-700',
  Meta: 'bg-indigo-100 text-indigo-700',
  Naver: 'bg-green-100 text-green-700',
};

const RANK_BAR_COLORS = ['bg-blue-500', 'bg-blue-400', 'bg-blue-300'];

function formatMetricValue(value: number, metric: RankingMetricKey): string {
  if (metric === 'cpc') return formatCurrency(Math.round(value));
  return value.toFixed(2);
}

export default function CampaignRanking() {
  const { rankingData, activeMetric, setActiveMetric } = useCampaignRanking();

  return (
    <Card
      title="캠페인 랭킹 Top 3"
      headerAction={
        <div className="flex gap-2">
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
      <div className="flex flex-col justify-center gap-5 p-6">
        {rankingData.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">해당 조건에 맞는 데이터가 없습니다.</p>
        ) : (
          rankingData.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${RANK_BAR_COLORS[index]}`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-sm font-medium text-gray-800">{item.name}</span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${PLATFORM_COLORS[item.platform]}`}
                >
                  {item.platform}
                </span>
                <span className="w-20 text-right text-sm font-semibold text-gray-900">
                  {formatMetricValue(item.value, activeMetric)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${RANK_BAR_COLORS[index]}`}
                  style={{ width: `${item.barWidth}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
