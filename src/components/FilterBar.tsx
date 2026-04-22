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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-6">
      <div className="flex flex-wrap gap-8">
        {/* 기간 필터 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">집행 기간</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={format(dateRange.startDate, 'yyyy-MM-dd')}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: new Date(e.target.value) })
              }
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400">~</span>
            <input
              type="date"
              value={format(dateRange.endDate, 'yyyy-MM-dd')}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: new Date(e.target.value) })
              }
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="캠페인명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
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
      <div className="flex gap-3 h-full items-center">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
