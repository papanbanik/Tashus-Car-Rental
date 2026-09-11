'use client';
import SingleDateCalendar from '@/components/Common/HookFormFields/SingleDateCalendar';
import { VehicleCustomPriceProps } from '@/types/user-profile/customPriceTypes';
import { currentDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { Button, Popover } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';

const VehicleFromDate = ({ register, control, watch, setValue, selectedDate, setIsDrawerOpen }: VehicleCustomPriceProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (selectedDate) {
      setValue('customPricing.fromDate', selectedDate);
      //setValue('customPricing.fromDate', dayjs(selectedDate).utc());
    } else {
      setValue('customPricing.fromDate', currentDateTime.toDate());
      //setValue('customPricing.fromDate', currentDateTime.utc().toDate());
      // setValue('customPricing.fromDate', dayjs().get('date').toDate());
    }
  }, [selectedDate]);

  return (
    <div className="flex items-center justify-between p-4">
      {!!setIsDrawerOpen && <FaArrowLeftLong className="text-primary text-base cursor-pointer" onClick={() => setIsDrawerOpen(false)} />}
      <span className="text-primary font-bold text-md md:text-lg justify-center">
        {/* {!!selectedDate ? dayjs(selectedDate).format('MMMM DD, YYYY') : dayjs().format('MMMM DD, YYYY')} */}
        {dayjs(watch('customPricing.fromDate')).format('DD MMM, YYYY')}
        {/* {dayjs(watch('customPricing.fromDate')).utc().format('DD MMM, YYYY')} */}
      </span>
      <Button variant="text" color="primary" className="normal-case" onClick={handleClick}>
        Edit
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {open && (
          <SingleDateCalendar
            control={control}
            required={true}
            registerName={'customPricing.fromDate'}
            disablePast={true}
            maxDate={dayjs().add(1, 'year').toDate()}
            register={register}
            defaultValue={watch('customPricing.fromDate') || dayjs(selectedDate).toDate() || currentDateTime.toDate()}
            handleClosePopover={() => setAnchorEl(null)}
          />
        )}
      </Popover>
    </div>
  );
};

export default VehicleFromDate;
