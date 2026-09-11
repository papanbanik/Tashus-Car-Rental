export interface OutstandingDuesBreakdown {
  rent: number;
  revised: number;
  additionalFee: number;
  coverageFee: number;
  vehicleFee: number;
  holdDue: number;
}

export interface TransactionSummary {
  totalPaidAmount: number;
  totalReturnedAmount: number;
  totalOutstandingDues: number;
  totalAdditionalAmount: number;
  depositAmount: number;
  isHoldSuccess: boolean;
}

export interface OutstandingDuesItem {
  reservationId: string;
  reservationStatus: string;
  transactionSummary: TransactionSummary;
  outStandingDuesBreakdown: OutstandingDuesBreakdown;
}

export interface OutstandingDuesResponse {
  totalOutstandingDues: number;
  outstandingDuesList: OutstandingDuesItem[];
}

export type SortField = 'reservationId' | 'totalOutstandingDues' | 'totalPaidAmount';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField | string;
  order: SortOrder;
}
