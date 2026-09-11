'use client';

import SignUp from '@/components/SignUp/SignUp';
import { CarDataState, CarFuelValues, TLicenseVerifiedData } from '@/types/car-listing/carListingTypes';
import { SearchParamsType } from '@/types/searchingTypes';
import { ListingData } from '@/types/user-profile/customPriceTypes';
import { ListingStep, getCarListingSteps } from '@/utils/Lists/carListingSteps';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
import { useModalContext } from './ModalProvider';
import { useUserCredContext } from './UserCredProvider';

type CarListingContextType = {
  handleSaveCurrentStep: (id: number, listingId: number) => void;
  handlePrevNextBtn: (redirectString: string | undefined) => void;
  getSubString: () => string;
  updateCurrentStep: () => void;
  handlePublicListingButton: () => void;
  getLastStep: (storedSteps: [any]) => any;
  updateCurrentCarSteps: (lastCompletedStep: any, storedSteps: [any], currentListingId: number) => void;
  updateLocalListingId: (currentListId: number | string) => Promise<void>;
  handleAddNewListing: () => void;
  getUpdatedSteps: (stepNumber: number) => any;
  showCarDetails: (vehicleId: number, searchedCarData: any, searchParams: SearchParamsType) => void;
  listingSteps: ListingStep[];
  setListingSteps: Dispatch<SetStateAction<ListingStep[]>>;
  currentStep: ListingStep | undefined;
  setCurrentStep: Dispatch<SetStateAction<ListingStep | undefined>>;
  listingId: string;
  setListingId: Dispatch<SetStateAction<string>>;
  carData: CarDataState;
  setCarData: Dispatch<SetStateAction<CarDataState>>;
  licenseVerifiedData: TLicenseVerifiedData;
  setLicenseVerifiedData: Dispatch<SetStateAction<TLicenseVerifiedData>>;
  listingErrorMessage: string | undefined;
  setListingErrorMessage: Dispatch<SetStateAction<string | undefined>>;
  listingSuccessMessage: string | undefined;
  setListingSuccessMessage: Dispatch<SetStateAction<string | undefined>>;
  verifyCar: boolean;
  setVerifyCar: Dispatch<SetStateAction<boolean>>;
  enableListSteps: boolean;
  setEnableListSteps: Dispatch<SetStateAction<boolean>>;
  weeklyAvailabilityList: any;
  setWeeklyAvailabilityList: Dispatch<SetStateAction<any>>;
  isUploading: PhotoUploading;
  setIsUploading: Dispatch<SetStateAction<PhotoUploading>>;
  isHideSpaceForEditVehicle: boolean;
  setIsHideSpaceForEditVehicle: Dispatch<SetStateAction<boolean>>;
  isEditVehicle: boolean;
  setIsEditVehicle: Dispatch<SetStateAction<boolean>>;
  isCarLicenseVerified: boolean;
  setIsCarLicenseVerified: Dispatch<SetStateAction<boolean>>;
  userVehicleList: any;
  setUserVehicleList: Dispatch<SetStateAction<any>>;
  userVehiclePrice: ListingData[];
  setUserVehiclePrice: Dispatch<SetStateAction<ListingData[]>>;
  vehicleFuelList: CarFuelValues;
  setVehicleFuelList: Dispatch<SetStateAction<CarFuelValues>>;
};

type CarListingProviderProps = {
  children: ReactNode;
};

type PhotoUploading = {
  coverPhoto: boolean;
  additionalPhotos: boolean;
  initialPhotos: boolean;
  inspectionPhoto: boolean; //Inspection Photo
};

export const CarListing = createContext<CarListingContextType | undefined>(undefined);

export const useCarListingContext = (): CarListingContextType => {
  const context = useContext(CarListing);
  if (!context) {
    throw new Error('useContext must be used within a CarListingProvider');
  }
  return context;
};

