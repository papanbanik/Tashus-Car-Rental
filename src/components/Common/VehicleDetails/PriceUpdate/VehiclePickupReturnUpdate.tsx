import { useCarListingContext } from '@/context/CarListingProvider';
import { defaultDiscountValues, useSearchContext } from '@/context/SearchProvider';
import { useGetBlockDatesByCarId } from '@/hooks/car-search/useGetBlockDatesByCarId';
import { useGetReservationsByListingId } from '@/hooks/reservation/useGetReservationsByListingId';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { TSingleCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { SearchParamsType, VehiclePickupReturnType } from '@/types/searchingTypes';
import { handleCommonDateTimeValidation } from '@/utils/Functions/createEditTravelCommonFn';
import { getDefaultPickupTime, getDefaultReturnTime, scrollToSection } from '@/utils/Functions/dateTimeCommonFn';
import { getCombinedPickReturnUtc, getPickerDateUtc, getPickerTimeUtc } from '@/utils/Functions/utcCommonFn';
import { calculateTotalPrice, handleAllDayBlockDates } from '@/utils/Functions/vehiclePriceUpdateFn';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import CustomSearchDateTimePickerTz from '../../DateTimePickers/CustomSearchDateTimePickerTz';

const defaultValues: VehiclePickupReturnType = {
  startDate: getDefaultPickupTime(),
  endDate: getDefaultReturnTime(),
  startTime: getDefaultPickupTime(),
  endTime: getDefaultReturnTime(),
};

const VehiclePickupReturnUpdate = () => {
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, setError, clearErrors, trigger } =
    useForm<VehiclePickupReturnType>({
      shouldFocusError: false,
      mode: 'onChange',
      defaultValues: defaultValues,
    });
  const router = useRouter();
  // const params = useParams();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const isIPadPro = useIPadProQuery();
  const urlParams = useSearchParams();
  const { carData } = useCarListingContext();
  const {
    setTotalPrice,
    setSearchParams,
    searchParams,
    setReservationDuration,
    setDurationPrice,
    setDiscountedPrice,
    setPeakIncPrice,
    setReservationPriceList,
    setAvailabilityErrorText,
    setServiceFee,
    timeErrorText,
    setTimeErrorText,
    singleCarBlockDates,
    setSingleCarBlockDates,
    setUserSelectingDateList,
    verifyConfirmReservationAvailability,
    reservationCustomPriceList,
    setReservationCustomPriceList,
    setIndividualPriceList,
  } = useSearchContext();

  const { data: reservationData } = useGetReservationsByListingId();
  useGetBlockDatesByCarId();

  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    setError,
    clearErrors,
    trigger,
    classNames: 'grid grid-cols-1 md:grid-cols-1',
  };

  useEffect(() => {
    setTimeErrorText('');
    const updatedSearchParams: SearchParamsType = {
      city: urlParams.get('city') || '',
      country: urlParams.get('country') || '',
      postcode: urlParams.get('postcode') || '',
      region: urlParams.get('region') || '',
      lat: urlParams.get('lat') || '',
      long: urlParams.get('long') || '',
      pickup: urlParams.get('pickup') || '',
      return: urlParams.get('return') || '',
      address: urlParams.get('address') || '',
    };
    //Commented the previous code
    //const updatedSearchParams: SearchParamsType = { ...searchParams };
    // @ts-ignore
    // for (const [key, value] of urlParams.entries()) {
    //   if (updatedSearchParams.hasOwnProperty(key)) {
    //     updatedSearchParams[key as keyof SearchParamsType] = value;
    //   }
    // }
    // urlParams.forEach((value, key) => {
    //   if (updatedSearchParams.hasOwnProperty(key)) {
    //     updatedSearchParams[key as keyof SearchParamsType] = value;
    //   }
    // });
    setSearchParams(updatedSearchParams);
    setSingleCarBlockDates({} as TSingleCarBlockDate);
    setUserSelectingDateList([]);
  }, []);

  useEffect(() => {
    if (isMedium && !isIPadPro) {
      scrollToSection('pickup-return');
      // scrollToSection('vehicle-calendar');
    } else {
      // scrollToSection('pick-ret');
    }
  }, [urlParams]);

  useEffect(() => {
    if (searchParams?.pickup && searchParams?.return) {
      // UTC
      setValue('startDate', getPickerDateUtc(searchParams?.pickup));
      setValue('endDate', getPickerDateUtc(searchParams?.return));
      setValue('startTime', getPickerTimeUtc(searchParams?.pickup));
      setValue('endTime', getPickerTimeUtc(searchParams?.return));

      // setValue('startDate', new Date(searchParams?.pickup));
      // setValue('endDate', new Date(searchParams?.return));
      // setValue('startTime', new Date(searchParams?.pickup));
      // setValue('endTime', new Date(searchParams?.return));
    }
  }, [searchParams?.pickup, searchParams?.return]);

  //reservationData is added in dependency list to check validation whenever it changes
  useEffect(() => {
    if (carData?.rates && carData?.availability && reservationData?.status === 200) {
      setDefaultValues();
      setAvailabilityErrorText('');
      setUserSelectingDateList([]);
      calculation();
    }
  }, [watch('startDate'), watch('endDate'), watch('endTime'), watch('startTime'), carData, reservationData, singleCarBlockDates]);

  const calculation = async () => {
    // Combine selected date time
    const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(
      watch('startDate'),
      watch('startTime'),
      watch('endDate'),
      watch('endTime'),
      'vehicle-details'
    );

    const pickupTime = combinedPickup?.combinedDateTimeString;
    const returnTime = combinedReturn?.combinedDateTimeString;

    if (singleCarBlockDates?.allDayList?.length > 0) {
      handleAllDayBlockDates(pickupTime, returnTime, singleCarBlockDates, setAvailabilityErrorText);
    }
    // Check basic validation between pickup and return time
    const isTimeValid = await handleCommonDateTimeValidation(dayjs(pickupTime), dayjs(returnTime), setTimeErrorText, 'vehicle-details');
    const isAvailable = !isTimeValid
      ? false
      : await verifyConfirmReservationAvailability(pickupTime, returnTime, carData?.availability, reservationData?.data);

    // console.log({ isAvailable, isTimeValid });
    const searchPickup = dayjs(urlParams.get('pickup'));
    const searchReturn = dayjs(urlParams.get('return'));

    const isSame = dayjs(pickupTime).isSame(searchPickup) && dayjs(returnTime).isSame(searchReturn);

    if (!isSame) {
      // !Dynamic Domain
      router.replace(`/search/${vehicleId}/vehicle-details?pickup=${pickupTime}&return=${returnTime}`, {
        scroll: false,
      });
    }

    if (isAvailable && isTimeValid) {
      // calculates total price
      await calculateTotalPrice(
        pickupTime,
        returnTime,
        carData,
        setReservationPriceList,
        setReservationDuration,
        setDurationPrice,
        setServiceFee,
        setDiscountedPrice,
        setTotalPrice,
        setReservationCustomPriceList,
        setPeakIncPrice,
        setIndividualPriceList
      );
    }
  };

  useEffect(() => {
    if (timeErrorText) {
      setDefaultValues();
      return;
    }
  }, [timeErrorText]);

  const setDefaultValues = () => {
    setTotalPrice(0);
    setDurationPrice(0);
    setReservationDuration('');
    setDiscountedPrice(defaultDiscountValues);
    setPeakIncPrice({});
    setAvailabilityErrorText('');
    setServiceFee(0);
    setUserSelectingDateList([]);
  };

  return (
    <div ref={pickerRef} id="pick">
      {/* UTC */}
      <CustomSearchDateTimePickerTz
        {...commonProps}
        disableBlockDates={singleCarBlockDates?.allDayList?.map((blockDate) => new Date(blockDate?.start))}
        showUtc={true}
        pickupLabel="Pickup"
        returnLabel="Return"
      ></CustomSearchDateTimePickerTz>
      {/* <CustomSearchDateTimePicker
        {...commonProps}
        disableBlockDates={singleCarBlockDates?.allDayList?.map((blockDate) => new Date(blockDate?.start))}
      /> */}
      {timeErrorText && <p className="bg-red-200 md:text-sm text-xs text-center p-2 text-error rounded w-full">{timeErrorText}</p>}
    </div>
  );
};

export default VehiclePickupReturnUpdate;
