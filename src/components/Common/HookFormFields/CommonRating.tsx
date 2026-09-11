'use client';
import { CommonRatingProps } from '@/types/componentTypes';
import Rating from '@mui/material/Rating';
import { Controller } from 'react-hook-form';

const CommonRating = ({ control, registerName, precision, size, defaultValue, required, watch }: CommonRatingProps) => {
  return (
    <Controller
      name={registerName}
      control={control}
      rules={{ required: required }}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className="flex items-center justify-center">
          <Rating
            // name={field.name}
            name={registerName}
            // value={field.value !== undefined ? field.value : value}
            // value={watch ? watch(registerName) : 5}
            value={value}
            precision={precision ?? 1}
            defaultValue={defaultValue}
            // onChange={(e, newValue) => {
            //   field.onChange(newValue);
            //   // onChange && onChange(newValue);
            //   onChange && onChange(newValue ?? 0);
            //   // onChange;
            //   //  && onChange();
            // }}
            onChange={(newValue: any) => {
              onChange(newValue);
            }}
            size={size ?? 'medium'}
          />
          <span className="ml-2">{value ?? 0}/5</span>
        </div>
      )}
    />
  );
};

export default CommonRating;
