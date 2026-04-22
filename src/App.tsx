import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FilterBar from './components/FilterBar';
import DashboardChart from './components/DashboardChart';
import CampaignTable from './components/CampaignTable';
import { useDashboardData } from './hooks/useDashboardData';
import { Plus } from 'lucide-react';

const queryClient = new QueryClient();

function DashboardContent() {
  const { isLoading } = useDashboardData();

  if (isLoading) return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sans">마케팅 캠페인 성과 대시보드</h1>
        <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-200">
          <Plus className="h-4 w-4" />
          캠페인 등록
        </button>
      </header>

      <FilterBar />

      <DashboardChart />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">캠페인 목록</h2>
        <CampaignTable />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
