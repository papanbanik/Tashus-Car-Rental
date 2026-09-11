import z from 'zod';
import { allocatePayment, validateNoPartialPayment } from '../utils/functions/paymentAllocationFn';
import type { DueBreakdown } from './combined-payment.types';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';

export const buildAmountSchema = (max: number, dues?: DueBreakdown) =>
  z.object({
    amount: z
      .number({ error: 'Please enter a valid amount' })
      .min(1, 'Minimum amount is $1')
      .max(max, `Amount cannot exceed $${parseFloatWithPrecision(max)}`)
      .superRefine((value, ctx) => {
        if (!dues) return;
        const distribution = allocatePayment(value, dues);
        const violations = validateNoPartialPayment(distribution, dues);
        for (const v of violations) {
          ctx.addIssue({
            code: 'custom',
            message: `${v.label} must be paid in full ($${parseFloatWithPrecision(v.due)}). Partial payments are not allowed.`,
          });
        }
      }),
  });

export type AmountForm = { amount: number };
