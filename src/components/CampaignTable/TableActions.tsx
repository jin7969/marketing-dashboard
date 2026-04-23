import { Search } from 'lucide-react';
import { STATUS_OPTIONS } from '../../constants/dashboard';
import type { CampaignStatus } from '../../types/dashboard';

interface TableActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onStatusUpdate: (status: CampaignStatus) => void;
  totalResults: number;
  totalCount: number;
}

export function TableActions({
  searchTerm,
  onSearchChange,
  selectedCount,
  onStatusUpdate,
  totalResults,
  totalCount,
}: TableActionsProps) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-gray-50 bg-gray-50/50 p-4 md:flex-row md:items-center">
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-500">
          검색 결과 <span className="font-bold text-gray-900">{totalResults}</span>건 / 전체{' '}
          <span className="font-bold text-gray-900">{totalCount}</span>건
        </div>

        <div className="relative w-64">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="캠페인명 검색"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-4 pl-10 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-blue-600">{selectedCount}개 선택됨</span>
          <select
            className="rounded-lg border-gray-200 text-xs focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => {
              if (e.target.value) {
                onStatusUpdate(e.target.value as CampaignStatus);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              상태 일괄 변경
            </option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
