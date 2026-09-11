'use client';
import CommonForm from '@/components/Common/CommonForm';
import { useForgotPassword } from '@/components/ForgotPassword/hooks/useForgotPassword';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useUpdatePassword } from '@/hooks/profile/profile-info/account-security/useProfileResetPassword';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { AccountSecurityUpdateType } from '@/types/profileInfoTypes';
import { Button } from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import DeactivationNDeletion from './DeactivationNDeletion';
import OTPVerify from './OTPVerify';
import ResetPassword from './ResetPassword';

const AccountSecurity = () => {
  const isIPadPro = useIPadProQuery();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } =
    useForm<AccountSecurityUpdateType>({
      shouldFocusError: false,
      mode: 'onChange',
    });
  const [isConfirmationSuccessful, setIsConfirmationSuccessful] = useState<boolean>(false);
  const { mutateAsync: sendOTP, isLoading: Sending } = useForgotPassword();
  const { mutateAsync, isLoading } = useUpdatePassword();
  const { userCred } = useUserCredContext();
  const { signInMethod } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();

  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
    setError,
    clearErrors,
  };
  const handleSendOTP = async () => {
    try {
      const { email } = userCred;
      const oldPassword = watch('oldPassword');
      await sendOTP({ email, oldPassword });
      openSnackBar({
        message: 'OTP sent successfully',
        severity: 'success',
      });
      setIsConfirmationSuccessful(true);
    } catch (error) {
      openSnackBar({
        message: 'Incorrect Current Password',
        severity: 'error',
      });
      console.log('handleSendOTP Error', error);
    }
  };

  const onPasswordUpdate: SubmitHandler<AccountSecurityUpdateType> = async (data) => {
    try {
      const { oldPassword, newPassword, otp } = data;
      const { userId, email } = userCred;
      await mutateAsync({ email, oldPassword, newPassword, otp, userId });
      openSnackBar({
        message: 'Password Reset Successful',
        severity: 'success',
      });
      // setAlertMessage('Password Reset Successful');
      setIsConfirmationSuccessful(false);
      reset();
    } catch (err) {
      openSnackBar({
        message: 'Current Password Incorrect or Invalid OTP',
        severity: 'error',
      });
      console.error('Error onPasswordUpdate:', err);
    }
  };

  return (
    <div className="p-4">
      <span className="text-lg font-bold">Account Security</span>
      {signInMethod === 'email' && (
        <CommonForm handleFunction={handleSubmit(onPasswordUpdate)}>
          <ResetPassword {...commonProps} />
          {isConfirmationSuccessful ? (
            <>
              <OTPVerify {...commonProps} />
              <div className="my-4">
                <Button
                  disabled={!watch('oldPassword') || !watch('newPassword') || !watch('otp') || !formState?.isValid || isLoading}
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="normal-case"
                >
                  {isLoading ? 'Updating' : 'Update'}
                </Button>
              </div>
            </>
          ) : (
            <div className="my-4">
              <Button
                disabled={!watch('oldPassword') || !watch('newPassword') || !formState?.isValid || Sending}
                variant="contained"
                color="primary"
                className="normal-case"
                onClick={handleSendOTP}
              >
                {Sending ? 'Confirming' : 'Confirm'}
              </Button>
            </div>
          )}
        </CommonForm>
      )}
      <div className="mt-8">
        <DeactivationNDeletion />
      </div>
    </div>
  );
};

export default AccountSecurity;
