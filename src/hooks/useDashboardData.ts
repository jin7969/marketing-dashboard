import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isWithinInterval, parseISO } from 'date-fns';
import { getCampaigns, getDailyStats } from '../api';
import { useFilterStore } from '../store/useFilterStore';
import { calculateMetrics } from '../utils/metrics';

export const useDashboardData = () => {
  const { dateRange, statuses, platforms } = useFilterStore();

  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
  });

  const { data: dailyStats = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ['dailyStats'],
    queryFn: getDailyStats,
  });

  // 1. 캠페인 필터링 (상태, 매체만 적용 - 검색어 제외)
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesStatus = statuses.includes(campaign.status);
      const matchesPlatform = platforms.includes(campaign.platform);
      return matchesStatus && matchesPlatform;
    });
  }, [campaigns, statuses, platforms]);

  // 2. 일별 통계 필터링 및 지표 계산
  const { filteredStats, metrics } = useMemo(() => {
    const campaignIds = new Set(filteredCampaigns.map((c) => c.id));

    const stats = dailyStats.filter((stat) => {
      const statDate = parseISO(stat.date);
      const isWithinDate = isWithinInterval(statDate, {
        start: dateRange.startDate,
        end: dateRange.endDate,
      });
      return isWithinDate && campaignIds.has(stat.campaignId);
    });

    return {
      filteredStats: stats,
      metrics: calculateMetrics(stats),
    };
  }, [dailyStats, filteredCampaigns, dateRange]);

  return {
    campaigns: filteredCampaigns,
    stats: filteredStats,
    metrics,
    isLoading: isLoadingCampaigns || isLoadingStats,
  };
};
