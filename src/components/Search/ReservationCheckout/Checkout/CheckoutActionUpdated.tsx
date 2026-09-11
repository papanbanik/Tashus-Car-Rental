import CommonCheckbox from '@/components/Common/CommonCheckbox';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useCreateReservation } from '@/hooks/reservation/useCreateReservation';
import { useCustomHoldAmount } from '@/hooks/reservation/useCustomHoldAmount';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { CheckoutActionProps } from '@/types/checkout/checkoutTypes';
import { TGuestInsurance } from '@/types/checkout/guestVerificationTypes';
import { TDeliveryDetails } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import {
  buildCreateReservationPayload,
  getCreateReservationPayableAmount,
  getCreateReservationPaymentMethod,
  getCreateReservationTotalPriceTotalPrice,
  getGSTAmount,
} from '@/utils/Functions/payment/reservationPayment';
import { ECommonValue, toNumber } from '@/utils/Functions/randomCommonFn';
import { initialHoldAmountMessage } from '@/utils/Functions/searchCommonFn';
import { getVerificationFlags } from '@/utils/Functions/verification/verificationFn';
import { guestInsuranceList, updateExcessFees } from '@/utils/Lists/insuranceInfo';
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationCheck from '../../../Common/ConfirmationCheck';
import CheckoutLgMd from '../CheckoutComponents/CheckoutResponsiveness/CheckoutLgMd';
import CheckoutSmIPad from '../CheckoutComponents/CheckoutResponsiveness/CheckoutSmIPad';
import CreditCheckout from '../CheckoutComponents/CreditCheckout';
import VoucherCheckout from '../CheckoutComponents/VoucherCheckout';
import { useCreditSufficiency } from './HoldCoveredCredit';
// import { useGetCompletedReservations } from '@/hooks/reservation/useGetCompletedReservations';

