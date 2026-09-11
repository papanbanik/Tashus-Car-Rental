import { useSearchContext } from '@/context/SearchProvider';
import { TCalendarIndicatorList, TVehicleCalendarData } from '@/types/car-search/availabilityValidationTypes';
import { TCommonDateRange } from '@/types/commonTypes';
import { calendarLocalizer, customStyles } from '@/utils/Functions/calenderCommonFn';
import { getUpdatedReservationDates } from '@/utils/Functions/reservationValidationFn';
import { getReservationDateList } from '@/utils/Functions/searchCommonFn';
import { dayjsUtc } from '@/utils/Functions/utcCommonFn';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, ToolbarProps } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { GoDotFill } from 'react-icons/go';
import CalendarCustomDateCellWrapper from '../ReactBigCalendar/CalendarCustomDateCellWrapper';
import RBCCustomToolbar from '../ReactBigCalendar/RBCCustomToolbar';
import CarDetailsSectionDivider from './CarDetailsSectionDivider';
import CarDetailsSectionTitle from './CarDetailsSectionTitle';

const VehicleUnavailabilityCalendar = () => {
  const params = useSearchParams();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const [eventList, setEventList] = useState<TVehicleCalendarData[]>([]);
  const [unavailableEventList, setUnavailableEventList] = useState<TVehicleCalendarData[]>([]);
  // const [userEventList, setUserEventList] = useState<TVehicleCalendarData[]>([]);
  const [calendarIndicatorList, setCalendarIndicatorList] = useState<TCalendarIndicatorList[]>([
    { status: 'today', color: 'text-secondary', active: false, label: 'Today' },
    { status: 'blocked', color: 'text-zinc-500', active: false, label: 'Unavailable' },
    { status: 'reserved', color: 'text-primary', active: false, label: 'Reserved' },
    { status: 'user', color: 'text-success', active: false, label: 'Your selected dates' },
  ]);
  const [defaultDate, setDefaultDate] = useState<Date>(new Date());

  const { singleCarReservationList, singleCarBlockDates, setUserSelectingDateList, userSelectingDateList, availabilityErrorText } =
    useSearchContext();

  useEffect(() => {
    setEventList([]);
    setUnavailableEventList([]);
    // setUserEventList([]);
    const style = document.createElement('style');
    style.innerHTML = customStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    setDefaultDate(dayjs(params?.get('pickup')).toDate());
  }, [params]);

  useEffect(() => {
    if (singleCarReservationList?.length > 0 || singleCarBlockDates?.allDayList?.length > 0 || singleCarBlockDates?.customList?.length > 0) {
      try {
        handleUpdate();
      } catch (error) {
        console.log(error);
      }
    }
  }, [singleCarReservationList, singleCarBlockDates]);

  // useEffect(() => {
  //   setUserEventList([]);
  //   // console.log(userSelectingDateList);
  //   if (userSelectingDateList?.length > 0) {
  //     try {
  //       handleUserSelectingDates();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }, [userSelectingDateList, params]);

  useEffect(() => {
    if (availabilityErrorText) {
      setUserSelectingDateList([]);
    }
  }, [availabilityErrorText]);

  useEffect(() => {
    let tempIndicatorList = [...calendarIndicatorList];
    const reservationList = unavailableEventList?.filter((event) => event?.title === 'Reserved');
    const blockedList = unavailableEventList?.filter((event) => event?.title === 'Unavailable');

    tempIndicatorList = calendarIndicatorList.map((indicator) => {
      if (reservationList?.length > 0 && indicator.status === 'reserved') {
        const tempIndicator = reservationList?.length > 0 ? { ...indicator, active: true } : { ...indicator, active: false };
        return tempIndicator;
      } else if (blockedList?.length > 0 && indicator.status === 'blocked') {
        const tempIndicator = unavailableEventList?.length > 0 ? { ...indicator, active: true } : { ...indicator, active: false };
        return tempIndicator;
      } else if (indicator.status === 'today') {
        const tempIndicator = { ...indicator, active: true };
        return tempIndicator;
      } else {
        return indicator;
      }

      // if (indicator.status === 'user') {
      //   const tempIndicator = userEventList?.length > 0 ? { ...indicator, active: true } : { ...indicator, active: false };
      //   return tempIndicator;
      // } else if (reservationList?.length > 0 && indicator.status === 'reserved') {
      //   const tempIndicator = reservationList?.length > 0 ? { ...indicator, active: true } : { ...indicator, active: false };
      //   return tempIndicator;
      // } else if (blockedList?.length > 0 && indicator.status === 'blocked') {
      //   const tempIndicator = userEventList?.length > 0 ? { ...indicator, active: true } : { ...indicator, active: false };
      //   return tempIndicator;
      // } else {
      //   return indicator;
      // }
    });

    setCalendarIndicatorList(tempIndicatorList);

    setEventList([...unavailableEventList]);
  }, [unavailableEventList]);
  //   setEventList([...userEventList, ...unavailableEventList]);
  // }, [userEventList, unavailableEventList]);

  // const handleUserSelectingDates = () => {
  //   let tempEventList: TVehicleCalendarData[] = [];
  //   const listLength = userSelectingDateList?.length;
  //   userSelectingDateList?.map((selectedDate, index) => {
  //     if (listLength === 1) {
  //       const tempEvent: TVehicleCalendarData = {
  //         start: dayjs(params?.get('pickup')).toDate(),
  //         end: dayjs(params?.get('return')).toDate(),
  //         title: `$${selectedDate?.dayPrice}`,
  //         allDay: false,
  //       };
  //       // console.log(tempEvent);
  //       tempEventList.push(tempEvent);
  //       return;
  //     }

  //     if (index === 0) {
  //       const tempEvent: TVehicleCalendarData = {
  //         start: dayjs(selectedDate?.date).toDate(),
  //         end: dayjs(selectedDate?.date).endOf('day').toDate(),
  //         title: `$${selectedDate?.dayPrice}`,
  //         allDay: false,
  //       };
  //       tempEventList.push(tempEvent);
  //     } else if (index === listLength - 1) {
  //       const tempEvent = {
  //         start: dayjs(selectedDate?.date).startOf('day').toDate(),
  //         end: dayjs(selectedDate?.date).toDate(),
  //         title: `$${selectedDate?.dayPrice}`,
  //         allDay: false,
  //       };
  //       tempEventList.push(tempEvent);
  //     } else {
  //       const tempEvent = {
  //         start: dayjs(selectedDate?.date).startOf('day').toDate(),
  //         end: dayjs(selectedDate?.date).endOf('day').toDate(),
  //         title: `$${selectedDate?.dayPrice}`,
  //         allDay: true,
  //       };
  //       tempEventList.push(tempEvent);
  //     }
  //   });

  //   setUserEventList(tempEventList);
  // };

  const handleUpdate = async () => {
    let tempEventList: TVehicleCalendarData[] = [];
    const filteredCancelReservations = singleCarReservationList?.filter(
      (reservation: any) =>
        reservation?.reservationStatus !== 'cancelledByGuest' &&
        reservation?.reservationStatus !== 'cancelledByHost' &&
        reservation?.reservationStatus !== 'cancelled'
    );
    const tempList: TCommonDateRange[] = (await getUpdatedReservationDates(filteredCancelReservations)) || [];
    const reservationDateList: TVehicleCalendarData[] = (await getReservationDateList(tempList)) || [];

    const updatedAllDayList: TVehicleCalendarData[] =
      singleCarBlockDates?.allDayList?.map((item) => ({
        start: dayjsUtc(item?.start).toDate(),
        end: dayjsUtc(item?.end).toDate(),
        title: 'Unavailable',
        // allDay: true,
      })) || [];

    const updatedCustomDayList: TVehicleCalendarData[] =
      singleCarBlockDates?.customList?.map((item) => ({
        start: dayjsUtc(item?.start).toDate(),
        end: dayjsUtc(item?.end).toDate(),
        title: 'Unavailable',
        // allDay: false,
      })) || [];

    tempEventList = [...reservationDateList, ...updatedAllDayList, ...updatedCustomDayList];

    setUnavailableEventList(tempEventList);
  };

  const eventPropGetter = (event: any) => {
    let className = 'bg-zinc-500 text-white';
    if (event?.title === 'Reserved') {
      className = 'bg-zinc-500 text-white';
      // className = 'bg-primary text-white';
    } else if (event?.title?.includes('$')) {
      className = 'bg-success text-white';
    }

    return {
      className,
    };
  };

  return (
    <div id="vehicle-calendar">
      {/* {eventList?.length > 0 && ( */}
      <>
        <CarDetailsSectionTitle sectionTitle="Vehicle Availability"></CarDetailsSectionTitle>

        <div className="flex flex-wrap justify-start items-center gap-1 mb-4">
          {calendarIndicatorList?.map((indicator) => (
            <span key={indicator?.status} className={`${indicator?.color} flex justify-start items-center ${indicator?.active ? 'block' : 'hidden'}`}>
              <GoDotFill size={20} />
              <span>{indicator.label}</span>
            </span>
          ))}
        </div>
      </>
      {/* )} */}

      {/* {eventList?.length > 0 && ( */}
      <div className={`${isSmallScreen ? 'overflow-x-auto' : 'w-full'}`}>
        <Calendar
          key={defaultDate.toString()}
          localizer={calendarLocalizer}
          events={eventList}
          startAccessor="start"
          endAccessor="end"
          defaultView={isSmallScreen ? 'month' : 'week'}
          defaultDate={defaultDate}
          step={90}
          showMultiDayTimes
          // max={dayjs().endOf('day').subtract(1, 'hours').toDate()}
          // views={{ week: { step: 120 } }}
          views={['week', 'month']}
          className={`${isSmallScreen ? 'w-[700px] text-sm' : 'w-full'}`}
          style={{ height: 500, width: '100%' }}
          // eventPropGetter={() => ({
          //   style: {
          //     backgroundColor: '#800080',
          //     // bordersColor: '#800080',
          //     color: 'white',
          //     opacity: 0.9,
          //   },
          // })}
          eventPropGetter={eventPropGetter}
          // min={new Date()}
          // onSelectEvent={handleEventSelect}
          components={{
            dateCellWrapper: (props) => <CalendarCustomDateCellWrapper {...props} />,
            toolbar: (props) => <RBCCustomToolbar {...(props as ToolbarProps)} />,
          }}
        />
      </div>
      {/* )} */}

      <CarDetailsSectionDivider></CarDetailsSectionDivider>
    </div>
  );
};

export default VehicleUnavailabilityCalendar;
