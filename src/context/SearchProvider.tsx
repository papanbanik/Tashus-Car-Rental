'use client';

import { TSingleCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { TSearchedCar } from '@/types/car-search/carSearchType';
import { TAppliedCreditInfo, TAppliedVoucherInfo, TGstData, VoucherDetailsType } from '@/types/checkout/checkoutTypes';
import { TGuestInsurance, TSaveAdditionalDriverInfo } from '@/types/checkout/guestVerificationTypes';
import { TPaymentMethods } from '@/types/commonTypes';
import { IMapFormattedResult } from '@/types/mapLocations';
import { SearchParamsType, SelectedFiltersType } from '@/types/searchingTypes';
import { TDateInfo } from '@/types/travels/typeEditTravels';
import { PeakIncreaseTypeEnum, ReservationLocationState } from '@/types/travels/typeTravels';
import { ICustomPricing, IndividualPricing, ReservationPriceListType } from '@/types/user-profile/customPriceTypes';
import { TDeliveryDetails } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import { TVehicleReservation, VehicleDeliveryInfoState, VehicleDropInfoState } from '@/types/vehicle-details/vehicle-details';
import { isSameDay } from '@/utils/Functions/dateTimeCommonFn';
import {
  validateBlockDates,
  validateReservations,
  verifyCustomPickupReturn,
  verifyMaxTravelDays,
  verifyMinTravelDays,
} from '@/utils/Functions/reservationValidationFn';
import { getAdvanceTimeDiffInMin, getIsNoticePeriodRequired } from '@/utils/Functions/searchCommonFn';
import { formatDateUtc, formatTimeUtc } from '@/utils/Functions/utcCommonFn';
import dayjs from 'dayjs';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

type SearchContextType = {
  removeAppliedFilter: (filterName: string) => void;
  verifyConfirmReservationAvailability: (
    pickupDateTime: string,
    returnDateTime: string,
    carAvailability: any,
    reservationList: any[]
  ) => Promise<boolean>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  searchParams: SearchParamsType;
  setSearchParams: Dispatch<SetStateAction<SearchParamsType>>;
  searchedCarList: TSearchedCar[];
  setSearchedCarList: Dispatch<SetStateAction<TSearchedCar[]>>;
  filteredCarList: TSearchedCar[];
  setFilteredCarList: Dispatch<SetStateAction<TSearchedCar[]>>;
  selectedFilters: SelectedFiltersType[];
  setSelectedFilters: Dispatch<SetStateAction<SelectedFiltersType[]>>;
  availableCarList: TSearchedCar[];
  setAvailableCarList: Dispatch<SetStateAction<TSearchedCar[]>>;
  selectedSearchedLocation: IMapFormattedResult | null;
  setSelectedSearchedLocation: Dispatch<SetStateAction<IMapFormattedResult | null>>;
  locationOptions: IMapFormattedResult[];
  setLocationOptions: Dispatch<SetStateAction<IMapFormattedResult[]>>;
  totalPrice: number;
  setTotalPrice: Dispatch<SetStateAction<number>>;
  durationPrice: number;
  setDurationPrice: Dispatch<SetStateAction<number>>;
  discountedPrice: DiscountedPriceType;
  setDiscountedPrice: Dispatch<SetStateAction<DiscountedPriceType>>;
  reservationDuration: string;
  setReservationDuration: Dispatch<SetStateAction<string>>;
  peakIncPrice: TPeakIncreasePrice;
  setPeakIncPrice: Dispatch<SetStateAction<TPeakIncreasePrice>>;
  reservationPriceList: ReservationPriceListType[];
  setReservationPriceList: Dispatch<SetStateAction<ReservationPriceListType[]>>;
  availabilityErrorText: string;
  setAvailabilityErrorText: Dispatch<SetStateAction<string>>;
  timeErrorText: string;
  setTimeErrorText: Dispatch<SetStateAction<string>>;
  serviceFee: number;
  setServiceFee: Dispatch<SetStateAction<number>>;
  queryEnableFlags: QueryEnableFlagsType;
  setQueryEnableFlags: Dispatch<SetStateAction<QueryEnableFlagsType>>;
  hostInfo: HostDetailsType | null;
  setHostInfo: Dispatch<SetStateAction<HostDetailsType | null>>;
  verificationAlertMessage: TVerificationAlertMessage;
  setVerificationAlertMessage: Dispatch<SetStateAction<TVerificationAlertMessage>>;
  customMessage: string;
  setCustomMessage: Dispatch<SetStateAction<string>>;
  reservationInfo: TReservationInfo | null;
  setReservationInfo: Dispatch<SetStateAction<TReservationInfo | null>>;
  guestVerificationFlags: TGuestVerificationFlags;
  setGuestVerificationFlags: Dispatch<SetStateAction<TGuestVerificationFlags>>;
  verificationStatusFlags: TVerificationStatusFlags;
  setVerificationStatusFlags: Dispatch<SetStateAction<TVerificationStatusFlags>>;
  singleCarBlockDates: TSingleCarBlockDate;
  setSingleCarBlockDates: Dispatch<SetStateAction<TSingleCarBlockDate>>;
  singleCarReservationList: TVehicleReservation[];
  setSingleCarReservationList: Dispatch<SetStateAction<TVehicleReservation[]>>;
  userSelectingDateList: TDateInfo[];
  setUserSelectingDateList: Dispatch<SetStateAction<TDateInfo[]>>;
  guestCoveragePackage: TGuestInsurance;
  setGuestCoveragePackage: Dispatch<SetStateAction<TGuestInsurance>>;
  guestCoverageType: string;
  setGuestCoverageType: Dispatch<SetStateAction<string>>;
  additionalDrivers: TSaveAdditionalDriverInfo[];
  setAdditionalDrivers: Dispatch<TSaveAdditionalDriverInfo[]>;
  gstData: TGstData;
  setGstData: Dispatch<TGstData>;
  additionalPaymentInfo: any;
  setAdditionalPaymentInfo: Dispatch<any>;
  reservationDepositAmount: number;
  setReservationDepositAmount: Dispatch<number>;
  holdWithCredit: boolean;
  setHoldWithCredit: Dispatch<SetStateAction<boolean>>;
  creditInput: number;
  setCreditInput: Dispatch<SetStateAction<number>>;
  reservationCustomPriceList: any[];
  setReservationCustomPriceList: Dispatch<SetStateAction<ICustomPricing[]>>;
  individualPriceList: IndividualPricing[];
  setIndividualPriceList: Dispatch<SetStateAction<IndividualPricing[]>>;
  vehicleDeliveryInfo: VehicleDeliveryInfoState;
  setVehicleDeliveryInfo: Dispatch<SetStateAction<VehicleDeliveryInfoState>>;
  vehicleDropInfo: VehicleDropInfoState;
  setVehicleDropInfo: Dispatch<SetStateAction<VehicleDropInfoState>>;
  voucherDetails: VoucherDetailsType;
  setVoucherDetails: Dispatch<SetStateAction<VoucherDetailsType>>;
  validVoucher: boolean;
  setValidVoucher: Dispatch<SetStateAction<boolean>>;
  paymentMethod: TPaymentMethods;
  setPaymentMethod: Dispatch<SetStateAction<TPaymentMethods>>;
  //Vehicle Delivery
  isDeliverToInitialLocation: boolean;
  setIsDeliverToInitialLocation: Dispatch<SetStateAction<boolean>>;
  isReturnToInitialLocation: boolean;
  setIsReturnToInitialLocation: Dispatch<SetStateAction<boolean>>;
  deliveryCost: number;
  setDeliveryCost: Dispatch<SetStateAction<number>>;
  deliveryDistance: number;
  setDeliveryDistance: Dispatch<SetStateAction<number>>;
  deliveryDetails: TDeliveryDetails;
  setDeliveryDetails: Dispatch<SetStateAction<TDeliveryDetails>>;
  appliedVoucherInfo: TAppliedVoucherInfo | null;
  setAppliedVoucherInfo: Dispatch<SetStateAction<TAppliedVoucherInfo | null>>;
  appliedCreditInfo: TAppliedCreditInfo | null;
  setAppliedCreditInfo: Dispatch<SetStateAction<TAppliedCreditInfo | null>>;
};

type SearchProviderProps = {
  children: ReactNode;
};

export type TNextLongDiscount = {
  amount: number;
  text: string;
};

export type TDiscountedPrice = {
  calculatedAmount?: number;
  text?: string;
  duration?: number;
  durationUnit?: string;
  percentage?: number;
};

export type DiscountedPriceType = {
  longDiscount: TDiscountedPrice;
  nextLongDiscount: TNextLongDiscount;
  advanceDiscount: TDiscountedPrice;
};

export type ImageInfoType = {
  bytes?: number;
  format: string;
  originalHeight?: number;
  originalWidth?: number;
  public_id: string;
  secure_url: string;
};

export type HostDetailsType = {
  firstName: string;
  lastName: string;
  joiningDate?: Date;
  picture?: {
    imageInfo: ImageInfoType;
  };
  profileSummary?: {
    partner?: string;
    guest?: string;
  };
  hostTotalTrips: number;
  hostRatingCount: number;
  hostRatingTotal: number;
  username?: string;
};

export type TVerificationAlertMessage = {
  messageType?: 'error' | 'success';
  message?: string;
};

export type QueryEnableFlagsType = {
  enableVehicleDetails: boolean;
  enableSingleCarReservations: boolean;
};

export type TReservationInfo = {
  listingId: number;
  pickupTime: string | Date;
  returnTime: string | Date;
  totalPrice: number;
  serviceFeeAmount?: number;
  durationPrice: number;
  discounts?: {
    advanceBookingDiscounts: TDiscountedPrice;
    longBookingDiscounts: TDiscountedPrice;
  };
  incPrice?: TPeakIncreasePrice;
  reservationCustomPrice?: ICustomPricing[];
  dropOffLocation?: ReservationLocationState;
  deliveryDetails?: TDeliveryDetails;
  reservationDuration: string;
};

export type TGuestVerificationFlags = {
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isLicenseVerified: boolean;
  isProfilePhotoVerified: boolean;
  isLicenseFaceVerified: boolean;
  //Additional
  isLicensePhotoVerified: boolean;
  isSecondaryIDVerified: boolean;
  //Address
  isAddressVerified: boolean;
};

export type TVerificationStatusFlags = {
  isEmailApproved: boolean;
  isMobileApproved: boolean;
  isLicenseApproved: boolean;
  isProfilePhotoApproved: boolean;
  isLicenseFaceApproved: boolean;
  //Additional
  isLicensePhotoApproved: boolean;
  isSecondaryIDApproved: boolean;
  //Address
  isAddressApproved: boolean;
};

export type TPeakIncreasePrice = {
  calculatedAmount?: number;
  increaseType?: PeakIncreaseTypeEnum;
  increaseAmount?: number;
  increaseDays?: string[];
};

export const defaultSearchParams = {
  city: '',
  country: '',
  postcode: '',
  region: '',
  lat: '',
  long: '',
  pickup: '',
  return: '',
  address: '',
};

export const defaultDiscountValues = {
  longDiscount: {
    amount: 0,
    text: '',
  },
  nextLongDiscount: {
    amount: 0,
    text: '',
  },
  advanceDiscount: {
    amount: 0,
    text: '',
  },
};

export const defaultQueryEnableFlags = {
  enableVehicleDetails: false,
  enableSingleCarReservations: false,
};

export const DGuestVerificationFlags = {
  isEmailVerified: false,
  isMobileVerified: false,
  isLicenseVerified: false,
  isProfilePhotoVerified: false,
  isLicenseFaceVerified: false,
  //Additional
  isLicensePhotoVerified: false,
  isSecondaryIDVerified: false,
  //Address
  isAddressVerified: false,
};

export const DVerificationStatusFlags = {
  isEmailApproved: false,
  isMobileApproved: false,
  isLicenseApproved: false,
  isProfilePhotoApproved: false,
  isLicenseFaceApproved: false,
  //Additional
  isLicensePhotoApproved: false,
  isSecondaryIDApproved: false,
  //Address
  isAddressApproved: false,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedSearchedLocation, setSelectedSearchedLocation] = useState<IMapFormattedResult | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParamsType>(defaultSearchParams);
  const [searchedCarList, setSearchedCarList] = useState<TSearchedCar[]>([]);
  const [filteredCarList, setFilteredCarList] = useState<TSearchedCar[]>([]);
  const [availableCarList, setAvailableCarList] = useState<TSearchedCar[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersType[]>([]);
  const [locationOptions, setLocationOptions] = useState<IMapFormattedResult[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [durationPrice, setDurationPrice] = useState<number>(0);
  const [discountedPrice, setDiscountedPrice] = useState<DiscountedPriceType>(defaultDiscountValues);
  // const [peakIncPrice, setPeakIncPrice] = useState<number>(0);
  const [peakIncPrice, setPeakIncPrice] = useState<TPeakIncreasePrice>({});
  const [reservationPriceList, setReservationPriceList] = useState<ReservationPriceListType[]>([]);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [reservationDuration, setReservationDuration] = useState<string>('');
  const [availabilityErrorText, setAvailabilityErrorText] = useState<string>('');
  const [timeErrorText, setTimeErrorText] = useState<string>('');
  const [queryEnableFlags, setQueryEnableFlags] = useState<QueryEnableFlagsType>(defaultQueryEnableFlags);
  const [hostInfo, setHostInfo] = useState<HostDetailsType | null>(null);
  const [verificationAlertMessage, setVerificationAlertMessage] = useState<TVerificationAlertMessage>({});
  const [customMessage, setCustomMessage] = useState<string>('');
  const [reservationInfo, setReservationInfo] = useState<TReservationInfo | null>(null);
  const [guestVerificationFlags, setGuestVerificationFlags] = useState<TGuestVerificationFlags>(DGuestVerificationFlags);
  const [verificationStatusFlags, setVerificationStatusFlags] = useState<TVerificationStatusFlags>(DVerificationStatusFlags);
  const [singleCarBlockDates, setSingleCarBlockDates] = useState<TSingleCarBlockDate>({} as TSingleCarBlockDate);
  const [singleCarReservationList, setSingleCarReservationList] = useState<TVehicleReservation[]>([]);
  const [userSelectingDateList, setUserSelectingDateList] = useState<TDateInfo[]>([]);
  const [guestCoveragePackage, setGuestCoveragePackage] = useState<TGuestInsurance>({} as TGuestInsurance);
  const [guestCoverageType, setGuestCoverageType] = useState<string>('');
  const [additionalDrivers, setAdditionalDrivers] = useState<TSaveAdditionalDriverInfo[]>([]);
  const [gstData, setGstData] = useState<TGstData>({} as TGstData);
  const [additionalPaymentInfo, setAdditionalPaymentInfo] = useState<any>({});
  const [reservationDepositAmount, setReservationDepositAmount] = useState<number>(0);
  const [holdWithCredit, setHoldWithCredit] = useState<boolean>(false);
  const [creditInput, setCreditInput] = useState<number>(0);
  const [reservationCustomPriceList, setReservationCustomPriceList] = useState<ICustomPricing[]>([]);
  const [individualPriceList, setIndividualPriceList] = useState<IndividualPricing[]>([]);

  // For customized reservation location
  const [vehicleDeliveryInfo, setVehicleDeliveryInfo] = useState<VehicleDeliveryInfoState>({} as VehicleDeliveryInfoState);
  const [vehicleDropInfo, setVehicleDropInfo] = useState<VehicleDropInfoState>({} as VehicleDropInfoState);
  //Voucher
  const [appliedVoucherInfo, setAppliedVoucherInfo] = useState<TAppliedVoucherInfo | null>(null);
  const [voucherDetails, setVoucherDetails] = useState<VoucherDetailsType>({} as VoucherDetailsType);
  const [validVoucher, setValidVoucher] = useState<boolean>(false);
  //Credit
  const [appliedCreditInfo, setAppliedCreditInfo] = useState<TAppliedCreditInfo | null>(null);
  //Payment method
  const [paymentMethod, setPaymentMethod] = useState<TPaymentMethods>('onlyCard');
  //Vehicle Delivery
  const [isDeliverToInitialLocation, setIsDeliverToInitialLocation] = useState<boolean>(false);
  const [isReturnToInitialLocation, setIsReturnToInitialLocation] = useState<boolean>(true);
  const [deliveryCost, setDeliveryCost] = useState<number>(0);
  const [deliveryDistance, setDeliveryDistance] = useState<number>(0);
  const [deliveryDetails, setDeliveryDetails] = useState<TDeliveryDetails>({} as TDeliveryDetails);

  const removeAppliedFilter = (filterName: string) => {
    const updatedList = selectedFilters.filter((item) => item.name !== filterName);
    setSelectedFilters(updatedList);
  };

  // validates vehicle's availability
  const verifyConfirmReservationAvailability = async (
    pickupDateTime: string,
    returnDateTime: string,
    carAvailability: any,
    reservationList: any[]
  ): Promise<boolean> => {
    const { noticeInAdvance, minTripDuration, maxTripDuration, pickupReturnHour } = carAvailability;
    const pickupDate = dayjs(pickupDateTime);
    const returnDate = dayjs(returnDateTime);

    // Calculate the time difference between pickup & return in hours, days
    const timeDiffMins = returnDate.diff(pickupDate, 'minute');
    const timeDiffHours = returnDate.diff(pickupDate, 'hour');
    const timeDiffDays = returnDate.diff(pickupDate, 'day');
    const timeDiffWeek = returnDate.diff(pickupDate, 'week');

    // Find advance hours
    const advanceTimeDiffInMin = getAdvanceTimeDiffInMin(pickupDate);
    // Commenting the following as created the above function
    // const { formattedTimeDayObj: formattedCurrentDateTime } = getPickerTimeStringInUtc(currentDateTime);
    // const pickupDateUtc = dayjsUtc(pickupDate);
    // const advanceHourDiff = pickupDateUtc.diff(formattedCurrentDateTime, 'hour');

    // console.log({
    //   pickupDate,
    //   pickupDateUtc,
    //   formattedCurrentDateTime,
    //   currentDateTime,
    //   currentDateTimeUtc,
    //   returnDate,
    //   advanceHourDiff,
    // });

    const sameDay = isSameDay(pickupDate, returnDate);

    setQueryEnableFlags({ ...queryEnableFlags, enableSingleCarReservations: true });

    // Check reservation data if pickup return hour is available
    const filteredCancelReservations = reservationList?.filter(
      (reservation: any) =>
        reservation?.reservationStatus !== 'cancelledByGuest' &&
        reservation?.reservationStatus !== 'cancelledByHost' &&
        reservation?.reservationStatus !== 'cancelled'
    );
    if (reservationList?.length > 0 && filteredCancelReservations?.length > 0) {
      const isCarReserved = await validateReservations(filteredCancelReservations, pickupDateTime, returnDateTime);
      // console.log(isCarReserved);
      if (isCarReserved) {
        setAvailabilityErrorText('Reserved on selected time');
        return false;
      }
    }

    // Check custom block dates validity
    // console.log(singleCarBlockDates?.allDayList);
    if (singleCarBlockDates?.customList?.length > 0) {
      // console.log(singleCarBlockDates?.customList);
      const { isCarBlocked, overlappedDate } = await validateBlockDates(singleCarBlockDates?.customList, pickupDateTime, returnDateTime);
      // console.log(isCarBlocked);
      if (isCarBlocked) {
        setAvailabilityErrorText(
          `Unavailable on ${formatDateUtc(overlappedDate?.start)}, from ${formatTimeUtc(overlappedDate?.start)} to ${formatTimeUtc(
            overlappedDate?.end
          )}`
        );
        return false;
      }
    }

    if (
      noticeInAdvance?.alwaysAvailableImmediately &&
      minTripDuration?.noMinimum &&
      maxTripDuration?.noMaximum &&
      pickupReturnHour?.alwaysAvailable
    ) {
      return true;
    }

    if (!noticeInAdvance?.alwaysAvailableImmediately && getIsNoticePeriodRequired(noticeInAdvance?.hoursRequired, advanceTimeDiffInMin)) {
      // console.log(noticeInAdvance);
      const errorText = `${noticeInAdvance?.hoursRequired} hour${noticeInAdvance?.hoursRequired > 1 ? 's' : ''} notice period is required`;
      setAvailabilityErrorText(errorText);
      return false;
    }

    if (!minTripDuration?.noMinimum) {
      // console.log(minTripDuration);
      const isMinDurationValid = await verifyMinTravelDays(
        minTripDuration?.unit,
        minTripDuration?.shortestDuration,
        timeDiffHours,
        timeDiffDays,
        timeDiffMins
      );
      // console.log(isMinDurationValid);

      if (!isMinDurationValid) {
        const errorText = `Reservation needs to be for minimum ${minTripDuration?.shortestDuration} ${
          minTripDuration?.shortestDuration > 1 ? `${minTripDuration?.unit}` : `${minTripDuration?.unit.slice(0, -1)}`
        }`;
        setAvailabilityErrorText(errorText);
        return isMinDurationValid || false;
      }
    }

    // console.log(maxTripDuration);
    if (!maxTripDuration?.noMaximum) {
      const isMaxDurationValid = await verifyMaxTravelDays(maxTripDuration?.unit, maxTripDuration?.longestDuration, timeDiffMins);
      // console.log(isMaxDurationValid);

      if (!isMaxDurationValid) {
        const errorText = `Reservations must not exceed ${maxTripDuration?.longestDuration} ${
          maxTripDuration?.longestDuration > 1 ? `${maxTripDuration?.unit}` : `${maxTripDuration?.unit.slice(0, -1)}`
        }`;
        setAvailabilityErrorText(errorText);
        return isMaxDurationValid || false;
      }
    }

    if (!pickupReturnHour?.alwaysAvailable) {
      // console.log(pickupReturnHour?.customAvailability);
      const isCustomAvailabilityValid = await verifyCustomPickupReturn(
        pickupReturnHour?.customAvailability,
        pickupDateTime,
        returnDateTime,
        timeDiffHours,
        sameDay
      );
      if (isCustomAvailabilityValid?.isPickupValid && isCustomAvailabilityValid?.isReturnValid) {
        // console.log('custom');
        return true;
      }
      if (!isCustomAvailabilityValid?.isPickupValid) {
        setAvailabilityErrorText(`Pickup unavailable for selected time on ${isCustomAvailabilityValid?.pickupData?.dayName}`);
        return false;
      }
      if (!isCustomAvailabilityValid?.isReturnValid) {
        setAvailabilityErrorText(`Return unavailable for selected time on ${isCustomAvailabilityValid?.returnData?.dayName}`);
        return false;
      }
    }
    return true;
  };

  const contextValue: SearchContextType = {
    removeAppliedFilter,
    verifyConfirmReservationAvailability,
    searchValue,
    setSearchValue,
    searchParams,
    setSearchParams,
    searchedCarList,
    setSearchedCarList,
    filteredCarList,
    setFilteredCarList,
    selectedFilters,
    setSelectedFilters,
    selectedSearchedLocation,
    setSelectedSearchedLocation,
    locationOptions,
    setLocationOptions,
    totalPrice,
    setTotalPrice,
    reservationDuration,
    setReservationDuration,
    durationPrice,
    setDurationPrice,
    discountedPrice,
    setDiscountedPrice,
    peakIncPrice,
    setPeakIncPrice,
    reservationPriceList,
    setReservationPriceList,
    availabilityErrorText,
    setAvailabilityErrorText,
    serviceFee,
    setServiceFee,
    timeErrorText,
    setTimeErrorText,
    queryEnableFlags,
    setQueryEnableFlags,
    hostInfo,
    setHostInfo,
    verificationAlertMessage,
    setVerificationAlertMessage,
    customMessage,
    setCustomMessage,
    reservationInfo,
    setReservationInfo,
    guestVerificationFlags,
    setGuestVerificationFlags,
    verificationStatusFlags,
    setVerificationStatusFlags,
    availableCarList,
    setAvailableCarList,
    singleCarBlockDates,
    setSingleCarBlockDates,
    singleCarReservationList,
    setSingleCarReservationList,
    userSelectingDateList,
    setUserSelectingDateList,
    guestCoveragePackage,
    setGuestCoveragePackage,
    guestCoverageType,
    setGuestCoverageType,
    additionalDrivers,
    setAdditionalDrivers,
    gstData,
    setGstData,
    additionalPaymentInfo,
    setAdditionalPaymentInfo,
    reservationDepositAmount,
    setReservationDepositAmount,
    holdWithCredit,
    setHoldWithCredit,
    creditInput,
    setCreditInput,
    reservationCustomPriceList,
    setReservationCustomPriceList,
    individualPriceList,
    setIndividualPriceList,
    vehicleDeliveryInfo,
    setVehicleDeliveryInfo,
    vehicleDropInfo,
    setVehicleDropInfo,
    voucherDetails,
    setVoucherDetails,
    validVoucher,
    setValidVoucher,
    paymentMethod,
    setPaymentMethod,
    isDeliverToInitialLocation,
    setIsDeliverToInitialLocation,
    isReturnToInitialLocation,
    setIsReturnToInitialLocation,
    deliveryCost,
    setDeliveryCost,
    deliveryDistance,
    setDeliveryDistance,
    deliveryDetails,
    setDeliveryDetails,
    appliedVoucherInfo,
    setAppliedVoucherInfo,
    appliedCreditInfo,
    setAppliedCreditInfo,
  };

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};
