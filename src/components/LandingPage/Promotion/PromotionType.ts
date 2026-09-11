export type TVoucherRule = {
  field: string;
  value: string | boolean;
  id?: string;
  operator?: string;
  valueSource?: string;
};

export type TVoucherItem = {
  discountType?: 'flat' | 'percentage' | 'free_days' | string;
  discountAmount?: number | null;
  voucherRules?: TVoucherRule[];
};
