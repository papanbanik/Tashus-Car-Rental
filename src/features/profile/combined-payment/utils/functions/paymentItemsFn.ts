import type { DueBreakdown, PaymentDistribution } from '../../types/combined-payment.types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DueItem {
  label: string;
  due: number;
  paid: number;
}

export type PaymentCategory = 'additionalFee' | 'rent' | 'holdDue' | 'revised' | 'vehicleFee' | 'coverageFee';

export interface PaymentItem {
  category: PaymentCategory;
  amount: number;
  label: string;
  description: string;
  paymentCategory: string;
}

// ─── Builders ────────────────────────────────────────────────────────────────

/**
 * Maps outstanding due values and their allocated amounts into a
 * labelled list for display in the breakdown and distribution tables.
 */
export const buildDueItems = (dues: DueBreakdown, paid: PaymentDistribution): DueItem[] => [
  { label: 'Additional Fees', due: dues.additionalFee, paid: paid.additionalFeePaid },
  { label: 'Rent Due',        due: dues.rent,          paid: paid.rentPaid           },
  { label: 'On Hold Due',     due: dues.holdDue,       paid: paid.holdDuePaid        },
  { label: 'Revised Due',     due: dues.revised,       paid: paid.revisedPaid        },
  { label: 'Vehicle Due',     due: dues.vehicleFee,    paid: paid.vehiclePaid        },
  { label: 'Coverage Due',    due: dues.coverageFee,   paid: paid.coveragePaid       },
];

/**
 * Builds the full (unfiltered) list of payment items from a distribution.
 * Filter by amount > 0 and clientSecrets presence in the component.
 */
export const buildPaymentItems = (paid: PaymentDistribution): PaymentItem[] => [
  {
    category: 'additionalFee',
    amount: paid.additionalFeePaid,
    label: 'Additional Fee',
    description: 'Additional fees payment',
    paymentCategory: 'additional_fees',
  },
  {
    category: 'rent',
    amount: paid.rentPaid,
    label: 'Rent',
    description: 'Rent payment',
    paymentCategory: 'rent',
  },
  {
    category: 'holdDue',
    amount: paid.holdDuePaid,
    label: 'Hold Due',
    description: 'Hold due payment',
    paymentCategory: 'hold_due',
  },
  {
    category: 'revised',
    amount: paid.revisedPaid,
    label: 'Revised',
    description: 'Revised reservation payment',
    paymentCategory: 'revised',
  },
  {
    category: 'vehicleFee',
    amount: paid.vehiclePaid,
    label: 'Vehicle Fee',
    description: 'Vehicle fee payment',
    paymentCategory: 'vehicle_fee',
  },
  {
    category: 'coverageFee',
    amount: paid.coveragePaid,
    label: 'Coverage Fee',
    description: 'Coverage fee payment',
    paymentCategory: 'coverage_fee',
  },
];
