'use client';

import CustomDateTime, { TSelectedDates } from '@/components/Common/DateTimePickers/CustomDateTime';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetBlockDatesByCarId } from '@/hooks/car-search/useGetBlockDatesByCarId';
import { usePublicVehicleDetails } from '@/hooks/car-search/usePublicVehicleDetails';
import { useGetReservationsByListingId } from '@/hooks/reservation/useGetReservationsByListingId';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { TSingleCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { VehiclePickupReturnType } from '@/types/searchingTypes';
import { TBillingDetails } from '@/types/travels/typeEditTravels';
import { getMinTime } from '@/utils/Functions/availabilityCommonFn';
import { handleCommonDateTimeValidation } from '@/utils/Functions/createEditTravelCommonFn';
import { loadText } from '@/utils/Functions/randomCommonFn';
import { handleTravelEdit } from '@/utils/Functions/travel-edit/travelEditFn';
import { getCombinedPickReturnUtc, getPickerDateUtc, getPickerTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Alert } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import EditTravelCommon from '../EditTravel/EditTravelCommon';

const EditCurrentTravelM = () => {
  const defaultSelectedDates = {
    startDate: dayjs().add(1, 'day').toDate(),
    endDate: dayjs().add(3, 'day').toDate(),
    key: 'selection',
  };
  const [selectedDates, setSelectedDates] = useState<[TSelectedDates]>([defaultSelectedDates]);
  const methods = useForm<VehiclePickupReturnType>({
    shouldFocusError: false,
    mode: 'onChange',
  });

  const { watch, setValue } = methods;
  useTravelDetails();
  useGetBlockDatesByCarId();
  usePublicVehicleDetails();
  const { travelDetails } = useProfileInfoContext();
  const { verifyAvailability, updatedTravelData, setBillingDetails, peakIncreasedDates } = useTravelContext();
  const {
    setSingleCarReservationList,
    setQueryEnableFlags,
    queryEnableFlags,
    availabilityErrorText,
    setAvailabilityErrorText,
    singleCarBlockDates,
    setSingleCarBlockDates,
    setIndividualPriceList,
  } = useSearchContext();
  const { setListingId, carData, setCarData } = useCarListingContext();
  const { data: reservationData } = useGetReservationsByListingId();

  const classNames = 'grid grid-cols-1 md:grid-cols-1';

  useEffect(() => {
    setListingId('');
    setCarData({} as CarDataState);
    setBillingDetails({} as TBillingDetails);
    setSingleCarBlockDates({} as TSingleCarBlockDate);
    setSingleCarReservationList([]);
  }, []);

  useEffect(() => {
    if (travelDetails?.carListingId) {
      setQueryEnableFlags({ ...queryEnableFlags, enableVehicleDetails: true });
    }
  }, [travelDetails?.carListingId]);

  useEffect(() => {
    // console.log(updatedTravelData);
    if (updatedTravelData?.pickupDate && updatedTravelData?.returnDate) {
      // UTC
      const { pickupDate, returnDate } = updatedTravelData;
      setSelectedDates([
        {
          startDate: getPickerDateUtc(pickupDate),
          endDate: getPickerDateUtc(returnDate),
          key: 'selection',
        },
      ]);
      setValue('startDate', getPickerDateUtc(pickupDate));
      setValue('startTime', getPickerTimeUtc(pickupDate));
      setValue('endDate', getPickerDateUtc(returnDate));
      setValue('endTime', getPickerTimeUtc(returnDate));
      // setSelectedDates([
      //   {
      //     startDate: new Date(updatedTravelData?.pickupDate),
      //     endDate: new Date(updatedTravelData?.returnDate),
      //     key: 'selection',
      //   },
      // ]);
      // methods.setValue('startDate', new Date(updatedTravelData?.pickupDate));
      // methods.setValue('startTime', new Date(updatedTravelData?.pickupDate));
      // methods.setValue('endDate', new Date(updatedTravelData?.returnDate));
      // methods.setValue('endTime', new Date(updatedTravelData?.returnDate));
    }
  }, [updatedTravelData]);

  useEffect(() => {
    setAvailabilityErrorText('');
    if (
      updatedTravelData?.pickupDate &&
      updatedTravelData?.returnDate &&
      carData?.availability &&
      carData?.rates &&
      reservationData?.status === 200
    ) {
      const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(
        watch('startDate'),
        watch('startTime'),
        watch('endDate'),
        watch('endTime'),
        'edit-current'
      );

      const pickupTime = combinedPickup?.combinedDateTimeString;
      const returnTime = combinedReturn?.combinedDateTimeString;

      const isEndSame = dayjs(updatedTravelData?.returnDate).isSame(dayjs(returnTime), 'minute');
      handleCommonDateTimeValidation(dayjs(pickupTime), dayjs(returnTime), setAvailabilityErrorText, 'current-edit').then((isTimeValid) => {
        // console.log(isUnchanged, isTimeValid);
        // If any date or time changes, do the calculations
        if (!isEndSame && isTimeValid) {
          calculation(returnTime);
        } else {
          setBillingDetails({} as TBillingDetails);
        }
      });

      // const tempReservationData = [...reservationData?.data];
      // const excludingCurrentReservationData = tempReservationData?.filter(
      //   (reservation: any) => parseInt(reservation?.reservationId) !== parseInt(travelDetails?.reservationId)
      // );
      // const isTimeValid = handleDateTimeValidation(dayjs(pickupTime), dayjs(returnTime), setAvailabilityErrorText);
      // const isEndSame = dayjs(updatedTravelData?.returnDate).isSame(dayjs(returnTime), 'minute');
      // const calculation = async () => {
      //   //Check if current travel or upcoming
      //   const isAvailable = await verifyAvailability(
      //     updatedTravelData?.pickupDate,
      //     returnTime,
      //     carData,
      //     excludingCurrentReservationData,
      //     false,
      //     singleCarBlockDates?.customList
      //   );
      //   if (isAvailable) {
      //     await handleCurrentTravelEdit(
      //       updatedTravelData?.pickupDate,
      //       returnTime,
      //       updatedTravelData?.pickupDate,
      //       updatedTravelData?.returnDate,
      //       carData,
      //       updatedTravelData,
      //       getPreviousReservationData,
      //       travelDetails,
      //       setBillingDetails
      //     );
      //   }
      // };
      // if (!isEndSame && isTimeValid) {
      //   calculation();
      // } else {
      //   setBillingDetails({} as TBillingDetails);
      // }
    }
  }, [watch('endDate'), watch('endTime'), carData, reservationData, singleCarBlockDates]);

  const calculation = async (returnTime: string | Date) => {
    const tempReservationData = [...reservationData?.data];
    const excludingCurrentReservationData = tempReservationData?.filter(
      (reservation: any) => parseInt(reservation?.reservationId) !== parseInt(travelDetails?.reservationId?.toString())
    );
    const { customList = [], allDayList = [] } = singleCarBlockDates ?? {};
    const mergedBlockDates = [...customList, ...allDayList];
    const isAvailable = await verifyAvailability(
      updatedTravelData?.pickupDate,
      returnTime,
      carData,
      excludingCurrentReservationData,
      false,
      mergedBlockDates
    );
    if (isAvailable) {
      // await handleCurrentTravelEdit(
      //   updatedTravelData?.pickupDate,
      //   returnTime,
      //   updatedTravelData?.pickupDate,
      //   updatedTravelData?.returnDate,
      //   carData,
      //   updatedTravelData,
      //   getPreviousReservationData,
      //   travelDetails,
      //   setBillingDetails,
      //   setIndividualPriceList
      // );
      const updatedBillingDetails = await handleTravelEdit(
        updatedTravelData?.pickupDate,
        returnTime,
        updatedTravelData?.pickupDate,
        updatedTravelData?.returnDate,
        carData,
        travelDetails,
        updatedTravelData,
        setIndividualPriceList,
        peakIncreasedDates
      );
      setBillingDetails(updatedBillingDetails);
    }
  };

  const handleDateChange = (ranges: any) => {
    setValue('endDate', new Date(ranges?.endDate));
  };

  const handleEndTimeChange = (timeValue: Dayjs | null, timeType: string) => {
    // console.log(timeValue);
  };

  const handleEndMinTime = () => {
    return dayjs(selectedDates[0]?.startDate).isSame(dayjs(selectedDates[0]?.endDate), 'day') ? getMinTime(methods.watch('startTime')) : undefined;
  };

  return (
    <div className="travel_container">
      <div className="bg-[#E4E3E4] p-8 rounded-lg">
        {updatedTravelData?.pickupDate ? (
          <FormProvider {...methods}>
            <CustomDateTime
              classNames={classNames}
              disableStartDate={true}
              disableStartTime={true}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              handleDateChange={handleDateChange}
              defaultStartTime={watch('startTime')}
              defaultEndTime={watch('endTime')}
              // handleEndTimeChange={handleEndTimeChange}
              // getEndMinTime={handleEndMinTime}
              disabledDates={singleCarBlockDates?.allDayList?.map((blockDate) => new Date(blockDate?.start))}
            ></CustomDateTime>
          </FormProvider>
        ) : (
          <p>{loadText}</p>
        )}
      </div>

      {availabilityErrorText && (
        <Alert severity="error" className="bg-red-10 my-4 text-error">
          {availabilityErrorText}
        </Alert>
      )}
      <EditTravelCommon />
    </div>
  );
};

export default EditCurrentTravelM;
