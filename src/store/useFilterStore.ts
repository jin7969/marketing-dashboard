import { create } from 'zustand';
import { startOfMonth, endOfMonth } from 'date-fns';
import type { FilterState, Platform, CampaignStatus } from '../types/dashboard';

interface FilterStore extends FilterState {
  setDateRange: (range: { startDate: Date; endDate: Date }) => void;
  setStatuses: (statuses: CampaignStatus[]) => void;
  setPlatforms: (platforms: Platform[]) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
}

const initialDateRange = {
  startDate: startOfMonth(new Date()),
  endDate: endOfMonth(new Date()),
};

export const useFilterStore = create<FilterStore>((set) => ({
  dateRange: initialDateRange,
  statuses: ['active', 'paused', 'ended'],
  platforms: ['Google', 'Meta', 'Naver'],
  searchTerm: '',

  setDateRange: (dateRange) => set({ dateRange }),
  setStatuses: (statuses) => set({ statuses }),
  setPlatforms: (platforms) => set({ platforms }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  resetFilters: () =>
    set({
      dateRange: initialDateRange,
      statuses: ['active', 'paused', 'ended'],
      platforms: ['Google', 'Meta', 'Naver'],
      searchTerm: '',
    }),
}));
