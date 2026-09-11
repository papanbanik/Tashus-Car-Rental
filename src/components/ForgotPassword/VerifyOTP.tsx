'use client';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { Button, Container, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import ResetPassword from './ResetPassword';
import { useResendOTP } from './hooks/useResendOTP';
import { useVerifyOTP } from './hooks/useVerifyOTP';

interface VerifyOTPProps {
  email: string;
  onResetPassword: () => void;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ email, onResetPassword }) => {
  const [otp, setOtp] = useState<number>(0);
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);
  const [otpError, setOTPError] = useState<string>('');
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [showResendMessage, setShowResendMessage] = useState<boolean>(false);
  const { openSnackBar } = useSnackBarContext();
  const { mutateAsync: verifyOTP } = useVerifyOTP();
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
  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOTP = e.target.value;
    if (/^\d{0,5}$/.test(newOTP)) {
      setOtp(parseInt(newOTP, 10));
      if (newOTP.length === 5) {
        setOTPError('');
      } else {
        setOTPError('OTP should be 5 digits of numbers');
      }
    } else {
      setOtp(0);
      setOTPError('OTP can not be empty');
    }
  };

  const handleVerify = async () => {
    if (!otpError) {
      try {
        await verifyOTP({ email, otp });
        openSnackBar({
          message: 'Verification Successful',
          severity: 'success',
          hideDuration: 3000,
        });
        onResetPassword();
        setShowResetPassword(true);
      } catch (error: any) {
        openSnackBar({
          message: error?.response?.data?.message || error?.message || 'Invalid or Expired OTP',
          severity: 'error',
          hideDuration: 5000,
        });
      }
    }
  };
  const handleResend = async () => {
    try {
      await resendOTP({ email });
      openSnackBar({
        message: 'Resend OTP Successful',
        severity: 'success',
        hideDuration: 3000,
      });
      setResendDisabled(true);
      setRemainingTime(60);
      setShowResendMessage(true);
    } catch (error: any) {
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Error Occurred',
        severity: 'error',
        hideDuration: 5000,
      });
    }
  };
  return (
    <div>
      {showResetPassword ? (
        <ResetPassword email={email} otp={otp} />
      ) : (
        <>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            inputProps={{
              readOnly: true,
              required: true,
            }}
          />
          <TextField
            label="OTP"
            variant="outlined"
            fullWidth
            margin="normal"
            // value={otp.toString()}
            value={otp === 0 ? '' : otp.toString()}
            // onChange={(e) => setOtp(+e.target.value)}
            onChange={handleOTPChange}
            error={Boolean(otpError)}
            helperText={otpError}
          />
          <Button
            disabled={!otp || Boolean(otpError)}
            variant="contained"
            color="success"
            fullWidth
            size="large"
            onClick={handleVerify}
            className="my-2 normal-case"
          >
            Verify
          </Button>
          <Container className="flex justify-center items-center">
            {/* <Link onClick={handleResend} href="/forgot-password" className="no-underline text-primary my-2 text-xs">
              {resendDisabled ? 'Resend OTP (Disabled)' : 'Resend OTP'}
            </Link> */}
            <Button
              disabled={resendDisabled}
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleResend}
              className="border-none normal-case text-lg font-bold"
            >
              {resendDisabled ? `Resend OTP (${remainingTime})` : 'Resend OTP'}
            </Button>
          </Container>
          {showResendMessage && (
            <span className="text-black text-center">
              The OTP has been sent again. We would like you to check your email account.
              {/* <span className="text-primary font-bold">{email}</span> */}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyOTP;
