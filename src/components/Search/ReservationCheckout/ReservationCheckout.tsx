'use client';

import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useProfileInfo } from '@/hooks/profile/useProfileInfo';
import { useEffect, useState } from 'react';
// import VerificationOptions from './Verification/VerificationOptions';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { usePublicVehicleDetails } from '@/hooks/car-search/usePublicVehicleDetails';
import { useGetVerificationInfo } from '@/hooks/profile/verification-steps/useGetVerificationInfo';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { getVerificationStatusInfo } from '@/utils/Functions/verification/verificationStepsFn';
import { useMediaQuery, useTheme } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import AdditionalDriver from './AdditionalDriver';
import BillingDetails from './BillingDetails';
import CheckoutBar from './Checkout/CheckoutBar';
import CheckoutInfoUpdated from './CheckoutInfoUpdated';
import CheckoutVerification from './CheckoutVerification';
import GuestInsurance from './GuestInsurance/GuestInsurance';
// import AdditionalDriver from './Verification/AdditionalDriver/AdditionalDriver';

export interface IDiscountAdditionalData {
  reservationInfo: any;
}

const ReservationCheckout = () => {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const isIPadPro = useIPadProQuery();
  const { vehicleId: carListingId } = useParams<{ vehicleId: string }>();
  // const params = useParams();
  const router = useRouter();
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<string>('');

  const { profileHookEnableKeys, setProfileHookEnableKeys, userCred } = useUserCredContext();
  const { setVerificationAlertMessage, setQueryEnableFlags, queryEnableFlags, setReservationInfo, reservationInfo, setDeliveryDetails, totalPrice } =
    useSearchContext();
  const { setListingId } = useCarListingContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { data: publicVehicleData } = usePublicVehicleDetails();
  const { data } = useProfileInfo();
  useGetVerificationInfo();
  const [discount, setDiscount] = useState<number | any>();
  const [totalAmountAfterDiscount, setTotalAmountAfterDiscount] = useState<number | any>(null);
  const [creditVoucherToggle, setCreditVoucherToggle] = useState('voucher');
  const [discountAdditionalData, setDiscountAdditionalData] = useState<IDiscountAdditionalData | any>({});

  useEffect(() => {
    if (userCred?.loggedIn && userCred?.userId) {
      setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: true });
    }
  }, [userCred?.userId]);

  useEffect(() => {
    const vehicleId = parseInt(carListingId);
    setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: true });
    setVerificationAlertMessage({});
    setListingId(carListingId);
    // setListingId('1110');
    setQueryEnableFlags({ ...queryEnableFlags, enableVehicleDetails: true });

    // Get the specific car's reservation data, if car not found in local host, redirect to not found
    const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
    if (tashus?.reservationList?.length > 0) {
      const reservedCarData = tashus?.reservationList?.find((car: any) => parseInt(car?.listingId) === vehicleId);
      // reservedCarData ? setReservationInfo(reservedCarData) : router.push('/not_found');
      reservedCarData ? (setReservationInfo(reservedCarData), setDeliveryDetails(reservedCarData?.deliveryDetails)) : router.push('/not_found');
    } else {
      // setReservationNotFound(true);
      router.push('/not_found');
    }
  }, []);

  useEffect(() => {
    const handleWindowFocus = () => {
      setIsWindowFocused(true);
    };

    const handleWindowBlur = () => {
      setIsWindowFocused(false);
      // setSetEnableFlag(false); // Set setEnableFlag to false when window loses focus
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      // Clean up the event listeners when the component unmounts
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  useEffect(() => {
    const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');

    if (
      isWindowFocused &&
      !userProfileVerificationInfo?.profileInfo?.verificationInfo?.email?.isVerified &&
      tashus?.accessToken &&
      tashus?.emailVerified
    ) {
      setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: true });
      const { emailVerified, ...others } = tashus;
      localStorage.setItem('tashus', JSON.stringify({ ...others }));
    }
  }, [isWindowFocused]);

  //for discount additional data
  useEffect(() => {
    if (reservationInfo) {
      discountAdditionalData.reservationInfo = reservationInfo;
    }
  }, [reservationInfo]);

  // const verificationFlags = getVerificationFlags(userProfileVerificationInfo);
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerificationInfo = userProfileVerificationInfo?.guestVerification;
  useEffect(() => {
    const { verificationStatus } = getVerificationStatusInfo(profileInfo, guestVerificationInfo);
    setVerificationStatus(verificationStatus);
  }, [profileInfo, guestVerificationInfo]);

  return (
    <div className="lg:px-40 md:px-20 px-4 mb-10 ">
      <div className={`grid ${isIPadPro ? 'grid-cols-1' : 'lg:grid-cols-5 lg:gap-24'} grid-cols-1 justify-center items-start pt-6`}>
        <div className={`${isIPadPro ? 'col-span-1' : 'lg:col-span-3'} col-span-1 `}>
          <CheckoutInfoUpdated reservationInfo={reservationInfo} totalPrice={totalPrice} />
          {verificationStatus !== 'approved' && <CheckoutVerification />}
          <GuestInsurance></GuestInsurance>
          {/* <VerificationOptions></VerificationOptions> */}
          {/* <VerificationSteps /> */}
          {/* <AdditionalDriver></AdditionalDriver> */}
          <AdditionalDriver />
          {/* TODO: Remove the following UI */}
          {/* <BillingDetails
            discount={discount}
            setDiscount={setDiscount}
            totalAmountAfterDiscount={totalAmountAfterDiscount}
            setTotalAmountAfterDiscount={setTotalAmountAfterDiscount}
            creditVoucherToggle={creditVoucherToggle}
            setCreditVoucherToggle={setCreditVoucherToggle}
          ></BillingDetails> */}
          {/* <div className=' h-[500px]'></div> */}
        </div>
        <div className={`${isIPadPro ? 'col-span-1' : 'lg:col-span-2'} col-span-1 block lg:sticky lg:top-[100px]`}>
          <CheckoutBar
            discount={discount}
            setDiscount={setDiscount}
            totalAmountAfterDiscount={totalAmountAfterDiscount}
            setTotalAmountAfterDiscount={setTotalAmountAfterDiscount}
            creditVoucherToggle={creditVoucherToggle}
            setCreditVoucherToggle={setCreditVoucherToggle}
            discountAdditionalData={discountAdditionalData}
          ></CheckoutBar>
        </div>
      </div>

      {/* {(!isMedium || isIPadPro) && (
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 35 }} className="bg-transparent shadow-none">
          <div className="bg-secondary mx-4 rounded-lg px-10 py-4 flex justify-between items-center">
            <p className="text-black font-semibold m-0">Total: </p>
            <p className="text-black font-semibold m-0">AUD ${totalAmountAfterDiscount ?? reservationInfo?.totalPrice}</p>
          </div>
        </AppBar>
      )} */}

      {/* <CommonSnackBar
        open={!!verificationAlertMessage?.message}
        autoHideDuration={verificationAlertMessage?.messageType === 'error' ? 8000 : 5000}
        message={`${verificationAlertMessage?.message}`}
        severity={verificationAlertMessage?.messageType}
      ></CommonSnackBar> */}
    </div>
  );
};

export default ReservationCheckout;
