'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetCombinedDuesBreakdown } from './useGetCombinedDuesBreakdown';
import { useCreateCombinedPaymentIntent } from './useCreateCombinedPaymentIntent';
import { allocatePayment, validateNoPartialPayment, type PartialPaymentViolation } from '../utils/functions/paymentAllocationFn';
import type { CombinedPaymentClientSecrets, DueBreakdown, PaymentDistribution } from '../types/combined-payment.types';
import { AmountForm, buildAmountSchema } from '../types/combined-payment.validation';

export const useCombinedPayments = (reservationId: number) => {
  const { userCred } = useUserCredContext();
  const { data: breakdown, isLoading } = useGetCombinedDuesBreakdown(reservationId);
  const { mutateAsync: createPaymentIntent } = useCreateCombinedPaymentIntent();
  const { totalOutstandingDues = 0, outStandingDuesBreakdown } = breakdown ?? {};
  const { rent = 0, revised = 0, additionalFee = 0, coverageFee = 0, vehicleFee = 0, holdDue = 0 } = outStandingDuesBreakdown ?? {};

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecrets, setClientSecrets] = useState<CombinedPaymentClientSecrets | null>(null);

  const totalOutstanding = useMemo(() => totalOutstandingDues, [totalOutstandingDues]);

  // Build dues object for schema validation
  const dues: DueBreakdown = useMemo(
    () => ({ rent, revised, additionalFee, coverageFee, vehicleFee, holdDue }),
    [rent, revised, additionalFee, coverageFee, vehicleFee, holdDue],
  );

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<AmountForm>({
    resolver: zodResolver(buildAmountSchema(totalOutstanding, dues)),
    mode: 'onChange',
    defaultValues: { amount: totalOutstanding },
    values: { amount: totalOutstanding },
  });

  const inputAmount = watch('amount');
  const amount = Number(inputAmount);
  const isInvalid = !!errors.amount || amount < 1 || amount > totalOutstanding;

  const distribution: PaymentDistribution | null = useMemo(() => {
    if (!breakdown) return null;
    return allocatePayment(amount, dues);
  }, [amount, dues, breakdown]);

  // Derive partial-payment violations from the current distribution
  const partialPaymentViolations: PartialPaymentViolation[] = useMemo(() => {
    if (!distribution || isInvalid) return [];
    return validateNoPartialPayment(distribution, dues);
  }, [distribution, dues, isInvalid]);

  const hasPartialPaymentError = partialPaymentViolations.length > 0;

  //Destruct
  const { email = '', userId = 0 } = userCred ?? {};
  const { rentPaid = 0, revisedPaid = 0, additionalFeePaid = 0, coveragePaid = 0, vehiclePaid = 0, holdDuePaid = 0 } = distribution ?? {};

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isInvalid || hasPartialPaymentError || amount <= 0 || !distribution || !email || !userId) return;

    setIsProcessing(true);
    setError(null);

    try {
      const amounts = {
        rent: rentPaid,
        revised: revisedPaid,
        additionalFee: additionalFeePaid,
        coverageFee: coveragePaid,
        vehicleFee: vehiclePaid,
        holdDue: holdDuePaid,
      };

      const paymentDetails = {
        ...amounts,
        totalInputAmount: amount,
      };

      const result = await createPaymentIntent({
        reservationId,
        body: {
          email: email,
          guestId: userId,
          amounts,
          paymentDetails,
        },
      });

      console.log('Payment Intent Result:', result);

      if (result?.clientSecrets) {
        setClientSecrets(result.clientSecrets);
      } else {
        setError('Failed to create payment intents. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    breakdown,
    isLoading,
    totalOutstanding,
    register,
    errors,
    amount,
    isInvalid,
    distribution,
    isProcessing,
    error,
    clientSecrets,
    handleSubmit,
    partialPaymentViolations,
    hasPartialPaymentError,
  };
};
