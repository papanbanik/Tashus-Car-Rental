import ConfirmationCheck from '@/components/Common/ConfirmationCheck';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useCheckVoucherValidation } from '@/hooks/reservation/voucher/useCheckVoucherValidation';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { VoucherCheckoutProps } from '@/types/checkout/checkoutTypes';
import { additionalDataProcessingForVoucher } from '@/utils/Functions/checkout/voucherCommonFn';
import { getReservationRentFee } from '@/utils/Functions/payment/reservationPayment';
import { calculateAndSetCoverageAmount } from '@/utils/Functions/travel-edit/travelEditFn';
import { Button, Divider } from '@mui/material';
import Image from 'next/image';
import { useEffect } from 'react';
import VoucherCreditBilling from './VoucherCreditBilling';
import VoucherCreditInput from './VoucherCreditInput';

const VoucherCheckout = ({
  applyBtnShow,
  setApplyBtnShow,
  guestCoveragePackage,
  gstData,
  payable,
  creditVoucherToggle,
  setCreditVoucherToggle,
  depositMessage,
  discountAdditionalData,
  setPaymentMethod,
  voucherInput,
  setVoucherInput,
}: VoucherCheckoutProps) => {
  const isIPadPro = useIPadProQuery();
  const { appliedVoucherInfo, setAppliedVoucherInfo, reservationInfo, setGuestCoveragePackage } = useSearchContext();
  const { carData } = useCarListingContext();
  const { userCred } = useUserCredContext();
  const { openModal, closeModal } = useModalContext();
  const { mutateAsync: validateVoucher, isLoading: voucherLoading, error, reset: resetAPICall } = useCheckVoucherValidation();

  const { isVoucherValid, responseMessage, discountAmount = 0 } = appliedVoucherInfo ?? {};

  const guestEmail = userCred?.email ?? '';
  // reset when there is no voucherInput
  useEffect(() => {
    if (!voucherInput) {
      handleRemoveVoucherContents();
    }
  }, [voucherInput, payable]);

  //handle voucher
  const checkVoucherValidity = async () => {
    // When voucher is applied rent fee is only the duration price
    const updatedCoverageAmount = calculateAndSetCoverageAmount(reservationInfo?.durationPrice ?? 0, guestCoveragePackage) ?? 0;
    const rentalFeeWithCoverage = (reservationInfo?.durationPrice ?? 0) + updatedCoverageAmount;
    const additionalData = await additionalDataProcessingForVoucher(carData?.listingId, guestEmail, discountAdditionalData);

    if (!!userCred?.userId && !!voucherInput) {
      try {
        await validateVoucher({
          voucherCode: voucherInput,
          userId: userCred?.userId,
          totalAmount: rentalFeeWithCoverage,
          additionalData,
        });
        setGuestCoveragePackage((prev) => ({ ...prev, coverageAmount: updatedCoverageAmount }));
        closeModal();
      } catch (error) {
        console.error('Error validating voucher:', error);
        closeModal();
      }
    }
  };

  const handleApplyVoucherConfirmation = async () => {
    openModal({
      content: (
        <ConfirmationCheck
          title="Are you sure to apply the voucher?"
          subTitle="Once the voucher is applied, other discounts will not be applicable."
          agreeButtonText="Yes"
          disagreeButtonText="No"
          agreeButtonAction={checkVoucherValidity}
          disagreeButtonAction={closeModal}
        ></ConfirmationCheck>
      ),
    });
  };

  const handleRemoveVoucherConfirmation = async () => {
    // When voucher is removed rent fee includes all other discounts
    openModal({
      content: (
        <ConfirmationCheck
          title="Are you sure to remove the voucher discount?"
          subTitle="Once the voucher discount is removed, other discounts will be applied again if applicable."
          agreeButtonText="Yes"
          disagreeButtonText="No"
          agreeButtonAction={handleRemoveVoucher}
          disagreeButtonAction={closeModal}
        ></ConfirmationCheck>
      ),
    });
  };

  const handleRemoveVoucher = () => {
    setVoucherInput('');
    closeModal();
  };

  const handleCreditToggle = () => {
    handleRemoveVoucherContents();
    setVoucherInput('');
    setCreditVoucherToggle('credit');
  };

  const handleRemoveVoucherContents = () => {
    setApplyBtnShow(false);
    setAppliedVoucherInfo(null);
    // handleCoverageUpdateWithVoucher(reservationInfo?.totalPrice ?? 0);
    resetAPICall();
    const voucherInput = document.getElementById('validity-check') as HTMLInputElement | null;
    if (voucherInput) {
      voucherInput.value = '';
    }
  };

  // const handleCoverageUpdateWithVoucher = async (reservationFee: number) => {
  //   const updatedCoverageAmount = calculateAndSetCoverageAmount(reservationFee, guestCoveragePackage) ?? 0;
  //   setGuestCoveragePackage((prev) => ({ ...prev, coverageAmount: updatedCoverageAmount }));
  // };

  const rentFee = getReservationRentFee(isVoucherValid ?? false, reservationInfo?.durationPrice ?? 0, reservationInfo?.totalPrice ?? 0);

  const voucherValidationMessage = responseMessage || error?.response?.data?.message || '';

  return (
    <>
      <div className="flex justify-end my-4">
        <Button onClick={handleCreditToggle} size="small" className="w-28 h-5 flex justify-end items-start p-0">
          <div>
            <Image alt="DollarSign" src="/Images/Dollar.png" width={18} height={18}></Image>
          </div>
          <div className="text-sm">Use Credit</div>
        </Button>
      </div>

      <VoucherCreditInput
        imageAlt="VoucherSign"
        imageSrc="/Images/Voucher.png"
        label="Voucher Code"
        title="Tashus Voucher:"
        inputId="validity-check"
        inputName="validity-check"
        inputType="text"
        onChange={(e) => {
          if (!applyBtnShow) {
            setApplyBtnShow(true);
          }
          setVoucherInput(e.target.value);
        }}
      />

      {applyBtnShow && (
        <div className="flex justify-between items-center mt-2">
          <p className={`${isVoucherValid ? 'text-success' : 'text-error'} m-0 text-xs`}>{voucherValidationMessage}</p>
          <div className="flex gap-1">
            {isVoucherValid && (
              <Button
                onClick={handleRemoveVoucherConfirmation}
                className="h-5 m-0 text-white"
                size="small"
                variant="contained"
                color="error"
                disabled={voucherLoading}
              >
                Remove
              </Button>
            )}
            <Button onClick={handleApplyVoucherConfirmation} className="h-5 m-0" size="small" variant="contained" disabled={voucherLoading}>
              {voucherLoading ? 'Applying...' : 'Apply'}
            </Button>
          </div>
        </div>
      )}

      <Divider className="col-span-12 my-2 bg-black" />

      <VoucherCreditBilling
        payable={payable}
        isVoucherValid={isVoucherValid}
        rentFee={rentFee}
        showDeductedAmount={Boolean(isVoucherValid && discountAmount > 0)}
        deductedAmount={discountAmount}
        deductedAmountText="Voucher Discount"
      ></VoucherCreditBilling>
    </>
  );
};

export default VoucherCheckout;
