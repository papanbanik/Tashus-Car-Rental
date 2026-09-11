import { CalenderFilterProps } from '@/types/user-profile/customPriceTypes';
// import { Button } from '@mui/material';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import dayjs from 'dayjs';
import { GoDotFill } from 'react-icons/go';

const CalenderFilter = ({
  displayDate,
  handleDateChange,
  handleCurrentDateClick,
  uniqueLabels,
  filteredStatusFilters,
  allBlockedDates,
}: CalenderFilterProps) => {
  return (
    <div>
      <div className="flex flex-col">
        {/* <SectionHeader
          title="Partner's Calendar"
          subtitle="The calendar provides a clear visualization of your vehicle bookings, showing when each vehicle is reserved by guests. It also marks the dates when your vehicles are not available."
          noMargin
        /> */}
        <span className="text-lg font-bold">{`Partner's Calendar`}</span>
        <span className="helping_text pb-4">{`The calendar provides a clear visualization of your vehicle bookings, showing when each vehicle is reserved by guests. It also marks the dates when your vehicles are not available.`}</span>
      </div>
      <div className={` flex flex-row p-2`}>
        {/* <div className="flex justify-between w-[310px]">
          <div className="w-1/2">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['month', 'year']}
                value={displayDate}
                onChange={handleDateChange}
                slotProps={{ textField: { size: 'small' } }}
                minDate={dayjs().year(2024).startOf('year').toDate()}
                maxDate={dayjs().add(1, 'year').endOf('year').toDate()}
              />
            </LocalizationProvider>
          </div>
          <Button variant="outlined" size="small" className="normal-case" onClick={handleCurrentDateClick}>
            Current Date
          </Button>
        </div> */}
        <div className={`flex flex-wrap justify-start items-center gap-1`}>
          {uniqueLabels?.map((label, index) => (
            <span key={index} className="flex flex-row">
              <GoDotFill size={20} className={filteredStatusFilters.find((item) => item.label === label)?.color || 'bg-secondary'} />
              <span>{label}</span>
            </span>
          ))}
          {allBlockedDates?.length > 0 && (
            <span className="flex flex-row">
              <GoDotFill size={20} className="text-zinc-500 md:ml-2" />
              <span>Blocked Dates</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalenderFilter;
