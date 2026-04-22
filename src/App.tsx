import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FilterBar from './components/FilterBar';
import { useDashboardData } from './hooks/useDashboardData';

const queryClient = new QueryClient();

function DashboardContent() {
  const { isLoading } = useDashboardData();

  if (isLoading) return <div className="p-8 text-center">데이터를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">마케팅 캠페인 대시보드</h1>
      </header>

      <FilterBar />

      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">일별 추이</h2>
        <div className="flex h-80 items-center justify-center text-gray-400">
          {/* 차트 컴포넌트 들어갈 자리 */}
          차트 구현 예정
        </div>
      </div>

      {/* 테이블 구현 예정 */}
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
