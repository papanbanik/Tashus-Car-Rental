'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useCarListingSteps } from '@/hooks/useCarListing';
import { getCarListingSteps } from '@/utils/Lists/carListingSteps';
import { useMediaQuery, useTheme } from '@mui/material';
import Step from '@mui/material/Step';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { GiCarKey } from 'react-icons/gi';
import { LiaCalendar } from 'react-icons/lia';
import { MdOutlineInsertPhoto } from 'react-icons/md';
import { TbStatusChange } from 'react-icons/tb';
import AvailabilityGray from '../../../../public/icons/ListingStepper/availability-gray.svg';
import Availability from '../../../../public/icons/ListingStepper/availability.svg';
import CarInfoGray from '../../../../public/icons/ListingStepper/car-info-gray.svg';
import CarInfo from '../../../../public/icons/ListingStepper/car-info.svg';
import DistanceGray from '../../../../public/icons/ListingStepper/distance-gray.svg';
import Distance from '../../../../public/icons/ListingStepper/distance.svg';
import GuidelinesGray from '../../../../public/icons/ListingStepper/guidelines-gray.svg';
import Guidelines from '../../../../public/icons/ListingStepper/guidelines.svg';
import InsuranceGray from '../../../../public/icons/ListingStepper/insurance-gray.svg';
import Insurance from '../../../../public/icons/ListingStepper/insurance.svg';
import LocationGray from '../../../../public/icons/ListingStepper/location-gray.svg';
import Location from '../../../../public/icons/ListingStepper/location.svg';
import PhotosGray from '../../../../public/icons/ListingStepper/photos-gray.svg';
import Photos from '../../../../public/icons/ListingStepper/photos.svg';
import RatesGray from '../../../../public/icons/ListingStepper/rates-gray.svg';
import Rates from '../../../../public/icons/ListingStepper/rates.svg';
import ViewGray from '../../../../public/icons/ListingStepper/view-gray.svg';
import View from '../../../../public/icons/ListingStepper/view.svg';

export const iconArrayForEditTabList = [
  CarInfoGray,
  LocationGray,
  AvailabilityGray,
  RatesGray,
  GuidelinesGray,
  MdOutlineInsertPhoto,
  DistanceGray,
  InsuranceGray,
  LiaCalendar,
  GiCarKey,
  TbStatusChange,
];

const breakpoints = {
  md: '40px',
  lg: '60px',
  xl: '80px',
};
// const breakpoints = {
//   xs: '30px',
//   sm: '50px',
//   md: '70px',
//   lg: '100px',
// };

const CarListStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 32,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: 'linear-gradient(90deg, transparent 40%, white 40%, white 60%, transparent 60%)',
      backgroundSize: '16px 1px', // Increase this value to make the white dashes wider
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'center',
      backgroundColor: '#800080',
      // backgroundImage:
      // 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: 'linear-gradient(90deg, transparent 40%, white 40%, white 60%, transparent 60%)',
      backgroundSize: '16px 1px', // Increase this value to make the white dashes wider
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'center',
      backgroundColor: '#800080',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: '4px',
    // Use @media rule to set the width based on screen size
    '@media (max-width: 900px)': {
      width: breakpoints.md,
    },
    '@media (min-width: 901px) and (max-width: 1280px)': {
      width: breakpoints.lg,
    },
    '@media (min-width: 1281px)': {
      width: breakpoints.xl,
    },
    // width: '40px',
    border: '0',
    background: 'linear-gradient(90deg, transparent 40%, white 40%, white 60%, transparent 60%)',
    backgroundSize: '16px 1px', // Increase this value to make the white dashes wider
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'center',
    backgroundColor: '#A8A1A8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
  },
}));

// circle
const CarListStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  zIndex: 1,
  height: 50,
  ':hover': {
    borderBottom: '4px solid #5C8D07',
  },

  ...(ownerState.active && {
    backgroundColor: '#d8b4fe',
    borderBottom: '4px solid #800080',
    borderRadius: '50%',
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  ...(!ownerState.active && {
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
}));

const CarListStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <CarInfo className="text-6xl" />,
    2: <Location className="text-4xl " />,
    3: <Availability className="text-4xl" />,
    4: <Rates className="text-4xl text-primary" />,
    5: <Guidelines className="text-3xl" />,
    6: <Photos className="text-3xl" />,
    7: <Distance className="text-3xl" />,
    8: <Insurance className="text-3xl" />,
    9: <View className="text-3xl" />,
  };

  const iconsGray: { [index: string]: React.ReactElement } = {
    1: <CarInfoGray className="text-6xl" />,
    2: <LocationGray className="text-4xl " />,
    3: <AvailabilityGray className="text-4xl" />,
    4: <RatesGray className="text-4xl text-primary" />,
    5: <GuidelinesGray className="text-3xl" />,
    6: <PhotosGray className="text-3xl" />,
    7: <DistanceGray className="text-3xl" />,
    8: <InsuranceGray className="text-3xl" />,
    9: <ViewGray className="text-3xl" />,
  };

  return (
    <CarListStepIconRoot ownerState={{ completed, active }} className={className}>
      {active || completed ? (
        <div className="flex justify-center items-center">{icons[String(props.icon)]}</div>
      ) : (
        <div className="flex justify-center items-center">{iconsGray[String(props.icon)]}</div>
      )}
    </CarListStepIconRoot>
  );
};

