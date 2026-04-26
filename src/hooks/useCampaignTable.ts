import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import { useDashboardData } from './useDashboardData';
import { useFilterStore } from '../store/useFilterStore';
import { updateCampaignStatus } from '../api';
import { calculateCampaignMetrics } from '../utils/metrics';
import type { Campaign, CampaignStatus } from '../types/dashboard';
import { ITEMS_PER_PAGE } from '../constants/dashboard';

export type SortKey = 'startDate' | 'cost' | 'ctr' | 'cpc' | 'roas';
export type SortOrder = 'asc' | 'desc';

export function useCampaignTable() {
  const queryClient = useQueryClient();
  const { campaigns: filteredCampaigns, stats, isLoading } = useDashboardData();
  const { dateRange, statuses, platforms } = useFilterStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 버그 3: 글로벌 필터·검색어 변경 시 페이지 1로 리셋 — filterKey가 바뀌면 page를 1로 파생
  const filterKey = `${statuses.join()}-${platforms.join()}-${dateRange.startDate.getTime()}-${dateRange.endDate.getTime()}-${searchTerm}`;
  const [pageState, setPageState] = useState({ filterKey, page: 1 });
  const currentPage = pageState.filterKey === filterKey ? pageState.page : 1;
  const setCurrentPage = (page: number) => setPageState({ filterKey, page });
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({
    key: 'startDate',
    order: 'desc',
  });

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

  const processedData = useMemo(() => {
    const searched = filteredCampaigns.filter((campaign) => {
      const name = campaign.name || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const dataWithMetrics = searched.map((campaign) => ({
      ...campaign,
      metrics: calculateCampaignMetrics(campaign.id, stats),
    }));

    return dataWithMetrics.sort((a, b) => {
      let aValue = a[sortConfig.key as keyof Campaign] ?? a.metrics[sortConfig.key as keyof typeof a.metrics];
      let bValue = b[sortConfig.key as keyof Campaign] ?? b.metrics[sortConfig.key as keyof typeof b.metrics];

      if (sortConfig.key === 'startDate') {
        aValue = parseISO(a.startDate.replace(/\//g, '-')).getTime();
        bValue = parseISO(b.startDate.replace(/\//g, '-')).getTime();
      }

      if (aValue === bValue) return 0;
      if (sortConfig.order === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredCampaigns, stats, sortConfig, searchTerm]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  return {
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    selectedIds,
    sortConfig,
    processedData,
    paginatedData,
    totalPages,
    handleSort,
    toggleSelectAll,
    toggleSelect,
    updateStatus: mutation.mutate,
    totalCount: filteredCampaigns.length,
  };
}
