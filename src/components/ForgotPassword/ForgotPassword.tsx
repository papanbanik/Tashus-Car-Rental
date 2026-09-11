'use client';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import VerifyOTP from './VerifyOTP';
import { useForgotPassword } from './hooks/useForgotPassword';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [showVerifyOTP, setShowVerifyOTP] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string>('Forgot Password');
  const [emailError, setEmailError] = useState<string>('');
  const { openSnackBar } = useSnackBarContext();
  const { mutateAsync } = useForgotPassword();
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };
  const handleSendOTP = async () => {
    if (!emailError) {
      try {
        await mutateAsync({ email });
        openSnackBar({
          message: 'OTP sent successfully',
          severity: 'success',
          hideDuration: 3000,
        });
        setShowVerifyOTP(true);
        setPageTitle('Verify OTP');
      } catch (error: any) {
        openSnackBar({
          message: error?.response?.data?.message || error?.message || 'Invalid Email',
          severity: 'error',
          hideDuration: 5000,
        });
      }
    }
  };
  const handleResetPassword = () => {
    setPageTitle('Reset Password');
  };
  return (
    <div className="flex flex-col items-center my-4 p-6">
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-lg shadow-md shadow-secondary">
        {/* <h1 className="text-2xl font-bold mb-4">{showVerifyOTP ? 'Verify OTP' : 'Forgot Password'}</h1> */}
        <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
        {showVerifyOTP ? (
          <VerifyOTP email={email} onResetPassword={handleResetPassword} />
        ) : (
          <>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              // onChange={(e) => setEmail(e.target.value)}
              onChange={handleEmailChange}
              inputProps={{
                required: true,
              }}
              error={Boolean(emailError)}
              helperText={emailError}
            />
            <Button
              disabled={!email || Boolean(emailError)}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleSendOTP}
              className="my-2 normal-case"
            >
              Send OTP
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
