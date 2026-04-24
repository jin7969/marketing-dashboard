import { useMemo, useState } from 'react';
import { useDashboardData } from './useDashboardData';
import { calculateCampaignMetrics } from '../utils/metrics';
import type { Platform, RankingMetricKey } from '../types/dashboard';

interface RankingItem {
  id: string;
  name: string;
  platform: Platform;
  value: number;
  barWidth: number;
}

export function useCampaignRanking() {
  const { campaigns, stats } = useDashboardData();
  const [activeMetric, setActiveMetric] = useState<RankingMetricKey>('roas');

  const rankingData = useMemo((): RankingItem[] => {
    const withMetrics = campaigns
      .filter((c) => c.name)
      .map((c) => ({
        id: c.id,
        name: c.name,
        platform: c.platform,
        value: calculateCampaignMetrics(c.id, stats)[activeMetric],
      }))
      .filter((c) => c.value > 0); // 데이터 없는 캠페인 제외

    const sorted = [...withMetrics].sort((a, b) => (activeMetric === 'cpc' ? a.value - b.value : b.value - a.value));

    const top3 = sorted.slice(0, 3);
    const maxValue = top3[0]?.value ?? 1;

    return top3.map((item) => ({
      ...item,
      barWidth: (item.value / maxValue) * 100,
    }));
  }, [campaigns, stats, activeMetric]);

  return { rankingData, activeMetric, setActiveMetric };
}
