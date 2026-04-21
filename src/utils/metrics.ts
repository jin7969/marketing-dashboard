export const calculateCTR = (clicks: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
};

export const calculateCPC = (cost: number, clicks: number): number => {
  if (clicks === 0) return 0;
  return cost / clicks;
};

export const calculateROAS = (conversionsValue: number | null, cost: number): number => {
  if (cost === 0 || conversionsValue === null) return 0;
  return (conversionsValue / cost) * 100;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(Math.round(num));
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(num);
};
