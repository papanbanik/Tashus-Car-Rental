'use client';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { usePayoutDetails, useUpdatePayoutOptions } from '@/hooks/profile/profile-info/payout-options/usePayoutOptions';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { PayoutOptionsType } from '@/types/profileInfoTypes';
import { isGuestRestrict, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Button, Divider, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import PayoutDetails from './PayoutDetails';

const PayoutOptions = () => {
  const { control, register, handleSubmit, watch, formState, reset, setValue } = useForm<PayoutOptionsType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const isIPadPro = useIPadProQuery();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { payoutDetails, partnerAccess, guestAccess } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();

  const { mutateAsync, isLoading } = useUpdatePayoutOptions();
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { data, refetch } = usePayoutDetails();
  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
  };
  useEffect(() => {
    if (userId && payoutDetails?.accountName !== '') {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [payoutDetails, userId]);

  useEffect(() => {
    const getContactDetails = async () => {
      if (payoutDetails && data != undefined) {
        setValue('accountName', payoutDetails?.accountName || '');
        setValue('accountNumber', payoutDetails?.accountNumber || '');
        setValue('bsb', payoutDetails?.bsb || '');
      } else {
        reset();
      }
    };
    getContactDetails();
  }, [payoutDetails, userId]);

  const onPayoutDetailsUpdate: SubmitHandler<PayoutOptionsType> = async (data) => {
    try {
      const { bsb, accountNumber, accountName } = data;
      await mutateAsync({ userId, bsb, accountNumber, accountName });
      openSnackBar({
        message: 'Successfully updated payout information',
        severity: 'success',
      });
      reset();
      refetch();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating payout details:', err);
      openSnackBar({
        message: 'Error updating payout details',
        severity: 'error',
      });
    }
  };

  return (
    <div className="p-4">
      {isPartnerRestrict(partnerAccess) && isGuestRestrict(guestAccess) ? (
        <CommonAccStatusAlert isPartner={true} isGuest={true} isRestrict={true} />
      ) : (
        <>
          {isPartnerRestrict(partnerAccess) && <CommonAccStatusAlert isPartner={true} isRestrict={true} />}
          {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
        </>
      )}
      {isPartnerSuspended(partnerAccess) && <CommonAccStatusAlert isPartner={true} isSuspend={true} />}
      <span className="text-lg font-bold">Payment Options</span>
      <div className="mt-4">
        <div className="flex gap-2">
          <span className="text-md font-semibold">{`Payout Details`}</span>
          {payoutDetails?.accountName !== '' && (
            <IconButton size="medium" className="normal-case underline text-md font-semibold p-0" onClick={() => setIsEditing(!isEditing)}>
              <FiEdit className="text-primary" />
            </IconButton>
          )}
        </div>
        <span className="helping_text pb-4">{`Please add your bank account details where Tashus will pay your earnings`}</span>
        <Divider className="mb-4 md:mb-8" />
        <CommonForm handleFunction={handleSubmit(onPayoutDetailsUpdate)}>
          <PayoutDetails {...commonProps} isEditing={isEditing} />
          <div className="flex justify-center my-4">
            {isEditing && (
              <Button
                disabled={
                  !formState?.isValid ||
                  !formState?.isDirty ||
                  isPartnerRestrict(partnerAccess) ||
                  isPartnerSuspended(partnerAccess) ||
                  isGuestRestrict(guestAccess)
                }
                type="submit"
                variant="contained"
                color="primary"
                className="normal-case ml-4"
              >
                {isLoading ? 'Saving' : 'Save'}
              </Button>
            )}
          </div>
        </CommonForm>
      </div>
    </div>
  );
};

export default PayoutOptions;
