import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useSecondaryContactDetails } from '@/hooks/profile/profile-info/secondary-contact/useSecondaryContactDetails';
import { secondaryContactType } from '@/types/profileInfoTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SectionBorder from '../../SectionBorder';
import SecondaryDetails from './SecondaryDetails';

const SecondaryContact = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } =
    useForm<secondaryContactType>({
      shouldFocusError: false,
      mode: 'onChange',
    });
  const { isValid } = formState;
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const {
    userCred: { userId },
    userProfileInfo,
  } = useUserCredContext();
  const { mutateAsync: updateSecondaryContactDetails, isLoading } = useSecondaryContactDetails();

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

  // Exclude country code
  const onContactDetailsSave: SubmitHandler<secondaryContactType> = async (data) => {
    const secondaryCountryCode = data?.secondaryContact?.phone?.code || '';
    const modifiedData = {
      secondaryContact: {
        ...data.secondaryContact,
        phone: {
          ...data.secondaryContact.phone,
          number: data?.secondaryContact?.phone?.number?.replace(secondaryCountryCode, '') || '',
        },
        name: data?.secondaryContact?.name || '',
      },
    };

    if (!!userId) {
      try {
        await updateSecondaryContactDetails({
          userId: userId,
          secondaryContact: modifiedData?.secondaryContact,
        });
        setIsEdit(false);
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const getSecondaryContactDetails = async () => {
      if (userProfileInfo?.secondaryContact) {
        setValue('secondaryContact.name', userProfileInfo?.secondaryContact?.name);
        setValue('secondaryContact.phone', userProfileInfo?.secondaryContact?.phone);
      } else {
        reset();
      }
    };
    getSecondaryContactDetails();
  }, [userProfileInfo?.secondaryContact]);

  // added to resolve save button disable issue
  useEffect(() => {
    if (watch('secondaryContact.phone.number')) {
      trigger('secondaryContact.phone.number');
    }
  }, [watch('secondaryContact.phone.number')]);

  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (!!userProfileInfo?.secondaryContact) {
      const { name, phone } = userProfileInfo?.secondaryContact;
      return name !== watch('secondaryContact.name') || phone !== watch('secondaryContact.phone');
    }
    return true;
  };

  //Disabled Button
  const isRestrictRSuspend =
    isPartnerRestrict(partnerAccess) || isPartnerSuspended(partnerAccess) || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess);
  const isButtonDisabled =
    watch('secondaryContact.phone.number') === watch('secondaryContact.phone.code') ||
    (watch('secondaryContact.phone.number')?.length || 0) < 6 ||
    isLoading ||
    isRestrictRSuspend;
  return (
    <div className="my-6">
      <div className="flex justify-between items-center">
        <span className="text-md font-semibold my-2">
          Secondary Contact<span className="text-xs text-gray-600">{`(optional)`}</span>
        </span>
        <div className="text-md font-semibold underline normal-case text-success cursor-pointer" onClick={() => setIsEdit(!isEdit)}>
          Edit
        </div>
      </div>
      <CommonForm handleFunction={handleSubmit(onContactDetailsSave)}>
        <SectionBorder>
          <SecondaryDetails {...commonProps} isEdit={isEdit} />
          {isEdit && (
            <Button
              disabled={!isValid || !hasDataChanged() || isButtonDisabled}
              size="small"
              type="submit"
              variant="contained"
              color="success"
              className="normal-case mt-4"
            >
              {isLoading ? 'Saving' : 'Save'}
            </Button>
          )}
        </SectionBorder>
      </CommonForm>
    </div>
  );
};

export default SecondaryContact;
