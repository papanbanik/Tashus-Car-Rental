import { useSearchContext } from '@/context/SearchProvider';
import Divider from '@mui/material/Divider/Divider';
import React, { Dispatch, SetStateAction, useState } from 'react';

interface BillingDetailsProps {
  discount: number | any;
  setDiscount: Dispatch<SetStateAction<number | any>>;
  totalAmountAfterDiscount: number | any;
  setTotalAmountAfterDiscount: Dispatch<SetStateAction<number | any>>;
  creditVoucherToggle: boolean | any;
  setCreditVoucherToggle: Dispatch<SetStateAction<boolean | any>>;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({
  discount,
  setDiscount,
  totalAmountAfterDiscount,
  setTotalAmountAfterDiscount,
  creditVoucherToggle,
  setCreditVoucherToggle,
}) => {
  const { reservationInfo, guestCoveragePackage, gstData, additionalPaymentInfo, reservationDepositAmount, paymentMethod, deliveryDetails } =
    useSearchContext();
  const [voucherDivShow, setVoucherDivShow] = useState<boolean>(false);

  // const totalDue = gstData?.payableWithGst - (parseFloat(additionalPaymentInfo?.creditAmountUsed?.toFixed(2)) || 0);
  const totalDue =
    (paymentMethod === 'cardWithVoucher' || paymentMethod === 'onlyVoucher') && totalAmountAfterDiscount !== null
      ? parseFloat((totalAmountAfterDiscount || 0).toFixed(2))
      : parseFloat(((gstData?.payableWithGst ?? 0) - (additionalPaymentInfo?.creditAmountUsed || 0)).toFixed(2));

  return (
    <div className="mt-12 bg-white shadow-lg shadow-secondary rounded-lg md:p-4 px-2">
      <p className="md:text-2xl text-xl font-semibold mb-4">Billing Details</p>
      <Divider className="bg-black mb-2" />

      {reservationInfo?.totalPrice && (
        <div className="grid grid-cols-12">
          <p className="col-span-6 m-0">Reservation</p>
          <p className="col-span-6 flex justify-end items-center gap-2 m-0">{`$${reservationInfo?.totalPrice?.toFixed(2)}`}</p>
          {guestCoveragePackage?.guestCoverageType !== 'no-coverage' ? (
            <>
              <Divider className="col-span-12 my-2" />

              <p className="col-span-6 m-0">Vehicle Coverage</p>
              <p className="col-span-6 flex justify-end items-center gap-2 m-0 text-success">+${guestCoveragePackage?.coverageAmount?.toFixed(2)}</p>
            </>
          ) : undefined}
          {gstData?.gstAmount > 0 && ( //gstAmount show change if calculated but not display
            <>
              <Divider className="col-span-12 my-2" />

              <p className="col-span-6 m-0">GST</p>
              <p className="col-span-6 flex justify-end items-center gap-2 m-0 text-success">+${gstData?.gstAmount?.toFixed(2)}</p>
            </>
          )}
          {discount ? (
            <>
              <Divider className="col-span-12 my-2" />
              <p className="col-span-6 m-0">{creditVoucherToggle === 'voucher' ? 'Voucher Discount' : 'Credit used'}</p>
              {/* <p className="col-span-6 m-0">{creditVoucherToggle === 'voucher' ? 'Discount' : 'Credit used'}</p> */}
              <p className="col-span-6 flex justify-end items-center gap-2 m-0 text-error">-${discount?.toFixed(2)}</p>
            </>
          ) : undefined}
          {deliveryDetails?.isDeliveryEnabled && (
            <>
              <Divider className="col-span-12 my-2" />
              <p className="col-span-6 m-0">Delivery Fee : </p>
              <p className="col-span-6 flex justify-end items-center gap-2 m-0 text-success">
                +${(deliveryDetails?.totalDeliveryFee ?? 0)?.toFixed(2)}
              </p>
              {deliveryDetails?.isReturnEnabled && (
                <>
                  <Divider className="col-span-12 my-2" />
                  <p className="col-span-6 m-0">Return Fee : </p>
                  <p className="col-span-6 flex justify-end items-center gap-2 m-0 text-success">
                    +${(deliveryDetails?.totalReturnFee ?? 0)?.toFixed(2)}
                  </p>
                </>
              )}
            </>
          )}
          {/* {reservationDepositAmount > 0 && (
            <>
              <Divider className="col-span-12 my-2" />

              <p className="col-span-6 m-0">Excess Fee</p>
              <p className="col-span-6 flex justify-end items-center gap-2 m-0 text-success">+${reservationDepositAmount?.toFixed(2)}</p>
            </>
          )} */}
          {/* {discount && creditVoucherToggle !== 'voucher' ? (
            <>
              <Divider className="col-span-12 my-2" />

              <p className="col-span-6 m-0">{'Credit used'}</p>
              <p className="col-span-6 flex justify-end items-center gap-2 m-0 text-error">-${discount?.toFixed(2)}</p>
            </>
          ) : undefined} */}

          <Divider className="col-span-12 my-2 bg-black " />
          <p className="md:col-span-10 col-span-8 flex justify-end items-center m-0 text-success font-semibold">Total Due</p>
          <p className="md:col-span-2 col-span-4 flex justify-end items-center text-success m-0 font-semibold">
            <span>{'$'}</span>
            <span>
              {totalDue?.toFixed(2)}
              {/* {totalAmountAfterDiscount !== null ? totalAmountAfterDiscount : totalPrice?.toFixed(2)} */}
              {/* : reservationInfo?.totalPrice && parseFloat(reservationInfo?.totalPrice?.toFixed(2)).toFixed(2)} */}
            </span>
            {/* <span>{reservationInfo?.totalPrice && (parseFloat(reservationInfo?.totalPrice?.toFixed(2)) + 100).toFixed(2)}</span> */}
          </p>
          {reservationDepositAmount > 0 && (
            <>
              <p className="md:col-span-10 col-span-8 flex justify-end items-center m-0 font-semibold">Hold Amount</p>
              <p className="md:col-span-2 col-span-4 flex justify-end items-center m-0 font-semibold">
                <span>
                  {'$'}
                  {reservationDepositAmount?.toFixed(2)}
                </span>
              </p>
            </>
          )}
        </div>
      )}
      {/* voucher application section  */}
      {/* <div className='mt-6 flex justify-end items-end'>
        {
          voucherDivShow &&
          <div className='w-full flex gap-6'>
            <TextField className='w-3/4' label="Voucher Code" variant="standard" />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="normal-case text-md w-1/3 h-10 mt-2"
            // onClick={handleDoubleConfirmation}
            // onClick={handleCheckout}
            // disabled={Object.values(guestVerificationFlags).some((value) => value === false || !isAgreed)}
            >
              Apply
            </Button>
          </div>
        }
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={`normal-case text-md w-1/4 h-10 ${voucherDivShow ? 'hidden' : ''}`}
          onClick={() => setVoucherDivShow(true)}
        // onClick={handleCheckout}
        // disabled={Object.values(guestVerificationFlags).some((value) => value === false || !isAgreed)}
        >
          Apply Voucher
        </Button>
      </div> */}
    </div>
  );
};

export default BillingDetails;