const CheckoutActionUpdated = ({
  discount,
  setDiscount,
  totalAmountAfterDiscount,
  setTotalAmountAfterDiscount,
  creditVoucherToggle,
  setCreditVoucherToggle,
  discountAdditionalData,
}: CheckoutActionProps) => {
  //Responsiveness
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const isIPadPro = useIPadProQuery();
  //APIs call
  useCustomHoldAmount();
  const { mutateAsync, isLoading, isSuccess } = useCreateReservation();
  //Context call
  const {
    reservationInfo,
    guestCoveragePackage,
    setTotalPrice,
    totalPrice,
    guestCoverageType,
    setGuestCoverageType,
    additionalDrivers,
    setGstData,
    gstData,
    reservationDepositAmount,
    setReservationDepositAmount,
    setPaymentMethod,
    deliveryDetails,
    appliedVoucherInfo,
    appliedCreditInfo,
    setAppliedCreditInfo,
    setAppliedVoucherInfo,
    setReservationInfo,
    setGuestCoveragePackage,
    setDeliveryDetails,
    holdWithCredit,
  } = useSearchContext();
  const { userCred, userProfileInfo, customizedHoldAmount, isDepositSetByAdmin } = useUserCredContext();
  const { isInsufficientCredit, holdCreditAmount } = useCreditSufficiency();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { carData } = useCarListingContext();
  const { openModal, closeModal } = useModalContext();
  const checkCreditSufficiency = holdWithCredit ? isInsufficientCredit : false;
  //State Call
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [depositMessage, setDepositMessage] = useState<JSX.Element | null>(null);
  const [applyBtnShow, setApplyBtnShow] = useState<boolean>(false);
  const [validCredit, setValidCredit] = useState<boolean>(false);
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [creditInputString, setCreditInputString] = useState<string>('');

  const payable = getCreateReservationPayableAmount(
    appliedVoucherInfo,
    appliedCreditInfo,
    reservationInfo,
    guestCoveragePackage,
    gstData?.gstAmount || 0
  );
  const finalPaymentMethod = getCreateReservationPaymentMethod(
    payable,
    appliedVoucherInfo,
    appliedCreditInfo,
    userProfileInfo?.isDepositApplicable || false
  );
  const payConfirmationText = payable > 0 ? ' To confirm your reservation, please make the payment within the next 30 minutes.' : '';

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      setAppliedCreditInfo(null);
      setAppliedVoucherInfo(null);
      setReservationInfo(null);
      setGuestCoveragePackage({} as TGuestInsurance);
      setTotalPrice(0);
      setReservationDepositAmount(0);
      setDeliveryDetails({} as TDeliveryDetails);
    };
  }, []);

  useEffect(() => {
    if (voucherInput) setVoucherInput('');
  }, [guestCoverageType]);

  useEffect(() => {
    const gstAmount = getGSTAmount(appliedVoucherInfo, reservationInfo, guestCoveragePackage);
    setGstData({ gstAmount });
  }, [appliedVoucherInfo, reservationInfo, guestCoveragePackage]);

  //set deposit amount
  useEffect(() => {
    if (
      (userProfileInfo?.guestTotalTrips < 1 || userProfileInfo?.isDepositApplicable) && // change 3 times to 1 time deposit enforcement
      guestCoveragePackage?.guestCoverageType &&
      !userProfileInfo?.isDepositWaived
    ) {
      // const tempDepositAmount = guestCoveragePackage?.excessFee || 500;
      // setReservationDepositAmount(tempDepositAmount);
      //Custom Hold Amount
      const updatedGuestInsuranceList = updateExcessFees(guestInsuranceList, customizedHoldAmount);
      const customizeCoverage = updatedGuestInsuranceList?.find((insurance) => insurance.id === guestCoverageType);
      const tempDepositAmount = customizeCoverage?.excessFee;
      const fixedDeposit = !!userProfileInfo?.customFixedDeposit ? userProfileInfo?.customFixedDeposit : ECommonValue.HoldDepositAmount;
      // setReservationDepositAmount(toNumber(tempDepositAmount));
      setReservationDepositAmount(toNumber(fixedDeposit));
    }
  }, [userProfileInfo?.guestTotalTrips, guestCoveragePackage, userProfileInfo?.isDepositApplicable, customizedHoldAmount]);

  //set deposit message
  useEffect(() => {
    const fetchReservationMessage = async () => {
      const message = await initialHoldAmountMessage(reservationDepositAmount ?? 0, isDepositSetByAdmin);
      setDepositMessage(message);
    };
    fetchReservationMessage();
  }, [reservationDepositAmount, guestCoverageType]);

  useEffect(() => {
    if (reservationInfo) {
      const tempTotalPrice = getCreateReservationTotalPriceTotalPrice(
        payable,
        appliedVoucherInfo?.discountAmount || 0,
        appliedCreditInfo?.deductedCreditAmount || 0
      );
      setTotalPrice(tempTotalPrice);
    }
  }, [payable]);

  //Add checkout
  const handleCheckout = async () => {
    setIsButtonLoading(true);
    try {
      if (!reservationInfo) {
        openSnackBar({ message: 'Something went wrong!', severity: 'error' });
        return;
      }
      const reservationData = await buildCreateReservationPayload({
        reservationInfo,
        userProfileInfo,
        reservationDepositAmount,
        guestCoveragePackage,
        customizedHoldAmount,
        carData,
        userId: userCred?.userId || '',
        gstAmount: gstData?.gstAmount || 0,
        deliveryDetails,
        payable,
        paymentMethod: finalPaymentMethod,
        additionalDrivers,
        appliedVoucherInfo,
        appliedCreditInfo,
        totalPrice,
        isDepositCoveredByCredit: holdWithCredit,
        holdCreditAmount: holdWithCredit ? holdCreditAmount : 0,
      });
      // console.log('reservationData');
      // console.log(reservationData);
      await mutateAsync(reservationData);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsButtonLoading(false);
      closeModal();
    }
  };

  //handle default coverage
  const handleDefaultCoverage = () => {
    setGuestCoverageType(guestInsuranceList[0]?.id);
    closeModal();
  };

  const { openSnackBar } = useSnackBarContext();
  const [totalAmountError, setTotalAmountError] = useState<boolean>(false);

  useEffect(() => {
    // !Previous comparison was with 1, changed to 0 to resolve confirm button not enabling issue
    if (payable >= 0) {
      setTotalAmountError(false);
    }
  }, [payable]);

  //handle double confirmation
  const handleDoubleConfirmation = () => {
    // localStorage.setItem('checkoutFlag', JSON.stringify(flag));
    if (payable > 0 && payable < 1) {
      setTotalAmountError(true);
      openSnackBar({
        message: 'Total amount should not be less then $1.00',
        severity: 'error',
      });
      return;
    }
    setTotalAmountError(false);
    const disableAgreeButton = isLoading || isButtonLoading || isSuccess;
    openModal({
      content:
        guestCoveragePackage?.guestCoverageType !== 'no-coverage' ? (
          <ConfirmationCheck
            title="Are you sure to confirm reservation?"
            subTitle={payable > 0 ? 'To confirm your reservation, please make the payment within the next 30 minutes' : ''}
            agreeButtonText="Yes"
            disagreeButtonText="No"
            agreeButtonAction={handleCheckout}
            disagreeButtonAction={closeModal}
            disableAgreeButton={disableAgreeButton}
            isDisableOnAgreeClick={true}
          ></ConfirmationCheck>
        ) : (
          <ConfirmationCheck
            title="Declining Coverage?"
            subTitle={`By declining vehicle coverage, you acknowledge and accept full responsibility for any damages or incidents that may occur during the reservation period. Tashus strongly recommends opting for coverage to safeguard against unforeseen circumstances and potential financial liabilities. Please be aware that any expenses and liabilities related to damages or loss incurred to the vehicle will be your sole responsibility.${payConfirmationText} Safe travels!`}
            agreeButtonText="Decline and Confirm"
            disagreeButtonText="Change Coverage"
            agreeButtonAction={handleCheckout}
            disableAgreeButton={disableAgreeButton}
            disagreeButtonAction={handleDefaultCoverage}
            isDisableOnAgreeClick={true}
          ></ConfirmationCheck>
        ),
    });
  };

  //const common props
  const commonProps = {
    applyBtnShow,
    setApplyBtnShow,
    discount,
    setDiscount,
    totalAmountAfterDiscount,
    setTotalAmountAfterDiscount,
    creditVoucherToggle,
    setCreditVoucherToggle,
    discountAdditionalData,
    setPaymentMethod,
    guestCoveragePackage,
    gstData,
    payable,
  };

  const verificationFlags = getVerificationFlags(userProfileVerificationInfo);
  const disabledForVerification =
    Object.values(verificationFlags).some((value) => value === false) ||
    userProfileVerificationInfo?.guestVerification?.finalVerificationStatus !== 'approved';
  //checkout responsiveness
  const confirmButtonDisabled =
    disabledForVerification || !isAgreed || isLoading || totalAmountError || isButtonLoading || checkCreditSufficiency || isSuccess;

  const commonCheckoutProps = {
    payable,
    isAgreed,
    setIsAgreed,
    handleCheckout: handleDoubleConfirmation,
    isLoading,
    depositMessage,
    totalAmountError,
    confirmButtonDisabled,
  };
  return (
    <div>
      <div className={`flex flex-col`}>
        {creditVoucherToggle === 'credit' ? (
          <CreditCheckout
            {...commonProps}
            validCredit={validCredit}
            setValidCredit={setValidCredit}
            creditInputString={creditInputString}
            setCreditInputString={setCreditInputString}
          />
        ) : (
          <VoucherCheckout
            {...commonProps}
            voucherInput={voucherInput}
            setVoucherInput={setVoucherInput}
            depositMessage={depositMessage as JSX.Element}
          />
        )}
        {!!isMedium && !isIPadPro && (
          <CommonCheckbox
            isChecked={isAgreed}
            onChange={(checked) => setIsAgreed(checked)}
            className={`flex justify-center items-center ${isIPadPro ? '' : 'lg:mt-6'} text-primary`}
            label="Accept Rental Agreements"
            labelLink={`${process.env.NEXT_PUBLIC_DOMAIN}/legals/rental-agreement`}
            tooltipText="Please tick the checkbox to agree to the rental agreement."
          />
        )}
      </div>

      {!!isMedium && !isIPadPro && <CheckoutLgMd {...commonCheckoutProps} />}

      {(!isMedium || isIPadPro) && reservationInfo?.totalPrice && <CheckoutSmIPad {...commonCheckoutProps} />}
    </div>
  );
};

export default CheckoutActionUpdated;
