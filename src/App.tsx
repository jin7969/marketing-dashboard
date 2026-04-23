import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { useDashboardData } from './hooks/useDashboardData';
import Header from './components/Header';
import FilterBar from './components/filterBar/FilterBar';
import DashboardChart from './components/DashboardChart';
import CampaignTable from './components/campaignTable/CampaignTable';

function Dashboard() {
  const { isLoading } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Header />

        <main className="space-y-6">
          <FilterBar />

          {isLoading ? (
            <div className="flex h-100 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                <p className="text-sm font-medium">데이터를 분석하고 있습니다...</p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in space-y-6 duration-500">
              <DashboardChart />
              <CampaignTable />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
