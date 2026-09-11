import { TCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { customSxStyles } from '@/utils/Functions/commonStyleFn';
import { getMinSelectableDate } from '@/utils/Functions/utcCommonFn';
import IconButton from '@mui/material/IconButton/IconButton';
import Popover from '@mui/material/Popover/Popover';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns/AdapterDateFns';
import { DateField } from '@mui/x-date-pickers/DateField/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { FaCalendarDay } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

export interface ICustomDateField {
  id?: string | undefined;
  format?: string;
  dateValue?: Date;
  handleClose?: () => void;
  selectedDates: any[];
  handleDateChange: (ranges: any) => void;
  disableBlockDates?: Date[];
  customBlockDates?: TCarBlockDate[];
  anchorElement?: any;
  disabled?: boolean;
  label?: string;
  hideButton?: boolean;
  showUtc?: boolean;
  isReturnDate?: boolean;
}

const SearchDateField = ({
  format,
  dateValue,
  selectedDates,
  handleDateChange,
  disableBlockDates,
  disabled,
  label,
  hideButton,
  showUtc,
  isReturnDate = false,
}: ICustomDateField) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCurrentDateChange = (ranges: any) => {
    handleDateChange(ranges);
    handleClose();
  };

  let minSelectableDate = getMinSelectableDate();

  return (
    <div className="flex">
      {!hideButton && (
        <IconButton onClick={handleClick} disabled={disabled} edge="end" className="ml-1">
          {open ? <IoClose /> : <FaCalendarDay />}
        </IconButton>
      )}
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
              ranges={selectedDates}
              onChange={handleCurrentDateChange}
              moveRangeOnFirstSelection={false}
              months={1}
              direction="horizontal"
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
          value={showUtc ? dayjs.utc(dateValue).toDate() : dayjs(dateValue).toDate()}
          timezone={showUtc ? 'UTC' : 'default'}
          readOnly
          onClick={handleClick}
          format={format || 'd MMM'}
          sx={{
            ...customSxStyles.customDateTimeInputSx,
            '& .MuiFormLabel-root': {
              // marginBottom: '-4px', // Adjust this value to reduce space between label and date input
            },
          }}
          disabled={disabled}
          label={label}
        />
      </LocalizationProvider>
    </div>
  );
};

export default SearchDateField;
