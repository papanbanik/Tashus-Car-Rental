'use client';
import CommonForm from '@/components/Common/CommonForm';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSaveCarGuidelines } from '@/hooks/car-listing/useCarGuidence';
import { CarGuidelinesValues } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import StepContainer from '../StepContainer';
import StepHeader from '../StepHeader';
import PickupInformation from './PickupInformation';
import ReturnInformation from './ReturnInformation';
import SecondaryContact from './SecondaryContact';
import WordOfWelcomes from './WordOfWelcomes';

const defaultValues: CarGuidelinesValues = {
  guidelines: {
    pickupInformation: '',
    returnInformation: '',
    wordOfWelcome: '',
    secondaryContact: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
    firstPointOfContactIsMe: true,
    secondPointOfContactOther: false,
  },
};

const CarGuidelines = () => {
  const { partnerAccess } = useProfileInfoContext();
  const { handleSaveCurrentStep, updateCurrentStep, listingId, carData, getUpdatedSteps } = useCarListingContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } =
    useForm<CarGuidelinesValues>({
      shouldFocusError: false,
      mode: 'onChange',
      defaultValues: defaultValues,
    });
  const { mutateAsync: saveCarGuidelines, isLoading, isSuccess, isError, error } = useSaveCarGuidelines();
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
  const firstPointOfContactIsMe = watch('guidelines.firstPointOfContactIsMe');
  const secondPointOfContactOther = watch('guidelines.secondPointOfContactOther');
  const secondaryContact = watch('guidelines.secondaryContact');

  useEffect(() => {
    updateCurrentStep();
  }, []);

  useEffect(() => {
    trigger('guidelines.firstPointOfContactIsMe');
    trigger('guidelines.secondPointOfContactOther');
  }, [firstPointOfContactIsMe, secondPointOfContactOther]);

  useEffect(() => {
    const getUpdatedGuidelines = async () => {
      // console.log('Check list and Data', listingId, carData)
      if (listingId && carData?.guidelines) {
        const { pickupInformation, returnInformation, wordOfWelcome, secondaryContact, firstPointOfContactIsMe, secondPointOfContactOther } =
          carData?.guidelines;
        // console.log(pickupInformation, returnInformation);
        setValue('guidelines.pickupInformation', pickupInformation);
        setValue('guidelines.returnInformation', returnInformation);
        setValue('guidelines.wordOfWelcome', wordOfWelcome);
        setValue('guidelines.secondaryContact', secondaryContact ?? {}, { shouldValidate: true });
        setValue('guidelines.firstPointOfContactIsMe', firstPointOfContactIsMe, { shouldValidate: true });
        if (!firstPointOfContactIsMe) {
          setValue('guidelines.secondPointOfContactOther', true);
        } else {
          setValue('guidelines.firstPointOfContactIsMe', true);
        }

        // clearErrors('guidelines.pickupInformation');
      } else {
        reset();
      }
    };
    getUpdatedGuidelines();
  }, [listingId, carData]);

  const onGuidelinesSave: SubmitHandler<CarGuidelinesValues> = async (data) => {
    // console.log('onGuidelinesSave', data);
    try {
      const tempSteps = await getUpdatedSteps(5);
      await saveCarGuidelines({
        listingId: listingId,
        guidelines: {
          pickupInformation: data.guidelines.pickupInformation,
          returnInformation: data.guidelines.returnInformation,
          wordOfWelcome: data.guidelines.wordOfWelcome,
          // secondaryContact: secondaryContact,
          secondaryContact: {
            firstName: !data?.guidelines?.secondaryContact?.firstName ? undefined : data?.guidelines?.secondaryContact?.firstName,
            lastName: !data?.guidelines?.secondaryContact?.lastName ? undefined : data?.guidelines?.secondaryContact?.lastName,
            email: !data?.guidelines?.secondaryContact?.email ? undefined : data?.guidelines?.secondaryContact?.email,
            phoneNumber: !data?.guidelines?.secondaryContact?.phoneNumber ? undefined : data?.guidelines?.secondaryContact?.phoneNumber,
          },
          firstPointOfContactIsMe: firstPointOfContactIsMe,
        },
        listingSteps: tempSteps,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (listingId && carData?.guidelines) {
      return (
        carData?.guidelines?.pickupInformation !== watch('guidelines.pickupInformation') ||
        carData?.guidelines?.returnInformation !== watch('guidelines.returnInformation') ||
        carData?.guidelines?.wordOfWelcome !== watch('guidelines.wordOfWelcome') ||
        carData?.guidelines?.firstPointOfContactIsMe !== watch('guidelines.firstPointOfContactIsMe') ||
        carData?.guidelines?.secondaryContact?.firstName !== watch('guidelines.secondaryContact.firstName') ||
        carData?.guidelines?.secondaryContact?.lastName !== watch('guidelines.secondaryContact.lastName') ||
        carData?.guidelines?.secondaryContact?.email !== watch('guidelines.secondaryContact.email') ||
        carData?.guidelines?.secondaryContact?.phoneNumber !== watch('guidelines.secondaryContact.phoneNumber')
      );
    }
    return true;
  };
  return (
    <StepContainer>
      <StepHeader title="Guidelines" />
      <CommonForm handleFunction={handleSubmit(onGuidelinesSave)}>
        <PickupInformation {...commonProps} />
        <ReturnInformation {...commonProps} />
        <WordOfWelcomes {...commonProps} />
        <SecondaryContact {...commonProps} />
        <div className="flex justify-center mt-8">
          <Button
            // disabled={!formState?.isValid || isLoading || !formState.isDirty || isPartnerRestrict(partnerAccess)}
            disabled={!formState?.isValid || isLoading || !hasDataChanged() || isPartnerRestrict(partnerAccess)}
            type="submit"
            variant="contained"
            color="primary"
            className="justify-end"
          >
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>
    </StepContainer>
  );
};

export default CarGuidelines;
