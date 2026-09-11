import CommonTextIcon from '@/components/Common/CommonTextIcon';
import PriceDisplay from '@/components/UserProfileUpdated/UserCalendar/AdvancedCalender/CalendarRender/PriceDisplay';
import ResourceCard from '@/components/UserProfileUpdated/UserCalendar/AdvancedCalender/CalendarRender/ResourceCard';
import { ItemRendererProps, OptionType, PriceInfoItem } from '@/types/user-profile/customPriceTypes';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Moment } from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { dayjsUtc, getPickerDateUtc } from './utcCommonFn';

export const labelFormat = ([startTime, endTime]: [Moment, Moment]) => {
  const startMonth = startTime.format('MMMM');
  const endMonth = endTime.format('MMMM');
  const startYear = startTime.format('YYYY');
  const endYear = endTime.format('YYYY');
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startYear}`;
  } else if (startMonth === endMonth && startYear !== endYear) {
    return `${startMonth} ${startYear}/${endYear}`;
  } else if (startMonth !== endMonth && startYear === endYear) {
    return `${startMonth}/${endMonth} ${startYear}`;
  } else {
    return `${startMonth}/${endMonth} ${startYear}/${endYear}`;
  }
};

export const generateUniqueID = (prefix: string, carId: string | number) => {
  let counter = 0;
  counter++;
  return `${prefix}_${carId}_${Math.random().toString(36).substring(2, 11)}_${counter}`;
};

// export const handleModifiedReservation = (reservation: any) => {
//   if (reservation?.revisedReservations && reservation?.revisedReservations.length > 0) {
//     const paidRevisedReservations = reservation?.revisedReservations.filter(
//       (revisedReservation: any) => revisedReservation?.paymentStatus === 'paid'
//     );

//     if (paidRevisedReservations.length > 0) {
//       const lastRevisedReservation = paidRevisedReservations[paidRevisedReservations.length - 1];
//       return {
//         startDate: dayjs(lastRevisedReservation?.newStartDate).toDate(),
//         endDate: dayjs(lastRevisedReservation?.newEndDate).toDate(),
//       };
//     }
//   }
//   return {
//     startDate: dayjs(reservation?.startDate).toDate(),
//     endDate: dayjs(reservation?.endDate).toDate(),
//   };
// };
export const handleModifiedReservation = (reservation: any) => {
  const { startDate, endDate, basePrice } = reservation;
  let lastRevision: any = reservation?.revisedReservations?.slice(-1)?.[0];
  let isEditPaymentExpired: boolean = false;
  if (lastRevision?.paymentStatus === 'pending') {
    isEditPaymentExpired = dayjs().diff(dayjs(lastRevision?.createdAt), 'minute') > 30;
  }
  // if last revision payment is expired, take the last not pending revision
  if (isEditPaymentExpired) {
    lastRevision = reservation?.revisedReservations?.filter((revised: any) => revised?.paymentStatus !== 'pending').slice(-1)?.[0];
  }
  const updatedTravelData = {
    pickupDate: lastRevision?.newStartDate || startDate,
    returnDate: lastRevision?.newEndDate || endDate,
    totalPrice: lastRevision?.basePrice?.totalPrice || basePrice?.totalPrice,
  };
  return updatedTravelData;
};
//Default Date Set
export const startOfWeek = dayjs().startOf('week').toDate();
export const endOfWeek = dayjs().endOf('week').toDate();

export const setToMidnightUTC = (time: number | Date | null) => {
  return dayjs(time).utc().hour(0).minute(0).second(0).millisecond(0).toDate();
};
// export const setToMidnightLocal = (time: number | Date | null): Date | null => {
//   if (time === null) return null;
//   const date = dayjs(time);
//   const year = date.year();
//   const month = date.month();
//   const day = date.date();

//   const midnightDate = new Date(year, month, day, 0, 0, 0, 0);

//   return midnightDate;
// };

// export const createDateAtMidnight = (day: number, month: number, year: number): Date => {
//   return new Date(year, month, day, 0, 0, 0, 0);
// };
// export const createDateAtMidnight = (day: number, month: number, year: number): Date => {
//   return dayjs().utc().date(day).month(month).year(year).hour(0).minute(0).second(0).millisecond(0).toDate();
// };
export const createCustomDateAtMidnight = (date: Date | null): Date => {
  const day = dayjs(date).date();
  const month = dayjs(date).month();
  const year = dayjs(date).year();
  return dayjs().utc().date(day).month(month).year(year).hour(0).minute(0).second(0).millisecond(0).toDate();
};
// export const setToMidnightUTC = (time: number | Date | null) => {
//   const date = dayjs(time).toDate();
//   const setHours = date.setUTCHours(0, 0, 0, 0);
//   return new Date(setHours);
// };
//Default Zoom
// Function to get the duration for a week in milliseconds
const getWeekDuration = () => {
  const startOfWeek = dayjs().startOf('week');
  const endOfWeek = dayjs().endOf('week');
  return endOfWeek.diff(startOfWeek);
};
export const fixedZoom = getWeekDuration();
//export const maxZoom = 365 * 24 * 60 * 60 * 1000; // Set maximum zoom to a year
//export const maxZoom = 30 * 24 * 60 * 60 * 1000; // Set maximum zoom to a year days
// export const maxZoom = 14 * 24 * 60 * 60 * 1000; // Set maximum zoom to 2 weeks
//export const maxZoom = 7 * 24 * 60 * 60 * 1000; // Set maximum zoom to 1 week
//export const minZoom = 60 * 60 * 24 * 1000; // Set minimum zoom to a day
// export const maxZoom = dayjs.duration(1, 'year').valueOf();
// export const minZoom = dayjs.duration(1, 'day').valueOf();

// Calculate canvas start date and canvas end date
export const canvasStartDate = getPickerDateUtc(dayjs());
export const canvasEndDate = dayjsUtc().add(1, 'year').endOf('day').toDate();
// export const canvasStartDate = dayjs().startOf('day').toDate();
// export const canvasEndDate = dayjs().add(1, 'year').endOf('day').toDate();

// Function to generate group info
export const generateGroupsInfo = (
  userVehicleList: any,
  isCheckedMap: { [listingId: string]: boolean },
  setIsCheckedMap: Dispatch<SetStateAction<{ [listingId: string]: boolean }>>
) => {
  const groups = userVehicleList.map((vehicle: any, index: number) => {
    const { car, photos, carNickName, listingId, rates } = vehicle;
    const coverPhoto = photos?.coverPhoto?.imageInfo?.secure_url;
    return {
      id: listingId,
      title: (
        <ResourceCard
          key={index}
          car={car}
          coverPhoto={coverPhoto}
          carNickName={carNickName}
          listingId={listingId}
          setIsChecked={(isChecked: boolean) => {
            setIsCheckedMap((prev) => ({ ...prev, [listingId]: isChecked }));
          }}
          isChecked={isCheckedMap[listingId] || false}
        />
      ),
      dailyPrice: rates?.dailyRates?.amount,
      hourlyPrice: rates?.hourlyRates?.amount,
      isSelected: isCheckedMap[listingId] || false,
      vehicleName: `${carNickName} (${listingId})`,
    };
  });
  return groups;
};
// Function to generate reservation info
export const generateReservationInfo = (reservationList: any) => {
  const reservationEvents = reservationList?.map((reservation: any, index: number) => {
    const modifiedReservation = handleModifiedReservation(reservation);
    return {
      id: `reservationInfo_${index + 1}`,
      group: reservation?.carListingId,
      title: reservation?.carInfo?.carNickName ? `${reservation?.carInfo?.carNickName} (${reservation?.reservationId})` : 'Reservation',
      start_time: dayjs(modifiedReservation?.pickupDate).toDate(),
      end_time: dayjs(modifiedReservation?.returnDate).toDate(),
      // start_time: moment.utc(modifiedReservation?.startDate),
      // end_time: moment.utc(modifiedReservation?.endDate),
      type: 'reservation',
      status: reservation?.reservationStatus,
      // price: `$${reservation?.basePrice?.totalPrice}`,
      price: `$${modifiedReservation?.totalPrice}`,
    };
  });
  return reservationEvents;
};
// Function to generate block dates info
export const generateBlockDatesInfo = (allCalenderDetails: any) => {
  //const initialId = reservationEvents.length > 0 ? Math.max(...reservationEvents.map((event: any) => Number(event.id))) + 1 : 1;
  const blockedDates = (Array.isArray(allCalenderDetails) ? allCalenderDetails : []).flatMap((carListing: any) =>
    carListing.blockedDates.map((item: any, index: number) => ({
      id: `blockInfo_${index + 1}`,
      group: carListing?.carListingId,
      title: item.title.trim() !== '' ? item.title : 'Self Use',
      start_time: dayjs(item.start).toDate(),
      end_time: dayjs(item.end).toDate(),
      type: 'blockDate',
    }))
  );
  return blockedDates;
};

// Function to generate price info
// export const generatePriceInfoItems = (groups: any) => {
//   const priceInfoItems: any[] = [];
//   let currentDate = dayjs(canvasStartDate);
//   while (currentDate.isBefore(canvasEndDate, 'day') || currentDate.isSame(canvasEndDate, 'day')) {
//     groups.forEach((carPrice: any, index: number) => {
//       const startTime = currentDate.startOf('day').toDate();
//       const endTime = currentDate.endOf('day').toDate();
//       const priceInfoItem = {
//         id: generateUniqueID('priceInfo', carPrice?.id),
//         group: carPrice?.id,
//         title: ``,
//         type: 'priceInfo',
//         start_time: startTime,
//         end_time: endTime,
//         dailyPrice: carPrice?.dailyPrice,
//         hourlyPrice: carPrice?.hourlyPrice,
//       };

//       priceInfoItems.push(priceInfoItem);
//     });
//     currentDate = currentDate.add(1, 'day');
//   }

//   return priceInfoItems;
// };
// export const generatePriceInfoItems = (groups: any, reservationEvents: any, blockedDates: any) => {
//   const priceInfoItems: any[] = [];
//   let currentDate = dayjs(canvasStartDate);
//   dayjs.extend(isBetween);

//   while (currentDate.isBefore(canvasEndDate, 'day') || currentDate.isSame(canvasEndDate, 'day')) {
//     groups.forEach((carPrice: any, index: number) => {
//       const startTime = currentDate.startOf('day');
//       const endTime = currentDate.endOf('day');
//       // Check if the time range overlaps with any existing events
//       const isOverlapping = [...reservationEvents, ...blockedDates].some((event) => {
//         if (event?.group !== carPrice?.id) {
//           return false;
//         }
//         const eventStartTime = dayjs(event.start_time);
//         const eventEndTime = dayjs(event.end_time);
//         return startTime.isBetween(eventStartTime, eventEndTime, null, '[]') || endTime.isBetween(eventStartTime, eventEndTime, null, '[]');
//       });
//       if (!isOverlapping) {
//         const priceInfoItem = {
//           // id: `vehicleInfo_${carPrice?.id}_${index + 1}`,
//           id: generateUniqueID('priceInfo', carPrice?.id),
//           group: carPrice?.id,
//           title: '',
//           type: 'priceInfo',
//           start_time: startTime.toDate(),
//           end_time: endTime.toDate(),
//           dailyPrice: carPrice.dailyPrice,
//           hourlyPrice: carPrice.hourlyPrice,
//         };
//         priceInfoItems.push(priceInfoItem);
//       }
//     });
//     currentDate = currentDate.add(1, 'day');
//   }
//   return priceInfoItems;
// };
export const generatePriceInfoItems = (groups: any, reservationEvents: any, blockedDates: any) => {
  const priceInfoItems: any[] = [];
  let currentDate = dayjsUtc(canvasStartDate);
  dayjs.extend(isBetween);
  if (Array.isArray(groups)) {
    while (currentDate.isBefore(canvasEndDate, 'day') || currentDate.isSame(canvasEndDate, 'day')) {
      groups.forEach((carPrice: any, index: number) => {
        const startTime = currentDate.startOf('day');
        const endTime = currentDate.endOf('day');
        // Check if the time range overlaps with any existing events
        const isOverlapping = [...reservationEvents, ...blockedDates].some((event) => {
          if (event?.group !== carPrice?.listingId) {
            return false;
          }
          const eventStartTime = dayjs(event.start_time);
          const eventEndTime = dayjs(event.end_time);
          return startTime.isBetween(eventStartTime, eventEndTime, null, '[]') || endTime.isBetween(eventStartTime, eventEndTime, null, '[]');
        });
        // if (!isOverlapping) {
        //   let dailyPrice = carPrice?.rates?.dailyRates?.amount;
        //   let hourlyPrice = carPrice?.rates?.hourlyRates?.amount;
        //   let rateChange = '';
        //   const customPricing = carPrice?.rates?.customPricing.find((customPrice: any) => {
        //     return dayjs(customPrice?.date).isSame(startTime, 'day');
        //   });
        //   if (customPricing) {
        //     dailyPrice = customPricing?.updatedDailyRates;
        //     hourlyPrice = customPricing?.updatedHourlyRates;
        //     rateChange = customPricing?.rateChange;
        //   }
        //   const priceInfoItem = {
        //     // id: `vehicleInfo_${carPrice?.id}_${index + 1}`,
        //     id: generateUniqueID('priceInfo', carPrice?.listingId),
        //     group: carPrice?.listingId,
        //     title: '',
        //     type: 'priceInfo',
        //     start_time: startTime.toDate(),
        //     end_time: endTime.toDate(),
        //     dailyPrice: dailyPrice,
        //     hourlyPrice: hourlyPrice,
        //     rateChange: rateChange,
        //   };
        //   priceInfoItems.push(priceInfoItem);
        // }
        if (!isOverlapping) {
          const defaultDailyRate = carPrice?.rates?.dailyRates?.amount || 0;
          const defaultHourlyRate = carPrice?.rates?.hourlyRates?.amount || 0;
          let customDailyRate = defaultDailyRate;
          let customHourlyRate = defaultHourlyRate;

          const customPricing = carPrice?.rates?.customPricing.find((customPrice: any) => dayjs(customPrice.date).isSame(startTime, 'day'));
          if (customPricing) {
            customDailyRate = customPricing.updatedDailyRates;
            customHourlyRate = customPricing.updatedHourlyRates;
          } else {
            const currentDayOfWeek = currentDate.format('ddd').toLowerCase();
            const peakIncrease = carPrice?.rates?.peakIncrease?.find((peak: any) => peak.dayOfWeek === currentDayOfWeek);
            if (peakIncrease) {
              if (peakIncrease.increaseType === 'percentage') {
                customDailyRate += defaultDailyRate * (peakIncrease.percentage! / 100);
                customHourlyRate += defaultHourlyRate * (peakIncrease.percentage! / 100);
              } else if (peakIncrease.increaseType === 'amount') {
                customDailyRate += peakIncrease.amount!;
                customHourlyRate += peakIncrease.amount!;
              }
            }
          }
          const { rateDailyChange, rateHourlyChange, dailyDiff, hourlyDiff } = generateRateChange(
            defaultDailyRate,
            customDailyRate,
            defaultHourlyRate,
            customHourlyRate
          );

          const priceInfoItem: PriceInfoItem = {
            id: generateUniqueID('priceInfo', carPrice.listingId),
            group: carPrice.listingId,
            title: '',
            type: 'priceInfo',
            start_time: dayjsUtc(startTime).toDate(),
            end_time: dayjsUtc(endTime).toDate(),
            dailyPrice: customDailyRate,
            hourlyPrice: customHourlyRate,
            rateDailyChange,
            rateHourlyChange,
            dailyDiff,
            hourlyDiff,
          };

          priceInfoItems.push(priceInfoItem);
        }
      });
      currentDate = currentDate.add(1, 'day');
    }
  }
  return priceInfoItems;
};
//Color Filter
export const StatusFilters = [
  { status: 'confirmed', color: 'text-primary', label: 'Confirmed' },
  { status: 'pending', color: 'text-warning md:ml-2', label: 'Pending' },
  { status: 'completed', color: 'text-success md:ml-2', label: 'Completed' },
  // { status: 'cancelled' || 'cancelledByHost' || 'cancelledByGuest', color: 'text-error md:ml-2', label: 'Cancelled' },
  { status: 'cancelled', color: 'text-error md:ml-2', label: 'Cancelled' },
  { status: 'cancelledByHost', color: 'text-error md:ml-2', label: 'Cancelled' },
  { status: 'cancelledByGuest', color: 'text-error md:ml-2', label: 'Cancelled' },
];

export const processFiltersAndBlockedDates = (reservationList: any[], allCalenderDetails: any[]) => {
  const filteredStatusFilters = StatusFilters.filter((filterItem) => {
    return reservationList?.some((reservation: any) => reservation?.reservationStatus === filterItem.status);
  });
  const uniqueLabels = Array.from(new Set(filteredStatusFilters.map((filterItem) => filterItem.label)));
  const carListings = Array.isArray(allCalenderDetails) ? allCalenderDetails : [];
  const allBlockedDates = carListings.reduce((acc: any, carListing: any) => {
    const carNickName = carListing?.carListingInfo?.carNickName;
    const eventsForCarListing = carListing.blockedDates.map((item: any) => {
      const title = item.title.trim() !== '' ? item.title : 'Unavailable';
      return {
        start: new Date(item.start),
        end: new Date(item.end),
        title: `${title} (${carNickName})`,
        type: 'blockDate',
      };
    });
    return acc.concat(eventsForCarListing);
  }, []);

  return { uniqueLabels, allBlockedDates, filteredStatusFilters };
};

export const itemRenderer = ({ item, getItemProps, handleItemClick }: ItemRendererProps) => {
  const commonClassName = `text-white rounded-lg hover:border-black px-2`;
  let className = `bg-secondary ${commonClassName}`;
  if (item?.type === 'reservation') {
    switch (item?.status) {
      case 'pending':
        className = `bg-warning ${commonClassName}`;
        break;
      case 'confirmed':
        className = `bg-primary ${commonClassName}`;
        break;
      case 'completed':
        className = `bg-success ${commonClassName}`;
        break;
      case 'cancelled':
      case 'cancelledByHost':
      case 'cancelledByGuest':
        className = `bg-error ${commonClassName}`;
        break;
      default:
        break;
    }
  } else if (item?.type === 'blockDate') {
    className = `bg-zinc-500 ${commonClassName}`;
  } else if (item?.type === 'priceInfo') {
    className = `bg-transparent text-black border-none`;
  }
  return (
    <>
      <div
        {...getItemProps({ style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' } })}
        className={className}
        // onClick={(event) => {
        //   event.stopPropagation();
        //   handleItemClick(item.id);
        // }}
        onClick={
          item?.type !== 'priceInfo'
            ? (event) => {
                event.stopPropagation();
                handleItemClick(item.id);
              }
            : undefined
        }
      >
        {item?.type === 'priceInfo' ? <PriceDisplay rates={item} /> : item?.title}
      </div>
    </>
  );
};

export const customRatesTypes: OptionType[] = [
  { id: 1, label: 'AUD', value: 'F' },
  { id: 2, label: '%', value: 'P' },
];

export const customRatesChanges: OptionType[] = [
  {
    id: 1,
    label: <CommonTextIcon text="Increase" startIcon={<FaArrowUp className="text-success text-md mr-2" />} />,
    value: 'I',
  },
  {
    id: 2,
    label: <CommonTextIcon text="Decrease" startIcon={<FaArrowDown className="text-error text-md mr-2" />} />,
    value: 'D',
  },
];

export const generateRateChange = (
  defaultDailyRate: number,
  customDailyRate: number,
  defaultHourlyRate: number,
  customHourlyRate: number
): { rateDailyChange: string; rateHourlyChange: string; dailyDiff: number; hourlyDiff: number } => {
  let rateDailyChange = 'ND'; // No Change Daily
  let rateHourlyChange = 'NH'; // No Change Hourly
  const dailyDiff = customDailyRate - defaultDailyRate;
  const hourlyDiff = customHourlyRate - defaultHourlyRate;

  if (dailyDiff > 0) {
    rateDailyChange = 'DI'; // Daily Increase
  } else if (dailyDiff < 0) {
    rateDailyChange = 'DD'; // Daily Decrease
  }

  if (hourlyDiff > 0) {
    rateHourlyChange = 'HI'; // Hourly Increase
  } else if (hourlyDiff < 0) {
    rateHourlyChange = 'HD'; // Hourly Decrease
  }

  return {
    rateDailyChange,
    rateHourlyChange,
    dailyDiff,
    hourlyDiff,
  };
};

// Tried Cell Selection Functionalities
// const [selectionStart, setSelectionStart] = useState<Date | null>(null);
// const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
// const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

// Event handler for canvas click to start selection
// const handleCanvasClick = (groupId: Id, time: number, e: SyntheticEvent<Element, Event>) => {
//   setSelectionStart(dayjs(time).toDate());
//   setSelectedGroupIds([groupId.toString()]);
// };

// Event handler for canvas double-click to end selection
// const handleCanvasDoubleClick = (groupId: Id, time: number, e: SyntheticEvent<Element, Event>) => {
//   setSelectionEnd(dayjs(time).toDate());
//   if (selectionStart) {
//     const firstSelectedGroupIndex = groups.findIndex((group: any) => group.id === selectedGroupIds[0]);
//     const lastSelectedGroupIndex = groups.findIndex((group: any) => group.id === groupId);
//     if (firstSelectedGroupIndex !== -1 && lastSelectedGroupIndex !== -1) {
//       const selectedGroups = groups.slice(firstSelectedGroupIndex, lastSelectedGroupIndex + 1);
//       const selectedGroupIds = selectedGroups.map((group: any) => group?.id.toString());
//       setSelectedGroupIds(selectedGroupIds);
//       setIsDrawerOpen(true);
//     }
//   }
// };

export const customAdvancedCalendarStyles = `
.react-calendar-timeline {
  background-color: white;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

.rct-dateHeader {
  background-color: white !important;
}

// .rct-hl-even,
// .rct-hl-odd {
//   background-color: white !important;
// }
.rct-hl-even {
  background-color: white !important;
}

.rct-hl-odd {
  background-color: lightgray !important; /* Replace with your desired odd row color */
}
.canvas-clicked .rct-today:before,
.canvas-clicked .rct-header-root:before {
  background-color: blue !important;
}
`;
