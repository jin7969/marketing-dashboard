import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCampaign } from '../api';
import type { Platform } from '../types/dashboard';

export interface CampaignFormData {
  name: string;
  platform: Platform;
  budget: string;
  cost: string;
  startDate: string;
  endDate: string;
}

export interface CampaignFormErrors {
  name?: string;
  budget?: string;
  cost?: string;
  startDate?: string;
  endDate?: string;
}

const initialForm: CampaignFormData = {
  name: '',
  platform: 'Google',
  budget: '',
  cost: '',
  startDate: '',
  endDate: '',
};

function validate(data: CampaignFormData): CampaignFormErrors {
  const errors: CampaignFormErrors = {};
  const name = data.name.trim();
  const budget = Number(data.budget);
  const cost = Number(data.cost);

  if (name.length < 2) errors.name = '캠페인명은 2자 이상 입력해주세요.';
  else if (name.length > 100) errors.name = '캠페인명은 100자 이하로 입력해주세요.';

  if (!data.budget) errors.budget = '예산을 입력해주세요.';
  else if (!Number.isInteger(budget) || budget < 100 || budget > 1_000_000_000)
    errors.budget = '100원 ~ 10억 원 사이의 정수를 입력해주세요.';

  if (data.cost === '') errors.cost = '집행금액을 입력해주세요.';
  else if (!Number.isInteger(cost) || cost < 0 || cost > 1_000_000_000)
    errors.cost = '0원 ~ 10억 원 사이의 정수를 입력해주세요.';
  else if (!errors.budget && cost > budget)
    errors.cost = '집행금액은 예산을 초과할 수 없습니다.';

  if (!data.startDate) errors.startDate = '시작일을 선택해주세요.';

  if (!data.endDate) errors.endDate = '종료일을 선택해주세요.';
  else if (data.startDate && data.endDate <= data.startDate)
    errors.endDate = '종료일은 시작일 이후여야 합니다.';

  return errors;
}

export function useCampaignCreateForm(onClose: () => void) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CampaignFormData>(initialForm);
  const [errors, setErrors] = useState<CampaignFormErrors>({});

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createCampaign({
        name: formData.name.trim(),
        platform: formData.platform,
        status: 'active',
        budget: Number(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      handleClose();
    },
  });

  const setField = <K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof CampaignFormErrors]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(formData);
    setErrors(next);
    if (Object.keys(next).length === 0) mutate();
  };

  const handleClose = () => {
    setFormData(initialForm);
    setErrors({});
    onClose();
  };

  return { formData, errors, isPending, setField, handleSubmit, handleClose };
}
