'use client';
import CommonSnackBar from '@/components/Common/CommonSnackBar';
import { useResendOTP } from '@/components/ForgotPassword/hooks/useResendOTP';
import { useUserCredContext } from '@/context/UserCredProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const OTPVerify = ({ register, control, watch, formState, setValue, reset, getValues, trigger, setError, clearErrors }: HookFormComponentProps) => {
  const { errors } = formState;
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const {
    userCred: { email },
  } = useUserCredContext();
  const { mutateAsync: resendOTP } = useResendOTP();
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendDisabled) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timer as NodeJS.Timeout);
            setResendDisabled(false);
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [resendDisabled]);
  const handleResend = async () => {
    try {
      const response = await resendOTP({ email });
      setAlertMessage('Resend OTP Successful');
      // enableResendButton();
      setResendDisabled(true);
      setRemainingTime(60);
    } catch (error) {
      setAlertMessage('Error Occurred');
    }
  };
  const handleCloseAlert = () => {
    setAlertMessage(null);
  };
  return (
    <div>
      <div className="mt-8 ">
        {/* <div className="grid md:grid-cols-2 mt-8 "> */}
        {/* <div>
          <Typography className="text-base mb-2 md:mb-0">Input OTP</Typography>
        </div> */}
        <div className="lg:w-2/3 flex flex-col">
          <TextField
            label="OTP"
            variant="outlined"
            className=" w-full"
            size="small"
            {...register('otp', {
              required: true,
              pattern: {
                value: /^\d{5}$/,
                message: 'OTP should be 5 digits of numbers',
              },
            })}
            error={!!errors?.otp}
            helperText={errors?.otp?.message}
          />
          <div className="flex justify-end items-end">
            <Button disabled={resendDisabled} color="primary" onClick={handleResend} className="normal-case font-bold">
              {resendDisabled ? `Resend OTP (${remainingTime})` : 'Resend OTP'}
            </Button>
          </div>
        </div>
      </div>
      {/* <span className="flex justify-end">
        <Button disabled={resendDisabled} color="primary" onClick={handleResend} className="normal-case font-bold">
          {resendDisabled ? `Resend OTP (${remainingTime})` : 'Resend OTP'}
        </Button>
      </span> */}
      <CommonSnackBar
        open={!!alertMessage}
        message={alertMessage || ''}
        severity={alertMessage === 'Resend OTP Successful' ? 'success' : 'error'}
        // severity={alertMessage === 'OTP sent successfully' ? 'success' : 'error'}
        onClose={handleCloseAlert}
      />
    </div>
  );
};

export default OTPVerify;
