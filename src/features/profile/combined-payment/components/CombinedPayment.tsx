'use client';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { CardElement } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoPerson } from 'react-icons/io5';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ECommonText } from '@/utils/Functions/randomCommonFn';
import { useCombinedPayments } from '../hooks/useCombinedPayments';
import { useStripeCombinedPayment } from '../hooks/useStripeCombinedPayment';
import { useHandleApp } from '../hooks/useHandleApp';
import { AllocRow, DueRow } from '../utils/styles/paymentAllocationStyle';
import { buildDueItems, buildPaymentItems } from '../utils/functions/paymentItemsFn';
import StripeLogo from '/public/stripe-logo.png';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';

// ─── Component ────────────────────────────────────────────────────────────────

const CombinedPayment = ({ reservationId }: { reservationId: number }) => {
  const { breakdown, isLoading, totalOutstanding, register, errors, amount, isInvalid, distribution, isProcessing, error, clientSecrets, handleSubmit, partialPaymentViolations, hasPartialPaymentError } =
    useCombinedPayments(reservationId);

  const { userCred } = useUserCredContext();
  const { isApp, isFlutterWebView, sendToFlutter } = useHandleApp();
  const { outStandingDuesBreakdown } = breakdown ?? {};
  const dues = outStandingDuesBreakdown ?? { rent: 0, revised: 0, additionalFee: 0, coverageFee: 0, vehicleFee: 0, holdDue: 0 };
  const paid = distribution ?? { additionalFeePaid: 0, rentPaid: 0, holdDuePaid: 0, revisedPaid: 0, vehiclePaid: 0, coveragePaid: 0, totalDistributed: 0, remainingAmount: 0 };

  const dueItems = buildDueItems(dues, paid);

  // Payment items — filtered to those with an allocation and a client secret
  const paymentItems = buildPaymentItems(paid).filter(
    (item) => item.amount > 0 && clientSecrets?.[item.category],
  );

  // Stripe payment hook
  const {
    cardHolderName,
    cardHolderAddress,
    cardError,
    isPaymentProcessing,
    paymentComplete,
    transactionIds,
    isPaymentDisabled,
    setCardHolderName,
    setCardHolderAddress,
    setCardError,
    handleStripePayment,
  } = useStripeCombinedPayment({
    clientSecrets,
    paymentItems,
    reservationId,
    guestId: userCred?.userId ?? '',
    email: userCred?.email ?? '',
    requestOrigin: isFlutterWebView ? 'mobile' : 'web',
    sendToFlutter,
  });

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-16">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!breakdown) {
    return (
      <div className="p-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          Failed to load dues breakdown. Please try again.
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col p-4 justify-center items-center md:w-2/3 lg:w-3/5 mx-auto">
      <div className="w-full md:w-[600px] p-6 bg-white border border-gray-200 shadow-sm rounded-xl mt-4 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Combined Payment</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total Outstanding: <span className="font-semibold text-error">${parseFloatWithPrecision(totalOutstanding)}</span>
          </p>
        </div>

        {/* Outstanding Dues Breakdown */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Outstanding Dues Breakdown</h3>
          <ul className="space-y-1 divide-y divide-gray-100">
            {dueItems.map((item) => (
              <DueRow key={item.label} label={item.label} value={item.due} />
            ))}
          </ul>
        </div>

        {/* Amount Input */}
        <div>
          <TextField
            id="amount"
            label="Amount to Pay ($)"
            type="number"
            variant="outlined"
            fullWidth
            size="small"
            error={!!errors.amount}
            helperText={errors.amount?.message}
            inputProps={{
              step: '0.01',
              min: 1,
              max: totalOutstanding,
              'aria-describedby': hasPartialPaymentError ? 'partial-payment-error' : undefined,
            }}
            {...register('amount', { valueAsNumber: true })}
          />
        </div>
        {/* Partial Payment Validation Warning */}
        {hasPartialPaymentError && (
          <div
            id="partial-payment-error"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className="bg-amber-50 border border-amber-300 rounded-lg p-4 space-y-2"
          >
            <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <span aria-hidden="true">⚠️</span>
              Partial payment not allowed for the following:
            </p>
            <ul className="list-disc list-inside space-y-1" aria-label="Partial payment violations">
              {partialPaymentViolations.map((v) => (
                <li key={v.field} className="text-sm text-amber-700">
                  <span className="font-semibold">{v.label}</span> must be paid in full.{' '}
                  Required: <span className="font-semibold">${parseFloatWithPrecision(v.due)}</span>,{' '}
                  currently allocated: <span className="font-semibold">${parseFloatWithPrecision(v.allocated)}</span>.
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-600">
              Please increase the amount to cover the full balance, or pay other dues separately first.
            </p>
          </div>
        )}

        {/* Distribution Preview */}
        {distribution && !isInvalid && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Distribution Preview</h3>
            <ul className="space-y-1 divide-y divide-gray-100">
              {dueItems.map((item) => (
                <AllocRow key={item.label} label={item.label} value={item.paid} due={item.due} />
              ))}
            </ul>
          </div>
        )}

        {/* Payment Section */}
        {!isInvalid && amount > 0 && distribution && (
          <>
            {!clientSecrets ? (
              // Show "Pay" button to create payment intents
              <div className="space-y-4">
                {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing || hasPartialPaymentError}
                  aria-disabled={isProcessing || hasPartialPaymentError}
                  className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    `Pay $${parseFloatWithPrecision(amount)}`
                  )}
                </button>
              </div>
            ) : paymentComplete ? (
              // Show success message
              <div className="text-center space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Alert severity="success" className="bg-green-100">
                  Payment Successful!
                </Alert>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">Total Paid: ${parseFloatWithPrecision(amount)}</p>
                  <p className="text-xs mt-1">{transactionIds.length} payment(s) completed successfully</p>
                  {transactionIds.map((txId, idx) => (
                    <p key={txId} className="text-xs text-gray-500 mt-1">
                      Transaction {idx + 1}: {txId}
                    </p>
                  ))}
                </div>
                {isFlutterWebView || isApp ? (
                  <Alert severity="info">Please close the tab and return to App for more details</Alert>
                ) : (
                  <Link href={`/dashboard/${userCred?.userId}/travels/details/${reservationId}`}>
                    <Button className="normal-case" variant="contained">
                      View Travel Details
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              // Show Stripe card form
              <>
                {/* Payment Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    {paymentItems.map(item => (
                      <div key={item.category} className="flex justify-between">
                        <span className="text-gray-600">{item.label}:</span>
                        <span className="font-semibold">${parseFloatWithPrecision(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-blue-300">
                      <span className="font-bold text-gray-800">Total:</span>
                      <span className="font-bold text-primary">${parseFloatWithPrecision(amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Form */}
                <form onSubmit={handleStripePayment} className="space-y-4">
                  <TextField
                    name="name"
                    id="name"
                    label={
                      <div className="flex items-center gap-2">
                        <IoPerson />
                        Card holder name {ECommonText.RequiredSign}
                      </div>
                    }
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    disabled={isPaymentProcessing}
                    size="small"
                    fullWidth
                    className="capitalize font-semibold"
                  />

                  <TextField
                    name="address"
                    id="address"
                    label={
                      <div className="flex items-center gap-2">
                        <FaMapLocationDot />
                        Billing address {ECommonText.RequiredSign}
                      </div>
                    }
                    value={cardHolderAddress}
                    onChange={(e) => setCardHolderAddress(e.target.value)}
                    disabled={isPaymentProcessing}
                    size="small"
                    fullWidth
                    className="capitalize"
                  />

                  <CardElement
                    className="p-3 rounded-md bg-white border-solid border border-gray-300"
                    onChange={() => setCardError('')}
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: '16px',
                          backgroundColor: 'white',
                          color: 'black',
                          '::placeholder': {
                            color: 'grey',
                          },
                        },
                        invalid: {
                          color: '#ff737a',
                        },
                      },
                    }}
                  />

                  {/* Error Message */}
                  {cardError && (
                    <Alert severity="error" className="bg-red-50">
                      {cardError}
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isPaymentDisabled}
                    fullWidth
                    className="normal-case text-md md:text-lg"
                    color="success"
                    variant="contained"
                  >
                    {isPaymentProcessing ? (
                      <CircularProgress color="inherit" size={22} />
                    ) : (
                      `Pay $${parseFloatWithPrecision(amount)}`
                    )}
                  </Button>
                </form>

                {/* Stripe Logo */}
                <div className="flex justify-center items-center mt-4">
                  <Image className="w-2/3 h-auto max-w-[200px]" src={StripeLogo} alt="Stripe logo" />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CombinedPayment;
