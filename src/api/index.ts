import axios from 'axios';
import type { Campaign, DailyStat } from '../types/dashboard';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getCampaigns = async (): Promise<Campaign[]> => {
  const { data } = await api.get<Campaign[]>('/campaigns');
  return data;
};

export const getDailyStats = async (): Promise<DailyStat[]> => {
  const { data } = await api.get<DailyStat[]>('/daily_stats');
  return data;
};

export const updateCampaignStatus = async (id: string, status: string): Promise<Campaign> => {
  const { data } = await api.patch<Campaign>(`/campaigns/${id}`, { status });
  return data;
};

export const createCampaign = async (campaign: Omit<Campaign, 'id'>): Promise<Campaign> => {
  const { data } = await api.post<Campaign>('/campaigns', campaign);
  return data;
};

export default api;
