import CommonTooltip from '@/components/Common/CommonTooltip';
import IndividualPriceDisplay from '@/components/Common/VehicleDetails/PriceUpdate/IndividualPriceDisplay';
import { useTravelContext } from '@/context/TravelProvider';
import { Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { Fragment, ReactNode, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import EarlyDiscountBreakdown from './EarlyDiscountBreakdown';
import LongDiscountBreakdown from './LongDiscountBreakdown';

export interface Bill {
  amountType: 'increase' | 'decrease' | 'general';
  label: string;
  amount: any;
  helpingText?: string;
  useBorder?: boolean;
  inDetails?: ReactNode;
  inDetailsText?: string;
}
const BillingPriceBreakdown = () => {
  const { updatedTravelData, billingDetails } = useTravelContext();
  const [openDetails, setOpenDetails] = useState<number | null>(null);
  const { basePrice } = updatedTravelData ?? {};
  const { durationPrice } = basePrice ?? {};
  const {
    newDuration,
    newDurationPrice,
    newLongBookingDis,
    newAdvBookingDis,
    newCoverageAmount,
    discountsInfo,
    previousLongBookingDiscount = 0,
  } = billingDetails ?? {};

  const billingData: Bill[] = [
    {
      amountType: 'increase',
      label: newDuration,
      amount: `+$${newDurationPrice?.toFixed(2)}`,
      inDetails: <IndividualPriceDisplay />,
      inDetailsText: 'Duration Price',
    },
    previousLongBookingDiscount > 0 && {
      amountType: 'decrease',
      label: 'Previous Long Discount',
      amount: `-$${previousLongBookingDiscount?.toFixed(2)}`,
    },
    (newLongBookingDis?.calculatedAmount ?? 0) > 0 && {
      amountType: 'decrease',
      label: 'Long Reservation Discount',
      amount: `-$${newLongBookingDis?.calculatedAmount?.toFixed(2)}`,
      inDetails: (
        <LongDiscountBreakdown longBookingDiscount={newLongBookingDis} previousDurationPrice={durationPrice} newDurationPrice={newDurationPrice} />
      ),
      inDetailsText: 'Long Discount',
    },
    (newAdvBookingDis?.calculatedAmount ?? 0) > 0 && {
      amountType: 'decrease',
      label: 'Early Reservation Discount',
      amount: `-$${newAdvBookingDis?.calculatedAmount?.toFixed(2)}`,
      inDetails: (
        <EarlyDiscountBreakdown
          longBookingDiscount={newLongBookingDis}
          advBookingDiscount={newAdvBookingDis}
          discountInfo={discountsInfo}
          previousDurationPrice={durationPrice}
          newDurationPrice={newDurationPrice}
          haveLongDiscount={(newLongBookingDis?.calculatedAmount ?? 0) > 0}
        />
      ),
      inDetailsText: 'Early Discount',
    },
    // {
    //   amountType: 'increase',
    //   label: 'Coverage Amount',
    //   amount: `+$${newCoverageAmount?.toFixed(2) ?? 0}`,
    //   useBorder: true,
    // },
    // (newGstAmount ?? 0) > 0 && {
    //   amountType: 'increase',
    //   label: 'GST',
    //   amount: `+$${newGstAmount?.toFixed(2) ?? 0}`,
    //   helpingText: (voucherAmountUsed ?? 0) > 0 ? `After applying $${voucherAmountUsed?.toFixed(2)} voucher discount` : '',
    //   useBorder: (penaltyPrice ?? 0) > 0 ? false : true,
    // },
    // (penaltyPrice ?? 0) > 0 && {
    //   amountType: 'increase',
    //   label: 'Inconvenience Fee',
    //   amount: `+$${penaltyPrice ?? 0}`,
    //   useBorder: true,
    //   helpingText: inconvenienceToolTip,
    // },
    // (voucherAmountUsed ?? 0) > 0 && {
    //   amountType: 'decrease',
    //   label: 'Voucher Discount',
    //   amount: `-$${voucherAmountUsed?.toFixed(2)}`,
    //   useBorder: true,
    // },
    // {
    //   amountType: 'general',
    //   label: 'Total Fare',
    //   amount: `$${newTotalPrice?.toFixed(2)}`,
    // },
  ].filter(Boolean) as any[];

  const handleToggleDetails = (index: number) => {
    setOpenDetails(openDetails === index ? null : index); // Toggle open/close for the specific item
  };
  return (
    <div>
      <TableContainer component={Paper} className="bg-transparent">
        <Table>
          <TableBody>
            {billingData?.map((item, index) => (
              <Fragment key={index}>
                <TableRow className={`${index % 2 === 0 ? 'bg-[#ececec]' : 'bg-[#fafafa]'} `}>
                  <TableCell>
                    <span>{item.label}</span>
                    {item?.helpingText && (
                      <CommonTooltip title={item?.helpingText} arrow={true}>
                        <IconButton size="small">
                          <AiOutlineInfoCircle />
                        </IconButton>
                      </CommonTooltip>
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`${item?.amountType === 'increase' ? 'text-success' : item?.amountType === 'decrease' ? 'text-error' : ''}`}
                  >
                    {item.amount}{' '}
                  </TableCell>
                </TableRow>
                {item?.inDetails && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Collapse in={openDetails === index}>
                        <div className="border border-solid border-accent rounded-lg p-2 my-2">{item?.inDetails}</div>
                      </Collapse>
                      <span onClick={() => handleToggleDetails(index)} className="cursor-pointer hover:underline text-primary">
                        {openDetails === index ? 'Hide ' : 'Show'} {item?.inDetailsText ?? ''} Details
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BillingPriceBreakdown;
