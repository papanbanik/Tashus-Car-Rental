export const getDriverInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const formatStageDisplay = (stage: string) => {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount);
};
