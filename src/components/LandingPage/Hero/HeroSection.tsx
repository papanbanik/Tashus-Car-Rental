'use client';
import CommonForm from '@/components/Common/CommonForm';
import { defaultSearchParams, useSearchContext } from '@/context/SearchProvider';
import { CarSearchByLocationDate } from '@/types/searchingTypes';
import { getDefaultPickupTime, getDefaultReturnTime } from '@/utils/Functions/dateTimeCommonFn';
import { getInitialLocation } from '@/utils/Lists/initialLocations';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';
import Location from './Location';

import CustomImage from '@/components/Common/CustomImage';
import CustomSearchDateTimePicker from '@/components/Common/DateTimePickers/CustomSearchDateTimePicker';
import { combineDateTimeUtc } from '@/utils/Functions/utcCommonFn';

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

const HeroSection = () => {
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

  const onCarSearch = async (data: CarSearchByLocationDate) => {
    // console.log(data);
    const { combinedDateTimeString: pickupTime } = await combineDateTimeUtc(data?.startDate, data?.startTime, 'hero pick');
    const { combinedDateTimeString: returnTime } = await combineDateTimeUtc(data?.endDate, data?.endTime, 'hero ret');
    // console.log(pickupTime);
    // console.log(returnTime);
    const { city } = formatQueryParams(data);
    const { stateShortCode, countryShortCode, postalCode, coordinates, street } = data?.location;
    const { place: iniCity, countryShortCode: iniCountry, stateShortCode: iniState, complete_address } = getInitialLocation()[0];
    // const { city, region, country, pickupDate, pickTime, returnDate, retTime } = formatQueryParams(data, pickupTime, returnTime);

    router.push(
      `/search?country=${countryShortCode || iniCountry}&region=${!countryShortCode ? iniState : stateShortCode}&postcode=${postalCode}&city=${
        !countryShortCode ? iniCity : city
      }&lat=${coordinates[0]}&long=${coordinates[1]}&pickup=${pickupTime}&return=${returnTime}&address=${street || complete_address}`
    );
  };
  const [backgroundImage, setBackgroundImage] = useState<string>('/Hero/a.svg');
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1600) {
        setBackgroundImage('/Hero/a3-01.svg');
      } else {
        setBackgroundImage('/Hero/a.svg');
      }
    };

    // Call handleResize initially and add event listener for window resize
    handleResize();
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="bg-neutral lg:px-32 xl:px-52  md:px-24 px-2  "
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundPositionY: 'top',

        position: 'relative', // Ensure that the pseudo-element is positioned relative to this div
      }}
    >
      <Box className="md:mt-0 mt-2 flex flex-col justify-center items-center h-full relative">
        <div className="hidden lg:block">
          {/* <Image
        src="/Hero/Tashus-Earth.png"
        alt="Tashus eco-friendly car sharing platform"
        width={800}
        height={800}
        className="relative earth w-[800px] h-[800px]"
      /> */}
          <CustomImage
            src="/Hero/Tashus-Earth.png"
            alt="Tashus eco-friendly car rental platform"
            width={800}
            height={800}
            className="relative earth w-[800px] h-[800px]"
          />
        </div>

        <div className="hidden lg:block ">
          <Image src="/Hero/Tashus-Earth-car.svg" alt="Tashus simple car for sharing" width={50} height={50} className="-translate-y-[687px]" />
        </div>

        {/* Rest of the content */}
        <Box id="main-box" className="lg:absolute lg:w-full  lg:top-1/3  bg-gray-200 ">
          <Typography
            className="text-[24px] lg:text-[40px] block lg:hidden"
            variant="h4"
            component="h2"
            sx={{
              padding: '1rem',
              fontWeight: '600',
              backgroundColor: '#800080',
              color: '#ffffff',
              textAlign: 'center',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              willChange: 'transform',
              contain: 'content',
              whiteSpace: 'normal', // Allows the text to break
            }}
          >
            Rent Instantly &<br />
            Hit the road
          </Typography>

          <Typography
            className="text-[24px] lg:text-[40px] hidden lg:block"
            variant="h4"
            component="h2"
            sx={{
              padding: '1rem',
              fontWeight: '600',
              backgroundColor: '#800080',
              color: '#ffffff',
              textAlign: 'center',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              willChange: 'transform',
              contain: 'content',
            }}
          >
            Rent Instantly & Hit the road
          </Typography>

          <CommonForm handleFunction={handleSubmit(onCarSearch)}>
            <Box className="w-full xl:flex justify-between xl:gap-2 items-start lg:px-2 xl:px-2 px-4 pt-4">
              <div className="xl:w-1/2 w-full">
                <Location {...commonProps}></Location>
              </div>
              <div className="xl:w-1/2 w-full">
                <CustomSearchDateTimePicker {...commonProps}></CustomSearchDateTimePicker>
                {/* <CustomSearchDateTimePickerTz {...commonProps}></CustomSearchDateTimePickerTz> */}
              </div>
              {/* <DateTimeSection {...commonProps}></DateTimeSection> */}
            </Box>
            <Box className="mt-0 md:mt-12  ">
              <Button
                variant="contained"
                type="submit"
                className="search normal-case text-[18x] lg:text-[18px] rounded-md md:rounded-lg px-4 py-2 md:px-8 lg:py-4 font-bold flex items-center mx-auto lg:my-4 mt-6"
                endIcon={<BsSearch />}
              >
                Search a Car
              </Button>
            </Box>
          </CommonForm>

          {/* <LaunchingBanner></LaunchingBanner> */}
          {/* Uncomment following to hide hero image */}
          <Box className="h-[95px] md:h-[130px] lg:h-[150px] pt-5 bg-neutral w-full mt-16"></Box>
        </Box>
      </Box>
    </div>
  );
};

export default HeroSection;
