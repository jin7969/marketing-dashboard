import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isWithinInterval, parseISO } from 'date-fns';
import { getCampaigns, getDailyStats } from '../api';
import { useFilterStore } from '../store/useFilterStore';
import { PLATFORMS } from '../constants/dashboard';
import type { MetricKey, Platform } from '../types/dashboard';

export interface PlatformDataItem {
  platform: Platform;
  value: number;
  percentage: number;
  color: string;
  isActive: boolean;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  Google: '#4285F4',
  Meta: '#0866FF',
  Naver: '#03C75A',
};

export function usePlatformChart() {
  const { dateRange, statuses, platforms, setPlatforms } = useFilterStore();
  const [activeMetric, setActiveMetric] = useState<MetricKey>('cost');

  const { data: campaigns = [] } = useQuery({ queryKey: ['campaigns'], queryFn: getCampaigns });
  const { data: dailyStats = [] } = useQuery({ queryKey: ['dailyStats'], queryFn: getDailyStats });

  const platformData = useMemo((): PlatformDataItem[] => {
    // 플랫폼 필터 제외, 날짜·상태만 적용 (도넛은 전체 비중을 보여야 함)
    const validCampaigns = campaigns.filter((c) => {
      if (!c.startDate || !statuses.includes(c.status)) return false;
      const start = parseISO(c.startDate.replace(/\//g, '-'));
      const end = c.endDate ? parseISO(c.endDate.replace(/\//g, '-')) : null;
      return start <= dateRange.endDate && (end === null || end >= dateRange.startDate);
    });

    const campaignPlatformMap = new Map(validCampaigns.map((c) => [c.id, c.platform]));
    const campaignIds = new Set(validCampaigns.map((c) => c.id));

    const totals: Record<Platform, number> = { Google: 0, Meta: 0, Naver: 0 };

    dailyStats.forEach((stat) => {
      if (!campaignIds.has(stat.campaignId)) return;
      const statDate = parseISO(stat.date);
      if (!isWithinInterval(statDate, { start: dateRange.startDate, end: dateRange.endDate })) return;
      const platform = campaignPlatformMap.get(stat.campaignId);
      if (platform) totals[platform] += stat[activeMetric] || 0;
    });

    const total = PLATFORMS.reduce((sum, p) => sum + totals[p], 0);

    return PLATFORMS.map((platform) => ({
      platform,
      value: totals[platform],
      percentage: total > 0 ? (totals[platform] / total) * 100 : 0,
      color: PLATFORM_COLORS[platform],
      isActive: platforms.includes(platform),
    }));
  }, [campaigns, dailyStats, dateRange, statuses, platforms, activeMetric]);

  const togglePlatform = (platform: Platform) => {
    const isSelected = platforms.includes(platform);
    if (isSelected && platforms.length <= 1) return;
    setPlatforms(isSelected ? platforms.filter((p) => p !== platform) : [...platforms, platform]);
  };

  return { platformData, activeMetric, setActiveMetric, togglePlatform };
}
