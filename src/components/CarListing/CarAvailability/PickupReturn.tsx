import React, { useEffect } from 'react';
import SectionHeader from '../SectionHeader';
import { HookFormComponentProps } from '@/types/componentTypes';
import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import WeekAvailability from './WeekAvailability';
import { carWeekAvailability } from '@/utils/Lists/carListInfo';

const PickupReturn = ({
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
  const { errors, isDirty, touchedFields, isValid, isSubmitting } = formState;

  return (
    <div>
      <SectionHeader title="Pickup & Return hour"></SectionHeader>
      <span className="text-left">
        <IosSwitch
          control={control}
          registerName="pickupReturnHour.alwaysAvailable"
          size="large"
          label="Vehicle is available 24 hours everyday for pickup and return"
          required={false}
          // required={watch(`pickupReturnHour.customAvailability`)?.find((availability: any) => availability.checked === true) === undefined}
        ></IosSwitch>
      </span>
      {!watch('pickupReturnHour.alwaysAvailable') && (
        <>
          {carWeekAvailability.map(({ id, label, value }, index) => (
            <WeekAvailability
              index={index}
              key={id}
              control={control}
              registerName={`pickupReturnHour.customAvailability.${id - 1}`}
              label={label}
              watch={watch}
              setValue={setValue}
              reset={reset}
              allErrors={errors?.pickupReturnHour?.customAvailability[id - 1] ?? ''}
              getValues={getValues}
              trigger={trigger}
              setError={setError}
              clearErrors={clearErrors}
            ></WeekAvailability>
          ))}
        </>
      )}
    </div>
  );
};

export default PickupReturn;
