import { useCampaignTable } from '../../hooks/useCampaignTable';
import { TableActions } from './TableActions';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TablePagination } from './TablePagination';
import type { CampaignStatus } from '../../types/dashboard';

export default function CampaignTable() {
  const {
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
    updateStatus,
    totalCount,
  } = useCampaignTable();

  if (isLoading) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <TableActions
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        selectedCount={selectedIds.size}
        onStatusUpdate={(status: CampaignStatus) => updateStatus({ ids: Array.from(selectedIds), status })}
        totalResults={processedData.length}
        totalCount={totalCount}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <TableHeader
            isAllSelected={selectedIds.size > 0 && selectedIds.size === paginatedData.length}
            onSelectAll={toggleSelectAll}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <tbody className="divide-y divide-gray-50">
            {paginatedData.length > 0 ? (
              paginatedData.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  campaign={campaign}
                  isSelected={selectedIds.has(campaign.id)}
                  onToggleSelect={toggleSelect}
                />
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

      <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
