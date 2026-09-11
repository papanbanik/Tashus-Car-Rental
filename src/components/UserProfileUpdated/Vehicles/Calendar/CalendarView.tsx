'use client';
import StepHeader from '@/components/CarListing/StepHeader';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useEachVehicleBlocks } from '@/hooks/vehicle/useEachVehicleBlocks';
import { BlockDatesView } from '@/types/profileInfoTypes';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import BlockPickModal from './BlockPickModal';
import StepContainer from '@/components/CarListing/StepContainer';
import { IoAdd } from 'react-icons/io5';
// import EventEditModal from './EventEditModal';
// import BlockDate from './Modals/BlockDate';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetBlockDatesByCarId } from '@/hooks/car-search/useGetBlockDatesByCarId';
import { useReservationList } from '@/hooks/reservation/useReservationList';
import { getHostUpdatedReservation } from '@/utils/Functions/blockDatesValidationFn';
import { calendarLocalizer, customVehicleEditCalendarStyles } from '@/utils/Functions/calenderCommonFn';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { GoDotFill } from 'react-icons/go';
import EventModal from './EventModal';
import BlockPickUpdated from './Modals/BlockPickUpdated';
import EventEditModal from './Modals/EventEditModal';

const CalendarView = () => {
  useReservationList();
  useGetBlockDatesByCarId();
  useEachVehicleBlocks();
  const { reservationList } = useTravelContext();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const { singleCarBlockDates } = useSearchContext();
  // console.log(singleCarBlockDates);
  const [myEventsList, setMyEventsList] = useState<BlockDatesView[]>([]);
  const { openModal } = useModalContext();
  // console.log('Each Vehicle Data', data);
  // const params = useParams();
  // // console.log(params);
  // const userId = params['host-profile-id'];
  // const listingId = params['vehicle-id'];
  const { userId: userId, vehicleId: listingId } = useParams<{ userId: string; vehicleId: string }>();
  const { eachCalenderDetails } = useProfileInfoContext();

  // Modification
  useEffect(() => {
    if (userId && listingId) {
      let updatedEventsList: BlockDatesView[] = [];
      //Show BlockDates
      if (eachCalenderDetails?.length > 0) {
        updatedEventsList = eachCalenderDetails.map((event: any) => ({
          start: new Date(event.start),
          end: new Date(event.end),
          title: event.title || 'Unavailable',
          type: 'blockDate',
          originalTitle: event.title || formatFullDateTime(event.createdAt),
        }));
      }
      if (reservationList?.length > 0) {
        const reservationEvents: BlockDatesView[] = reservationList
          .filter((reservation) => reservation?.carListingId === parseInt(listingId))
          .map((reservation) => {
            const modifiedReservation = getHostUpdatedReservation(reservation);
            return {
              start: new Date(modifiedReservation?.startDate),
              end: new Date(modifiedReservation?.endDate),
              title:
                reservation?.reservationStatus === 'cancelled' ||
                reservation?.reservationStatus === 'cancelledByHost' ||
                reservation?.reservationStatus === 'cancelledByGuest'
                  ? 'Cancelled'
                  : 'Reservation',
              type: 'reservation',
              reservationStatus: reservation?.reservationStatus,
              price: `${modifiedReservation?.basePrice?.hostIncome ?? modifiedReservation?.basePrice?.totalPrice} AUD`,
            };
          });

        updatedEventsList = [...updatedEventsList, ...reservationEvents];
      }
      //Updated list
      setMyEventsList(updatedEventsList);
    }
  }, [eachCalenderDetails, reservationList, userId, listingId]);

  const handleClick = () => {
    openModal({
      title: 'Block Dates for Reservation',
      content: <BlockPickUpdated blockDates={singleCarBlockDates} />,
    });
  };
  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customVehicleEditCalendarStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const eventPropGetter = (event: any) => {
    let className = 'bg-secondary text-white';

    if (event?.type === 'reservation') {
      if (event?.reservationStatus === 'pending') {
        className = 'bg-warning text-white';
      } else if (event?.reservationStatus === 'confirmed') {
        className = 'bg-primary text-white';
      } else if (event?.reservationStatus === 'completed') {
        className = 'bg-success text-white';
      } else if (
        event?.reservationStatus === 'cancelled' ||
        event?.reservationStatus === 'cancelledByHost' ||
        event?.reservationStatus === 'cancelledByGuest'
      ) {
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

  //Render Modal Open
  const renderModal = () => {
    if (!selectedEvent) {
      return null;
    }
    if (selectedEvent.type === 'blockDate') {
      const currentDateConvert = getPickerTimeStringInUtc(dayjs(), true);
      const currentDate = currentDateConvert?.formattedTimeDayObj;
      // Render EventEditModal for block dates
      // return <EventEditModal isOpen={true} onClose={handleCloseModal} event={selectedEvent} />;
      if (dayjs(selectedEvent?.end).isAfter(currentDate)) {
        return <EventEditModal isOpen={true} onClose={handleCloseModal} event={selectedEvent} />;
      } else {
        return <EventModal isOpen={true} onClose={handleCloseModal} event={selectedEvent} />;
      }
    } else if (selectedEvent.type === 'reservation') {
      // Render EventModal for reservations
      return <EventModal isOpen={true} onClose={handleCloseModal} event={selectedEvent} />;
    }

    return null;
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
  // Filter specificCar
  const filteredReservationsByCarListing = reservationList.filter((reservation) => reservation?.carListingId === parseInt(listingId));
  //Filter Status
  const uniqueStatus = Array.from(new Set(filteredReservationsByCarListing.map((reservation) => reservation.reservationStatus)));
  //Set label
  const uniqueFilters = uniqueStatus.map((label) => {
    const matchingStatusFilter = StatusFilters.find((filterItem) => filterItem.status === label);
    return matchingStatusFilter;
  });
  //Get unique label
  const uniqueLabels = Array.from(new Set(uniqueFilters.map((filterItem) => filterItem?.label)));
  return (
    <div>
      <StepContainer>
        <StepHeader
          title="Vehicle Calendar"
          subtitle="The calendar provides a visual representation of reservations of this vehicle and allows you to manage unavailable dates efficiently"
        />
        <div className="px-4">
          <div className="flex justify-end">
            {/* <Typography className="mt-2">
              <span>Reservation Calender</span> | <span>Unavailable Dates</span>
            </Typography> */}
            <Button onClick={handleClick} variant="contained" className="bg-blue-600 normal-case text-white" startIcon={<IoAdd />}>
              Add Blocked Dates
            </Button>
          </div>
          {/* Show Indicator */}
          <div className={`flex flex-wrap justify-start items-center gap-1 mb-4`}>
            {uniqueLabels.map((label, index) => (
              <span key={index} className="flex items-center">
                <GoDotFill size={20} className={StatusFilters.find((item) => item.label === label)?.color || 'text-secondary'} />
                <span>{label}</span>
              </span>
            ))}
            {eachCalenderDetails?.length > 0 && (
              <span className="flex items-center">
                <GoDotFill size={20} className="text-zinc-500 md:ml-2" />
                <span>Blocked Dates</span>
              </span>
            )}
          </div>
          <div className="flex items-center justify-center mt-4">
            <Calendar
              localizer={calendarLocalizer}
              events={myEventsList}
              startAccessor="start"
              endAccessor="end"
              className="w-full"
              style={{ height: 500, width: '95%' }}
              eventPropGetter={eventPropGetter}
              onSelectEvent={handleEventSelect}
              showMultiDayTimes
              // length={1}
            />
          </div>
        </div>
      </StepContainer>
      {renderModal()}
    </div>
  );
};

export default CalendarView;
