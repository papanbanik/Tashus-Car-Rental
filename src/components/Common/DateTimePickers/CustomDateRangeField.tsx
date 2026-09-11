import { customSxStyles } from '@/components/LandingPage/Hero/Date/DateTimeSection';
import { TCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { TDate } from '@/types/commonTypes';
import IconButton from '@mui/material/IconButton/IconButton';
import Popover from '@mui/material/Popover/Popover';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns/AdapterDateFns';
import { DateField } from '@mui/x-date-pickers/DateField/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { FaCalendarDay } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

export interface ICustomDateRangeField {
  id?: string | undefined;
  handleDateField: (newDate: any) => any;
  format?: string;
  dateValue?: Date;
  togglePicker?: any;
  handleClose?: () => void;
  isPickerOpen?: boolean;
  selectedDates: any[];
  handleDateChange: (ranges: any) => void;
  disableBlockDates?: Date[];
  customBlockDates?: TCarBlockDate[];
  anchorElement?: any;
  disabled?: boolean;
  minDate?: Date;
  moveRangeOnFirstSelection?: boolean;
  onDatePickerClose?: (startDate: TDate, endDate: TDate) => any;
}

const CustomDateRangeField = ({
  isPickerOpen,
  handleDateField,
  format,
  dateValue,
  togglePicker,
  selectedDates,
  handleDateChange,
  disableBlockDates,
  disabled,
  minDate,
  moveRangeOnFirstSelection,
  onDatePickerClose,
}: ICustomDateRangeField) => {
  const [clickCount, setClickCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setClickCount(0);
  }, []);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setClickCount(0);
  };

  const handleCurrentDateChange = (ranges: any) => {
    handleDateChange(ranges);

    const tempClickCount = clickCount + 1;
    setClickCount(tempClickCount);

    if (moment(ranges?.selection?.startDate).format('MM-DD-YYYY') !== moment(ranges?.selection?.endDate).format('MM-DD-YYYY')) {
      handleClose();
      onDatePickerClose && onDatePickerClose(ranges?.selection?.startDate, ranges?.selection?.endDate);
    } else if (ranges?.selection?.startDate === '' && ranges?.selection?.endDate === '') {
      handleClose();
      onDatePickerClose && onDatePickerClose(ranges?.selection?.startDate, ranges?.selection?.endDate);
    } else if (tempClickCount % 2 === 0) {
      handleClose();
      onDatePickerClose && onDatePickerClose(ranges?.selection?.startDate, ranges?.selection?.endDate);
    }
  };

  return (
    <div className="flex w-full sm:w-[300px] bg-white rounded-lg">
      <IconButton onClick={handleClick} disabled={disabled} edge="end" className="ml-1">
        {open ? <IoClose className="text-primary" /> : <FaCalendarDay className="text-primary" />}
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
          <div className="flex gap-4 bg-neutral p-2 overflow-auto">
            <DateRangePicker
              ranges={selectedDates}
              onChange={handleCurrentDateChange}
              moveRangeOnFirstSelection={moveRangeOnFirstSelection}
              months={1}
              direction="horizontal"
              showDateDisplay={false}
              showMonthArrow={true}
              minDate={minDate}
              rangeColors={['#800080']}
              showPreview
            />
          </div>
        )}
      </Popover>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div onClick={handleClick} className="flex justify-center items-center cursor-pointer flex-1">
          <DateField
            value={dayjs(selectedDates[0]?.startDate).toDate()}
            readOnly
            format={format || 'd MMM'}
            sx={customSxStyles.borderLessInputStyles}
            disabled={disabled}
            className="bg-transparent cursor-pointer flex-1"
          />
          <span className="mx-2 text-gray-600">{'-'}</span>
          <DateField
            value={dayjs(selectedDates[0]?.endDate).toDate()}
            readOnly
            format={format || 'd MMM'}
            sx={customSxStyles.borderLessInputStyles}
            disabled={disabled}
            className="bg-transparent flex-1"
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default CustomDateRangeField;
