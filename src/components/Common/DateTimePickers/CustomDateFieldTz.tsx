import { customSxStyles } from '@/components/LandingPage/Hero/Date/DateTimeSection';
import { TCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { getMinSelectableDate } from '@/utils/Functions/utcCommonFn';
import IconButton from '@mui/material/IconButton/IconButton';
import Popover from '@mui/material/Popover/Popover';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3/AdapterDateFnsV3';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns/AdapterDateFns';
import { DateField } from '@mui/x-date-pickers/DateField/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { FaCalendarDay } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

// export interface ICustomDateField {
//   handleDateField: (newDate: any) => any;
//   format?: string;
//   dateValue?: Date;
//   togglePicker: () => void;
//   // togglePicker: (event: React.MouseEvent<HTMLButtonElement>) => void;
//   isPickerOpen: boolean;
//   selectedDates: any[];
//   handleDateChange: (ranges: any) => void;
//   disableBlockDates?: Date[];
//   customBlockDates?: TCarBlockDate[];
// }

export interface ICustomDateFieldTz {
  id?: string | undefined;
  handleDateField: (newDate: any) => any;
  format?: string;
  dateValue?: Date;
  // togglePicker: () => void;
  togglePicker?: any;
  // togglePicker: ((event: React.MouseEvent<HTMLButtonElement>) => void);
  handleClose?: () => void;
  isPickerOpen?: boolean;
  selectedDates: any[];
  handleDateChange: (ranges: any) => void;
  disableBlockDates?: Date[];
  customBlockDates?: TCarBlockDate[];
  anchorElement?: any;
  disabled?: boolean;
  isReturnDate?: boolean;
}

const CustomDateFieldTz = ({
  isPickerOpen,
  handleDateField,
  format,
  dateValue,
  togglePicker,
  selectedDates,
  handleDateChange,
  disableBlockDates,
  disabled,
  isReturnDate = false,
}: ICustomDateFieldTz) => {
  const [scrollCompleted, setScrollCompleted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleScrollComplete = () => {
    setScrollCompleted(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCurrentDateChange = (ranges: any) => {
    // console.log(ranges);
    handleDateChange(ranges);
    handleClose();
  };

  let minSelectableDate = getMinSelectableDate();

  return (
    <div className="flex">
      <IconButton onClick={handleClick} disabled={disabled} edge="end" className="ml-1">
        {open ? <IoClose /> : <FaCalendarDay />}
      </IconButton>
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
          <div className="flex gap-4 bg-neutral p-2">
            <DateRangePicker
              // editableDateInputs={true}
              ranges={selectedDates}
              onChange={handleCurrentDateChange}
              moveRangeOnFirstSelection={false}
              months={1}
              direction="horizontal"
              // showMonthAndYearPickers={false}
              showDateDisplay={false}
              showMonthArrow={true}
              minDate={minSelectableDate}
              rangeColors={['#800080']}
              disabledDates={disableBlockDates}
              shownDate={isReturnDate ? selectedDates[0].endDate : selectedDates[0].startDate}
            />
          </div>
        )}
      </Popover>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateField
          value={dayjs.utc(dateValue).toDate()}
          timezone="UTC"
          readOnly
          onClick={handleClick}
          // onChange={(newValue) => handleDateField(newValue)}
          format={format || 'MMM d'}
          // format="MMM d" //"dd-MM-yy"
          sx={customSxStyles.borderLessInputStyles}
          disabled={disabled}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDateFieldTz;
