import CommonForm from '@/components/Common/CommonForm';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetPhoneVerification } from '@/hooks/guest-verification/useGetPhoneVerification';
import { usePhoneVerificationSave } from '@/hooks/guest-verification/usePhoneVerificationSave';
import { TPhoneVerification } from '@/types/checkout/guestVerificationTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { ECommonText, getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import { calculateOTPRemainingTime, maxOtpAttempts } from '@/utils/Functions/verification/verificationFn';
import { Alert, Button, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import ContactOTPModal from './ContactVerify/ContactOTPModal';

const ProfileContactVerify = () => {
  useGetPhoneVerification();
  const { handleSubmit, watch, formState, setValue } = useForm<TPhoneVerification>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { openModal } = useModalContext();
  const { userCred } = useUserCredContext();
  const { partnerAccess, guestAccess, timeInterval, setTimeInterval, otpVerifyAttempt, phoneVerificationDetails, userProfileVerificationInfo } =
    useProfileInfoContext();
  const { mutateAsync: phoneOTPSend, isLoading } = usePhoneVerificationSave();
  const { errors } = formState;
  const phoneInputError = errors?.number?.message;

  const handlePhoneInputChange = (phoneNumber: string, country: any) => {
    if (watch('country') !== country?.name) {
      setValue('number', `+${phoneNumber}`);
      setValue('code', `+${country?.dialCode}`);
      setValue('country', country?.name);
      setValue('shortCode', country?.countryCode);
    } else {
      setValue('number', `+${phoneNumber}`);
      setValue('code', `+${country?.dialCode}`);
      setValue('country', country?.name);
      setValue('shortCode', country?.countryCode);
    }
  };
  // console.log('Time Interval', timeInterval);
  // console.log('OTP Request', otpVerifyAttempt);

  const savePhoneData: SubmitHandler<TPhoneVerification> = async (data) => {
    try {
      const phoneNumber = watch('number');
      const countryDialCode = watch('code') || '';
      const countryName = watch('country');
      const countryCode = watch('shortCode');
      const phoneData = {
        isVerified: false,
        number: phoneNumber?.replace(countryDialCode, ''),
        code: countryDialCode,
        country: countryName,
        shortCode: countryCode,
      };
      if (userCred?.userId && phoneNumber) {
        const fullPhoneNumber = `${countryDialCode}${phoneNumber.replace(countryDialCode, '')}`;
        if (timeInterval <= 0) {
          await phoneOTPSend({ userId: userCred?.userId, phoneNumberInfo: phoneData });
        }
        openModal({
          title: 'Phone Verification',
          content: <ContactOTPModal phoneNumber={fullPhoneNumber || ''} />,
        });
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  //Matching One
  const isPhoneNumberMatch = () => {
    if (
      !!userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone &&
      watch('shortCode') === userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.shortCode
    ) {
      const countryDialCode = watch('code') ?? '';
      const phoneNumber = watch('number');
      const matchNumber = phoneNumber?.replace(countryDialCode, '') || '';
      const userProfilePhoneNumber = userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.number;
      return matchNumber === userProfilePhoneNumber;
    }
    return false;
  };

  //set Time Interval
  useEffect(() => {
    if (!isPhoneNumberMatch()) {
      setTimeInterval(0);
      return;
    }
    if (!!phoneVerificationDetails?.otpRequests && !!phoneVerificationDetails?.lastOtpRequest && isPhoneNumberMatch()) {
      const timeInterval = calculateOTPRemainingTime(phoneVerificationDetails?.otpRequests, phoneVerificationDetails?.lastOtpRequest);
      setTimeInterval(timeInterval);
    }
  }, [otpVerifyAttempt, isPhoneNumberMatch(), phoneVerificationDetails?.lastOtpRequest]);
  //timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (timeInterval > 0) {
      timerId = setTimeout(() => {
        setTimeInterval((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timeInterval]);

  //Set Phone Number
  useEffect(() => {
    const getContactNumber = async () => {
      if (userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone) {
        setValue('code', userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.code);
        setValue('number', userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.number);
        setValue('country', userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.country);
        setValue('shortCode', userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.shortCode);
      }
    };
    getContactNumber();
  }, [userProfileVerificationInfo?.profileInfo?.verificationInfo]);
  //add to calculate remaining expiration minutes
  const remainingMinutes = !!phoneVerificationDetails?.lastOtpRequest
    ? Math.ceil(dayjs(phoneVerificationDetails?.lastOtpRequest).add(10, 'minute').diff(dayjs(), 'minute', true))
    : 0;
  //Disabled Button
  const isRestrictRSuspend =
    isPartnerRestrict(partnerAccess) || isPartnerSuspended(partnerAccess) || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess);

  const phoneNumber = watch('number');
  const countryDialCode = watch('code') || '';
  const localPhoneNumber = phoneNumber?.replace(countryDialCode, '');
  const disabledForPhoneNumber = localPhoneNumber === countryDialCode || (localPhoneNumber?.length || 0) < 6;

  const isButtonDisabled =
    disabledForPhoneNumber ||
    isLoading ||
    isRestrictRSuspend ||
    (!isPhoneNumberMatch() && otpVerifyAttempt >= maxOtpAttempts && remainingMinutes > 0);

  //Have Previous Number
  const havePreviousContact = userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.number !== '';
  return (
    <CommonForm handleFunction={handleSubmit(savePhoneData)}>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="w-full md:w-2/3 my-2 md:my-0">
          <PhoneInput
            country={'au'}
            autoFormat={false}
            // placeholder="Phone Number"
            enableSearch={true}
            // onlyCountries={['us', 'bd', 'au', 'ru', 'in', 'pk', 'my', 'de', 'pl', 'id', 'fr', 'ie']}
            // inputStyle={{ width: '100%', height: '40px' }}
            // value={
            //   `+${userProfileInfo?.verificationInfo?.phone?.code || 'country-code'}${userProfileInfo?.verificationInfo?.phone?.number}` ||
            //   watch('number')
            // }
            inputStyle={{ width: '100%' }}
            value={
              userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.code &&
              `+${userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.code || watch('code')}${
                userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.number || watch('number')
              }`
            }
            specialLabel=""
            countryCodeEditable={false}
            onChange={handlePhoneInputChange}
          />
          {phoneInputError && <span className="text-error">{phoneInputError}</span>}
        </div>
        {/* Conditionally Button Show */}
        {havePreviousContact ? (
          <>
            {isPhoneNumberMatch() && userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone?.isVerified ? (
              <span className="text-success">{`${isSmallScreen ? '(Verified)' : 'Verified'}`}</span>
            ) : (
              <div className="flex items-center">
                {isPhoneNumberMatch() ? (
                  <Button variant="text" type="submit" disabled={isButtonDisabled} className="normal-case underline">
                    {isLoading ? 'Verifying' : 'Verify'}
                    {ECommonText.RequiredSign}
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" type="submit" disabled={isButtonDisabled} className="normal-case">
                    {isLoading ? 'Updating' : 'Update'}
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center">
            <Button variant="contained" color="success" type="submit" disabled={isButtonDisabled} className="normal-case">
              {isLoading ? 'Saving' : 'Save'}
            </Button>
          </div>
        )}
      </div>
      {!isPhoneNumberMatch() && otpVerifyAttempt >= maxOtpAttempts && remainingMinutes > 0 && (
        <Alert severity="info">
          {`You have reached the maximum limit. Please wait ${remainingMinutes} ${getSingularPluralNoun(
            'minute',
            remainingMinutes
          )} for your next attempt.`}
        </Alert>
      )}
    </CommonForm>
  );
};

export default ProfileContactVerify;
