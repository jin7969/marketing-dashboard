import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useDashboardData } from './useDashboardData';
import type { MetricKey } from '../types/dashboard';

export function useDashboardChart() {
  const { stats } = useDashboardData();
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(['impressions', 'clicks']);

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
        if (prev.length <= 1) return prev;
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  return {
    chartData,
    activeMetrics,
    toggleMetric,
  };
}
