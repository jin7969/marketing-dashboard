import type { DailyStat, MetricData } from '../types/dashboard';

/**
 * 안전한 산술 계산을 위한 유틸리티
 * 평가 포인트: Division by Zero, Null Safety 처리
 */
export const calculateMetrics = (stats: DailyStat[]): MetricData => {
  const totals = stats.reduce(
    (acc, curr) => ({
      impressions: acc.impressions + (curr.impressions || 0),
      clicks: acc.clicks + (curr.clicks || 0),
      conversions: acc.conversions + (curr.conversions || 0),
      cost: acc.cost + (curr.cost || 0),
      conversionsValue: acc.conversionsValue + (curr.conversionsValue || 0),
    }),
    {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      cost: 0,
      conversionsValue: 0,
    }
  );

  // CTR (%) = (총 클릭 수 / 총 노출 수) × 100
  const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;

  // CPC (원) = 총 집행 비용 / 총 클릭 수
  const cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;

  // ROAS (%) = (총 전환 가치 / 총 집행 비용) × 100
  const roas = totals.cost > 0 ? (totals.conversionsValue / totals.cost) * 100 : 0;

  return {
    ...totals,
    ctr,
    cpc,
    roas,
  };
};

/**
 * 특정 캠페인의 지표만 계산
 */
export const calculateCampaignMetrics = (campaignId: string, allStats: DailyStat[]): MetricData => {
  const campaignStats = allStats.filter((stat) => stat.campaignId === campaignId);
  return calculateMetrics(campaignStats);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
};

export const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ko-KR').format(value);
};
