import { CheckCircle, PauseCircle, XCircle } from 'lucide-react';
import type { CampaignStatus } from '../../types/dashboard';

interface StatusBadgeProps {
  status: CampaignStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    active: { icon: CheckCircle, text: '진행중', color: 'text-green-600 bg-green-50' },
    paused: { icon: PauseCircle, text: '일시중지', color: 'text-yellow-600 bg-yellow-50' },
    ended: { icon: XCircle, text: '종료', color: 'text-red-600 bg-red-50' },
  };
  const { icon: Icon, text, color } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${color}`}>
      <Icon className="h-3 w-3" />
      {text}
    </span>
  );
}
