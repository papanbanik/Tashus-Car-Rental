export type TLabelMapping = {
  [key: string]: { label: string; icon: React.ReactNode; label2?: string };
};
export type TTashusLocalStorage = {
  userId?: string;
};

export type TVoucherRule = {
  id: string;
  field: string;
  operator: string;
  valueSource: string;
  value: any;
};

export type TVoucherUsage = {
  userId: string;
  amount: number;
  reservationId: number;
  _id: string;
};

export type TAdminUser = {
  adminUserName: string;
  adminId: string;
};

export type ChangeLog = {
  changes: {
    [key: string]: {
      oldValue: any;
      newValue: any;
    };
  };
  modifiedBy: TAdminUser & {
    modifiedAt: string;
  };
  _id: string;
};

export type TPromotion = {
  _id: string;
  title: string;
  description: string;
  totalBudget: number;
  remainingBudget: number;
  promotionRules: TVoucherRule[];
  expiresAt: string;
  isExpired: boolean;
  createdBy: string;
  vouchers: string[];
  updatedBy: { adminId: string; updatedAt: string; _id: string }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  changeLogs: any[];
};

export type TVoucherImage = {
  public_id: string;
  secure_url: string;
};

export type TVoucher = {
  _id: string;
  promotionId: string;
  description: string;
  voucherCode: string;
  discountType: string;
  discountAmount: number;
  maxDiscountAmount: number | null;
  maxUsageCount: number;
  maxUsagePerUser: number;
  voucherUsageCount: number;
  voucherUsageAmount: number;
  isActive: boolean;
  voucherRules: TVoucherRule[];
  expiresAt: string;
  activateAt?: string;
  isExpired: boolean;
  isPaused: boolean;
  isPublic: boolean;
  createdBy: string;
  voucherTitle: string;
  voucherSlug: string;
  applicableUserDescription?: string;
  voucherTerms?: any;
  voucherImages: TVoucherImage[];
  voucherUsedBy: TVoucherUsage[];
  creator: TAdminUser;
  changeLogs: ChangeLog[];
  updatedBy: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  usageCount: number;
  promotion: TPromotion;
};
