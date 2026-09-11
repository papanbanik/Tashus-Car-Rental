'use client';
import CommonForm from '@/components/Common/CommonForm';
import { TSelectedDates } from '@/components/Common/DateTimePickers/CustomDateTime';
import CustomDateTimeBlock from '@/components/Common/DateTimePickers/CustomDateTimeBlock';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useDateBlocks } from '@/hooks/vehicle/useDateBlocks';
import { BlockDates, CalenderTimePick } from '@/types/profileInfoTypes';
import { getMinTime } from '@/utils/Functions/availabilityCommonFn';
import { combineDateTime, getDefaultEndTime, getRoundUpStartTime, shouldPastDisable } from '@/utils/Functions/dateTimeCommonFn';
import { Button, TextField, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// import BlockDateTime from './BlockDateTime';
// import BlockReason from './BlockReason';
const BlockPickModal = () => {
  const { openSnackBar } = useSnackBarContext();
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isAllDay, setIsAllDay] = useState<boolean>(false); //All day
  const { eachCalenderDetails } = useProfileInfoContext();
  const { reservationList } = useTravelContext();
  const { closeModal } = useModalContext();
  // const params = useParams();
  // // console.log(params);
  // const hostId = params['host-profile-id'];
  // const listingId = params['vehicle-id'];
  const { userId: hostId, vehicleId: listingId } = useParams<{ userId: string; vehicleId: string }>();
  const { mutateAsync: addBlockDates, isLoading } = useDateBlocks();

  useEffect(() => {
    const updatedDisabledDates: Date[] = [];
    if (hostId && listingId) {
      if (eachCalenderDetails?.length > 0) {
        eachCalenderDetails.forEach((range: any) => {
          // updatedDisabledDates.push(new Date(dayjs(range.start).toDate().getTime() - 1));
          // updatedDisabledDates.push(new Date(dayjs(range.end).toDate().getTime() - 1));
          updatedDisabledDates.push(new Date(dayjs(range.start).startOf('day').toDate().getTime()));
          updatedDisabledDates.push(new Date(dayjs(range.end).endOf('day').toDate().getTime()));
        });
      }
      // if (reservationList) {
      //   const matchingReservations = reservationList.filter((reservation: any) => {
      //     return reservation.carListingId === parseInt(listingId);
      //   });

      //   matchingReservations.forEach((reservation: any) => {
      //     const startDate = dayjs(reservation.startDate);
      //     const endDate = dayjs(reservation.endDate);
      //     let currentDate = startDate;
      //     while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      //       updatedDisabledDates.push(currentDate.toDate());
      //       currentDate = currentDate.add(1, 'day');
      //     }
      //   });
      // }
      if (reservationList) {
        // const matchingReservations = reservationList.filter((reservation: any) => {
        //   return reservation.carListingId === parseInt(listingId);
        // });
        const matchingReservations = reservationList
          .filter((reservation: any) => reservation.carListingId === parseInt(listingId))
          .filter((reservation: any) => !['cancelledByGuest', 'cancelledByHost', 'cancelled'].includes(reservation.reservationStatus));
        // console.log(matchingReservations);
        matchingReservations.forEach((reservation: any) => {
          const { startDate, endDate } = handleModifiedReservation(reservation);
          let currentDate = dayjs(startDate);

          while (currentDate.isBefore(dayjs(endDate), 'day') || currentDate.isSame(dayjs(endDate), 'day')) {
            updatedDisabledDates.push(currentDate.toDate());
            currentDate = currentDate.add(1, 'day');
          }
        });
      }
      setDisabledDates(updatedDisabledDates);
    }
  }, [eachCalenderDetails, reservationList, hostId, listingId]);

  //Revised Check
  const handleModifiedReservation = (reservation: any) => {
    if (reservation?.revisedReservations && reservation?.revisedReservations.length > 0) {
      const paidRevisedReservations = reservation?.revisedReservations.filter(
        (revisedReservation: any) => revisedReservation?.paymentStatus === 'paid'
      );

      if (paidRevisedReservations.length > 0) {
        const lastRevisedReservation = paidRevisedReservations[paidRevisedReservations.length - 1];
        return {
          startDate: lastRevisedReservation?.newStartDate,
          endDate: lastRevisedReservation?.newEndDate,
        };
      }
    }
    return {
      startDate: reservation?.startDate,
      endDate: reservation?.endDate,
    };
  };
  const defaultSelectedDates = {
    startDate: dayjs().add(1, 'day').toDate(),
    endDate: dayjs().add(3, 'day').toDate(),
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
  useEffect(() => {
    if (selectedDates.length > 0) {
      methods.setValue('startDate', new Date(selectedDates[0]?.startDate));
      methods.setValue('endDate', new Date(selectedDates[0]?.endDate));
      // methods.setValue('startTime', getRoundUpStartTime(30).toDate());
      // methods.setValue('endTime', getDefaultEndTime().toDate());
      if (isAllDay) {
        methods.setValue('startTime', dayjs().startOf('day').toDate());
        methods.setValue('endTime', dayjs().endOf('day').toDate());
      } else {
        methods.setValue('startTime', getRoundUpStartTime(30).toDate());
        methods.setValue('endTime', getDefaultEndTime().toDate());
      }
    }
  }, [selectedDates, isAllDay]);
  // console.log(selectedDates);
  const handleDateChange = (ranges: any) => {
    setSelectedDates([{ ...ranges.selection, key: 'selection' }]);
    // console.log(ranges.selection);
    methods.setValue('startDate', new Date(ranges.selection.startDate));
    methods.setValue('endDate', new Date(ranges.selection.endDate));
  };
  const handleStartTimeChange = (timeValue: Dayjs | null, timeType: string) => {
    // console.log('Start Time', timeValue);
  };
  const handleEndTimeChange = (timeValue: Dayjs | null, timeType: string) => {
    // console.log(timeValue);
  };

  const handleEndMinTime = () => {
    return dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinTime(methods.watch('startTime')) : undefined;
  };
  // console.log(methods.watch('startDate'));
  // console.log(methods.watch('endDate'));
  // console.log(methods.watch('startTime'));
  // console.log(methods.watch('endTime'));
  //All Day
  const isSameDate = dayjs(methods.watch('startDate')).isSame(dayjs(methods.watch('endDate')), 'day');
  const handleAllDayChange = (isChecked: boolean) => {
    setIsAllDay(isChecked);
    // if (isChecked) {
    //   methods.setValue('startTime', dayjs().startOf('day').toDate());
    //   methods.setValue('endTime', dayjs().endOf('day').toDate());
    // }
  };

  const onBlockDatesSave: SubmitHandler<BlockDates> = async (data) => {
    // console.log(data);
    const startDate = dayjs(combineDateTime(methods.watch('startDate'), methods.watch('startTime')));
    // console.log(startDate);
    const endDate = dayjs(combineDateTime(methods.watch('endDate'), methods.watch('endTime')));
    // console.log(endDate);
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
    // console.log('new blocked dates', blockedDates);
    try {
      await addBlockDates({
        listingId: listingId,
        blockedDates: blockedDates,
        hostId: hostId,
      });
      openSnackBar({
        message: 'Unavailable Dates Added Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
      closeModal();
    } catch (error) {
      console.log(error);
      openSnackBar({
        message: 'The following date ranges are already blocked',
        severity: 'error',
        hideDuration: 5000,
      });
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
            <CustomDateTimeBlock
              classNames={classNames}
              labelStart="From"
              labelEnd="To"
              toPickerDisabled={true}
              disableStartTime={isAllDay}
              disableEndTime={isAllDay}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              handleDateChange={handleDateChange}
              defaultStartTime={methods.watch('startTime')}
              defaultEndTime={methods.watch('endTime')}
              handleStartTimeChange={handleStartTimeChange}
              disabledDates={disabledDates}
              handleEndTimeChange={handleEndTimeChange}
              getEndMinTime={handleEndMinTime}
              disableStartPastTime={shouldPastDisable(methods.watch('startDate'))}
            ></CustomDateTimeBlock>
          </div>
        </FormProvider>
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
          <Button disabled={!formState?.isValid || isLoading} type="submit" variant="contained" color="primary" className="justify-end">
            {isLoading ? 'Updating' : 'Update'}
          </Button>
        </div>
      </CommonForm>
    </div>
  );
};

export default BlockPickModal;
