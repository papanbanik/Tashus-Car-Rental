'use client';
import SectionHeader from '@/components/CarListing/SectionHeader';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useReservationList } from '@/hooks/reservation/useReservationList';
import { useAllVehicleBlocks } from '@/hooks/vehicle/useAllVehicleBlocks';
import { calendarLocalizer, customStyles } from '@/utils/Functions/calenderCommonFn';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { GoDotFill } from 'react-icons/go';
import EventModal from '../Vehicles/Calendar/EventModal';

const UserCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const { data: blockDates } = useAllVehicleBlocks();
  // console.log(blockDates);
  const { data } = useReservationList();
  // console.log(data);
  const { allCalenderDetails } = useProfileInfoContext();
  const { reservationList } = useTravelContext();
  // console.log(reservationList);
  // console.log(allCalenderDetails);

  /*All Blocked Dates Event */
  // const carListings = data?.data?.data || [];
  const carListings = Array.isArray(allCalenderDetails) ? allCalenderDetails : [];
  //The date after problem
  const allBlockedDates = carListings.reduce((acc: any, carListing: any) => {
    // const carListingId = carListing?.carListingId;
    const carNickName = carListing?.carListingInfo?.carNickName;
    const eventsForCarListing = carListing.blockedDates.map((item: any) => {
      // const start = dayjs(item.start).toDate();
      // const end = dayjs(item.end).toDate();
      const title = item.title.trim() !== '' ? item.title : 'Unavailable';
      // console.log(carListing.blockedDates);
      return {
        start: new Date(item.start),
        end: new Date(item.end),
        // title: `${item.title} (${carListingId})`,
        // title: `${title} (${carListingId})`,
        title: `${title} (${carNickName})`,
        type: 'blockDate',
      };
    });
    return acc.concat(eventsForCarListing);
  }, []);
  /*Reservation Dates Blocked Event List */
  //Revised Check Add
  const handleModifiedReservation = (reservation: any) => {
    if (reservation?.revisedReservations && reservation?.revisedReservations.length > 0) {
      const paidRevisedReservations = reservation?.revisedReservations.filter(
        (revisedReservation: any) => revisedReservation?.paymentStatus === 'paid'
      );

      if (paidRevisedReservations.length > 0) {
        const lastRevisedReservation = paidRevisedReservations[paidRevisedReservations.length - 1];
        return {
          startDate: dayjs(lastRevisedReservation?.newStartDate).toDate(),
          endDate: dayjs(lastRevisedReservation?.newEndDate).toDate(),
        };
      }
    }
    return {
      startDate: dayjs(reservation?.startDate).toDate(),
      endDate: dayjs(reservation?.endDate).toDate(),
    };
  };
  const reservationEvents =
    // reservationDetails?.reservations.map((reservation: any) => {
    (reservationList || []).map((reservation: any) => {
      const modifiedReservation = handleModifiedReservation(reservation);
      const start = modifiedReservation?.startDate;
      const end = modifiedReservation?.endDate;
      // const title = `${reservation?.carInfo?.model}`;
      const title = `${reservation?.carInfo?.carNickName}`;
      const price = `${reservation?.basePrice?.totalPrice} AUD`;
      const reservationStatus = reservation?.reservationStatus;
      const type = 'reservation';
      return { start, end, title, reservationStatus, price, type };
    }) || [];

  const allEvents = [...allBlockedDates, ...reservationEvents];
  /*Status Color Changed */
  const eventPropGetter = (event: any) => {
    let className = 'bg-secondary text-white';
    if (event?.type === 'reservation') {
      if (event?.reservationStatus === 'pending') {
        // console.log(event?.reservationStatus);
        className = 'bg-warning text-white';
      } else if (event?.reservationStatus === 'confirmed') {
        className = 'bg-primary text-white';
      } else if (event?.reservationStatus === 'completed') {
        className = 'bg-success text-white';
      } else if (event?.reservationStatus === 'cancelled' || 'cancelledByHost' || 'cancelledByGuest') {
        className = 'bg-error text-white';
      }
    }
    if (event?.type === 'blockDate') {
      className = 'bg-zinc-500 text-white';
    }
    return {
      className,
    };
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  //Color Filter
  const StatusFilters = [
    { status: 'confirmed', color: 'text-primary', label: 'Confirmed' },
    { status: 'pending', color: 'text-warning md:ml-2', label: 'Pending' },
    { status: 'completed', color: 'text-success md:ml-2', label: 'Completed' },
    // { status: 'cancelled' || 'cancelledByHost' || 'cancelledByGuest', color: 'text-error md:ml-2', label: 'Cancelled' },
    { status: 'cancelled', color: 'text-error md:ml-2', label: 'Cancelled' },
    { status: 'cancelledByHost', color: 'text-error md:ml-2', label: 'Cancelled' },
    { status: 'cancelledByGuest', color: 'text-error md:ml-2', label: 'Cancelled' },
  ];
  const filteredStatusFilters = StatusFilters.filter((filterItem) => {
    return reservationList?.some((reservation: any) => reservation?.reservationStatus === filterItem.status);
  });
  const uniqueLabels = Array.from(new Set(filteredStatusFilters.map((filterItem) => filterItem.label)));
  return (
    <div className="lg:w-[1000px] w-full">
      <div className="flex-row md:px-12 md:py-8 bg-white px-2  py-4 rounded-xl shadow-lg  mx-4  ">
        <SectionHeader
          title="Partner's Calendar"
          subtitle="The calendar provides a clear visualization of all your vehicle bookings, showing when each vehicle is reserved by guests. It also marks the dates when your vehicles are not available."
          noMargin
        />
        <div className={`flex flex-wrap justify-start items-center gap-1 my-4`}>
          {/* {filteredStatusFilters.map((filterItem, index) => (
            <span key={index} className="flex flex-row">
              <GoDotFill size={20} className={filterItem.color} />
              <span>{filterItem.label}</span>
            </span>
          ))} */}
          {uniqueLabels.map((label, index) => (
            <span key={index} className="flex items-center">
              <GoDotFill size={20} className={filteredStatusFilters.find((item) => item.label === label)?.color || 'bg-secondary'} />
              <span>{label}</span>
            </span>
          ))}
          {allBlockedDates?.length > 0 && (
            <span className="flex items-center">
              <GoDotFill size={20} className="text-zinc-500 md:ml-2" />
              <span>Blocked Dates</span>
            </span>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Calendar
            localizer={calendarLocalizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            className="w-full"
            style={{ height: 500, width: '100%' }}
            eventPropGetter={eventPropGetter}
            onSelectEvent={handleEventSelect}
            showMultiDayTimes
          />
        </div>
      </div>
      <EventModal isOpen={!!selectedEvent} onClose={handleCloseModal} event={selectedEvent} />
    </div>
  );
};

export default UserCalendar;
