import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronUp, ChevronDown, CheckCircle, PauseCircle, XCircle, Search } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { updateCampaignStatus } from '../api';
import { calculateCampaignMetrics, formatCurrency, formatPercent, formatNumber } from '../utils/metrics';
import type { Campaign, CampaignStatus } from '../types/dashboard';
import { STATUS_OPTIONS } from '../constants/dashboard';

type SortKey = 'startDate' | 'budget' | 'ctr' | 'cpc' | 'roas';
type SortOrder = 'asc' | 'desc';

export default function CampaignTable() {
  const queryClient = useQueryClient();
  const { campaigns: filteredCampaigns, stats, isLoading } = useDashboardData();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({
    key: 'startDate',
    order: 'desc',
  });

  const itemsPerPage = 10;

  // 1. 상태 일괄 변경 Mutation
  const mutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: CampaignStatus }) => {
      return Promise.all(ids.map((id) => updateCampaignStatus(id, status)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setSelectedIds(new Set());
      alert('상태가 성공적으로 변경되었습니다.');
    },
  });

  // 2. 데이터 가공 (검색어 필터링 + 정렬)
  const processedData = useMemo(() => {
    // 2-1. 테이블 전용 실시간 검색 적용
    const searched = filteredCampaigns.filter((campaign) => {
      const name = campaign.name || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // 2-2. 지표 계산 및 정렬
    const dataWithMetrics = searched.map((campaign) => ({
      ...campaign,
      metrics: calculateCampaignMetrics(campaign.id, stats),
    }));

    return dataWithMetrics.sort((a, b) => {
      let aValue = a[sortConfig.key as keyof Campaign] ?? a.metrics[sortConfig.key as keyof typeof a.metrics];
      let bValue = b[sortConfig.key as keyof Campaign] ?? b.metrics[sortConfig.key as keyof typeof b.metrics];

      if (sortConfig.key === 'startDate') {
        aValue = new Date(a.startDate).getTime();
        bValue = new Date(b.startDate).getTime();
      }

      if (sortConfig.order === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredCampaigns, stats, sortConfig, searchTerm]);

  // 3. 페이지네이션 데이터
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc',
    }));
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  if (isLoading) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* 상단 액션 바 */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-50 bg-gray-50/50 p-4 md:flex-row md:items-center">
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-500">
            검색 결과 <span className="font-bold text-gray-900">{processedData.length}</span>건 / 전체{' '}
            <span className="font-bold text-gray-900">{filteredCampaigns.length}</span>건
          </div>

          {/* 테이블 전용 실시간 검색창 */}
          <div className="relative w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="캠페인명 실시간 검색"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // 검색 시 첫 페이지로 이동
              }}
              className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-4 pl-10 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-600">{selectedIds.size}개 선택됨</span>
            <select
              className="rounded-lg border-gray-200 text-xs focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.value) {
                  mutation.mutate({
                    ids: Array.from(selectedIds),
                    status: e.target.value as CampaignStatus,
                  });
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

      {/* 테이블 영역 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 font-medium text-gray-600">
            <tr>
              <th className="w-10 p-4 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.size > 0 && selectedIds.size === paginatedData.length}
                  onChange={toggleSelectAll}
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
                onSort={() => handleSort('startDate')}
              />
              <SortableHeader
                label="예산"
                sortKey="budget"
                currentSort={sortConfig}
                onSort={() => handleSort('budget')}
              />
              <SortableHeader label="CTR" sortKey="ctr" currentSort={sortConfig} onSort={() => handleSort('ctr')} />
              <SortableHeader label="CPC" sortKey="cpc" currentSort={sortConfig} onSort={() => handleSort('cpc')} />
              <SortableHeader label="ROAS" sortKey="roas" currentSort={sortConfig} onSort={() => handleSort('roas')} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedData.length > 0 ? (
              paginatedData.map((campaign) => (
                <tr key={campaign.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(campaign.id)}
                      onChange={() => toggleSelect(campaign.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">{campaign.name}</td>
                  <td className="p-4">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="p-4 text-gray-600">{campaign.platform}</td>
                  <td className="p-4 text-gray-600">
                    {campaign.startDate} ~ {campaign.endDate || '진행중'}
                  </td>
                  <td className="p-4 font-semibold">{formatCurrency(campaign.budget)}</td>
                  <td className="p-4">{formatPercent(campaign.metrics.ctr)}</td>
                  <td className="p-4">{formatNumber(Math.round(campaign.metrics.cpc))}원</td>
                  <td className="p-4 font-bold text-blue-600">{formatPercent(campaign.metrics.roas)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-10 text-center text-gray-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2 border-t border-gray-50 p-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-30"
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`h-8 w-8 rounded-lg text-sm transition-colors ${
              currentPage === page ? 'bg-blue-600 font-bold text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-30"
        >
          다음
        </button>
      </div>
    </div>
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

function StatusBadge({ status }: { status: CampaignStatus }) {
  const config = {
    active: { icon: CheckCircle, text: '진행중', color: 'text-green-600 bg-green-50' },
    paused: { icon: PauseCircle, text: '일시중지', color: 'text-yellow-600 bg-yellow-50' },
    ended: { icon: XCircle, text: '종료', color: 'text-red-600 bg-red-50' },
  };
  const { icon: Icon, text, color } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${color}`}>
      <Icon className="h-3 w-3" />
      {text}
    </span>
  );
}
