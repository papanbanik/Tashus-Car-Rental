'use client';
import { useModalContext } from '@/context/ModalProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SignUp from '../SignUp/SignUp';
import { useResetPass } from './hooks/useResetPassword';

interface ResetPasswordProps {
  email: string;
  otp: number;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email, otp }) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const { openModal } = useModalContext();
  const { mutateAsync: resetPassword, error, isError } = useResetPass();
  const { openSnackBar } = useSnackBarContext();
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/;
    if (!passwordPattern.test(newPassword)) {
      setPasswordError('Password must include symbol, uppercase, lowercase, and number');
    } else {
      setPasswordError('');
    }
  };
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/;
    if (!passwordPattern.test(confirmPassword)) {
      setConfirmPasswordError('Password must include symbol, uppercase, lowercase, and number');
      return false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };
  const handleResetPassword = async () => {
    if (!passwordError && !confirmPasswordError && typeof window !== 'undefined') {
      try {
        await resetPassword({ email, otp, newPassword });
        openSnackBar({
          message: 'Password Reset Successfully',
          severity: 'success',
          hideDuration: 3000,
        });
        openModal({
          title: 'Login or Sign Up',
          content: (
            <div className="md:mx-4 md:my-2">
              <SignUp></SignUp>
            </div>
          ),
        });
      } catch (error: any) {
        openSnackBar({
          message: error?.response?.data?.message || error?.message || 'Error Reset Password',
          severity: 'error',
          hideDuration: 5000,
        });
      }
    }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <div>
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
        className="my-2"
      />
      <FormControl fullWidth variant="outlined" className="my-2">
        <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </IconButton>
            </InputAdornment>
          }
          label="New Password"
          onChange={handleNewPasswordChange}
          error={Boolean(passwordError)}
        />
        {passwordError && <span className="text-error text-sm">{passwordError}</span>}
      </FormControl>
      <FormControl fullWidth variant="outlined" className="my-2">
        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showConfirmPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </IconButton>
            </InputAdornment>
          }
          label="Confirm Password"
          onChange={handleConfirmPasswordChange}
          error={Boolean(confirmPasswordError)}
        />
        {confirmPasswordError && <span className="text-error text-sm">{confirmPasswordError}</span>}
      </FormControl>
      <Button
        disabled={!newPassword || !confirmPassword || Boolean(passwordError || confirmPasswordError)}
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handleResetPassword}
        className="my-2 normal-case"
      >
        Reset
      </Button>
      {/* <CommonSnackBar
        open={!!alertMessage}
        message={alertMessage || ''}
        severity={alertMessage === 'Password has been Reset' ? 'success' : 'error'}
        onClose={handleCloseAlert}
      /> */}
    </div>
  );
};

export default ResetPassword;
