import ContactOTPModal from '@/components/Verification/VerificationSteps/Profile/ContactVerify/ContactOTPModal';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetPhoneVerification } from '@/hooks/guest-verification/useGetPhoneVerification';
import { usePhoneVerificationSave } from '@/hooks/guest-verification/usePhoneVerificationSave';
import { TPhoneVerification } from '@/types/checkout/guestVerificationTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import { calculateOTPRemainingTime, maxOtpAttempts } from '@/utils/Functions/verification/verificationFn';
import { Alert, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdCloseCircle } from 'react-icons/io';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const PhoneNumber = () => {
  useGetPhoneVerification();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { watch, formState, setValue } = useForm<TPhoneVerification>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { openModal } = useModalContext();
  const { userCred, userProfileInfo } = useUserCredContext();
  const { partnerAccess, guestAccess, timeInterval, otpVerifyAttempt, phoneVerificationDetails, setTimeInterval } = useProfileInfoContext();
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

  const handleSavePhoneData = async () => {
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
          setIsEdit(false);
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

  //Set Phone Number
  useEffect(() => {
    const getContactNumber = async () => {
      if (userProfileInfo?.verificationInfo?.phone) {
        setValue('code', userProfileInfo?.verificationInfo?.phone?.code);
        setValue('number', userProfileInfo?.verificationInfo?.phone?.number);
        setValue('country', userProfileInfo?.verificationInfo?.phone?.country);
        setValue('shortCode', userProfileInfo?.verificationInfo?.phone?.shortCode);
      }
    };
    getContactNumber();
  }, [userProfileInfo?.verificationInfo]);
  //Matching One
  const isPhoneNumberMatch = () => {
    if (!!userProfileInfo?.verificationInfo?.phone && watch('shortCode') === userProfileInfo?.verificationInfo?.phone?.shortCode) {
      const countryDialCode = watch('code') ?? '';
      const phoneNumber = watch('number');
      const matchNumber = phoneNumber?.replace(countryDialCode, '') || '';
      const userProfilePhoneNumber = userProfileInfo?.verificationInfo?.phone?.number;
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
  //add to calculate remaining expiration minutes
  const remainingMinutes = !!phoneVerificationDetails?.lastOtpRequest
    ? Math.ceil(dayjs(phoneVerificationDetails?.lastOtpRequest).add(10, 'minute').diff(dayjs(), 'minute', true))
    : 0;
  //Disabled Button
  const isRestrictRSuspend =
    isPartnerRestrict(partnerAccess) || isPartnerSuspended(partnerAccess) || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess);
  const isButtonDisabled =
    watch('number') === watch('code') ||
    (watch('number')?.length || 0) < 6 ||
    isLoading ||
    isRestrictRSuspend ||
    (!isPhoneNumberMatch() && otpVerifyAttempt >= maxOtpAttempts && remainingMinutes > 0);
  return (
    <div className="my-6">
      <div className="flex justify-between items-center">
        <span className="text-md font-semibold my-2">Phone Number</span>
        <div className="text-md font-semibold underline normal-case text-success cursor-pointer" onClick={() => setIsEdit(!isEdit)}>
          Edit
        </div>
      </div>
      <div className={`flex flex-col p-4 border border-solid border-accent rounded-lg`}>
        <div className="w-full flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <PhoneInput
                country={'au'}
                autoFormat={false}
                enableSearch={true}
                value={
                  userProfileInfo?.verificationInfo?.phone?.code &&
                  `+${userProfileInfo?.verificationInfo?.phone?.code || watch('code')}${
                    userProfileInfo?.verificationInfo?.phone?.number || watch('number')
                  }`
                }
                specialLabel=""
                countryCodeEditable={false}
                disabled={!isEdit}
                onChange={handlePhoneInputChange}
                inputStyle={{ backgroundColor: !isEdit ? '#f0f0f0' : '', color: !isEdit ? '#a0a0a0' : '' }}
              />
              {phoneInputError && <span className="text-error">{phoneInputError}</span>}
            </div>
            {userProfileInfo?.verificationInfo?.phone?.isVerified ? (
              <span className="flex items-center gap-2 text-success">
                <RiVerifiedBadgeFill />
                {'Verified'}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-error">
                <IoMdCloseCircle />
                Not Verified
              </span>
            )}
          </div>
          <div>
            {isEdit && (
              <Button variant="contained" color="primary" className="text-md normal-case" disabled={isButtonDisabled} onClick={handleSavePhoneData}>
                {isLoading ? 'Updating' : 'Update'}
              </Button>
            )}
          </div>
        </div>
        {!isPhoneNumberMatch() && otpVerifyAttempt >= maxOtpAttempts && remainingMinutes > 0 && isEdit && (
          <Alert severity="info" className="mt-2">
            {`You have reached the maximum limit. Please wait ${remainingMinutes} ${getSingularPluralNoun(
              'minute',
              remainingMinutes
            )} for your next attempt.`}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default PhoneNumber;
