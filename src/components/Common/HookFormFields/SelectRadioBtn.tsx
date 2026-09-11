import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { SelectRadioBtnProps } from '@/types/componentTypes';
import { Controller } from 'react-hook-form';

const SelectRadioBtn = ({
  control,
  registerName,
  required,
  options,
  exclusive,
  lightColor,
  otherValidationFn,
  watch,
  buttonWidth,
}: SelectRadioBtnProps) => {
  const handleMultiSelection = async (prevDays: string[], newValue: any) => {
    if (!Array.isArray(prevDays)) {
      // If prevDays is not an array, initialize it as an empty array
      prevDays = [];
    }
    let updatedDays = [...prevDays];

    if (updatedDays.includes(newValue)) {
      updatedDays = updatedDays.filter((day) => day !== newValue);
    } else {
      updatedDays = [...prevDays, newValue];
    }

    // console.log('updatedDays', updatedDays);
    return updatedDays;
  };

  return (
    <Controller
      control={control}
      name={registerName}
      rules={{
        required: required,
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <ToggleButtonGroup
          size="small"
          fullWidth
          value={watch && watch(registerName)}
          exclusive={exclusive}
          aria-label="text alignment"
          onChange={async (event: any, newValue) => {
            if (exclusive) {
              await onChange(newValue);
              otherValidationFn && otherValidationFn();
            } else {
              const updatedDays = await handleMultiSelection(value, event.target.value);
              onChange(updatedDays);
            }
          }}
        >
          {options.map(({ id, label, value: optionValue }) => {
            let tempValue;
            if (exclusive && watch) {
              tempValue = watch(registerName) === optionValue;
            } else {
              tempValue = value?.includes(optionValue);
            }
            return (
              <ToggleButton
                size="small"
                key={id}
                value={optionValue}
                className={`${buttonWidth ? buttonWidth : 'w-16'} ${
                  buttonWidth && tempValue ? 'border-r-2 border-white' : 'text-black border-1 border-gray-200'
                } normal-case ${
                  tempValue && !lightColor ? 'bg-primary text-white font-semibold' : tempValue && lightColor ? 'bg-gray-200 font-semibold' : ''
                }`}
              >
                {label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      )}
    />
  );
};

export default SelectRadioBtn;
