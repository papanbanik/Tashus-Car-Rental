import { StaticDateCalendarProps } from '@/types/componentTypes';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns/AdapterDateFns';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Controller } from 'react-hook-form';

const SingleDateCalendar = ({
  control,
  registerName,
  errors,
  validateDate,
  required,
  disableFuture,
  disablePast,
  disableHighlightToday,
  shouldDisableDate,
  maxDate,
  minDate,
  disabled,
  errorColor,
  handleClosePopover,
}: StaticDateCalendarProps) => {
  const handleChange = (newValue: Date) => {
    if (handleClosePopover) {
      handleClosePopover();
    }
  };

  return (
    <div>
      <div className="grid relative">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Controller
            control={control}
            name={registerName}
            rules={{
              required: required,
              validate: validateDate,
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <DateCalendar
                  value={value}
                  disabled={disabled}
                  disablePast={disablePast}
                  disableFuture={disableFuture}
                  disableHighlightToday={disableHighlightToday}
                  shouldDisableDate={shouldDisableDate}
                  onChange={(newValue) => {
                    onChange(newValue);
                    handleChange(newValue);
                  }}
                  maxDate={maxDate}
                  minDate={minDate}
                  sx={{
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                      borderColor: `${value || disabled ? '' : `${errorColor && '#f87272'}`}`,
                    },
                    '& .MuiInputLabel-outlined': {
                      color: `${value || disabled ? '' : `${errorColor && '#f87272'}`}`,
                    },
                  }}
                />
              );
            }}
          />
        </LocalizationProvider>
      </div>
      {errors && <span className="text-error text-xs mt-2">{errors?.message}</span>}
    </div>
  );
};

export default SingleDateCalendar;
