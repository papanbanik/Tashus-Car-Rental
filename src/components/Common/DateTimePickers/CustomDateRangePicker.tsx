import { useModalContext } from '@/context/ModalProvider';
import { customStyles } from '@/utils/Functions/dateTimeCommonFn';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export type TDateRange = {
  startDate: Dayjs;
  endDate: Dayjs;
  key: string;
};

export interface ICustomDateRangePicker {
  selectedDates: any[];
  handleDateChange: (ranges: any) => void;
  disabled?: boolean;
  displayMode?: 'date' | 'dateRange';
}

const CustomDateRangePicker = ({ selectedDates, handleDateChange, displayMode }: ICustomDateRangePicker) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { closeModal } = useModalContext();

  // To hide left side bar
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <Box className="bg-white p-4 rounded-lg">
        <DateRangePicker
          displayMode={displayMode}
          ranges={selectedDates}
          onChange={handleDateChange}
          months={isSmallScreen ? 1 : 2}
          direction="horizontal"
          showMonthAndYearPickers={false}
          showDateDisplay={false}
          showMonthArrow={true}
          minDate={new Date()}
          rangeColors={['#800080']}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={closeModal} className="border-primary bg-white text-primary hover:text-white hover:bg-primary">
            OK
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomDateRangePicker;
