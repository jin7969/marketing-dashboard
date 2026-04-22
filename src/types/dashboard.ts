export type Platform = 'Google' | 'Meta' | 'Naver';
export type CampaignStatus = 'active' | 'paused' | 'ended';

export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  budget: number;
  startDate: string;
  endDate: string | null;
}

export interface DailyStat {
  id: string;
  campaignId: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number | null;
}

export interface MetricData {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number;
  ctr: number;
  cpc: number;
  roas: number;
}

export interface FilterState {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  statuses: CampaignStatus[];
  platforms: Platform[];
  searchTerm: string;
}
