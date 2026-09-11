import {
  EHoldPaymentMethod,
  EHoldPaymentStatus,
  THoldPaymentChargeHistory,
  THoldPaymentTransaction,
  THoldRefundHistory,
} from '@/types/user-profile/holdPaymentTransactionTypes';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { formatCurrency } from '@/utils/Functions/randomCommonFn';
import { getPaymentMethod } from '@/utils/Functions/travelCommonFn';
import { FC } from 'react';
import { CollapsibleRow } from './CollapsibleRow';
import { useParams } from 'next/navigation';

interface HoldAmountBreakdownProps {
  record: Partial<THoldPaymentTransaction>;
}

export const PaymentText: FC<{ label: string; amount: number; className?: string }> = ({ label, amount, className = 'text-xs' }) => {
  if (amount === undefined || amount <= 0) return null;
  return <span className={className}>{`${label}: ${formatCurrency(amount)}`}</span>;
};

interface SplitInstallmentRowProps {
  item: any;
  creditReleasedAmount?: number;
  holdRefundHistory?: THoldRefundHistory[];
  holdPaymentChargeHistory?: THoldPaymentChargeHistory[];
}

export const SplitInstallmentRow: FC<SplitInstallmentRowProps> = ({
  item,
  holdPaymentChargeHistory = [],
  holdRefundHistory = [],
  creditReleasedAmount = 0,
}) => {
  const isTransferEntry = Boolean(item.transferId);
  const isCard =
    !isTransferEntry && (String(item.holdPaymentMethod) === String(EHoldPaymentMethod.OnlyCard) || String(item.holdPaymentMethod) === 'onlyCard');

  // Charges & refunds scoped to this split
  const splitCharges = holdPaymentChargeHistory.filter((c) => c.splitId === item._id);
  const splitRefunds = holdRefundHistory.filter((r) => r.splitId === item._id);

  const totalCharged = splitCharges.reduce((sum, c) => sum + (c.chargeAmount ?? 0), 0);
  const totalRefunded = splitRefunds.filter((r) => r.refundType !== 'credit').reduce((sum, r) => sum + (r.refundedAmount ?? 0), 0);
  const totalCredited = splitRefunds.filter((r) => r.refundType === 'credit').reduce((sum, r) => sum + (r.refundedAmount ?? 0), 0);

  const capturedAmount = item?.additionalHoldPaymentInfo?.capturedAmount ?? 0;
  const cardReleasedAmount = item?.additionalHoldPaymentInfo?.releasedAmount ?? 0;

  const isCaptured = item.holdPaymentStatus === EHoldPaymentStatus.Captured || item.holdPaymentStatus === EHoldPaymentStatus.PartiallyCaptured;

  const isCardFullyReleased = item.holdPaymentStatus === EHoldPaymentStatus.Released;

  const isCreditReleased = item.holdPaymentMethod === EHoldPaymentMethod.CreditApplied && item.holdPaymentStatus === EHoldPaymentStatus.Released;
  const cardFullyReleasedAmount = isCardFullyReleased ? cardReleasedAmount : 0;

  const effectiveTotal = isTransferEntry ? item.amount : isCaptured ? capturedAmount : item.amount;

  // subtract transferred out amount for this specific split
  const transferredOutAmount = (item.transferHistory || [])
    .filter(
      (t: any) =>
        String(t.splitId) === String(item._id) && (String(t.sourceReservationId) === String(item.reservationId) || !t.destinationReservationId)
    )
    .reduce((sum: number, t: any) => sum + (t.amount ?? 0), 0);

  const availableAmount = parseFloatWithPrecision(
    effectiveTotal - totalCharged - totalRefunded - totalCredited - creditReleasedAmount - cardFullyReleasedAmount - transferredOutAmount
  );

  const isReleased = item.holdPaymentStatus === EHoldPaymentStatus.Released;

  const subRows = [
    // Transfer-in row (only for transferred entries)
    isTransferEntry &&
      item.amount > 0 && {
        label: 'Transfer In',
        amount: item.amount,
        className: 'text-blue-500',
      },
    // Transfer-out row
    transferredOutAmount > 0 && {
      label: 'Transfer Out',
      amount: transferredOutAmount,
      className: 'text-orange-500',
    },
    // Card-specific rows
    isCard && cardReleasedAmount > 0 && { label: 'Released', amount: cardReleasedAmount },
    isCreditReleased && creditReleasedAmount > 0 && { label: 'Released', amount: creditReleasedAmount },
    isCard && capturedAmount > 0 && { label: 'Captured', amount: capturedAmount },
    // Common rows
    totalCharged > 0 && { label: 'Charged', amount: totalCharged },
    totalRefunded > 0 && { label: 'Refunded', amount: totalRefunded },
    totalCredited > 0 && { label: 'Credited', amount: totalCredited },
    {
      label: isReleased || availableAmount <= 0 ? 'Remaining' : 'Available',
      amount: availableAmount,
      className: !isReleased && availableAmount > 0 ? 'text-red-500' : 'text-gray-500',
    },
  ].filter(Boolean) as any;

  // Label: show payment method (do not display 'Transferred' inline)
  const rowLabel = getPaymentMethod(String(item.holdPaymentMethod));

  return (
    <div className="w-full">
      <CollapsibleRow label={rowLabel} amount={item.amount} subRows={subRows} />
    </div>
  );
};

