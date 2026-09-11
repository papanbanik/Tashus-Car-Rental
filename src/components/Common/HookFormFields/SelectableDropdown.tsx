'use client';

import { SelectableDropdownProps } from '@/types/componentTypes';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import { Autocomplete, Avatar, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
// import { IconType } from 'react-icons';

const SelectableDropdown = ({
  control,
  validate,
  registerName,
  options,
  label,
  defaultValue,
  required,
  errors,
  setError,
  clearErrors,
  disabled,
  size,
  showDisable,
  errorColor,
  showRequired,
}: SelectableDropdownProps) => {
  return (
    <Controller
      control={control}
      name={registerName}
      defaultValue={defaultValue}
      rules={{
        required: required,
        validate: validate,
      }}
      render={({ field: { value, onChange, onBlur, ref } }) => {
        return (
          <FormControl fullWidth size={size ?? 'small'} required={showRequired}>
            <InputLabel>{label}</InputLabel>
            <Select
              label={label}
              defaultValue={defaultValue}
              labelId={`${registerName}`}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              inputRef={ref}
              disabled={disabled}
              sx={{
                '& fieldset.MuiOutlinedInput-notchedOutline': {
                  borderColor: `${value || disabled ? '' : `${errorColor && '#f87272'}`}`,
                },
                '& .MuiInputLabel-outlined': {
                  color: `${value || disabled ? '' : `${errorColor && '#f87272'}`}`,
                },
              }}
            >
              {showDisable && (
                <MenuItem value="" disabled>
                  {label}
                </MenuItem>
              )}
              {options.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }}
    ></Controller>
  );
};

export default SelectableDropdown;
