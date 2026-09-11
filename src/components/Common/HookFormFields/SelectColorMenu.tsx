'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { ControlledFieldProps } from '@/types/componentTypes';
import { FormControl, InputLabel, Select, ToggleButton } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const SelectColorMenu = ({ control, registerName, required, watch }: ControlledFieldProps) => {
  // console.log(watch && watch(registerName));
  // const { carData } = useCarListingContext();
  return (
    <FormControl className="" fullWidth>
      <Controller
        name={registerName}
        control={control}
        rules={{
          required: required,
        }}
        render={({ field }) => (
          <>
            <InputLabel className={`${field.value ? '' : 'text-error'}`} size="small" id="demo-simple-select-label">
              Color
            </InputLabel>
            <Select
              size="small"
              value={field.value}
              // disabled={!!carData?.car?.color}
              onChange={(event, newValue) => {
                // console.log(event);
                // console.log(newValue);
                // console.log(event.target.value);
                // console.log(field.value);
                return field.onChange(event.target.value);
              }}
              sx={{
                '& fieldset.MuiOutlinedInput-notchedOutline': {
                  borderColor: `${field.value ? '' : '#f87272'}`,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Color"
              MenuProps={{
                // anchorEl: selectRef.current,
                PaperProps: {
                  style: {
                    maxWidth: 250,
                    display: 'flex',
                    flexWrap: 'wrap',
                    position: 'fixed',
                    padding: '0 12px',
                  },
                },
                // anchorOrigin: {
                //   vertical: 'bottom',
                //   horizontal: 'left',
                // },
                // getContentAnchorEl: null,
              }}
            >
              {/* <ToggleButtonGroup
              size="small"
              value={field.value} // Set the value of ToggleButtonGroup based on the form field
              exclusive
              aria-label="text alignment"
              className="grid grid-cols-6 gap-8"
              onChange={(event, newValue) => {
                console.log(newValue);
                return field.onChange(newValue)
              }} // Update the form field value on change
            > */}
              <ToggleButton value="black" className={`w-12 mr-4 mb-2 p-1 h-12  rounded-lg bg-black text-black`}>
                Black
              </ToggleButton>
              <ToggleButton value="white" className={`w-12 mr-4 mb-2 p-1 h-12  rounded-lg bg-white text-white`}>
                White
              </ToggleButton>
              <ToggleButton value="red" className={`w-12 mr-4 mb-2 p-1 h-12  rounded-lg bg-red-700 text-red-700`}>
                Red
              </ToggleButton>
              <ToggleButton value="green" className={`w-12 mr-4 mb-2 p-1 h-12  rounded-lg bg-green-900 text-green-900 text-xs`}>
                Green
              </ToggleButton>
              <ToggleButton value="lime" className={`w-12 mr-4 mb-2 p-1 h-12  rounded-lg bg-lime-500 text-lime-500`}>
                Lime
              </ToggleButton>
              <ToggleButton value="silver" className={`w-12 mr-4 mb-2 p-1 h-12  rounded-lg bg-stone-300 text-stone-300`}>
                Silver
              </ToggleButton>
              <ToggleButton value="gray" className={`w-12 mr-4 mb-2 p-1 h-12  rounded-lg bg-stone-500 text-stone-500`}>
                Gray
              </ToggleButton>
              <ToggleButton value="blue" className={`w-12 mr-4 mb-2 p-1 h-12  rounded-lg bg-blue-900 text-blue-900`}>
                Blue
              </ToggleButton>
              <ToggleButton value="others" className={`w-12 mr-4 mb-2 p-1 h-12 other_car_colors font-sm normal-case rounded-lg  text-white`}>
                Others
              </ToggleButton>
              {/* </ToggleButtonGroup> */}
            </Select>
          </>
        )}
      />
    </FormControl>
  );
};

export default SelectColorMenu;

{
  /* {carColorList.map((color) => {
                  console.log(color?.colorClass);
                  return (
                    <ToggleButton
                      key={color?.id}
                      value={color?.label}
                      // className={`col-span-1 h-12 rounded-lg bg-red-700`}
                      className={`col-span-1 h-12 rounded-lg bg-${color?.colorClass}`}
                    ></ToggleButton>
                  )
                })} */
}
