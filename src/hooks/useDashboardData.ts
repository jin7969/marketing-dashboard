import { useQuery } from '@tanstack/react-query';
import { fetchCampaigns, fetchDailyStats } from '../api';

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  });
}

export function useDailyStats() {
  return useQuery({
    queryKey: ['dailyStats'],
    queryFn: fetchDailyStats,
  });
}

export function useDashboardData() {
  const campaignsQuery = useCampaigns();
  const dailyStatsQuery = useDailyStats();

  return {
    campaigns: campaignsQuery.data ?? [],
    dailyStats: dailyStatsQuery.data ?? [],
    isLoading: campaignsQuery.isLoading || dailyStatsQuery.isLoading,
    isError: campaignsQuery.isError || dailyStatsQuery.isError,
    error: campaignsQuery.error || dailyStatsQuery.error,
  };
}
