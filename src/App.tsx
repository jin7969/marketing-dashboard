import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FilterBar from './components/filterBar/FilterBar';
import DashboardChart from './components/DashboardChart';
import CampaignTable from './components/campaignTable/CampaignTable';
import { useDashboardData } from './hooks/useDashboardData';
import Header from './components/Header';

const queryClient = new QueryClient();

function DashboardContent() {
  const { isLoading } = useDashboardData();

  if (isLoading) return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Header />
      <FilterBar />
      <DashboardChart />
      <CampaignTable />
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
