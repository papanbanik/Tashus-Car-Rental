'use client';
import { HookFormComponentProps } from '@/types/componentTypes';
import { TextField } from '@mui/material';

const SupportFuelGap = ({ register, watch, formState }: HookFormComponentProps) => {
  const { errors } = formState;
  const validateKilometerRange = () => {
    const rentedKilometers = watch('rentedKilometersRange');
    const returnedKilometers = watch('returnedKilometersRange');
    // console.log(returnedKilometers);
    const maxValue = 2000;
    if (rentedKilometers && returnedKilometers) {
      if (parseInt(returnedKilometers) >= parseInt(rentedKilometers)) {
        return 'Returned kilometers range must be less than rented kilometers range';
      }
    }
    return true;
  };

  return (
    <>
      <div className="my-4">
        <TextField
          {...register('rentedKilometersRange', {
            required: 'This field is required',
            pattern: {
              value: /^\d+$/,
              message: 'Please enter only numbers',
            },
            validate: validateKilometerRange,
          })}
          className="w-full"
          name="rentedKilometersRange"
          id="outlined-basic"
          label="Kilometers Range when Rented"
          variant="outlined"
          required
          error={errors?.rentedKilometersRange}
          helperText={errors?.rentedKilometersRange?.message}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
        />
      </div>
      <div>
        <TextField
          {...register('returnedKilometersRange', {
            required: 'This field is required',
            pattern: {
              value: /^\d+$/,
              message: 'Please enter only numbers',
            },
            validate: validateKilometerRange,
          })}
          className="w-full"
          name="returnedKilometersRange"
          id="outlined-basic"
          label="Kilometers Range when Returned"
          variant="outlined"
          required
          error={errors?.returnedKilometersRange}
          helperText={errors?.returnedKilometersRange?.message}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
        />
      </div>
    </>
  );
};

export default SupportFuelGap;