const ListingStepper = () => {
  const router = useRouter();
  const stepperRef = useRef<HTMLDivElement | null>(null); //used to scroll to specific step
  const theme = useTheme();
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('md'));
  const { listingSteps, listingId, setListingId, setCurrentStep, setListingSteps, setCarData, carData, currentStep, setEnableListSteps } =
    useCarListingContext();

  const { refetch } = useCarListingSteps();

  useEffect(() => {
    // const x = [...listingSteps, ...];
    // setListingSteps(x);
    // setCurrentStep({
    //   isCurrent: true,
    //   id: 1,
    //   name: '',
    //   urlString: '',
    //   isCompleted: false,
    // });
    const { listingId: currentListingId } = JSON.parse(localStorage.getItem('tashus') || '{}');
    // console.log('listingId', currentListingId);
    if (currentListingId) {
      setListingId(currentListingId);
      setEnableListSteps(true);
    }

    // extra
    // setListingSteps([...getCarListingSteps()]);
    // setCurrentStep({
    //   isCurrent: true,
    //   // id: 3,
    //   id: 1, //UC
    //   name: '',
    //   urlString: '/1/availability',
    //   isCompleted: false,
    // });
  }, []);

  useEffect(() => {
    if (!listingId && listingSteps.length === 0) {
      // console.log('lay in', getCarListingSteps());
      setListingSteps([...getCarListingSteps()]);
      setCurrentStep({
        isCurrent: true,
        id: 1,
        name: '',
        urlString: '',
        isCompleted: false,
      });
    }
  }, [listingId, listingSteps]);

  useEffect(() => {
    if (!isLargeDevice && listingSteps.length > 0) {
      const nextStep = listingSteps?.find((step: any) => !step?.isCompleted);
      // console.log(nextStep);
      scrollToStep(nextStep?.id || 1);
    }
  }, [listingSteps, isLargeDevice]);

  useEffect(() => {
    let temp = true;
    const reFetcher = async () => {
      if (listingId && temp && !carData) {
        setEnableListSteps(true);
      }
    };
    reFetcher();
    return () => {
      temp = false;
    };
  }, [listingId, carData]);

  const redirectCurrentStep = (id: number) => {
    const stepToUpdate = listingSteps.find((step) => step.id === id);

    if (!stepToUpdate) {
      return listingSteps;
    }

    if (stepToUpdate?.isCompleted || (id !== 1 && listingSteps[id - 2]?.isCompleted)) {
      const updatedList = listingSteps.map((step) => ({
        ...step,
        isCurrent: step.id === id,
      }));
      // console.log(updatedList);

      setListingSteps([...updatedList]);
      setCurrentStep(stepToUpdate);

      const lastString = `${listingId ? listingId : 1}/${stepToUpdate?.urlString}`;
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing/${stepToUpdate.id === 1 ? '' : lastString}`);
    }
  };

  // Scrolls to current step when listing steps changes
  const scrollToStep = (stepNumber: number) => {
    if (stepperRef?.current) {
      const stepElement = stepperRef?.current?.querySelector(`[data-step-id="${stepNumber}"]`);
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const stepperClasses = !isLargeDevice ? 'mb-8 bg-neutral flex overflow-x-scroll mt-8' : 'my-8 bg-neutral';

  return (
    // <Stepper className="mb-8 mt-8 bg-neutral" alternativeLabel activeStep={currentStep && currentStep?.id - 1} connector={<CarListStepConnector />}>
    <Stepper
      ref={stepperRef}
      className={stepperClasses}
      alternativeLabel
      activeStep={currentStep && currentStep?.id - 1}
      connector={<CarListStepConnector />}
    >
      {listingSteps.length > 0 &&
        listingSteps.map((step) => (
          <Step
            className="flex justify-center items-center gap-2 mr-2"
            completed={step?.isCompleted}
            onClick={() => redirectCurrentStep(step?.id)}
            key={step?.id}
            data-step-id={step?.id}
          >
            <StepLabel className={`${step?.isCompleted || step?.isCurrent ? 'cursor-pointer' : ''}`} StepIconComponent={CarListStepIcon}>
              <p className={`${step?.isCurrent || step?.isCompleted ? 'font-bold text-primary' : ''} p-0`}>{step?.name}</p>
            </StepLabel>
          </Step>
        ))}
    </Stepper>
  );
};

export default ListingStepper;
