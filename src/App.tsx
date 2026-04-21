import { useDashboardData } from './hooks/useDashboardData';
import { formatCurrency } from './utils/metrics';
import { FilterBar } from './components/FilterBar';
import { useFilterStore } from './store/useFilterStore';

function App() {
  const { campaigns, isLoading, isError, error } = useDashboardData();
  const { status, platform } = useFilterStore();

  // 1. 캠페인 필터링 (다중 선택 대응)
  const filteredCampaigns = campaigns.filter((campaign) => {
    const statusMatch = status.includes(campaign.status);
    const platformMatch = platform.includes(campaign.platform);
    return statusMatch && platformMatch;
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-12 text-gray-900">
      <header className="mb-6 border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">Marketing Dashboard</h1>
      </header>

      <div className="mx-auto max-w-7xl px-6">
        <FilterBar />

        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <p className="animate-pulse text-gray-500">데이터를 불러오는 중...</p>
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            에러 발생: {(error as Error).message}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border bg-white shadow">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-bold">캠페인 리스트</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        캠페인명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        매체
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        예산
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.slice(0, 10).map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                            {campaign.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                campaign.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : campaign.status === 'paused'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{campaign.platform}</td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                            {campaign.budget ? formatCurrency(campaign.budget) : '미설정'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                          조건에 맞는 캠페인이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
