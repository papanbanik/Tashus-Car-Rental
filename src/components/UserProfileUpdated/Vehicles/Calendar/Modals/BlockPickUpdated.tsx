'use client';
import CommonForm from '@/components/Common/CommonForm';
import CustomDateTime, { TSelectedDates } from '@/components/Common/DateTimePickers/CustomDateTime';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useDateBlocks } from '@/hooks/vehicle/useDateBlocks';
import { BlockDates, CalenderTimePick } from '@/types/profileInfoTypes';
import { TReservation } from '@/types/travels/typeTravels';
import { getMinTime } from '@/utils/Functions/availabilityCommonFn';
import { checkAvailability, getHostUpdatedReservation } from '@/utils/Functions/blockDatesValidationFn';
import { getDefaultPickupTime, getDefaultReturnTime, shouldPastDisable } from '@/utils/Functions/dateTimeCommonFn';
import { dayjsUtc, getCombinedPickReturnUtc, getDefaultPickupTimeUtc, getDefaultReturnTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Alert, Button, TextField, Typography, useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

const BlockPickUpdated = ({ blockDates }: { blockDates: any }) => {
  const { calendarErrorText, setCalendarErrorText } = useProfileInfoContext();
  // const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>(blockDates?.allDayList?.map((blockDate: any) => new Date(blockDate?.start)) || []);
  const [isAllDay, setIsAllDay] = useState<boolean>(false); //All day
  const { eachCalenderDetails } = useProfileInfoContext();
  const { reservationList } = useTravelContext();
  const { closeModal } = useModalContext();
  // const params = useParams();
  // // console.log(params);
  // const hostId = params['host-profile-id'];
  // const listingId = params['vehicle-id'];
  const { userId: hostId, vehicleId: listingId } = useParams<{ userId: string; vehicleId: string }>();
  // console.log(listingId);
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const { mutateAsync: addBlockDates, isLoading, isSuccess, isError, error } = useDateBlocks();
  const defaultSelectedDates = {
    startDate: getDefaultPickupTime(),
    endDate: getDefaultReturnTime(),
    key: 'selection',
  };
  const classNames = 'grid grid-cols-1 md:grid-cols-1';
  const [selectedDates, setSelectedDates] = useState<[TSelectedDates]>([defaultSelectedDates]);
  const { register, handleSubmit, formState, control } = useForm<BlockDates>();
  const methods = useForm<CalenderTimePick>({
    shouldFocusError: false,
    mode: 'onChange',
    // defaultValues: defaultValues,
  });

  const { watch, setValue } = methods;

  //Handle start time
  const handleStartTimeChange = (timeValue: Dayjs | null, timeType: string) => {
    // console.log('Start Time', timeValue);
  };

  //Handle End time
  const handleEndTimeChange = (timeValue: Dayjs | null, timeType: string) => {
    // console.log(timeValue);
  };
  // console.log(blockDates);

  useEffect(() => {
    setValue('startTime', getDefaultPickupTimeUtc());
    setValue('endTime', getDefaultReturnTimeUtc());
  }, []);

  useEffect(() => {
    if (hostId && listingId) {
      const updatedDisabledDates: Date[] = [];
      if (reservationList?.length > 0) {
        const matchingReservations: TReservation[] = reservationList
          .filter((reservation) => reservation.carListingId === parseInt(listingId))
          .filter((reservation) => !['cancelledByGuest', 'cancelledByHost', 'cancelled'].includes(reservation?.reservationStatus));
        matchingReservations.forEach((reservation: TReservation) => {
          const { startDate, endDate } = getHostUpdatedReservation(reservation);
          const rId = reservation?.reservationId;
          // console.log('Checking Dates', { startDate, endDate, rId });
          // let currentDate = dayjsUtc(startDate);
          // while (currentDate.isBefore(dayjsUtc(endDate), 'day') || currentDate.isSame(dayjsUtc(endDate), 'day')) {
          //   if (
          //     !(dayjsUtc(startDate).isSame(currentDate, 'day') && dayjsUtc(startDate).hour() !== 0) &&
          //     !(dayjsUtc(endDate).isSame(currentDate, 'day') && dayjsUtc(endDate).hour() !== 23)
          //   ) {
          //     // console.log({ currentDate, rId });
          //     updatedDisabledDates.push(currentDate.toDate());
          //   }
          //   currentDate = currentDate.add(1, 'day');
          // }
          let currentDate = dayjsUtc(startDate).startOf('day');
          const end = dayjsUtc(endDate).startOf('day');
          while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
            const isStartPartial = dayjsUtc(startDate).isSame(currentDate, 'day') && dayjsUtc(startDate).hour() !== 0;
            const isEndPartial =
              dayjsUtc(endDate).isSame(currentDate, 'day') && (dayjsUtc(endDate).hour() !== 23 || dayjsUtc(endDate).minute() !== 59);
            // const isStartPartial = !dayjsUtc(startDate).isSame(dayjsUtc(startDate).startOf('day'));
            // const isEndPartial = !dayjsUtc(endDate).isSame(dayjsUtc(endDate).endOf('day'));
            if (!isStartPartial && !isEndPartial) {
              updatedDisabledDates.push(currentDate.toDate());
            }
            currentDate = currentDate.add(1, 'day');
          }
        });
      }
      // setDisabledDates(updatedDisabledDates);
      setDisabledDates((prevDisabledDates) => [...prevDisabledDates, ...updatedDisabledDates]);
    }
  }, [eachCalenderDetails, reservationList, hostId, listingId]);

  //Validate Block Availability
  useEffect(() => {
    // const startDate = dayjsUtc(combineDateTime(watch('startDate'), watch('startTime')));
    // const endDate = dayjsUtc(combineDateTime(watch('endDate'), watch('endTime')));
    const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(
      watch('startDate'),
      watch('startTime'),
      watch('endDate'),
      watch('endTime'),
      'block-date'
    );
    const startDate = combinedPickup?.combinedDateTimeString;
    const endDate = combinedReturn?.combinedDateTimeString;
    checkAvailability(startDate, endDate, reservationList, eachCalenderDetails, listingId).then(({ isReserved, isBlocked }) => {
      if (isReserved) {
        setCalendarErrorText('The vehicle is reserved during that time.');
      } else if (isBlocked) {
        setCalendarErrorText('The schedule is already blocked.');
      } else {
        setCalendarErrorText('');
      }
    });
  }, [watch('startDate'), watch('endDate'), watch('startTime'), watch('endTime'), reservationList, eachCalenderDetails]);

  //If All day Selected
  useEffect(() => {
    if (selectedDates.length > 0) {
      setValue('startDate', new Date(selectedDates[0]?.startDate));
      setValue('endDate', new Date(selectedDates[0]?.endDate));
      // setValue('startTime', getRoundUpStartTime(30).toDate());
      // setValue('endTime', getDefaultEndTime().toDate());
      if (isAllDay) {
        setValue('startTime', dayjsUtc().startOf('day').toDate());
        setValue('endTime', dayjsUtc().endOf('day').toDate());
      }
      // else {
      //   setValue('startTime', getRoundUpStartTime(30).toDate());
      //   setValue('endTime', getDefaultEndTime().toDate());
      // }
    }
  }, [selectedDates, isAllDay]);

  //Handle Date Range
  // const handleDateChange = (ranges: any) => {
  //   setSelectedDates([{ ...ranges.selection, key: 'selection' }]);
  //   // console.log(ranges.selection);
  //   setValue('startDate', new Date(ranges.selection.startDate));
  //   setValue('endDate', new Date(ranges.selection.endDate));
  // };
  const handleDateChange = (ranges: any) => {
    setValue('endDate', new Date(ranges?.endDate));
    setValue('startDate', new Date(ranges?.startDate));
  };

  const handleEndMinTime = () => {
    return dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinTime(watch('startTime')) : undefined;
  };

  //All Day
  const isSameDate = dayjs(watch('startDate')).isSame(dayjs(watch('endDate')), 'day');
  const handleAllDayChange = (isChecked: boolean) => {
    setIsAllDay(isChecked);
  };

  //Handling Update
  const onBlockDatesSave: SubmitHandler<BlockDates> = async (data) => {
    // console.log(data);
    // const startDate = dayjs(combineDateTime(watch('startDate'), watch('startTime')));
    // // console.log(startDate);
    // const endDate = dayjs(combineDateTime(watch('endDate'), watch('endTime')));
    // console.log(endDate);
    const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(
      watch('startDate'),
      watch('startTime'),
      watch('endDate'),
      watch('endTime'),
      'block-date'
    );
    const startDate = combinedPickup?.combinedDayObj;
    const endDate = combinedReturn?.combinedDayObj;
    // const startDate = combinedPickup?.combinedDateTimeString;
    // const endDate = combinedReturn?.combinedDateTimeString;
    const blockedDates = [];
    let currentDate = startDate.clone();

    while (currentDate.isBefore(endDate, 'day') || currentDate.isSame(endDate, 'day')) {
      blockedDates.push({
        start: currentDate,
        end: currentDate,
        title: data?.blockedDates[0]?.title,
      });
      currentDate = currentDate.add(1, 'day');
    }
    // console.log(blockedDates);
    // console.log(blockedDates.length);
    // console.log(typeof blockedDates[0].start);
    // console.log(startDate);
    if (blockedDates.length === 1) {
      // Condition 1: Start day end same [Faced webpack typeError on this]
      blockedDates[0].start = startDate;
      blockedDates[0].end = endDate;
    } else if (blockedDates.length === 2) {
      // Condition 2: start and end
      blockedDates[0].start = startDate;
      blockedDates[0].end = blockedDates[0].end.endOf('day');
      blockedDates[1].start = endDate.startOf('day');
      blockedDates[1].end = endDate;
    } else if (blockedDates.length > 2) {
      blockedDates[0].start = startDate;
      blockedDates[0].end = startDate.endOf('day');
      blockedDates[blockedDates.length - 1].start = endDate.startOf('day');
      blockedDates[blockedDates.length - 1].end = endDate;
      for (let i = 1; i < blockedDates.length - 1; i++) {
        blockedDates[i].start = blockedDates[i].start.startOf('day');
        blockedDates[i].end = blockedDates[i].end.endOf('day');
      }
    }
    // console.log(blockedDates[0].start);
    try {
      await addBlockDates({
        listingId: listingId,
        blockedDates: blockedDates,
        hostId: hostId,
      });
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between my-4">
        <Typography className="font-bold">Date & Time:</Typography>
        {isSameDate && <CheckBox control={control} registerName="allDay" label="All Day" onChange={(isChecked) => handleAllDayChange(isChecked)} />}
      </div>
      <CommonForm handleFunction={handleSubmit(onBlockDatesSave)}>
        <FormProvider {...methods}>
          <div className="bg-gray-200 p-2 md:p-4">
            <CustomDateTime
              classNames={classNames}
              labelStart="From"
              labelEnd="To"
              disableStartTime={isAllDay}
              disableEndTime={isAllDay}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              handleDateChange={handleDateChange}
              defaultStartTime={watch('startTime')}
              defaultEndTime={watch('endTime')}
              handleStartTimeChange={handleStartTimeChange}
              disabledDates={disabledDates}
              // disabledDates={blockDates?.allDayList?.map((blockDate: any) => new Date(blockDate?.start))}
              handleEndTimeChange={handleEndTimeChange}
              getEndMinTime={handleEndMinTime}
              disableStartPastTime={shouldPastDisable(watch('startDate'))}
              minuteDifferenceBetweenPickers={30}
              minuteAfterNow={0}
            />
          </div>
        </FormProvider>
        {calendarErrorText && (
          <Alert severity="error" className="bg-red-10 my-4 text-error">
            {calendarErrorText}
          </Alert>
        )}
        <Typography className="my-4">Reason:</Typography>
        <TextField
          id="outlined-basic"
          label="Reasons for unavailable dates"
          variant="outlined"
          {...register('blockedDates.0.title', {
            required: false,
          })}
          fullWidth
        />
        <div className="flex justify-center mt-8">
          <Button
            disabled={!formState?.isValid || isLoading || !!calendarErrorText}
            type="submit"
            variant="contained"
            color="primary"
            className="justify-end"
          >
            {isLoading ? 'Updating' : 'Update'}
          </Button>
        </div>
      </CommonForm>
    </div>
  );
};

export default BlockPickUpdated;
