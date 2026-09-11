import { ControlledFieldProps, CustomSliderProps } from '@/types/componentTypes';
import { Slider } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const CustomSlider = ({ control, registerName, defaultValue, required, errors, minimum, maximum }: CustomSliderProps) => {
  return (
    <Controller
      control={control}
      name={registerName}
      defaultValue={defaultValue}
      rules={{
        required: required,
        validate: (value) => value >= (minimum ?? 0) || `Invalid`,
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => {
        return (
          <div>
            <Slider value={value} min={minimum} max={maximum} onChange={(newValue) => onChange(newValue)} valueLabelDisplay="auto" />
            {errors && <span className="text-error text-xs mt-2">{errors?.message}</span>}
          </div>
        );
      }}
    />
  );
};

export default CustomSlider;
