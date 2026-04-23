import { format } from 'date-fns';
import { useFilterStore } from '../../store/useFilterStore';
import type { CampaignStatus, Platform } from '../../types/dashboard';
import { STATUS_OPTIONS, PLATFORM_OPTIONS } from '../../constants/dashboard';
import { RotateCcw, Calendar } from 'lucide-react';
import FilterGroup from './FilterGroup';

export default function FilterBar() {
  const { dateRange, statuses, platforms, setDateRange, setStatuses, setPlatforms, resetFilters } = useFilterStore();

  const toggleFilter = <T,>(current: T[], item: T, setter: (val: T[]) => void) => {
    setter(current.includes(item) ? current.filter((i) => i !== item) : [...current, item]);
  };

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col divide-y divide-gray-100 lg:flex-row lg:items-center lg:divide-x lg:divide-y-0">
        {/* 기간 필터 */}
        <div className="shrink-0 p-5 lg:p-6">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">집행 기간</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={format(dateRange.startDate, 'yyyy-MM-dd')}
                onChange={(e) => setDateRange({ ...dateRange, startDate: new Date(e.target.value) })}
                className="w-36 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
              />
              <span className="font-light text-gray-300">~</span>
              <input
                type="date"
                value={format(dateRange.endDate, 'yyyy-MM-dd')}
                onChange={(e) => setDateRange({ ...dateRange, endDate: new Date(e.target.value) })}
                className="w-36 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* 상태 필터 */}
        <div className="grow p-5 lg:p-6">
          <FilterGroup
            label="캠페인 상태"
            options={STATUS_OPTIONS}
            selected={statuses}
            onToggle={(val) => toggleFilter(statuses, val as CampaignStatus, setStatuses)}
          />
        </div>

        {/* 매체 필터 */}
        <div className="grow p-5 lg:p-6">
          <FilterGroup
            label="광고 매체"
            options={PLATFORM_OPTIONS}
            selected={platforms}
            onToggle={(val) => toggleFilter(platforms, val as Platform, setPlatforms)}
          />
        </div>

        {/* 초기화 버튼 */}
        <div className="flex items-center justify-center bg-gray-50/50 p-4 lg:justify-start lg:p-6">
          <button
            type="reset"
            onClick={resetFilters}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 transition-all hover:bg-white hover:shadow-sm active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="whitespace-nowrap">초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
}
