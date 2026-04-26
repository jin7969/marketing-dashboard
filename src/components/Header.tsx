import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './_common';
import CampaignModal from './CampaignCreateModal';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="mb-8 flex items-center justify-between">
      <h1 className="font-sans text-2xl font-bold tracking-tight text-gray-900">캠페인 대시보드</h1>
      <Button
        icon={<Plus className="h-4 w-4" />}
        className="shadow-lg shadow-blue-200"
        onClick={() => setIsModalOpen(true)}
      >
        캠페인 등록
      </Button>
      <CampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
