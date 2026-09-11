'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { usePhoneUpdate } from '@/hooks/guest-verification/usePhoneUpdate';
import { usePhoneVerificationSave } from '@/hooks/guest-verification/usePhoneVerificationSave';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import { BeatLoader } from 'react-spinners';

const PhoneOTPVerify = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  // const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  // const [isVerifying, setIsVerifying] = useState<boolean>(false);
  // const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const { closeModal } = useModalContext();
  const { customMessage } = useSearchContext();
  const { mutateAsync: savePhoneNumber } = usePhoneVerificationSave();
  const { mutateAsync, isError, isSuccess, isLoading, reset } = usePhoneUpdate();
  const { userCred, userProfileInfo } = useUserCredContext();
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      // setIsResendDisabled(false);
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  // const handleOtpChange = async (index: number, value: string) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = value;
  //   setOtp(newOtp);

  //   if (index < 4 && value !== '') {
  //     const nextIndex = index + 1;
  //     document.getElementById(`otp-input-${nextIndex}`)?.focus();
  //   }

  //   if (index === 4 && value !== '') {
  //     setIsVerifying(true);
  //     const fullOtp = newOtp.join('');
  //     try {
  //       const response = await mutateAsync({ userId: userCred?.userId, email: userCred?.email, otp: parseInt(fullOtp) });
  //       console.log(response);
  //       // setVerificationResult(response);
  //     } catch (error) {
  //       console.error('Verification failed:', error);
  //       setVerificationResult('error');
  //     } finally {
  //       setIsVerifying(false);
  //     }
  //   }
  // };
  const callVerifyApi = async (otpValue: any) => {
    try {
      const response = await mutateAsync({
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
  // const handleOtpChange = async (value: string) => {
  //   setOtp(value.split(''));
  //   if (value.length === 5) {
  //     try {
  //       const response = await mutateAsync({ userId: userCred?.userId, email: userCred?.email, otp: parseInt(value) });
  //       console.log(response);
  //     } catch (error) {
  //       console.error('Verification failed:', error);
  //     }
  //   }
  // };
  // const handleVerifyClick = async () => {
  //   const fullOtp = otp.join('');
  //   try {
  //     const response = await mutateAsync({ userId: userCred?.userId, email: userCred?.email, otp: parseInt(fullOtp) });
  //     console.log(response);
  //   } catch (error) {
  //     console.error('Verification failed:', error);
  //   }
  // };
  const handleResendClick = async () => {
    if (userCred?.userId && userProfileInfo?.verificationInfo?.phone) {
      try {
        const response = await savePhoneNumber({
          userId: userCred?.userId,
          phoneNumberInfo: userProfileInfo?.verificationInfo?.phone,
        });
      } catch (error: any) {
        console.error('Phone verification failed:', error);
      }
    }
    // setIsResendDisabled(true);
    setTimer(60);
  };
  const handleClearClick = () => {
    setOtp(['', '', '', '', '']);
    reset();
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg md:text-xl font-bold mb-4">Verify OTP</h2>
      {customMessage && <span className="text-sm mb-2">{customMessage}</span>}
      {/* <div className="flex items-center justify-between mb-4">
        {otp.map((digit, index) => (
          <React.Fragment key={index}>
            <TextField
              id={`otp-input-${index}`}
              type="text"
              size="small"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              style={{ borderColor: '#800080' }}
            />
          </React.Fragment>
        ))}
      </div> */}
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
        {timer > 0 ? `Resend OTP in ${timer} seconds` : "Didn't get the OTP? "}
        {timer <= 0 && (
          <span className="font-bold text-success underline cursor-pointer" onClick={handleResendClick}>
            Resend the OTP
          </span>
        )}
      </p>
    </div>
  );
};

export default PhoneOTPVerify;
