import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FilterBar from './components/FilterBar';
import DashboardChart from './components/DashboardChart';
import { useDashboardData } from './hooks/useDashboardData';

const queryClient = new QueryClient();

function DashboardContent() {
  const { isLoading } = useDashboardData();

  if (isLoading) return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">마케팅 캠페인 성과 대시보드</h1>
      </header>

      <FilterBar />

      <DashboardChart />

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">캠페인 목록</h2>
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-100 text-sm text-gray-400">
          캠페인 목록 테이블 구현 예정
        </div>
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
