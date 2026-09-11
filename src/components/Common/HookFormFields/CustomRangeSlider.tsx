import { CustomRangeSliderProps } from '@/types/componentTypes';
import { Slider, SliderThumb } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { AiOutlineDollarCircle } from 'react-icons/ai';

function valuetext(value: number) {
  return `${value}`;
}

interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <AiOutlineDollarCircle />
    </SliderThumb>
  );
}

const CustomRangeSlider = ({
  control,
  registerName,
  defaultValue,
  required,
  watch,
  setValue,
  setRangeValues,
  maxValue,
  minValue,
  disabled,
}: CustomRangeSliderProps) => {
  return (
    <Controller
      control={control}
      name={registerName}
      defaultValue={defaultValue}
      rules={{
        required: required,
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => {
        // console.log(value);
        return (
          <div>
            <Slider
              defaultValue={defaultValue}
              getAriaLabel={() => 'Temperature range'}
              value={value}
              slots={{ thumb: AirbnbThumbComponent }}
              // value={value[0] === null ? defaultValue : value}
              onChange={(newValue: any) => {
                onChange(newValue);
              }}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              max={maxValue}
              min={minValue}
              disabled={disabled}
            />
          </div>
        );
      }}
    />
  );

  //  <Slider value={value} min={minimum} max={maximum} onChange={(newValue) => onChange(newValue)} valueLabelDisplay="auto" />
};

export default CustomRangeSlider;
