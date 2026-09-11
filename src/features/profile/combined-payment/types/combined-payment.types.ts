import { z } from 'zod';

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const DueBreakdownSchema = z.object({
  rent: z.number().min(0),
  revised: z.number().min(0),
  additionalFee: z.number().min(0),
  coverageFee: z.number().min(0),
  vehicleFee: z.number().min(0),
  holdDue: z.number().min(0),
});

export const PaymentAmountSchema = z.object({
  amount: z.number({ error: 'Amount must be a number' }).min(1, 'Minimum amount is $1'),
});

export const PaymentDistributionSchema = z.object({
  additionalFeePaid: z.number().min(0),
  rentPaid: z.number().min(0),
  holdDuePaid: z.number().min(0),
  revisedPaid: z.number().min(0),
  vehiclePaid: z.number().min(0),
  coveragePaid: z.number().min(0),
  totalDistributed: z.number().min(0),
  remainingAmount: z.number().min(0),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type DueBreakdown = z.infer<typeof DueBreakdownSchema>;
export type PaymentAmount = z.infer<typeof PaymentAmountSchema>;
export type PaymentDistribution = z.infer<typeof PaymentDistributionSchema>;

// ─── API Request/Response Types ───────────────────────────────────────────────

export interface CombinedPaymentClientSecrets {
  rent?: string;
  revised?: string;
  additionalFee?: string;
  coverageFee?: string;
  vehicleFee?: string;
  holdDue?: string;
}

export interface CombinedPaymentIntentResponse {
  ephemeralKey: string;
  customer: string;
  clientSecrets: CombinedPaymentClientSecrets;
}

export interface CombinedPaymentIntentRequest {
  email: string;
  guestId: string;
  amounts: Partial<DueBreakdown>;
  paymentDetails?: Partial<DueBreakdown> & { totalInputAmount: number };
}

export interface CombinedDuesData {
  totalOutstandingDues: number;
  outStandingDuesBreakdown: DueBreakdown;
}
