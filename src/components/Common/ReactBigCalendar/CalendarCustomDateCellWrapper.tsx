import React from 'react';
import { DateCellWrapperProps } from 'react-big-calendar';
import dayjs from 'dayjs';

const CalendarCustomDateCellWrapper = ({ children, value }: DateCellWrapperProps) => {
  const isPastDate = dayjs(value).isBefore(dayjs(), 'day');
  const isToday = dayjs(value).isSame(dayjs(), 'day');

  return (
    <div
      className={`w-full ${isToday && 'bg-secondary'} `}
      style={{
        backgroundColor: isPastDate ? '#BEBEBE' : 'inherit',
        pointerEvents: isPastDate ? 'none' : 'auto',
        opacity: isPastDate ? 0.2 : 1,
        borderRight: '1px solid rgba(0,0,0,0.1)', // Add default right border style
        borderLeft: '1px solid rgba(0,0,0,0.1)', // Add default left border style
        // borderRight: '2px solid lightGray',
      }}
    >
      {children}
    </div>
  );
};

export default CalendarCustomDateCellWrapper;
