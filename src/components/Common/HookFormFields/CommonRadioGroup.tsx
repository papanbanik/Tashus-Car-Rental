import { CommonRadioGroupProps } from '@/types/componentTypes';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Controller } from 'react-hook-form';

const CommonRadioGroup = ({
  control,
  registerName,
  options,
  defaultValue,
  required,
  formLabelText,
  disabled,
  isRow,
  classNames,
}: CommonRadioGroupProps) => {
  return (
    <Controller
      name={registerName}
      control={control}
      defaultValue={defaultValue}
      rules={{ required: required }}
      render={({ field }) => (
        <FormControl className={`${classNames ?? 'flex flex-row items-center justify-between'}`}>
          {/* <FormLabel>{formLabelText}</FormLabel> */}
          <span>{formLabelText}</span>
          <RadioGroup row={isRow} name={registerName} value={field.value || defaultValue} onChange={(e) => field.onChange(e.target.value)}>
            {options.map((option: any, index: number) => (
              <FormControlLabel key={index} value={option.value.toString()} disabled={disabled} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
};

export default CommonRadioGroup;
