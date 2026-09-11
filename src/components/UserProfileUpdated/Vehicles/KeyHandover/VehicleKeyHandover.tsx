'use client';
import StepHeader from '@/components/CarListing/StepHeader';
import CommonForm from '@/components/Common/CommonForm';
import CommonRadioGroup from '@/components/Common/HookFormFields/CommonRadioGroup';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useKeyHandover } from '@/hooks/vehicle/key-handover/useKeyHandover';
import { CarKeyHandoverValues } from '@/types/car-listing/carKeyHandoverTypes';
import { keyHandoverList } from '@/utils/Lists/carListInfo';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const defaultValues: CarKeyHandoverValues = {
  label: 'Self check-in via lockbox',
  value: 'selfCheck',
};

const VehicleKeyHandover = () => {
  const { listingId, carData } = useCarListingContext();
  const { mutateAsync: saveKeyHandover, isLoading } = useKeyHandover();
  const { control, handleSubmit, watch, formState, setValue } = useForm<CarKeyHandoverValues>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { isValid } = formState;
  const onKeyHandoverSave: SubmitHandler<CarKeyHandoverValues> = async (data) => {
    // console.log('onKeyHandoverSave', data);
    const selectedOption = keyHandoverList?.find((option) => option?.value === data?.value);
    const label = selectedOption?.label || '';
    try {
      await saveKeyHandover({ listingId: Number(listingId), label: label, value: data?.value });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (listingId && carData?.keyHandovers && carData?.keyHandovers?.length > 0) {
      const lastKeyHandover = carData?.keyHandovers?.slice(-1)?.[0];
      setValue('value', lastKeyHandover?.value ?? '');
    }
  }, [listingId, carData]);

  const hasDataChanged = () => {
    if (listingId && carData?.keyHandovers && carData?.keyHandovers?.length > 0) {
      const lastKeyHandover = carData?.keyHandovers?.slice(-1)?.[0];
      const keyHandoverOptionChanged = watch('value') !== lastKeyHandover?.value;
      return keyHandoverOptionChanged;
    }
    return true;
  };

  return (
    <div className="border border-accent border-solid mt-10 p-4 rounded-lg bg-white m-2 md:m-0">
      <StepHeader
        title="Key Handover"
        subtitle="For Self Check-In via Lockbox, enjoy a convenient, contact-free experience by retrieving keys from a secure lockbox at your own time. For Key Handover by Agent, meet with an agent for a personalized key exchange and a quick introduction to your stay."
        titleTextSize="text-lg md:text-2xl"
      />
      <CommonForm handleFunction={handleSubmit(onKeyHandoverSave)}>
        <CommonRadioGroup
          control={control}
          registerName="value"
          formLabelText="Key Handover Choices"
          options={keyHandoverList}
          required
          defaultValue={defaultValues?.value}
          classNames="flex flex-col font-semibold gap-2 text-sm md:text-lg"
        />
        <div className="flex mt-8">
          <Button disabled={!isValid || isLoading || !hasDataChanged()} type="submit" variant="contained" color="primary">
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>
    </div>
  );
};

export default VehicleKeyHandover;
