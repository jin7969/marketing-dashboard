import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/metrics';
import type { Campaign, MetricData } from '../../types/dashboard';

interface TableRowProps {
  campaign: Campaign & { metrics: MetricData };
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function TableRow({ campaign, isSelected, onToggleSelect }: TableRowProps) {
  return (
    <tr className="transition-colors hover:bg-gray-50/50">
      <td className="p-4 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(campaign.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="min-w-[200px] p-4 font-medium text-gray-900">{campaign.name}</td>
      <td className="min-w-[120px] p-4">
        <StatusBadge status={campaign.status} />
      </td>
      <td className="p-4 text-gray-600">{campaign.platform}</td>
      <td className="min-w-[150px] p-4 text-gray-600">
        {campaign.startDate} ~ {campaign.endDate || '진행중'}
      </td>
      <td className="p-4 font-semibold">{formatCurrency(campaign.metrics.cost)}</td>
      <td className="p-4">{formatPercent(campaign.metrics.ctr)}</td>
      <td className="p-4">{formatNumber(Math.round(campaign.metrics.cpc))}원</td>
      <td className="p-4 font-bold text-blue-600">{formatPercent(campaign.metrics.roas)}</td>
    </tr>
  );
}
