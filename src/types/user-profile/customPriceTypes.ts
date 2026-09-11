import { Dispatch, ReactNode, SetStateAction } from 'react';
import { TDate, TGeneratedDateList } from '../commonTypes';
import { HookFormComponentProps } from '../componentTypes';
import { TBillingDetails, TDateInfo, TUpdatedTravelData } from '../travels/typeEditTravels';

export interface VehicleDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  selectedDate: Date | null;
  groupData: any;
}

export interface ResourceCardProps {
  car: {
    make: string;
    model: string;
  };
  coverPhoto: string;
  carNickName: string;
  listingId: string;
  setIsChecked: (isChecked: boolean) => void;
  isChecked: boolean;
}

//Item Customization
export interface ItemRendererProps {
  item: any;
  getItemProps: (props: any) => any;
  handleItemClick: (itemId: string) => void;
}
export type CustomPricingValues = {
  customPricing: {
    fromDate: Date | null;
    toDate: Date | null;
    hostId: string;
    listingIds: number[];
    hourlyRates?: number;
    dailyRates?: number;
    // rateType: 'F' | 'P'; // 'F' for FIXED, 'P' for PERCENTAGE
    // rateChange: 'I' | 'D'; // 'I' for INCREASE, 'D' for DECREASE
  };
};

export interface VehicleCustomPriceProps extends HookFormComponentProps {
  selectedDate: Date | null;
  setIsDrawerOpen?: Dispatch<SetStateAction<boolean>>;
}
export interface OptionType {
  id: number;
  label: ReactNode;
  value: string;
}

export interface HourlyRates {
  currency: string;
  amount: number;
}

export interface DailyRates {
  currency: string;
  amount: number;
}

export interface PeakIncrease {
  dayOfWeek: string;
  increaseType: string;
  amount: number;
}

export interface LongBookingDiscounts {
  value: number;
  unit: string;
  percentage: number;
}

export interface AdvanceBookingDiscounts {
  value: number;
  unit: string;
  percentage: number;
}

export interface CustomPricing {
  date: TDate;
  dailyRates: number;
  hourlyRates: number;
  // rateType: string;
  // rateChange: string;
  updatedHourlyRates: number;
  updatedDailyRates: number;
}
export interface ICustomPricing {
  date: TDate;
  dailyRates: number;
  hourlyRates: number;
  // rateType: string;
  // rateChange: string;
  updatedHourlyRates: number;
  updatedDailyRates: number;
}

export interface IndividualPricing {
  date: TDate;
  price: number;
}

export interface Rates {
  hourlyRates: HourlyRates;
  dailyRates: DailyRates;
  peakIncrease?: PeakIncrease[];
  longBookingDiscounts?: LongBookingDiscounts[];
  advanceBookingDiscounts?: AdvanceBookingDiscounts[];
  updatedAt: string;
  customPricing: CustomPricing[];
}

export interface ListingData {
  hostId: string;
  rates: Rates;
  listingId: number;
}

export interface CalenderFilterProps {
  displayDate: Date;
  handleDateChange: (date: Date | null) => void;
  handleCurrentDateClick: () => void;
  uniqueLabels: string[];
  filteredStatusFilters: any[];
  allBlockedDates: any[];
}

export interface SidebarContentProps {
  groupData: any;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  handleSelectAll: () => void;
  isCheckedMap: { [listingId: string]: boolean };
  listingSelect: string | null;
  setListingSelect: Dispatch<SetStateAction<string | null>>;
}

export interface ReservationPriceListType {
  date: TDate;
  dailyPrice: number;
  hourlyPrice: number;
  rateDailyChange: string;
  rateHourlyChange: string;
  dailyDiff: number;
  hourlyDiff: number;
}
export interface TPeakIncreasedDates {
  reservationDate: TDate;
  dailyPrice: number;
  hourlyPrice: number;
}

export interface IExtendBilling {
  billingDetails: TBillingDetails;
}

export interface PeakIncreaseType {
  dayOfWeek: string;
  increaseType: string;
  percentage?: number;
  amount?: number;
}

export type TParamsGetUpcomingDurationPrice = {
  pickupTime: TDate;
  returnTime: TDate;
  currentPickupTime: TDate;
  currentReturnTime: TDate;
  storedDailyPrice: number;
  storedHourlyPrice: number;
  storedCustomPricing: CustomPricing[];
  currentDailyPrice: number;
  currentHourlyPrice: number;
  currentCustomPricing: CustomPricing[];
  peakIncrease: PeakIncreaseType[];
  generatedDates?: TGeneratedDateList[];
  matchedDates?: TGeneratedDateList[];
  previousPeakIncrease?: PeakIncreaseType[];
  peakIncreasedDates?: TPeakIncreasedDates[];
};

export type TParamsGetRefundOrPenalty = TParamsGetUpcomingDurationPrice & {
  dateList?: TDateInfo[];
  updatedBillingDetails: any;
  oldDurationHours: number;
  newDurationHours: number;
  paidPrice: number;
  newDurationPrice: number;
};

export interface PriceInfoItem {
  id: string;
  group: string;
  title: string;
  type: string;
  start_time: Date;
  end_time: Date;
  dailyPrice: number;
  hourlyPrice: number;
  rateDailyChange: string;
  rateHourlyChange: string;
  dailyDiff: number;
  hourlyDiff: number;
}

export interface PriceDisplayProps {
  rates: {
    dailyPrice: number;
    hourlyPrice: number;
    // rateChange: string;
    rateDailyChange: string;
    rateHourlyChange: string;
    dailyDiff: number;
    hourlyDiff: number;
  };
}

export interface PreviousBillingProps extends IExtendBilling {
  previousReservationAmount: number;
  updatedTravelData: TUpdatedTravelData;
  travelDetails: any;
  paidAmount: number;
}

export interface UpdatedBillingProps extends IExtendBilling {
  coveragePercentage: number;
}

export type TTravelInfo = {
  pickupDate: Date | string;
  returnDate: Date | string;
  reservationId: number;
  totalPrice: number;
  hostRentalFees: number;
  paymentStatus: string;
  reservationStatus: string;
  coverPhoto: string;
  vehicleModel: string;
  pickupLocation: string;
  maximumDailyDistance?: number;
  hourlyPrice: number;
  dailyPrice: number;
  isPaymentExpired: boolean;
  carNickName: string;
  guestId?: string;
  carListingId: number;
  // isEndedByGuest?: boolean;
  // isEndedByPartner?: boolean;
};
