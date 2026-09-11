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
// import 'dayjs-timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const SingleTimePicker = ({
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
            <CustomTimeField
              timeValue={fieldValue ? getFormattedSelectedTime(new Date(fieldValue)) : new Date()}
              minTime={minDate}
              hideButton={true}
              timeStep={30}
              disabled={disabled}
              // minTime={getMinimumEndDate(watch('startDate'), watch('startTime'), watch('endDate'), watch('endTime'))}
              // minTime={
              //   dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinimumEndDate(watch('startTime')) : undefined
              // }
              handleTimeChange={async (time: any) => {
                onChange(time);
                handleTimeChange && (await handleTimeChange(time, endType || false, index));
              }}
              shouldDisableTime={shouldDisableTime}
            ></CustomTimeField>
          );
        }}
        // <Controller
        //   control={control}
        //   name={registerName}
        //   rules={{
        //     required: required,
        //     validate: customValidate,
        //   }}
        //   render={({ field: { onChange, onBlur, value, ref } }) => {
        //     const defaultMinTime = new Date('1899-12-31T00:00:00.000Z');
        //     // const localTimezoneOffset = defaultMinTime.getTimezoneOffset();
        //     defaultMinTime.setHours(0, 0, 0, 0);
        //     // console.log(value);
        //     return (
        //       <DatePicker
        //         wrapperClassName=""
        //         customInput={<input className="w-full" style={{ border: `1px solid ${timeError ? 'red' : 'grey'}` }} />}
        //         className={`p-2 text-center ${timeError ? 'border-2 border-red-300 text-error' : 'border border-gray-300'} my-0`}
        //         selected={fieldValue ? new Date(fieldValue) : new Date()}
        //         onChange={async (time) => {
        //           onChange(time);
        //           handleTimeChange && (await handleTimeChange(time, endType || false, index));
        //         }}
        //         showTimeSelect
        //         showTimeSelectOnly
        //         timeIntervals={30}
        //         minTime={minDate ? minDate : defaultMinTime}
        //         maxTime={maxDate ? maxDate : new Date('1899-12-31T17:59:00.000Z')}
        //         // timeCaption="Start"
        //         timeFormat="h:mm aa"
        //         dateFormat="h:mm aa"
        //         popperClassName="bg-red"
        //         disabled={disabled}
        //       />
        //     );
        //   }}
      />
    </>
  );
};

export default SingleTimePicker;
