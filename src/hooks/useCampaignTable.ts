import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDashboardData } from './useDashboardData';
import { updateCampaignStatus } from '../api';
import { calculateCampaignMetrics } from '../utils/metrics';
import type { Campaign, CampaignStatus } from '../types/dashboard';
import { ITEMS_PER_PAGE } from '../constants/dashboard';

export type SortKey = 'startDate' | 'budget' | 'ctr' | 'cpc' | 'roas';
export type SortOrder = 'asc' | 'desc';

export function useCampaignTable() {
  const queryClient = useQueryClient();
  const { campaigns: filteredCampaigns, stats, isLoading } = useDashboardData();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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
        aValue = new Date(a.startDate).getTime();
        bValue = new Date(b.startDate).getTime();
      }

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
