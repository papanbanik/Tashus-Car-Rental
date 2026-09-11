import { HookFormFieldProps } from '@/types/componentTypes';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FiMinusSquare, FiPlusSquare } from 'react-icons/fi';
import SectionHeader from '../../CarListing/SectionHeader';

const DynamicField = ({ control, registerName, dynamicObjFieldName, register, label, watch, maxLength, allErrors, disabled }: HookFormFieldProps) => {
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: registerName,
  });
  const fieldValues = watch && watch(registerName);
  // console.log(fieldValues);
  // console.log(fieldValues?.length === 1 && !fieldValues[0]?.feature);
  const addBtnDisable = fields?.length >= 12 || !fieldValues[0]?.feature;
  // const addBtnDisable = fields?.length >= 12 || (fieldValues?.length === 1 && !fieldValues[0]?.feature);
  // const addBtnDisable = fields?.length >= 12 || !fieldValues[0]?.feature;
  return (
    <div>
      <SectionHeader title="Additional Features" subtitle="You can add upto 12 additional features">
        <span className="text-xs text-gray-600">{`    (optional)`}</span>
        <IconButton className="pb-0" disabled={addBtnDisable || disabled} onClick={() => prepend({ feature: '' })} size="large">
          <IoAddCircleOutline />
        </IconButton>
      </SectionHeader>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 listing_section_content">
        {fields.map((field: any, index) => {
          // console.log(allErrors);
          // console.log(field);
          return (
            <FormControl key={field.id} className="grid-cols-1" variant="outlined">
              <InputLabel
                size="small"
                className={`${allErrors && allErrors[index] ? 'text-error' : !field?.feature ? 'text-primary' : ''}`}
                htmlFor={`outlined-adornment-${registerName}`}
              >
                {label}
              </InputLabel>
              <OutlinedInput
                id={`outlined-adornment-${registerName}`}
                type={'text'}
                size="small"
                sx={{
                  '& fieldset.MuiOutlinedInput-notchedOutline': {
                    borderColor: `${field?.feature ? '' : '#800080'}`,
                  },
                }}
                {...register(`${registerName}.${index}.${dynamicObjFieldName}`, {
                  maxLength: maxLength,
                  required: fieldValues?.length > 1,
                })}
                error={!!allErrors && !!allErrors[index]}
                autoComplete="off"
                disabled={disabled}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      disabled={fieldValues?.length < 2}
                      className={`${index === 0 && !field?.feature && fieldValues?.length >= 2 ? 'text-red-400' : 'text-red-300'}`}
                      onClick={() => remove(index)}
                      size="large"
                    >
                      <FiMinusSquare />
                    </IconButton>
                  </InputAdornment>
                }
                label={label}
              />
              <FormHelperText className="text-error ml-0">
                {allErrors && allErrors[index]
                  ? 'Please write within 50 characters'
                  : fields?.length > 1 && !fieldValues[0]?.feature && index === 0
                  ? `This field can't be empty`
                  : ''}
              </FormHelperText>
            </FormControl>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicField;
