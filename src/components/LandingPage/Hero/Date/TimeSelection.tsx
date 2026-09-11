import { ControlledFieldProps } from '@/types/componentTypes';
import { TextField, Typography } from '@mui/material';
import { LocalizationProvider, TimePicker, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useState } from 'react';

interface TimeSelectionProps extends ControlledFieldProps {
  timePickerOpen: boolean;
  setTimePickerOpen: Dispatch<SetStateAction<boolean>>;
  disablePast: boolean;
  minTime?: Date;
  maxTime?: Date;
  manualOnChange?: (timeValue: Dayjs | null, timeType: string) => void;
}

const TimeSelection = ({
  setValue,
  registerName,
  timePickerOpen,
  setTimePickerOpen,
  disablePast,
  defaultValue,
  minTime,
  maxTime,
  manualOnChange,
  disabled,
}: TimeSelectionProps) => {
  // console.log(defaultValue);
  // console.log(currentDateTime);
  // console.log(disablePast);

  // console.log(minTime);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        disabled={disabled}
        className="border-none"
        value={dayjs(defaultValue)}
        disablePast={disablePast}
        minutesStep={15}
        minTime={minTime && dayjs(minTime)}
        onChange={(timeValue) => {
          // console.log(timeValue);
          setValue && setValue(registerName, timeValue?.toISOString());
          if (manualOnChange) {
            manualOnChange(timeValue, registerName);
          }
        }}
        slotProps={{
          actionBar: {
            actions: ['accept'],
          },
        }}
        closeOnSelect
        viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        }}
        sx={{
          border: 'none', // Remove border
          '&:hover': {
            border: 'none', // Remove border on hover
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Remove the outline
          },
        }}
        // onAccept={() => setTimePickerOpen(false)}
        // open={timePickerOpen}
        // onClose={handleTimePickerClose1}
      />
    </LocalizationProvider>
  );
};

export default TimeSelection;
