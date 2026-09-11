'use client';
import CommonTextIcon from '@/components/Common/CommonTextIcon';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { HookFormComponentProps } from '@/types/componentTypes';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { AiOutlineDollar } from 'react-icons/ai';
const VehicleCustomPrice = ({ register, control, watch, formState, setValue }: HookFormComponentProps) => {
  const { errors } = formState;
  const validateSelectedDate = (value: Date) => {
    const fromDate = watch('customPricing.fromDate');
    // console.log(fromDate);
    // return dayjs(value).isSame(fromDate) || dayjs(value).isAfter(fromDate) || 'Invalid Date';
    const fromDateObj = new Date(fromDate);
    return dayjs(value).isSame(dayjs(fromDateObj), 'day') || dayjs(value).isAfter(dayjs(fromDateObj), 'day') || 'Invalid Date';
  };
  useEffect(() => {
    if (watch('customPricing.toDate') === null) {
      setValue('customPricing.toDate', dayjs(watch('customPricing.fromDate')).add(1, 'day').toDate());
      //setValue('customPricing.toDate', dayjs(watch('customPricing.fromDate')).add(1, 'day').utc().toDate());
    }
  }, [watch('customPricing.toDate')]);
  return (
    <div className="p-4">
      <CommonTextIcon
        text="Edit Price"
        className="ml-2 font-bold"
        // startIcon={
        //   <div className="flex flex-col my-2">
        //     <FaArrowUp className="text-success" />
        //     <FaArrowDown className="text-error" />
        //   </div>
        // }
        startIcon={<AiOutlineDollar className="text-primary" />}
      />
      <span className="helping_text">{`Adjust your daily and hourly prices for vehicle listings with ease. Simply select the listing, enter the new prices, and save your changes.`}</span>
      <div className="flex items-center justify-between my-4">
        <div>
          <span>Until</span>
        </div>
        <div className="w-1/2">
          <SingleDatePicker
            control={control}
            required={true}
            registerName={'customPricing.toDate'}
            placeholder="DD/MM/YYYY"
            disablePast={true}
            maxDate={dayjs().add(1, 'year').toDate()}
            register={register}
            validateDate={validateSelectedDate}
            errors={errors?.customPricing?.toDate}
            minDate={dayjs(watch('customPricing.fromDate')).toDate()}
          />
        </div>
      </div>
      {/* <div className="flex justify-between my-4">
        <div>
          <SelectableDropdown
            control={control}
            registerName="customPricing.rateChange"
            options={customRatesChanges}
            required={true}
            errorColor={true}
          />
        </div>
        <div>
          <SelectRadioBtn
            control={control}
            registerName="customPricing.rateType"
            options={customRatesTypes}
            exclusive={true}
            lightColor={true}
            required
          />
        </div>
      </div> */}
      <div className="my-4">
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center">Daily</span>
          <TextField
            size="small"
            label="Rate"
            value={watch('customPricing.dailyRates')}
            type="number"
            className="w-1/2"
            {...register('customPricing.dailyRates', {
              required: true,
              pattern: {
                value: /^\d{1,5}(\.\d{1,2})?$/, //includes positive digits (0-9), supports decimal, 5 characters before . and 2 after decimal
                message: 'Invalid amount',
              },
              validate: (value) => value > 0 || '0 is invalid',
            })}
            error={!!errors?.customPricing?.dailyRates}
            helperText={errors?.customPricing?.dailyRates?.message}
          />
        </div>
        <div className="flex item-center justify-between mt-4">
          <span className="font-bold flex items-center">Hourly</span>
          <TextField
            size="small"
            label="Rate"
            value={watch('customPricing.hourlyRates')}
            type="number"
            className="w-1/2"
            {...register('customPricing.hourlyRates', {
              required: true,
              pattern: {
                value: /^\d{1,5}(\.\d{1,2})?$/, //includes positive digits (0-9), supports decimal, 5 characters before . and 2 after decimal
                message: 'Invalid amount',
              },
              validate: (value) => value > 0 || '0 is invalid',
            })}
            error={!!errors?.customPricing?.hourlyRates}
            helperText={errors?.customPricing?.hourlyRates?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleCustomPrice;
