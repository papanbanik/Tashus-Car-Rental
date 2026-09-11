import CommonTooltip from '@/components/Common/CommonTooltip';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TableHeader } from '@/types/commonTypes';
import { ETransactionType } from '@/types/travels/travelEnums';
import { ERefundPaymentMethod, PaymentCategory, TransactionsState } from '@/types/user-profile/transactionsTypes';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import {
  categorySimplify,
  dateConverter,
  paymentMethodSimplify,
  paymentStatus,
  refundPaymentMethodSimplify,
} from '@/utils/Functions/transactionCommonFn';
import Link from 'next/link';

interface ITransactionTable {
  pageData: TransactionsState;
  startIndex: number;
}

const TransactionTable = ({ pageData, startIndex }: ITransactionTable) => {
  const { role, transactions, transactionDetails } = useProfileInfoContext();
  const {
    userCred: { userId },
  } = useUserCredContext();

  const tableHeading: TableHeader[] = [
    { label: '#', align: 'left' },
    { label: 'Reservation', align: 'left' },
    { label: 'Category', align: 'center' },
    ...(role === 'guest' ? ([{ label: 'Payment Method', align: 'center' }] as TableHeader[]) : []),
    { label: 'Date', align: 'center' },
    { label: 'Amount', align: 'center' },
    { label: role === 'guest' ? 'Total Balance' : 'Total Payable', align: 'center' },
  ];

  const isCancellationRefund = (row: any) =>
    row?.paymentCategory === PaymentCategory.CancellationFee && row?.transactionType === ETransactionType.Refund;

  const renderAmountDetails = (row: any) => {
    if (role === 'guest') {
      const amounts = [
        row?.creditAmountBalance && `Added Credit: $${parseFloatWithPrecision(row.creditAmountBalance ?? 0)}`,
        row?.feeAmount && `Fee Amount: $${parseFloatWithPrecision(row.feeAmount ?? 0)}`,
        row?.refundableAmount > 0 &&
          `${isCancellationRefund(row) ? 'Refunded' : 'Refundable'}: $${parseFloatWithPrecision(row.refundableAmount ?? 0)}`,
        row?.actualCardPaidAmount
          ? `${row.paymentType === 'hold_payment' ? 'Hold: ' : 'Card: '} $${parseFloatWithPrecision(row.actualCardPaidAmount ?? 0)}`
          : row?.cardAmountUsed && `Card: $${parseFloatWithPrecision(row.cardAmountUsed ?? 0)}`,
        row?.creditAmountUsed && `Credit: $${parseFloatWithPrecision(row.creditAmountUsed ?? 0)}`,
        row?.voucherAmountUsed && `Voucher: $${parseFloatWithPrecision(row.voucherAmountUsed ?? 0)}`,
        row?.paymentCategory === PaymentCategory.Refunded &&
          Object.values(ERefundPaymentMethod).includes(row?.paymentMethod) &&
          `Refunded: $${parseFloatWithPrecision(row.totalAmount ?? 0)}`,
        (row?.paymentCategory === PaymentCategory.TashusGuestCredit || row?.paymentCategory === PaymentCategory.VehicleReplacementCredit) && (
          <>
            {row?.transactionType === 'credit' ? 'Credited' : 'Deducted'}: ${Number(row?.totalAmount).toFixed(2)} <br />
            Credit Balance: ${Number(row?.currentCredit).toFixed(2)} <br />
            {!!row?.remarks && row?.paymentCategory === PaymentCategory.TashusGuestCredit && (
              <CommonTooltip title={row?.remarks} arrow placement="bottom">
                <span className="inline-block max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis align-bottom text-primary italic font-semibold text-justify">
                  {row?.remarks}
                </span>
              </CommonTooltip>
            )}
          </>
        ),
        row?.transactionType === ETransactionType.Transfer && (
          <>
            Transfer: ${parseFloatWithPrecision(row.totalAmount ?? 0)} <br />
          </>
        ),
        !(
          row.totalAmount === row.cardAmountUsed ||
          row.totalAmount === row.creditAmountUsed ||
          row.totalAmount === row.voucherAmountUsed ||
          row?.totalAmount === row?.creditAmountBalance ||
          row.paymentCategory === PaymentCategory.TashusGuestCredit ||
          row?.paymentCategory === PaymentCategory.VehicleReplacementCredit ||
          row?.paymentCategory === PaymentCategory.HoldRefundAsCredit ||
          row?.transactionType === ETransactionType.Transfer ||
          (row?.paymentCategory?.toLowerCase() === PaymentCategory.Refunded && Object.values(ERefundPaymentMethod).includes(row?.paymentMethod))
        ) && `Total: $${parseFloatWithPrecision(row.totalAmount ?? 0)}`,
      ];

      return amounts.filter(Boolean).map((text, i) => (
        <div key={i} className="text-xs sm:text-sm">
          {text}
        </div>
      ));
    }

    return (
      <span className={`${row.transactionType === 'credit' ? 'text-green-600' : 'text-red-600'} text-xs sm:text-sm font-semibold`}>
        ${row.payableAmount?.toFixed(2) || row.totalAmount?.toFixed(2)}
      </span>
    );
  };

  const renderReservationLink = (row: any) => {
    if (!row?.reservationId) return row?.reservationInfo?.carName;

    const reservationPath = `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userId}/${role === 'guest' ? 'travels' : 'reservations'}/details/${
      row.reservationId
    }`;

    const destinationPath = row?.destinationReservationId
      ? `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userId}/${role === 'guest' ? 'travels' : 'reservations'}/details/${
          row.destinationReservationId
        }`
      : null;

    return (
      <>
        <span>{row?.reservationInfo?.carName}</span>
        <Link className="text-primary hover:underline" href={reservationPath}>
          {` (${row?.reservationId})`}
        </Link>
        {row?.destinationReservationId && destinationPath && (
          <>
            {' ➔ '}
            <Link className="text-primary hover:underline" href={destinationPath}>
              {` (${row.destinationReservationId})`}
            </Link>
          </>
        )}
      </>
    );
  };

  const renderBalanceOrPayable = (row: any) => {
    if (role === 'guest') {
      return [
        ...(row?.currentCredit > 0 ? [{ label: 'Credit', value: `$${row.currentCredit.toFixed(2)}` }] : []),
        ...(row?.currentRefundable > 0 ? [{ label: 'Refundable', value: `$${row.currentRefundable.toFixed(2)}` }] : []),
      ];
    }

    return row?.currentPayable > 0 ? [{ label: '', value: `$${row.currentPayable.toFixed(2)}` }] : [];
  };

  // const renderBalanceOrPayable = (row: any) => {
  //   if (role === 'guest') {
  //     return [
  //       row?.currentCredit > 0 && `Credit: $${row.currentCredit.toFixed(2)}`,
  //       row?.currentRefundable > 0 && `Refundable: $${row.currentRefundable.toFixed(2)}`,
  //     ]
  //       .filter(Boolean)
  //       .join(', ');
  //   }
  //   return row?.currentPayable > 0 && `$${row.currentPayable.toFixed(2)}`;
  // };

  return (
    <>
      {/* Desktop View: Table Layout */}
      <div className="hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-primary  text-white">
            <tr>
              {tableHeading?.map(({ align, label }, index) => (
                <th key={index} className={`px-4 sm:px-6 py-3 sm:py-4 text-${align} text-xs font-semibold uppercase tracking-wider min-w-[100px]`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {pageData?.length > 0 ? (
              pageData.map((row: any, index: number) => (
                <tr key={row?._id} className={` ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 font-medium">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 font-medium">{renderReservationLink(row)}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 text-center">
                    <div className="flex flex-col items-center">
                      <span>
                        {row?.transactionType === ETransactionType.Transfer
                          ? 'Transfer'
                          : row.paymentCategory
                          ? categorySimplify(row.paymentType === 'hold_payment' ? row.paymentType : row.paymentCategory)
                          : 'Others'}
                      </span>
                      {role === 'guest' && paymentStatus(row.paymentCategory, role) && (
                        <span className="bg-primary text-white rounded-full py-0.5 px-2 mt-1 text-xs">
                          {paymentStatus(row.paymentCategory, role)}
                        </span>
                      )}
                    </div>
                  </td>
                  {role === 'guest' && (
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 text-center">
                      {row.paymentMethod
                        ? row?.paymentCategory === PaymentCategory.Refunded
                          ? refundPaymentMethodSimplify(row.paymentMethod)
                          : paymentMethodSimplify(row.paymentMethod)
                        : row?.paymentCategory === PaymentCategory.VehicleReplacementCredit || row?.creditAmountBalance > 0
                        ? 'Credited'
                        : row?.paymentCategory === PaymentCategory.CancellationFee && row?.transactionType === ETransactionType.Refund
                        ? 'Refunded to card'
                        : 'Other'}
                      {row.voucherInfo?.voucherCode && ` (code: ${row.voucherInfo.voucherCode})`}
                    </td>
                  )}
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 text-center">
                    {dateConverter(row?.createdAt).split('at')[0]} <br /> {dateConverter(row?.createdAt).split('at')[1]}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary font-semibold text-center">{renderAmountDetails(row)}</td>
                  {/* <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 font-semibold text-center">
                    {renderBalanceOrPayable(row)}
                  </td> */}
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 font-semibold text-center">
                    {renderBalanceOrPayable(row).map((item, index) => (
                      <div key={index}>
                        <div className="text-gray-600">{item.label}:</div>
                        <div className="text-gray-800">{item.value}</div>
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeading.length} className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-700 font-semibold">
                  No Transactions to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Card Layout */}
      <div className="block sm:hidden space-y-4">
        {pageData?.length > 0 ? (
          pageData.map((row: any, index: number) => (
            <div
              key={row?._id}
              className={`glassmorphism rounded-xl p-4 card-hover transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-600">Transaction #</span>
                  <span className="text-xs font-medium text-gray-700">{startIndex + index + 1}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-600">Reservation</span>
                  <span className="text-xs font-medium text-gray-900 max-w-[60%] text-right">{renderReservationLink(row)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-600">Category</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-700">
                      {row?.transactionType === ETransactionType.Transfer
                        ? 'Transfer'
                        : row.paymentCategory
                        ? categorySimplify(row.paymentType === 'hold_payment' ? row.paymentType : row.paymentCategory)
                        : 'Others'}
                    </span>
                    {role === 'guest' && paymentStatus(row.paymentCategory, role) && (
                      <span className="bg-primary text-white rounded-full py-0.5 px-2 mt-1 text-xs">{paymentStatus(row.paymentCategory, role)}</span>
                    )}
                  </div>
                </div>
                {role === 'guest' && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-600">Payment Method</span>
                    <span className="text-xs text-gray-700 text-right">
                      {row.paymentMethod
                        ? paymentMethodSimplify(row.paymentMethod)
                        : row?.paymentCategory === PaymentCategory.VehicleReplacementCredit
                        ? 'Credited'
                        : 'Other'}
                      {row.voucherInfo?.voucherCode && ` (code: ${row.voucherInfo.voucherCode})`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-600">Date</span>
                  <span className="text-xs text-gray-700 text-right">
                    {dateConverter(row?.createdAt).split('at')[0]} <br /> {dateConverter(row?.createdAt).split('at')[1]}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-600">Amount</span>
                  <span className="text-xs text-primary font-semibold text-right">{renderAmountDetails(row)}</span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-600">{role === 'guest' ? 'Total Balance' : 'Total Payable'}</span>
                  <span className="text-xs text-gray-700 font-semibold text-right">{renderBalanceOrPayable(row)}</span>
                </div> */}

                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-600">{role === 'guest' ? 'Total Balance' : 'Total Payable'}</span>
                  <div className="text-right">
                    {renderBalanceOrPayable(row).map((item, index) => (
                      <div key={index}>
                        <div className="text-xs text-gray-600 font-semibold">{item.label}:</div>
                        <div className="text-xs text-gray-700 font-semibold">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glassmorphism rounded-xl p-4 text-center text-xs text-gray-700 font-semibold">No Transactions to show</div>
        )}
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .table-row-hover:hover {
          background: rgba(0, 0, 0, 0.05);
          transform: scale(1.01);
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default TransactionTable;
