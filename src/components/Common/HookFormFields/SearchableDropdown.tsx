'use client';

import { SearchableDropdownProps } from '@/types/componentTypes';
import { Avatar } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Image from 'next/image';
import React from 'react';
import { Controller } from 'react-hook-form';
import { IconType } from 'react-icons';

const SearchableDropdown = ({
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
  emptyColor,
  isLabelShow,
  showFlag,
  showRequired,
}: SearchableDropdownProps) => {
  // const selectedIndex = options.findIndex((option) => option.label === defaultValue || option.value === defaultValue);

  return (
    <Controller
      control={control}
      name={registerName}
      rules={{
        required: required,
        validate: validate,
      }}
      render={({ field: { value, onChange, onBlur, ref } }) => {
        // console.log(value);

        return (
          <Autocomplete
            options={options}
            size="small"
            fullWidth
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${value || disabled ? '' : `${!emptyColor && '#f87272'}`}`,
              },
              '& .MuiInputLabel-outlined': {
                color: `${value || disabled ? '' : `${!emptyColor && '#f87272'}`}`,
              },
            }}
            onChange={(event: React.ChangeEvent<{}>, newValue: any) => {
              // console.log(newValue);
              onChange(newValue?.value);
              if (newValue?.value === 'ACT' || newValue?.value === 'NT') {
                setError &&
                  setError(registerName, {
                    message: 'Tashus service not available in this state',
                  });
              } else {
                clearErrors && clearErrors(registerName);
              }
            }}
            value={options.find((option) => option.value === value) || null}
            autoSelect
            blurOnSelect={true}
            // getOptionLabel={(option) => {
            //   // console.log(option);
            //   return option.value.toString();
            // }}
            getOptionLabel={(option) => {
              return isLabelShow ? option.label.toString() : option.value.toString();
            }}
            renderOption={(props, option, { selected }) => {
              const { id, label, icon } = option;
              const IconComponent = icon as IconType;
              return (
                <li {...props} key={id}>
                  <div className="flex gap-2 items-center">
                    {icon && (
                      <>
                        {showFlag ? (
                          <div className="w-6 h-4 flex justify-center items-center overflow-hidden rounded">
                            <Image src={icon} alt={`${label}`} width={24} height={16} objectFit="contain" />
                          </div>
                        ) : (
                          <Avatar key={id} className="bg-transparent text-primary">
                            {IconComponent && <IconComponent />}
                          </Avatar>
                        )}
                      </>
                    )}
                    {label}
                  </div>
                </li>
              );
            }}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!errors}
                disabled={disabled}
                helperText={errors?.message}
                fullWidth
                required={showRequired}
              />
            )}
          />
        );
      }}
    ></Controller>
  );
};

export default SearchableDropdown;
