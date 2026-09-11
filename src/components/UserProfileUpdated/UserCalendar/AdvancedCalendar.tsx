'use client';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useVehicleList } from '@/hooks/profile/useVehicleList';
import { useReservationList } from '@/hooks/reservation/useReservationList';
import { useAllVehiclesPrice } from '@/hooks/vehicle/custom-pricing/useAllVehiclesPrice';
import { useAllVehicleBlocks } from '@/hooks/vehicle/useAllVehicleBlocks';
import {
  customAdvancedCalendarStyles,
  endOfWeek,
  fixedZoom,
  generateBlockDatesInfo,
  generateGroupsInfo,
  generatePriceInfoItems,
  generateReservationInfo,
  itemRenderer,
  labelFormat,
  processFiltersAndBlockedDates,
  startOfWeek,
} from '@/utils/Functions/advancedCalenderFn';
import { Divider } from '@mui/material';
import dayjs from 'dayjs';
import { SyntheticEvent, useEffect, useState } from 'react';
import Timeline, { DateHeader, Id, SidebarHeader, TimelineHeaders, TimelineMarkers, TodayMarker } from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import DisplayEventModal from './AdvancedCalender/DisplayEventInfo';
import CalenderFilter from './AdvancedCalender/FilteredCalendar/CalendarFilter';
import SidebarContent from './AdvancedCalender/SidebarContent';
import VehicleDrawer from './AdvancedCalender/VehicleDrawer';

//to show utc time in calendars
import moment from 'moment';
import 'moment-timezone';
moment.tz.setDefault('UTC');
// import 'dayjs/plugin/timezone';
// dayjs.tz.setDefault('UTC');

