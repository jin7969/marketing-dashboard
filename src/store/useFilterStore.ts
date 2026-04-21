import { create } from 'zustand';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export type StatusType = 'active' | 'paused' | 'ended';
export type PlatformType = 'Google' | 'Meta' | 'Naver';

interface FilterState {
  startDate: string;
  endDate: string;
  status: StatusType[];
  platform: PlatformType[];
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setStatus: (status: StatusType[]) => void;
  setPlatform: (platform: PlatformType[]) => void;
  resetFilters: () => void;
}

// 가이드: 기본값은 이번 달 1일부터 마지막 날까지
// (데이터가 2026년 기준이므로, 실제 서비스라면 new Date()를 쓰겠지만 
// 테스트를 위해 2026년 4월을 기준으로 설정합니다)
const baseDate = new Date(2026, 3, 21); // 2026년 4월 21일 기준
const initialState = {
  startDate: format(startOfMonth(baseDate), 'yyyy-MM-dd'),
  endDate: format(endOfMonth(baseDate), 'yyyy-MM-dd'),
  status: ['active', 'paused', 'ended'] as StatusType[], // '전체'는 모든 항목 선택된 상태
  platform: ['Google', 'Meta', 'Naver'] as PlatformType[],
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setStatus: (status) => set({ status }),
  setPlatform: (platform) => set({ platform }),
  resetFilters: () => set(initialState),
}));
