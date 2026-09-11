import { DueBreakdown, PaymentDistribution } from '../../types/combined-payment.types';

export type { DueBreakdown, PaymentDistribution };

// ─── Partial-Payment Validation ───────────────────────────────────────────────

export interface PartialPaymentViolation {
  /** Which due category is being partially paid */
  field: 'vehicleFee' | 'coverageFee';
  /** Human-readable label shown to the user */
  label: string;
  /** The full amount that must be paid */
  due: number;
  /** The amount that would actually be allocated */
  allocated: number;
}

/**
 * Returns a list of categories (vehicle fee / coverage fee) that would be
 * partially paid given the proposed allocation.  An empty array means the
 * payment is valid.
 *
 * Rules:
 * - Vehicle fee and coverage fee must be paid in full — no partial payments.
 * - A violation is raised only when the category has a due > 0 AND the
 *   allocation touches it but doesn't cover it completely.
 */
export const validateNoPartialPayment = (
  distribution: PaymentDistribution,
  dues: DueBreakdown,
): PartialPaymentViolation[] => {
  const violations: PartialPaymentViolation[] = [];
  const {vehicleFee=0, coverageFee=0}= dues ??{}
  const {vehiclePaid=0, coveragePaid=0}=distribution ?? {}
  if (vehicleFee > 0 && vehiclePaid > 0 && vehiclePaid < vehicleFee) {
    violations.push({
      field: 'vehicleFee',
      label: 'Vehicle Due',
      due:vehicleFee,
      allocated: distribution.vehiclePaid,
    });
  }

  if (coverageFee > 0 && coveragePaid > 0 && coveragePaid < coverageFee) {
    violations.push({
      field: 'coverageFee',
      label: 'Coverage Due',
      due: dues.coverageFee,
      allocated: distribution.coveragePaid,
    });
  }

  return violations;
};

/**
 * Allocates a payment amount across due categories in priority order:
 * 1. Additional Fees
 * 2. Rent Due
 * 3. Hold Due
 * 4. Revised Due
 * 5. Vehicle Due
 * 6. Coverage Due
 */
export const allocatePayment = (inputAmount: number, dues: DueBreakdown): PaymentDistribution => {
  let remaining = inputAmount;
  const {holdDue=0, rent=0, revised=0, vehicleFee=0, coverageFee=0, additionalFee=0}=dues ??{}
  const take = (due: number): number => {
    const paid = Math.min(due, remaining);
    remaining -= paid;
    return paid;
  };

  const additionalFeePaid = take(additionalFee);
  const rentPaid = take(rent);
  const holdDuePaid = take(holdDue);
  const revisedPaid = take(revised);
  const vehiclePaid = take(vehicleFee);
  const coveragePaid = take(coverageFee);

  return {
    additionalFeePaid,
    rentPaid,
    holdDuePaid,
    revisedPaid,
    vehiclePaid,
    coveragePaid,
    totalDistributed: inputAmount - remaining,
    remainingAmount: remaining,
  };
};
