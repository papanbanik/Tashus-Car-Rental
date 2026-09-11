import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Controller } from 'react-hook-form';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePickerProps } from '@/types/componentTypes';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import { parseISO } from 'date-fns';

const YearPicker = ({ control, registerName, placeholder, minDate, maxDate }: DatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        control={control}
        name={registerName}
        // rules={{
        //   validate: validateDate,
        // }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <DatePicker
            className="w-full"
            views={['year']}
            minDate={dayjs(minDate)}
            maxDate={dayjs(maxDate)}
            label={placeholder}
            // value={value ? parseISO(value) : null}
            // onChange={(date) => onChange(date?.getFullYear())}
            value={value ? dayjs(value) : null}
            onChange={(date) => onChange(date ? date.year() : null)}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default YearPicker;
