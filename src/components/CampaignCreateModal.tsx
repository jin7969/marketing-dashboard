import { Plus } from 'lucide-react';
import { Modal, Button, FormField, Input } from './_common';
import { useCampaignCreateForm } from '../hooks/useCampaignCreateForm';
import { PLATFORMS } from '../constants/dashboard';

interface CampaignCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignCreateModal({ isOpen, onClose }: CampaignCreateModalProps) {
  const { formData, errors, isPending, setField, handleSubmit, handleClose } = useCampaignCreateForm(onClose);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="캠페인 등록">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField label="캠페인명" error={errors.name}>
          <Input
            type="text"
            error={errors.name}
            placeholder="캠페인명을 입력하세요"
            value={formData.name}
            onChange={(e) => setField('name', e.target.value)}
          />
        </FormField>

        <FormField label="광고 매체">
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setField('platform', p)}
                className={`rounded-lg border py-2.5 text-sm font-medium transition-all ${
                  formData.platform === p
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="예산" error={errors.budget}>
            <Input
              type="number"
              step="1"
              min="100"
              max="1000000000"
              error={errors.budget}
              suffix="원"
              placeholder="0"
              value={formData.budget}
              onChange={(e) => setField('budget', e.target.value)}
            />
          </FormField>

          <FormField label="집행금액" error={errors.cost}>
            <Input
              type="number"
              step="1"
              min="0"
              max="1000000000"
              error={errors.cost}
              suffix="원"
              placeholder="0"
              value={formData.cost}
              onChange={(e) => setField('cost', e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="집행 시작일" error={errors.startDate}>
            <Input
              type="date"
              error={errors.startDate}
              value={formData.startDate}
              onChange={(e) => setField('startDate', e.target.value)}
            />
          </FormField>

          <FormField label="집행 종료일" error={errors.endDate}>
            <Input
              type="date"
              error={errors.endDate}
              min={formData.startDate || undefined}
              value={formData.endDate}
              onChange={(e) => setField('endDate', e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button type="submit" icon={<Plus className="h-4 w-4" />} disabled={isPending}>
            {isPending ? '등록 중...' : '등록'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