export const HoldAmountBreakdown: FC<HoldAmountBreakdownProps> = ({ record }) => {
  const { holdPaymentChargeHistory = [], holdRefundHistory = [], splitHoldPaymentHistory = [], transferHistory = [] } = record;
  const { reservationId: reservationIdParam, travelId: travelIdParam } = useParams<{ reservationId: string; travelId: string }>();
  const reservationId = Number(reservationIdParam ?? travelIdParam);
  const isSplit = splitHoldPaymentHistory.length > 0;

  // Calculate generic charges for non-split view
  let additionalFeesCharge = 0;
  let revisedFeesCharge = 0;
  holdPaymentChargeHistory.forEach((item) => {
    const amt = item.chargeAmount || 0;
    if (item.chargeCategory === 'additional_fee') {
      additionalFeesCharge += amt;
    } else if (item.chargeCategory === 'revised_fee') {
      revisedFeesCharge += amt;
    }
  });

  // Calculate generic refunds for non-split view
  let totalRefundedAmount = 0;
  let totalCreditedAmount = 0;
  holdRefundHistory.forEach((item) => {
    const amt = item.refundedAmount || 0;
    if (item.refundType === 'credit') {
      totalCreditedAmount += amt;
    } else {
      totalRefundedAmount += amt;
    }
  });

  // Calculate transferred out amount for non-split view
  let totalTransferredOutAmount = 0;
  if (transferHistory) {
    transferHistory.forEach((transfer: any) => {
      if (String(transfer.sourceReservationId) === String(reservationId)) {
        totalTransferredOutAmount += transfer.amount;
      }
    });
  }

  // console.log('transferHistory', transferHistory);
  // console.log('total Transferred Amount', totalTransferredOutAmount);
  return (
    <div className="flex flex-col gap-1 w-full">
      {isSplit ? (
        <div className="flex flex-col gap-0.5 w-full">
          <span className="text-xs font-semibold">{`Hold: ${formatCurrency(
            splitHoldPaymentHistory.reduce((sum, item) => sum + (item.amount || 0), 0)
          )}`}</span>
          {splitHoldPaymentHistory.map((item, index) => (
            <SplitInstallmentRow
              key={item._id ?? index}
              item={{ ...item, transferHistory, reservationId: reservationId }}
              holdPaymentChargeHistory={holdPaymentChargeHistory}
              holdRefundHistory={holdRefundHistory}
              creditReleasedAmount={
                item?.holdPaymentMethod === EHoldPaymentMethod.CreditApplied ? item?.additionalHoldPaymentInfo?.releasedAmount : 0
              }
            />
          ))}
        </div>
      ) : (() => {
          const capturedAmount = record?.additionalHoldPaymentInfo?.capturedAmount ?? 0;

          // Sub-items that nest under "Captured" when capturedAmount > 0
          const capturedSubItems = [
            totalTransferredOutAmount > 0 && {
              label: 'Transferred',
              amount: totalTransferredOutAmount,
              className: 'text-orange-500',
            },
            revisedFeesCharge > 0 && {
              label: 'Rent Due Charged',
              amount: revisedFeesCharge,
            },
            additionalFeesCharge > 0 && {
              label: 'A. Fees Charged',
              amount: additionalFeesCharge,
            },
          ].filter(Boolean) as { label: string; amount: number; className?: string }[];

          const hasCapturedSubItems = capturedAmount > 0 && capturedSubItems.length > 0;

          const nonSplitSubRows = [
            (record?.additionalHoldPaymentInfo?.releasedAmount ?? 0) > 0 && {
              label: 'Released',
              amount: record?.additionalHoldPaymentInfo?.releasedAmount ?? 0,
            },
            capturedAmount > 0 && {
              label: 'Captured',
              amount: capturedAmount,
              ...(hasCapturedSubItems ? { children: capturedSubItems } : {}),
            },
            // When capturedAmount is 0, show Transferred/charges as flat rows
            !hasCapturedSubItems && totalTransferredOutAmount > 0 && {
              label: 'Transferred',
              amount: totalTransferredOutAmount,
              className: 'text-orange-500',
            },
            !hasCapturedSubItems && revisedFeesCharge > 0 && {
              label: 'Rent Due Charged',
              amount: revisedFeesCharge,
            },
            !hasCapturedSubItems && additionalFeesCharge > 0 && {
              label: 'A. Fees Charged',
              amount: additionalFeesCharge,
            },
            totalRefundedAmount > 0 && {
              label: 'Refunded',
              amount: totalRefundedAmount,
            },
            totalCreditedAmount > 0 && {
              label: 'Credited',
              amount: totalCreditedAmount,
            },
            (record?.remainingDepositAmount ?? 0) > 0 && {
              label: 'Remaining',
              amount: record?.remainingDepositAmount ?? 0,
              className: 'text-[11px] text-red-600',
            },
          ].filter(Boolean) as any[];

          const holdAmount =
            (record?.actualCardPaidAmount ?? 0) > 0
              ? (record?.actualCardPaidAmount ?? 0) + totalTransferredOutAmount
              : capturedAmount > 0
                ? capturedAmount
                : 0;

          return <CollapsibleRow label="Hold" amount={holdAmount} subRows={nonSplitSubRows} />;
        })()}
    </div>
  );
};
