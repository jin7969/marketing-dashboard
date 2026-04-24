import type { CampaignStatus, Platform, MetricOption } from '../types/dashboard';

export const STATUS_OPTIONS: { label: string; value: CampaignStatus }[] = [
  { label: '진행중', value: 'active' },
  { label: '일시중지', value: 'paused' },
  { label: '종료', value: 'ended' },
];

export const PLATFORMS: Platform[] = ['Google', 'Meta', 'Naver'];

export const PLATFORM_OPTIONS: { label: string; value: Platform }[] = [
  { label: 'Google', value: 'Google' },
  { label: 'Meta', value: 'Meta' },
  { label: 'Naver', value: 'Naver' },
];

export const METRIC_OPTIONS: MetricOption[] = [
  { label: '노출수', key: 'impressions', color: '#8884d8' },
  { label: '클릭수', key: 'clicks', color: '#82ca9d' },
  { label: '전환수', key: 'conversions', color: '#ffc658' },
  { label: '비용', key: 'cost', color: '#ff7300' },
];

export const ITEMS_PER_PAGE = 10;
