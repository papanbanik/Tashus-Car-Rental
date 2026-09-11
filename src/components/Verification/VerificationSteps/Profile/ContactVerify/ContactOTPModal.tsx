'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { usePhoneUpdate } from '@/hooks/guest-verification/usePhoneUpdate';
import { usePhoneVerificationSave } from '@/hooks/guest-verification/usePhoneVerificationSave';
import { ContactOTPModalProps } from '@/types/user-verification/verificationListingSteps';
import { formatTimer } from '@/utils/Functions/dateTimeCommonFn';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import { maxOtpAttempts } from '@/utils/Functions/verification/verificationFn';
import { Alert, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import OTPInput from 'react-otp-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { BeatLoader } from 'react-spinners';

const ContactOTPModal = ({ phoneNumber }: ContactOTPModalProps) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
  const { closeModal } = useModalContext();
  const { customMessage } = useSearchContext();
  const { mutateAsync: savePhoneNumber } = usePhoneVerificationSave();
  const { mutateAsync: verifyOTP, isError, isSuccess, isLoading, reset } = usePhoneUpdate();
  const { userCred } = useUserCredContext();
  const { timeInterval, otpVerifyAttempt, phoneVerificationDetails, userProfileVerificationInfo } = useProfileInfoContext();

  const callVerifyApi = async (otpValue: any) => {
    try {
      await verifyOTP({
        userId: userCred?.userId,
        email: userCred?.email,
        otp: parseInt(otpValue),
      });
      closeModal();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleOtpChange = async (value: any) => {
    setOtp(value.split(''));
    if (value.length === 5) {
      await callVerifyApi(value);
    }
  };

  const handleVerifyClick = async () => {
    const fullOtp = otp.join('');
    await callVerifyApi(fullOtp);
  };

  const handleResendClick = async () => {
    if (userCred?.userId && userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone) {
      try {
        if (timeInterval <= 0) {
          await savePhoneNumber({
            userId: userCred?.userId,
            phoneNumberInfo: userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone,
          });
        }
      } catch (error: any) {
        console.error('Phone verification failed:', error);
      }
    }
  };

  const handleClearClick = () => {
    setOtp(['', '', '', '', '']);
    reset();
  };
  const remainingMinutes = !!phoneVerificationDetails?.lastOtpRequest
    ? Math.ceil(dayjs(phoneVerificationDetails?.lastOtpRequest).add(10, 'minute').diff(dayjs(), 'minute', true))
    : 0;
  return (
    <>
      <div>
        <PhoneInput
          autoFormat={false}
          specialLabel=""
          //  placeholder="Phone Number" inputStyle={{ width: '100%', height: '40px' }}
          value={phoneNumber}
          disabled
          inputStyle={{ width: '100%', backgroundColor: '#f0f0f0', color: '#a0a0a0' }} //disabled style
        />
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-lg md:text-xl font-bold mb-4">Verify OTP</h2>
        {customMessage && <span className="text-sm mb-2">{customMessage}</span>}
        {timeInterval > 0 && remainingMinutes > 0 && otpVerifyAttempt >= maxOtpAttempts && (
          <Alert severity="info">
            {`You have reached the maximum limit. Please wait ${remainingMinutes} ${getSingularPluralNoun(
              'minute',
              remainingMinutes
            )} for your next attempt.`}
          </Alert>
        )}
        <div className="flex items-center justify-between">
          <OTPInput
            value={otp.join('')}
            onChange={(value) => handleOtpChange(value)}
            numInputs={5}
            renderSeparator={<span>-</span>}
            renderInput={(inputProps, index) => (
              <input {...inputProps} id={`otp-input-${index}`} type="text" className="w-10 h-10 border border-primary text-center m-1" />
            )}
          />
        </div>
        {isLoading && <BeatLoader color="#800080" size={10} className="my-2" />}
        {(isSuccess || isError) && (
          <p className={`text-sm my-2 ${isSuccess ? 'text-success' : 'text-error'}`}>
            {isSuccess ? 'Verification successful!' : 'Verification failed. Please try again.'}
          </p>
        )}
        <div className="flex my-4 gap-2">
          <Button className="text-white font-bold normal-case" variant="contained" color="error" onClick={handleClearClick}>
            Clear
          </Button>
          <Button
            className="text-white font-bold normal-case"
            variant="contained"
            color="success"
            onClick={handleVerifyClick}
            disabled={otp.some((digit) => digit === '') || otp.length !== 5 || isLoading}
          >
            Verify
          </Button>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          {timeInterval > 0 ? `Resend OTP in ${formatTimer(timeInterval)}` : "Didn't get the OTP? "}
          {timeInterval <= 0 && (
            <span className="font-bold text-success underline cursor-pointer" onClick={handleResendClick}>
              Resend the OTP
            </span>
          )}
        </p>
      </div>
    </>
  );
};

export default ContactOTPModal;
