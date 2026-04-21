import type { Campaign, DailyStat } from '../types/dashboard';

const BASE_URL = 'http://localhost:3001';

export async function fetchCampaigns(): Promise<Campaign[]> {
  const response = await fetch(`${BASE_URL}/campaigns`);
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }
  return response.json();
}

export async function fetchDailyStats(): Promise<DailyStat[]> {
  const response = await fetch(`${BASE_URL}/daily_stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch daily stats');
  }
  return response.json();
}

export async function updateCampaignStatus(id: string, status: Campaign['status']): Promise<Campaign> {
  const response = await fetch(`${BASE_URL}/campaigns/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update campaign status');
  }
  return response.json();
}
