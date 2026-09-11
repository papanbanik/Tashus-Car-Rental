import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import { HookFormComponentProps } from '@/types/componentTypes';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import { FieldErrors, useFieldArray } from 'react-hook-form';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';
import SectionHeader from '../SectionHeader';
import { BookingFields } from './BookingFields';

const AdvanceBooking = ({ register, control, watch, formState, setValue, trigger, clearErrors, setError }: HookFormComponentProps) => {
  const { errors, isDirty, touchedFields, isValid, isSubmitting } = formState;

  const { fields, append, prepend, remove, update } = useFieldArray({
    control,
    name: 'advanceBookingDiscounts',
  });

  const handleAddAdvanceBooking = () => {
    const lastUnit = fields[fields?.length - 1];
    prepend({ value: '', unit: 'days', percentage: '' });
  };

  const handleRemoveAdvanceBooking = (index: number) => {
    remove(index);
    if (fields?.length === 1) {
      handleAddAdvanceBooking();
    }
  };
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <SectionHeader
          title="Advance Booking Discount"
          subtitle="Promote early booking by providing guests with enticing advance booking discounts (up to 5)"
        >
          <div className="ml-4">
            <IosSwitch control={control} registerName="hasAdvanceDiscounts" size="large" label="" watch={watch}></IosSwitch>
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
      {watch('hasAdvanceDiscounts') && (
        <div className="w-full mb-10">
          <Button variant="outlined" size="small" color="primary" className="normal-case" onClick={handleAddAdvanceBooking} startIcon={<IoMdAdd />}>
            Add Advanced Booking Discounts
          </Button>
        </div>
      )}
      {watch('hasAdvanceDiscounts') &&
        fields?.map((field, index) => {
          return (
            <BookingFields
              key={index}
              register={register}
              registerName="advanceBookingDiscounts"
              control={control}
              addFieldFn={handleAddAdvanceBooking}
              removeFieldFn={handleRemoveAdvanceBooking}
              watch={watch}
              index={index}
              disableAddBtn={fields?.length === 5}
              errorList={errors?.advanceBookingDiscounts as FieldErrors | undefined}
              setValue={setValue}
              trigger={trigger}
              clearErrors={clearErrors}
              setError={setError}
              showAdd={true}
            ></BookingFields>
          );
        })}
      {fields?.length === 0 && <p>No advance booking discounts</p>}
    </Grid>
  );
};

export default AdvanceBooking;
