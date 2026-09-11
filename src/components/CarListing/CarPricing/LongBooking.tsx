import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import { HookFormComponentProps } from '@/types/componentTypes';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import { FieldErrors, useFieldArray } from 'react-hook-form';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';
import SectionHeader from '../SectionHeader';
import { BookingFields } from './BookingFields';

const LongBooking = ({ register, control, watch, formState, setValue, trigger, clearErrors, setError }: HookFormComponentProps) => {
  const { errors, isDirty, touchedFields, isValid, isSubmitting } = formState;

  const { fields, append, prepend, remove, update } = useFieldArray({
    control,
    name: `longBookingDiscounts`,
  });

  const handleAddLongDiscount = () => {
    prepend({ value: '', unit: 'days', percentage: '' });
  };

  const handleRemoveLongDiscount = (index: number) => {
    remove(index);
    if (fields?.length === 1) {
      handleAddLongDiscount();
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <SectionHeader
          title="Long Booking Discount"
          subtitle="Attract guests to extend their booking with enticing discounts (up to 5) on weekend getaways, weekly, and monthly trips"
        >
          <div className="ml-4">
            <IosSwitch control={control} registerName="hasLongDiscounts" size="large" label="" watch={watch}></IosSwitch>
          </div>
          <Tooltip
            enterTouchDelay={0}
            title="Kindly select between days or weeks and input the number of days or weeks in the designated input box"
            placement="top"
          >
            <IconButton size="small">
              <AiOutlineExclamationCircle className="text-gray-400" size={22} />
            </IconButton>
          </Tooltip>
        </SectionHeader>
      </Grid>
      {watch('hasLongDiscounts') && (
        <div className="w-full  mb-10">
          <Button variant="outlined" size="small" color="primary" className="normal-case" onClick={handleAddLongDiscount} startIcon={<IoMdAdd />}>
            Add Long Booking Discounts
          </Button>
        </div>
      )}
      {watch('hasLongDiscounts') &&
        fields?.map((field, index) => {
          return (
            <BookingFields
              key={index}
              register={register}
              registerName="longBookingDiscounts"
              control={control}
              addFieldFn={handleAddLongDiscount}
              removeFieldFn={handleRemoveLongDiscount}
              watch={watch}
              index={index}
              disableAddBtn={fields?.length === 5}
              allErrors={errors?.longBookingDiscounts as FieldErrors | undefined}
              errorList={errors?.longBookingDiscounts as FieldErrors | undefined}
              setValue={setValue}
              trigger={trigger}
              clearErrors={clearErrors}
              setError={setError}
              showAdd={true}
            ></BookingFields>
          );
        })}
      {fields?.length === 0 && <p>No long booking discounts</p>}
    </Grid>
  );
};

export default LongBooking;
