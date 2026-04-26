import { create } from 'zustand';
import { startOfMonth, endOfMonth } from 'date-fns';
import { PLATFORMS } from '../constants/dashboard';
import type { FilterState, Platform, CampaignStatus } from '../types/dashboard';

interface FilterStore extends Omit<FilterState, 'searchTerm'> {
  setDateRange: (range: { startDate: Date; endDate: Date }) => void;
  setStatuses: (statuses: CampaignStatus[]) => void;
  setPlatforms: (platforms: Platform[]) => void;
  resetFilters: () => void;
}

const initialDateRange = {
  startDate: startOfMonth(new Date()),
  endDate: endOfMonth(new Date()),
};

export const useFilterStore = create<FilterStore>((set) => ({
  dateRange: initialDateRange,
  statuses: ['active', 'paused', 'ended'],
  platforms: PLATFORMS,

  setDateRange: (dateRange) => set({ dateRange }),
  setStatuses: (statuses) => set({ statuses }),
  setPlatforms: (platforms) => set({ platforms }),
  resetFilters: () =>
    set({
      dateRange: initialDateRange,
      statuses: ['active', 'paused', 'ended'],
      platforms: PLATFORMS,
    }),
}));
