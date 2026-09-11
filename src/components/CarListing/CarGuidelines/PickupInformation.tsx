'use client';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import { HookFormComponentProps } from '@/types/componentTypes';
import SectionHeader from '../SectionHeader';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useEffect } from 'react';

const PickupInformation = ({
  register,
  control,
  watch,
  formState,
  setValue,
  reset,
  getValues,
  trigger,
  setError,
  clearErrors,
}: HookFormComponentProps) => {
  const { errors } = formState;
  // console.log(errors);

  const { handleSaveCurrentStep, updateCurrentStep, listingId, carData, getUpdatedSteps } = useCarListingContext();

  // useEffect(() => {
  //   if (carData?.guidelines?.pickupInformation && clearErrors) {
  //     console.log('in');
  //     clearErrors('guidelines.pickupInformation');
  //   }
  // }, [carData]);
  return (
    <div>
      <SectionHeader
        title="Pickup Information"
        subtitle="Share any specific pickup instructions, including the vehicle's location and the process for retrieving the keys."
      />
      <div className="listing_section_content text-left">
        <RichEditor
          control={control}
          registerName="guidelines.pickupInformation"
          label="Guidelines to your pickup information..."
          required={true}
          errors={errors?.guidelines?.pickupInformation}
        />
      </div>
    </div>
  );
};

export default PickupInformation;
