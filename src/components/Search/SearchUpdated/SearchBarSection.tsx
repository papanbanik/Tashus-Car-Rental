'use client';
import CommonForm from '@/components/Common/CommonForm';
import SearchDateTimePickerTz from '@/components/Common/DateTimePickers/SearchDateTimePickerTz';
import SearchLocation from '@/components/LandingPage/HeroUpdated/SearchLocation';
import { defaultSearchParams, useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { CarSearchByLocationDate, CarSearchType } from '@/types/searchingTypes';
import { getDefaultPickupTime, getDefaultReturnTime } from '@/utils/Functions/dateTimeCommonFn';
import { buildQueryParams } from '@/utils/Functions/searchCommonFn';
import { combineDateTimeUtc, getCombinedPickReturnUtc } from '@/utils/Functions/utcCommonFn';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface SearchBarSectionProps {
  getCurrentLocation: () => void;
}
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

const SearchBarSection: React.FC<SearchBarSectionProps> = ({ getCurrentLocation }) => {
  const theme = useTheme();
  const patheName = usePathname();
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('lg'));
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, setError, clearErrors, trigger } =
    useForm<CarSearchByLocationDate>({
      shouldFocusError: false,
      mode: 'onChange',
      defaultValues: defaultValues,
    });

  const [allowFilter, setAllowFilter] = useState<boolean>(false); //to solve invalid date range error in search page

  const router = useRouter();
  const {
    setSearchValue,
    setSearchParams,
    setSelectedSearchedLocation,
    searchedCarList,
    setAvailableCarList,
    setFilteredCarList,
    selectedFilters,
    searchParams,
    setSelectedFilters,
    setSearchedCarList,
  } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();

  useEffect(() => {
    setSearchValue('');
    setSelectedSearchedLocation(null);
    setSearchParams(defaultSearchParams);
  }, []);

  useEffect(() => {
    handleeSearchParamsChange();
  }, [searchParams]);

  // Filter cars based on their availability
  useEffect(() => {
    handleSearchedCarValidation();
  }, [searchedCarList, watch('startDate'), watch('startTime'), watch('endDate'), watch('endTime'), allowFilter]);

  const handleeSearchParamsChange = () => {
    setValue('location.city', searchParams?.city || '');
    setValue('location.countryShortCode', searchParams?.country || '');
    setValue('location.stateShortCode', searchParams?.region || '');
    setValue('location.postalCode', searchParams?.postcode || '');
    setValue('location.coordinates', [parseFloat(searchParams?.long) || 0, parseFloat(searchParams?.lat) || 0]);
    setValue('startDate', new Date(searchParams?.pickup));
    setValue('endDate', new Date(searchParams?.return));
    setValue('startTime', new Date(searchParams?.pickup));
    setValue('endTime', new Date(searchParams?.return));
    setAllowFilter(true); //to solve invalid date range error in search page
  };

  const handleSearchedCarValidation = () => {
    //checking dates to avoid invalid date error
    if (searchedCarList?.length > 0 && allowFilter && watch('startDate') && watch('startTime') && watch('endDate') && watch('endTime')) {
      const tempSearchedList = [...searchedCarList];

      // !Start Range
      // Commented to avoid notice period, min, max duration validation in search bar
      // const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(
      //   watch('startDate'),
      //   watch('startTime'),
      //   watch('endDate'),
      //   watch('endTime'),
      //   'search-bar'
      // );
      // const pickupTimeUtc = combinedPickup?.combinedDateTimeString;
      // const returnTimeUtc = combinedReturn?.combinedDateTimeString;

      // const tempAvailableCarList = tempSearchedList?.map(async (car: any) => {
      //   const isAvailable = await searchedAvailabilityValidation(car, pickupTimeUtc, returnTimeUtc);
      //   if (isAvailable) {
      //     return car;
      //   }
      // });
      // !End Range

      const tempAvailableCarList = [...tempSearchedList];

      Promise.all(tempAvailableCarList).then((result) => {
        const updatedResult = result?.filter((car) => car !== undefined);
        setAvailableCarList(updatedResult);
        if (!selectedFilters.some((item) => item.name === 'carType')) {
          setFilteredCarList(updatedResult);
        }

        // To check vehicle number mismatch
        // const appList = [
        //   1144, 1112, 1118, 1113, 1125, 1001, 1129, 1138, 1133, 1134, 18, 23, 19, 20, 14, 16, 17, 21, 41, 58, 43, 2, 40, 39, 61, 36, 37, 55, 54, 62,
        //   34, 38, 60, 57, 42, 59, 63, 6, 11, 9, 8, 4, 5, 3, 10, 12, 33, 49, 52, 44, 30, 28, 27, 51, 47, 45, 48, 29, 1130,
        // ];
        // const beforeList = tempSearchedList?.map((result: any) => result.listingId);
        // const afterList = updatedResult?.map((result: any) => result.listingId);
        // const resultList = beforeList?.filter((item) => !afterList.includes(item));
        // console.log('resultList', resultList);
      });
      setAllowFilter(false); //so that whenever filter doesn't occur without clicking on search icon
    }
  };

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

  const onSearchVehicle: SubmitHandler<CarSearchType> = async (data) => {
    const { location, startDate, endDate, startTime, endTime } = data;
    // pickers are already in UTC value, so normal combine
    const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(startDate, startTime, endDate, endTime, 'search-bar');

    let pickupTime = combinedPickup?.combinedDateTimeString;
    let returnTime = combinedReturn?.combinedDateTimeString;

    const { combinedDayObj: defaultPickupTime, combinedDateTimeString: defaultPickupTimeString } = combineDateTimeUtc(
      getDefaultPickupTime(),
      getDefaultPickupTime(),
      'hero default'
    );

    const isPickupPast = combinedPickup?.combinedDayObj.isBefore(defaultPickupTime, 'minute');

    if (isPickupPast) {
      const { combinedDateTimeString: defaultReturnTimeString } = combineDateTimeUtc(getDefaultReturnTime(), getDefaultReturnTime(), 'hero default');
      pickupTime = defaultPickupTimeString;
      returnTime = defaultReturnTimeString;
    }

    setSelectedFilters([]);
    setSearchedCarList([]);
    // setAvailableCarList([]);
    const queryParams = buildQueryParams({
      lat: location?.coordinates[1]?.toString(),
      long: location?.coordinates[0]?.toString(),
      pickup: pickupTime,
      return: returnTime,
      postcode: location?.postalCode,
      city: location?.city,
      region: location?.stateShortCode,
      country: location?.countryShortCode,
      address: location?.street || searchParams?.address,
    });
    router.push(`${patheName}?${queryParams}&source=searchBar`);
  };

  return (
    <CommonForm handleFunction={handleSubmit(onSearchVehicle)}>
      <div className="flex justify-center items-center  my-4">
        <div className="w-[85%] sm:w-[95%] md:w-3/4 lg:w-[100%]  lg:h-[80px] rounded-2xl flex flex-col lg:flex-row gap-2 p-4 bg-white shadow-md shadow-secondary">
          <SearchLocation {...commonProps} />
          <SearchDateTimePickerTz {...commonProps} showUtc={true} />
          {/* <SearchDateTimePicker {...commonProps} /> */}
          <div className="flex flex-col items-center justify-center w-full lg:w-auto ">
            <Button fullWidth variant="contained" type="submit" color="primary" className="normal-case bg-primary">
              <div className="flex flex-col items-center h-[35px] justify-center ">
                {isLargeDevice ? <BsSearch size={30} /> : <BsSearch size={30} />}
              </div>
            </Button>
            <Button
              fullWidth
              variant="outlined" // Makes the button bordered
              className="normal-case border-gray-300 rounded-md h-[44px] mt-2 lg:hidden"
              onClick={getCurrentLocation}
            >
              <div className="flex items-center justify-center h-full text-primary">
                <FaMapMarkerAlt
                  className="mr-1 "
                  style={{ fontSize: '1rem', height: '1rem', width: '1rem' }} // Adjust size to match text
                />
                Search with current location
              </div>
            </Button>
          </div>
        </div>
      </div>
    </CommonForm>
  );
};

export default SearchBarSection;
