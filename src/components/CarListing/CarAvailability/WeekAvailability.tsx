import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import { ControlledFieldProps } from '@/types/componentTypes';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { PiMoonLight } from 'react-icons/pi';
import { FieldErrors } from 'react-hook-form';
import AvailabilityPicker from './AvailabilityPicker';
import { defaultCustomHour } from './CarAvailability';

interface IWeekAvailability extends ControlledFieldProps {
  index: number;
}

const WeekAvailability = ({
  index,
  control,
  registerName,
  label,
  watch,
  setValue,
  reset,
  allErrors,
  getValues,
  trigger,
  setError,
  clearErrors,
}: IWeekAvailability) => {
  const currentDay = watch && watch(registerName);

  useEffect(() => {
    if (!currentDay?.checked && setValue && clearErrors) {
      const tempCurrentDayInfo = { ...currentDay };
      clearErrors(`pickupReturnHour.customAvailability.${index}.customHours`);
      setValue(`pickupReturnHour.customAvailability.${index}`, { ...tempCurrentDayInfo, customHours: [defaultCustomHour] });
    }
  }, [currentDay?.checked]);

  return (
    <div className="mt-6 grid grid-cols-12 gap-2">
      <div className="md:col-span-3 col-span-6 order-first text-left">
        <IosSwitch control={control} registerName={`${registerName}.checked`} size="small" label={label}></IosSwitch>
      </div>

      {watch && !!watch(`${registerName}.checked`) ? (
        <AvailabilityPicker
          control={control}
          registerName={registerName}
          allErrors={allErrors && (allErrors?.customHours as FieldErrors | undefined)}
          watch={watch}
          setValue={setValue}
          reset={reset}
          getValues={getValues}
          trigger={trigger}
          setError={setError}
          clearErrors={clearErrors}
        ></AvailabilityPicker>
      ) : (
        <Box
          sx={{ border: 1 }}
          className="col-span-5 flex justify-start items-center md:gap-6 gap-1 order-8 h-10 border-gray-300 py-1 md:mx-2 px-2 text-gray-300"
        >
          <PiMoonLight />
          <p>Unavailable</p>
        </Box>
      )}
    </div>
  );
};

export default WeekAvailability;
