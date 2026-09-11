'use client';
import CommonForm from '@/components/Common/CommonForm';
import { defaultSearchParams, useSearchContext } from '@/context/SearchProvider';
import { CarSearchByLocationDate } from '@/types/searchingTypes';
import { getDefaultPickupTime, getDefaultReturnTime } from '@/utils/Functions/dateTimeCommonFn';
import { buildQueryParams, defaultCoordinate } from '@/utils/Functions/searchCommonFn';
import { combineDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { getInitialLocation } from '@/utils/Lists/initialLocations';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';
import SearchDateTimePicker from './DateTIme/SearchDateTimePicker';
import SearchLocation from './SearchLocation';

const defaultValues: CarSearchByLocationDate = {
  location: {
    street: '',
    state: '',
    city: '',
    country: '',
    postalCode: '',
    coordinates: [0, 0],
    stateShortCode: '',
    countryShortCode: '',
  },
  startDate: getDefaultPickupTime(),
  endDate: getDefaultReturnTime(),
  startTime: getDefaultPickupTime(),
  endTime: getDefaultReturnTime(),
};
const SearchSection = () => {
  const theme = useTheme();
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('lg'));
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, setError, clearErrors, trigger } =
    useForm<CarSearchByLocationDate>({
      shouldFocusError: false,
      mode: 'onChange',
      defaultValues: defaultValues,
    });

  const router = useRouter();
  const { setSearchValue, setSearchParams, setSelectedSearchedLocation } = useSearchContext();

  useEffect(() => {
    setSearchValue('');
    setSelectedSearchedLocation(null);
    setSearchParams(defaultSearchParams);
  }, []);

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
  };

  const formatQueryParams = (data: CarSearchByLocationDate, pickupTime?: Date, returnTime?: Date) => {
    const city = `${data?.location?.city?.split(' ')?.join('-')}`;
    const region = `${data?.location?.state?.split(' ')?.join('-')}`;
    const country = `${data?.location?.country?.split(' ')?.join('-')}`;
    const pickupDate = `${dayjs(pickupTime)?.format('D-MMM-YYYY')}`;
    const pickTime = `${dayjs(pickupTime)?.format('h:mmA')}`;
    const returnDate = `${dayjs(returnTime)?.format('D-MMM-YYYY')}`;
    const retTime = `${dayjs(returnTime)?.format('h:mmA')}`;

    return { city, region, country, pickupDate, pickTime, returnDate, retTime };
  };

  const onCarSearch = async (data: CarSearchByLocationDate, route: string = '') => {
    // console.log(data);
    const { combinedDateTimeString: pickupTimeString, combinedDayObj: pickupTimeDayObj } = await combineDateTimeUtc(
      data?.startDate,
      data?.startTime,
      'hero pick'
    );
    const { combinedDateTimeString: returnTimeString } = await combineDateTimeUtc(data?.endDate, data?.endTime, 'hero ret');

    let pickupTime = pickupTimeString;
    let returnTime = returnTimeString;

    const { combinedDayObj: defaultPickupTimeDayObj, combinedDateTimeString: defaultPickupTimeString } = combineDateTimeUtc(
      getDefaultPickupTime(),
      getDefaultPickupTime(),
      'hero default'
    );

    const isPickupPast = pickupTimeDayObj.isBefore(defaultPickupTimeDayObj, 'minute');

    if (isPickupPast) {
      const { combinedDateTimeString: defaultReturnTimeString } = combineDateTimeUtc(getDefaultReturnTime(), getDefaultReturnTime(), 'hero default');
      pickupTime = defaultPickupTimeString;
      returnTime = defaultReturnTimeString;
    }

    const { city } = formatQueryParams(data);
    const { stateShortCode, countryShortCode, postalCode, coordinates, street } = data?.location;
    const { place: iniCity, countryShortCode: iniCountry, stateShortCode: iniState, complete_address } = getInitialLocation()[0];
    // const { city, region, country, pickupDate, pickTime, returnDate, retTime } = formatQueryParams(data, pickupTime, returnTime);
    if (coordinates[1] && coordinates[0]) {
      const queryParams = buildQueryParams({
        lat: coordinates[1]?.toString(),
        long: coordinates[0]?.toString(),
        pickup: pickupTime,
        return: returnTime,
        postcode: postalCode,
        city: city,
        region: stateShortCode,
        country: countryShortCode,
        address: street,
      });
      // router.push(
      //   `/search?lat=${coordinates[1]}&long=${coordinates[0]}&pickup=${pickupTime}&return=${returnTime}&postcode=${postalCode}&city=${city}&region=${stateShortCode}&country=${countryShortCode}&address=${street}`
      // );
      router.push(`/${route}?${queryParams}`);
    } else {
      router.push(
        `/${route}?lat=${defaultCoordinate[1].toString()}&long=${defaultCoordinate[0].toString()}&pickup=${pickupTime}&return=${returnTime}&city=${iniCity}&region=${iniState}&country=${iniCountry}&address=${
          street || complete_address
        }`
      );
    }
  };

  return (
    // <CommonForm handleFunction={handleSubmit(onCarSearch)}>
    <CommonForm
      handleFunction={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Cast nativeEvent to SubmitEvent to access submitter
        const submitEvent = event.nativeEvent as SubmitEvent;
        const buttonName = (submitEvent.submitter as HTMLButtonElement)?.name;

        if (buttonName === 'search') {
          handleSubmit((data) => onCarSearch(data, 'search'))();
        } else if (buttonName === 'dummySearch') {
          handleSubmit((data) => onCarSearch(data, 'dummy-search'))();
        }
      }}
    >
      <div className="absolute left-1/2 lg:top-[92%] top-[70%] transform -translate-x-1/2 w-[85%] sm:w-[95%] md:w-3/4 lg:w-[71%] max-w-[1200px] lg:mx-0 lg:h-[80px] z-30 rounded-lg flex flex-col lg:flex-row gap-2 p-4 bg-white shadow-md shadow-secondary">
        <SearchLocation {...commonProps} />
        <SearchDateTimePicker {...commonProps} />
        <div className="flex items-center justify-center w-full lg:w-auto ">
          <Button
            fullWidth
            variant="contained"
            type="submit"
            color="primary"
            className="normal-case bg-primary h-12 lg:h-full"
            startIcon={!isLargeDevice ? <BsSearch className="text-base-100 text-base" /> : undefined}
            name="search"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              {isLargeDevice ? <BsSearch size={30} className="text-base-100" /> : <span className="text-base-100 text-base font-medium">Search</span>}
            </div>
          </Button>
          {/* {process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && (
            <Button fullWidth variant="outlined" type="submit" color="primary" className="normal-case text-sm ml-1" size="small" name="dummySearch">
              Dummy Search
            </Button>
          )} */}
        </div>
      </div>
    </CommonForm>
  );
};

export default SearchSection;
