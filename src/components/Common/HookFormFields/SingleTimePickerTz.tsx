import { ControlledFieldProps, SingleTimePickerProps } from '@/types/componentTypes';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller } from 'react-hook-form';
import CustomTimeField from '../DateTimePickers/CustomTimeField';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getFormattedSelectedTime } from '@/utils/Functions/availabilityCommonFn';
import CustomTimeFieldTz from '../DateTimePickers/CustomTimeFieldTz';
// import 'dayjs-timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const SingleTimePickerTz = ({
  control,
  registerName,
  required,
  disabled,
  minDate,
  maxDate,
  endType,
  index,
  watch,
  handleValidation,
  handleTimeChange,
  timeError,
  fieldValue,
  shouldDisableTime,
}: SingleTimePickerProps) => {
  const customValidate = async (value: any) => {
    const valid = handleValidation && (await handleValidation(value, endType || false, index));
    // console.log('valid', index, valid);
    return valid || 'Not valid';
  };

  return (
    <>
      <Controller
        control={control}
        name={registerName}
        rules={{
          required: required,
          validate: customValidate,
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          // const defaultMinTime = new Date('1899-12-31T00:00:00.000Z');
          // defaultMinTime.setHours(0, 0, 0, 0);
          // console.log(value);
          return (
            <div>
              <CustomTimeFieldTz
                timeValue={fieldValue ? getFormattedSelectedTime(new Date(fieldValue)) : new Date()}
                minTime={minDate}
                // hideButton={true}
                timeStep={30}
                isTimeReadOnly={false}
                disabled={disabled}
                handleTimeChange={async (time: any) => {
                  onChange(time);
                  handleTimeChange && (await handleTimeChange(new Date(time), endType || false, index));
                }}
                shouldDisableTime={shouldDisableTime}
                showUtc={true}
              ></CustomTimeFieldTz>
            </div>
          );
        }}
      />
    </>
  );
};

export default SingleTimePickerTz;
