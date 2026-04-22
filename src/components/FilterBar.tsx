import { format } from 'date-fns';
import { useFilterStore } from '../store/useFilterStore';
import type { CampaignStatus, Platform } from '../types/dashboard';
import { STATUS_OPTIONS, PLATFORM_OPTIONS } from '../constants/dashboard';
import { RotateCcw, Search } from 'lucide-react';

export default function FilterBar() {
  const {
    dateRange,
    statuses,
    platforms,
    searchTerm,
    setDateRange,
    setStatuses,
    setPlatforms,
    setSearchTerm,
    resetFilters,
  } = useFilterStore();

  // 토글 로직 공통화
  const toggleFilter = <T,>(current: T[], item: T, setter: (val: T[]) => void) => {
    setter(current.includes(item) ? current.filter((i) => i !== item) : [...current, item]);
  };

  return (
    <div className="mb-8 space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-8">
        {/* 기간 필터 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">집행 기간</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={format(dateRange.startDate, 'yyyy-MM-dd')}
              onChange={(e) => setDateRange({ ...dateRange, startDate: new Date(e.target.value) })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-gray-400">~</span>
            <input
              type="date"
              value={format(dateRange.endDate, 'yyyy-MM-dd')}
              onChange={(e) => setDateRange({ ...dateRange, endDate: new Date(e.target.value) })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 상태 필터 */}
        <FilterGroup
          label="상태"
          options={STATUS_OPTIONS}
          selected={statuses}
          onToggle={(val) => toggleFilter(statuses, val as CampaignStatus, setStatuses)}
        />

        {/* 매체 필터 */}
        <FilterGroup
          label="매체"
          options={PLATFORM_OPTIONS}
          selected={platforms}
          onToggle={(val) => toggleFilter(platforms, val as Platform, setPlatforms)}
        />
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="캠페인명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="reset"
          onClick={resetFilters}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <RotateCcw className="h-4 w-4" />
          필터 초기화
        </button>
      </div>
    </div>
  );
}

// 내부 재사용 컴포넌트
function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { label: string; value: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex h-full items-center gap-3">
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