export const CarListingProvider: FC<CarListingProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [listingSteps, setListingSteps] = useState<ListingStep[]>([...getCarListingSteps()]);
  const [listingId, setListingId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<ListingStep | undefined>({
    isCurrent: true,
    id: 1,
    name: '',
    urlString: '',
    isCompleted: false,
  });
  const [carData, setCarData] = useState<CarDataState>({} as CarDataState);
  const [licenseVerifiedData, setLicenseVerifiedData] = useState<TLicenseVerifiedData>({} as TLicenseVerifiedData);
  const [listingErrorMessage, setListingErrorMessage] = useState<string | undefined>('');
  const [listingSuccessMessage, setListingSuccessMessage] = useState<string | undefined>('');
  const [userVehiclePrice, setUserVehiclePrice] = useState<ListingData[]>([]);

  // Below states are enabling key for react queries
  const [verifyCar, setVerifyCar] = useState<boolean>(false);
  const [enableListSteps, setEnableListSteps] = useState<boolean>(false);
  const [weeklyAvailabilityList, setWeeklyAvailabilityList] = useState<any>([]);

  //Below state is edit vehicles component space hide
  const [isHideSpaceForEditVehicle, setIsHideSpaceForEditVehicle] = useState<boolean>(false);
  const [isEditVehicle, setIsEditVehicle] = useState<boolean>(false);

  // Below states are for loading buttons
  const [isUploading, setIsUploading] = useState<PhotoUploading>({
    coverPhoto: false,
    additionalPhotos: false,
    initialPhotos: false,
    inspectionPhoto: false, //Inspection Photo
  });

  const [isCarLicenseVerified, setIsCarLicenseVerified] = useState<boolean>(false);
  //Car All Vehicle Rates
  const [userVehicleList, setUserVehicleList] = useState<any>([]);
  //Car Fuel List
  const [vehicleFuelList, setVehicleFuelList] = useState<CarFuelValues>({} as CarFuelValues);

  const { setUserType, userType, userCred, userProfileInfo } = useUserCredContext();
  const { openModal } = useModalContext();

  // saves the current step
  const handleSaveCurrentStep = (id: number, listingId: number) => {
    const stepToUpdate = listingSteps.find((step) => step.id === id);
    const nextStep = listingSteps.find((step) => step.id === id + 1);
    if (!stepToUpdate || !nextStep) {
      return listingSteps;
    }
    stepToUpdate.isCompleted = true;
    nextStep.isCurrent = true;
    setListingSteps([...listingSteps]);
    const urlString = `${listingId}/${nextStep?.urlString}`;
    if (!isEditVehicle) {
      handlePrevNextBtn(urlString);
    }
  };

  // redirects to the provided route
  const handlePrevNextBtn = (redirectString: string | undefined) => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing/${redirectString}`);
  };

  // updates & provides current step
  const updateCurrentStep = () => {
    const subString = getSubString();
    const updatedList = listingSteps.map((step) => ({
      ...step,
      isCurrent: step.urlString === subString,
    }));
    setListingSteps(updatedList);
    const updatedStep = updatedList.find((step) => step.urlString === subString);
    updatedStep && setCurrentStep(updatedStep);
  };

  // provides current URL's last string
  const getSubString = () => {
    const lastIndex = pathName.lastIndexOf('/');
    return pathName.substring(lastIndex + 1);
  };

  // provides last completed step
  const getLastStep = (storedSteps: [any]) => {
    const lastCompletedStep = [...storedSteps].reverse().find((step) => step.completed);
    return lastCompletedStep;
  };

  const updateCurrentCarSteps = (lastCompletedStep: any, storedSteps: [any], currentListingId: number) => {
    const tempListingSteps = [...getCarListingSteps()];
    const updatedCarList = tempListingSteps.map((car) => ({
      ...car,
      isCurrent: car.id === lastCompletedStep?.step + 1 ? true : false,
      isCompleted: storedSteps.find((step: any) => step.step === car.id)?.completed,
    }));
    let tempCurrentStep = [...updatedCarList].find((step) => step.isCurrent);
    const lastString = `${currentListingId}/${tempCurrentStep?.urlString}`;

    setListingSteps(updatedCarList);
    setCurrentStep(tempCurrentStep);

    // console.log(updatedCarList);
    // console.log(tempCurrentStep);
    // console.log(storedSteps);
    // console.log(listingSteps);
    // console.log(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing/${tempCurrentStep?.id === 1 ? '' : lastString}`);

    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing/${lastString}`);
  };

  // Stores current listing id in local and state
  const updateLocalListingId = async (currentListId: number | string) => {
    setListingId(currentListId.toString());
    const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
    tashus.listingId = currentListId;
    localStorage.setItem('tashus', JSON.stringify(tashus));
  };

  // update relevant states and redirect to add new listing
  const handleAddNewListing = () => {
    updateLocalListingId('');
    setListingSteps([]);
    setCarData({} as CarDataState);
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing`);
  };

  const handlePublicListingButton = () => {
    setUserType('partner');
    if (typeof window !== 'undefined') {
      const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
      const userData = { ...tashus, userType: userType, listingId: '', isAllowListing: userProfileInfo?.isAllowListing || false };
      localStorage.setItem('tashus', JSON.stringify(userData));
    }
    setListingSteps([]);
    setListingId('');
    setCarData({} as CarDataState);
    userCred.loggedIn
      ? router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing`)
      : openModal({
          title: 'Login or Sign Up',
          content: (
            <div className="md:mx-4 md:my-2">
              <SignUp></SignUp>
            </div>
          ),
        });
  };

  // updates steps to save
  const getUpdatedSteps = async (stepNumber: number) => {
    const tempSteps = listingSteps.map((step) => ({
      step: step.id,
      name: step.name,
      completed: step.id === stepNumber ? true : step.isCompleted,
      isMandatory: true,
    }));
    // console.log(tempSteps);
    // console.log(listingSteps);
    return tempSteps;
  };

  // Redirect to car details page
  const showCarDetails = async (vehicleId: number, searchedCarData: any, searchParams: SearchParamsType) => {
    // setCarData(searchedCarData);
    router.push(
      `${process.env.NEXT_PUBLIC_DOMAIN}/search/${vehicleId}/vehicle-details?pickup=${searchParams?.pickup}&return=${searchParams?.return}`
    );
  };

  const contextValue: CarListingContextType = {
    handleSaveCurrentStep,
    getSubString,
    updateCurrentStep,
    handlePrevNextBtn,
    getLastStep,
    updateCurrentCarSteps,
    updateLocalListingId,
    handleAddNewListing,
    getUpdatedSteps,
    handlePublicListingButton,
    showCarDetails,
    listingSteps,
    setListingSteps,
    currentStep,
    setCurrentStep,
    listingId,
    setListingId,
    carData,
    setCarData,
    licenseVerifiedData,
    setLicenseVerifiedData,
    listingErrorMessage,
    setListingErrorMessage,
    listingSuccessMessage,
    setListingSuccessMessage,
    verifyCar,
    setVerifyCar,
    enableListSteps,
    setEnableListSteps,
    weeklyAvailabilityList,
    setWeeklyAvailabilityList,
    isUploading,
    setIsUploading,
    isHideSpaceForEditVehicle,
    setIsHideSpaceForEditVehicle,
    isEditVehicle,
    setIsEditVehicle,
    isCarLicenseVerified,
    setIsCarLicenseVerified,
    userVehicleList,
    setUserVehicleList,
    userVehiclePrice,
    setUserVehiclePrice,
    vehicleFuelList,
    setVehicleFuelList,
  };

  return <CarListing.Provider value={contextValue}>{children}</CarListing.Provider>;
};
//
