import { Plus } from 'lucide-react';
import { Button } from './_common';

export default function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <h1 className="font-sans text-2xl font-bold tracking-tight text-gray-900">대시보드</h1>
      <Button icon={<Plus className="h-4 w-4" />} className="shadow-lg shadow-blue-200">
        캠페인 등록
      </Button>
    </header>
  );
}