const AdvancedCalendar = () => {
  useVehicleList();
  useReservationList();
  useAllVehicleBlocks();
  useAllVehiclesPrice();
  // const [visibleTimeStart, setVisibleTimeStart] = useState<number>(dayjs().startOf('week').valueOf());
  // const [visibleTimeEnd, setVisibleTimeEnd] = useState<number>(dayjs().endOf('week').valueOf());
  const [visibleTimeStart, setVisibleTimeStart] = useState<Date>(startOfWeek); // Initial visible time start
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<Date>(endOfWeek); // Initial visible time end
  const [displayDate, setDisplayDate] = useState<Date>(dayjs().toDate());
  const [filteredStatusFilters, setFilteredStatusFilters] = useState<any[]>([]);
  const [uniqueLabels, setUniqueLabels] = useState<string[]>([]);
  const [allBlockedDates, setAllBlockedDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const { allCalenderDetails } = useProfileInfoContext();
  const { reservationList } = useTravelContext();
  const { userVehicleList, userVehiclePrice } = useCarListingContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isCheckedMap, setIsCheckedMap] = useState<{ [listingId: string]: boolean }>({});
  const [listingSelect, setListingSelect] = useState<string | null>(null);

  const handleSelectAll = () => {
    const allSelected = Object.values(isCheckedMap).every((isChecked) => isChecked);
    const newIsCheckedMap: { [listingId: string]: boolean } = {}; // Explicitly typed object
    userVehicleList.forEach((vehicle: any) => {
      // newIsCheckedMap[vehicle.listingId] = true;
      newIsCheckedMap[vehicle.listingId] = !allSelected;
    });
    setIsCheckedMap(newIsCheckedMap);
  };
  const filteredUserVehicleList = !!listingSelect
    ? userVehicleList.filter((item: any) => `${item?.car?.model} (${item?.listingId})` === listingSelect)
    : userVehicleList;
  //Resources
  const groups = generateGroupsInfo(filteredUserVehicleList, isCheckedMap, setIsCheckedMap);
  const selectedGroupData = groups.length > 0 ? groups.filter((data: any) => data.isSelected) : [];
  // Items
  const reservationEvents = generateReservationInfo(reservationList);
  const blockedDates = generateBlockDatesInfo(allCalenderDetails);
  // const priceInfoItems = generatePriceInfoItems(groups);
  const priceInfoItems = generatePriceInfoItems(userVehiclePrice, reservationEvents, blockedDates);

  // Combine all items
  const items = [...reservationEvents, ...blockedDates, ...priceInfoItems];

  // Function to handle the click event on an item
  const handleItemClick = (itemId: string) => {
    const clickedEvent = items.find((item: any) => item?.id === itemId);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setIsModalOpen(true);
    }
  };

  //Function to canvas click
  const handleCanvasDoubleClick = (groupId: Id, time: number, e: SyntheticEvent<Element, Event>) => {
    setSelectedDate(dayjs(time).toDate());
    // setSelectedDate(new Date(time));
    // const day = dayjs(time).get('date');
    // const month = dayjs(time).get('month');
    // const year = dayjs(time).get('year');
    // setSelectedDate(createDateAtMidnight(day, month, year));
    setIsDrawerOpen(true);
  };
  //Function For Date filtering
  const handleDateChange = (newDate: Date | null) => {
    // console.log(newDate);
    if (newDate) {
      setDisplayDate(newDate);
      const startOfWeek = dayjs(newDate).startOf('week');
      const endOfWeek = dayjs(newDate).endOf('week');
      // setVisibleTimeStart(startOfWeek.valueOf());
      // setVisibleTimeEnd(endOfWeek.valueOf());
      setVisibleTimeStart(startOfWeek.toDate());
      setVisibleTimeEnd(endOfWeek.toDate());
    }
  };

  //Function For Current Date
  const handleCurrentDateClick = () => {
    // setVisibleTimeStart(startOfWeek.valueOf());
    // setVisibleTimeEnd(endOfWeek.valueOf());
    setVisibleTimeStart(startOfWeek);
    setVisibleTimeEnd(endOfWeek);
  };

  const handleOnTimeChange = (visibleTimeStart: number, visibleTimeEnd: number, updateScrollCanvas: (start: number, end: number) => void) => {
    // setVisibleTimeStart(visibleTimeStart);
    // setVisibleTimeEnd(visibleTimeEnd);
    setVisibleTimeStart(dayjs(visibleTimeStart).toDate());
    setVisibleTimeEnd(dayjs(visibleTimeEnd).toDate());
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    // const minTime = startOfWeek.valueOf();
    // const maxTime = endOfWeek.valueOf();

    // if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
    //   updateScrollCanvas(minTime, maxTime);
    // } else if (visibleTimeStart < minTime) {
    //   updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
    // } else if (visibleTimeEnd > maxTime) {
    //   updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
    // } else {
    //   updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    // }
  };

  // useEffect(() => {
  //   const startOfWeek = dayjs(displayDate).startOf('week').toDate();
  //   const endOfWeek = dayjs(displayDate).endOf('week').toDate();
  //   setVisibleTimeStart(startOfWeek);
  //   setVisibleTimeEnd(endOfWeek);
  // }, [displayDate]);
  useEffect(() => {
    const { uniqueLabels, allBlockedDates, filteredStatusFilters } = processFiltersAndBlockedDates(reservationList, allCalenderDetails);
    setFilteredStatusFilters(filteredStatusFilters);
    setUniqueLabels(uniqueLabels);
    setAllBlockedDates(allBlockedDates);
  }, [reservationList, allCalenderDetails]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customAdvancedCalendarStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="p-4">
      <div className="w-full overflow-x-auto">
        {isDrawerOpen && selectedGroupData?.length > 0 && (
          <VehicleDrawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} selectedDate={selectedDate} groupData={groups} />
        )}
        <CalenderFilter
          displayDate={displayDate}
          handleDateChange={handleDateChange}
          handleCurrentDateClick={handleCurrentDateClick}
          uniqueLabels={uniqueLabels}
          filteredStatusFilters={filteredStatusFilters}
          allBlockedDates={allBlockedDates}
        />
        <Divider />
        <Timeline
          groups={groups}
          items={items}
          itemRenderer={(props: any) => itemRenderer({ ...props, handleItemClick })}
          // onCanvasClick={handleCanvasClick}
          onCanvasClick={handleCanvasDoubleClick}
          // onCanvasDoubleClick={handleCanvasDoubleClick}
          defaultTimeStart={visibleTimeStart}
          defaultTimeEnd={visibleTimeEnd}
          // visibleTimeStart={visibleTimeStart}
          // visibleTimeEnd={visibleTimeEnd}
          // onTimeChange={handleOnTimeChange}
          sidebarWidth={310}
          lineHeight={80}
          minZoom={fixedZoom}
          maxZoom={fixedZoom}
          className="cursor-pointer"
          buffer={5}
        >
          <TimelineHeaders className="sticky">
            <SidebarHeader>
              {({ getRootProps }) => {
                return (
                  <div
                    {...getRootProps()}
                    // className="bg-primary text-white flex items-center justify-center"
                  >
                    <SidebarContent
                      groupData={groups}
                      setIsDrawerOpen={setIsDrawerOpen}
                      handleSelectAll={handleSelectAll}
                      isCheckedMap={isCheckedMap}
                      listingSelect={listingSelect}
                      setListingSelect={setListingSelect}
                    />
                  </div>
                );
              }}
            </SidebarHeader>
            <DateHeader
              className="flex justify-start items-start  text-black font-bold"
              unit="week"
              // labelFormat="MMMM YYYY"
              labelFormat={labelFormat}
              style={{ backgroundColor: 'white' }}
            />
            <DateHeader unit="day" labelFormat="dd" style={{ backgroundColor: 'white' }} />
            <DateHeader unit="day" labelFormat="DD" />
          </TimelineHeaders>
          <TimelineMarkers>
            <TodayMarker date={dayjs().toDate()}>
              {({ styles, date }) => (
                <div style={{ ...styles, backgroundColor: 'green' }} /> // Set the background color to green
              )}
            </TodayMarker>
          </TimelineMarkers>
        </Timeline>
        <DisplayEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={selectedEvent} />
      </div>
    </div>
  );
};
export default AdvancedCalendar;
