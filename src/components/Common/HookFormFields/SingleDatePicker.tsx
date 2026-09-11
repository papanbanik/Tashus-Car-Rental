import { DatePickerProps } from '@/types/componentTypes';
// import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
// import 'react-datepicker/dist/react-datepicker.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns/AdapterDateFns';
import enAU from 'date-fns/locale/en-AU';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import 'dayjs/locale/en-au';

// import { de, enGB, zhCN } from 'date-fns/locale';
// interface Locales {
//   [key: string]: Locale | undefined;
//   'en-us': undefined;
//   'en-gb': Locale;
//   'zh-cn': Locale;
//   de: Locale;
// }

// const locales: Locales = {
//   'en-us': undefined,
//   'en-gb': enGB,
//   'zh-cn': zhCN,
//   de,
// };
const SingleDatePicker = ({
  control,
  registerName,
  errors,
  placeholder,
  validateDate,
  required,
  disableFuture,
  disablePast,
  disableHighlightToday,
  shouldDisableDate,
  maxDate,
  minDate,
  disabled,
  pickerHeight,
  watch,
  errorColor,
  showRequired,
}: DatePickerProps) => {
  // console.log(errors);
  // const userLocale = navigator.language.toLowerCase();
  // console.log(userLocale);
  // const locale = locales[userLocale] || locales['en-us'];
  return (
    <div>
      <div className="grid relative">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
          <Controller
            control={control}
            name={registerName}
            rules={{
              required: required,
              validate: validateDate,
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              // console.log(value);
              return (
                <DatePicker
                  label={
                    <span className={`${value || !errors ? '' : 'text-error'}`}>
                      {placeholder}
                      {showRequired && <>{`*`}</>}
                    </span>
                  }
                  value={value}
                  disabled={disabled}
                  // value={value ? parseISO(value) : null}
                  disablePast={disablePast}
                  disableFuture={disableFuture}
                  disableHighlightToday={disableHighlightToday}
                  shouldDisableDate={shouldDisableDate}
                  onChange={onChange}
                  maxDate={maxDate}
                  minDate={minDate}
                  // format="dd/MM/yyyy"
                  slotProps={{ textField: { size: 'small' } }}
                  // sx={{
                  //   '& .MuiOutlinedInput-root': {
                  //     '& fieldset': {
                  //       borderColor: value || !errors ? '' : '#f87272',
                  //     },
                  //   },
                  // }}
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
      {/* {(errors || !validateDate) && <span className="text-error text-xs mt-2">{errors?.message}</span>} */}
    </div>
  );
};

export default SingleDatePicker;
