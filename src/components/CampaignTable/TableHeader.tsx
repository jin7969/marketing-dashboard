import { ChevronUp, ChevronDown } from 'lucide-react';
import type { SortKey, SortOrder } from '../../hooks/useCampaignTable';

interface TableHeaderProps {
  isAllSelected: boolean;
  onSelectAll: () => void;
  sortConfig: { key: SortKey; order: SortOrder };
  onSort: (key: SortKey) => void;
}

export function TableHeader({ isAllSelected, onSelectAll, sortConfig, onSort }: TableHeaderProps) {
  return (
    <thead className="border-b border-gray-100 bg-gray-50 font-medium text-gray-600">
      <tr>
        <th className="w-10 p-4 text-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onSelectAll}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </th>
        <th className="p-4">캠페인명</th>
        <th className="p-4">상태</th>
        <th className="p-4">매체</th>
        <SortableHeader
          label="집행기간"
          sortKey="startDate"
          currentSort={sortConfig}
          onSort={() => onSort('startDate')}
        />
        <SortableHeader label="총 집행금액" sortKey="cost" currentSort={sortConfig} onSort={() => onSort('cost')} />
        <SortableHeader label="CTR" sortKey="ctr" currentSort={sortConfig} onSort={() => onSort('ctr')} />
        <SortableHeader label="CPC" sortKey="cpc" currentSort={sortConfig} onSort={() => onSort('cpc')} />
        <SortableHeader label="ROAS" sortKey="roas" currentSort={sortConfig} onSort={() => onSort('roas')} />
      </tr>
    </thead>
  );
}

function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: { key: SortKey; order: SortOrder };
  onSort: () => void;
}) {
  const isActive = currentSort.key === sortKey;
  return (
    <th className="cursor-pointer p-4 transition-colors hover:text-blue-600" onClick={onSort}>
      <div className="flex items-center gap-1">
        {label}
        <div className="flex flex-col opacity-40">
          <ChevronUp
            className={`-mb-1 h-3 w-3 ${isActive && currentSort.order === 'asc' ? 'text-blue-600 opacity-100' : ''}`}
          />
          <ChevronDown
            className={`h-3 w-3 ${isActive && currentSort.order === 'desc' ? 'text-blue-600 opacity-100' : ''}`}
          />
        </div>
      </div>
    </th>
  );
}
