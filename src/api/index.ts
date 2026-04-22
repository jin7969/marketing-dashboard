import type { Campaign, DailyStat } from '../types/dashboard';

const BASE_URL = 'http://localhost:3001';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await fetch(`${BASE_URL}/campaigns`);
  return handleResponse(response);
};

export const getDailyStats = async (): Promise<DailyStat[]> => {
  const response = await fetch(`${BASE_URL}/daily_stats`);
  return handleResponse(response);
};

export const updateCampaignStatus = async (id: string, status: string): Promise<Campaign> => {
  const response = await fetch(`${BASE_URL}/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

export const createCampaign = async (campaign: Omit<Campaign, 'id'>): Promise<Campaign> => {
  const response = await fetch(`${BASE_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign),
  });
  return handleResponse(response);
};
