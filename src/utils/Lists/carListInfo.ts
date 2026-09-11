import { IconType } from 'react-icons';
import { BsCamera, BsCloudSun, BsUsbSymbol } from 'react-icons/bs';
import { MdNavigation } from 'react-icons/md';
import { RiSoundModuleFill } from 'react-icons/ri';
import { TbAirConditioning, TbBluetooth, TbKeyOff } from 'react-icons/tb';

export interface OptionType {
  id: number;
  label: string;
  value?: string;
  icon?: IconType;
}

export interface CarColorsType extends OptionType {
  colorClass: string;
}

export interface CarFeatureType extends OptionType {
  iName?: string;
}

export const transmissionList: OptionType[] = [
  { id: 1, label: 'Automatic', value: 'Automatic' },
  { id: 2, label: 'Manual', value: 'Manual' },
  // { id: 3, label: 'Continuously Variable Transmission (CVT)', value: 'Continuously Variable Transmission (CVT)' },
  // { id: 4, label: 'Dual Clutch Transmission (DCT)', value: 'Dual Clutch Transmission (DCT)' },
  // { id: 5, label: 'Semi-Automatic', value: 'Semi-Automatic' },
  // { id: 6, label: 'Tiptronic', value: 'Tiptronic' },
  // { id: 7, label: 'Direct-Shift Gearbox (DSG)', value: 'Direct-Shift Gearbox (DSG)' },
];

export const transmissionList2: OptionType[] = [
  { id: 1, label: 'Automatic', value: 'Automatic' },
  { id: 2, label: 'Manual', value: 'Manual' },
];

// export const fuelListOld: OptionType[] = [
//   { id: 1, label: 'Gasoline', value: 'Gasoline' },
//   { id: 2, label: 'Diesel', value: 'Diesel' },
//   { id: 3, label: 'Electric', value: 'Electric' },
//   { id: 4, label: 'Hybrid (Gasoline/Electric)', value: 'Hybrid (Gasoline/Electric)' },
//   {
//     id: 5,
//     label: 'Plug-in Hybrid (Gasoline/Electric with Charging Capability)',
//     value: 'Plug-in Hybrid (Gasoline/Electric with Charging Capability)',
//   },
//   { id: 6, label: 'Natural Gas', value: 'Natural Gas' },
//   { id: 7, label: 'Hydrogen', value: 'Hydrogen' },
// ];

export const fuelList: OptionType[] = [
  { id: 1, label: 'Regular Unleaded (91 or E10)', value: 'Regular Unleaded (91 or E10)' },
  { id: 2, label: 'Premium Unleaded 95', value: 'Premium Unleaded 95' },
  { id: 3, label: 'Super Premium / Ultimate 98 / Ultimate+', value: 'Super Premium / Ultimate 98 / Ultimate+' },
  { id: 4, label: 'Diesel', value: 'Diesel' },
  { id: 5, label: 'LPG', value: 'LPG' },
  { id: 6, label: 'Electric', value: 'Electric' },
  { id: 7, label: 'Other', value: 'Other' },
];

export const carTypeList: OptionType[] = [
  { id: 1, label: 'SUV', value: 'SUV' },
  { id: 2, label: 'Sedan', value: 'Sedan' },
  { id: 3, label: 'Coupe', value: 'Coupe' },
  { id: 4, label: 'Convertible', value: 'Convertible' },
  { id: 5, label: 'Hatchback', value: 'Hatchback' },
  { id: 6, label: 'Pickup', value: 'Pickup' },
  { id: 7, label: 'Van', value: 'Van' },
  { id: 8, label: 'Minivan', value: 'Minivan' },
  { id: 9, label: 'Wagon', value: 'Wagon' },
];

export const stateList: OptionType[] = [
  { id: 1, label: 'New South Wales', value: 'NSW' },
  { id: 2, label: 'Victoria', value: 'VIC' },
  { id: 3, label: 'Queensland', value: 'QLD' },
  { id: 4, label: 'Western Australia', value: 'WA' },
  { id: 5, label: 'South Australia', value: 'SA' },
  { id: 6, label: 'Tasmania', value: 'TAS' },
  { id: 7, label: 'Australian Capital Territory', value: 'ACT' },
  { id: 8, label: 'Northern Territory', value: 'NT' },
];

export const carColorList: CarColorsType[] = [
  { id: 1, label: 'White', value: 'white', colorClass: 'white' },
  { id: 2, label: 'Black', value: 'black', colorClass: 'black' },
  { id: 3, label: 'Red', value: 'red', colorClass: 'error' },
  { id: 4, label: 'Green', value: 'green', colorClass: 'hi' },
  { id: 5, label: 'Lime', value: 'lime', colorClass: 'lime' },
  { id: 6, label: 'Blue', value: 'blue', colorClass: 'blue' },
  { id: 7, label: 'Silver', value: 'silver', colorClass: 'blue' },
  { id: 8, label: 'Gray', value: 'gray', colorClass: 'blue' },
  { id: 9, label: 'Others', value: 'others', colorClass: 'blue' },
];

export const featureList: CarFeatureType[] = [
  { id: 1, label: 'Air conditioning', iName: 'airCon', icon: TbAirConditioning },
  { id: 2, label: 'Power windows', iName: 'powWindow', icon: TbAirConditioning },
  { id: 3, label: 'Power locks', iName: 'powLock', icon: TbAirConditioning },
  { id: 4, label: 'Keyless entry', iName: 'keyless', icon: TbKeyOff },
  { id: 5, label: 'Cruise control', iName: 'cruiseCtrl', icon: TbAirConditioning },
  { id: 6, label: 'Navigation system', iName: 'nav', icon: MdNavigation },
  { id: 7, label: 'Bluetooth connectivity', iName: 'bt', icon: TbBluetooth },
  { id: 8, label: 'USB ports', iName: 'usb', icon: BsUsbSymbol },
  { id: 9, label: 'Sunroof', iName: 'sunroof', icon: BsCloudSun },
  { id: 10, label: 'Heated seats', iName: 'heatedSeat', icon: TbAirConditioning },
  { id: 11, label: 'Backup camera', iName: 'backCam', icon: BsCamera },
  { id: 12, label: 'Parking sensors', iName: 'parkSens', icon: TbAirConditioning },
  { id: 13, label: 'Alloy wheels', iName: 'alloyWheel', icon: TbAirConditioning },
  { id: 14, label: 'Roof rack', iName: 'roofRack', icon: TbAirConditioning },
  { id: 15, label: 'Towing package', iName: 'towPack', icon: TbAirConditioning },
  { id: 16, label: 'Audio system details', iName: 'audio', icon: RiSoundModuleFill },
];

// Availability lists
export const carWeekAvailability: OptionType[] = [
  { id: 1, label: 'Saturday', value: 'sat' },
  { id: 2, label: 'Sunday', value: 'sun' },
  { id: 3, label: 'Monday', value: 'mon' },
  { id: 4, label: 'Tuesday', value: 'tue' },
  { id: 5, label: 'Wednesday', value: 'wed' },
  { id: 6, label: 'Thursday', value: 'thu' },
  { id: 7, label: 'Friday', value: 'fri' },
];

export const tempCustomAvailability = carWeekAvailability.map((day) => ({
  checked: false,
  dayOfWeek: day.value,
  allDay: false,
  availability: '',
  customHours: [
    {
      startTime: '',
      endTime: '',
      status: '',
    },
  ],
}));

export interface NumberOptionType extends Omit<OptionType, 'value'> {
  value: number;
}

export const noticeHourList: NumberOptionType[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  label: `${index + 1}`,
  value: index + 1,
}));

export const minTripDuration: OptionType[] = [
  { id: 1, label: 'Hours', value: 'hours' },
  { id: 2, label: 'Days', value: 'days' },
  { id: 3, label: 'Weeks', value: 'weeks' },
];

export const minTripHours: NumberOptionType[] = [
  { id: 1, label: '3', value: 3 },
  { id: 2, label: '6', value: 6 },
  { id: 3, label: '9', value: 9 },
  { id: 4, label: '12', value: 12 },
];

export const minTripDays: NumberOptionType[] = [
  { id: 1, label: '1', value: 1 },
  { id: 2, label: '2', value: 2 },
  { id: 3, label: '3', value: 3 },
  { id: 4, label: '5', value: 5 },
];

export const minTripWeeks: NumberOptionType[] = [{ id: 1, label: '1', value: 1 }];

export const maxTripDuration: OptionType[] = [
  { id: 1, label: 'Days', value: 'days' },
  { id: 2, label: 'Weeks', value: 'weeks' },
];

export const maxTripDays: NumberOptionType[] = [
  { id: 1, label: '3', value: 3 },
  { id: 2, label: '5', value: 5 },
  { id: 3, label: '10', value: 10 },
];

export const maxTripWeeks: NumberOptionType[] = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  label: `${index + 1}`,
  value: index + 1,
}));

// Rates Lists
export const peakIncreaseDays = carWeekAvailability.map((day) => ({
  ...day,
  label: day.value?.toUpperCase(),
}));

export const peakIncreaseTypes: OptionType[] = [
  { id: 1, label: '$', value: 'amount' },
  { id: 2, label: '%', value: 'percentage' },
];

// Distance Lists
export const maxDistanceKM: NumberOptionType[] = Array.from({ length: 7 }, (_, index) => ({
  id: index + 1,
  label: `${(index + 1) * 100}`,
  value: (index + 1) * 100,
}));

// Seat Filter
export const seatFilterList: NumberOptionType[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  label: `${index + 1}`,
  value: index + 1,
}));

//Key Handover List
export const keyHandoverList: OptionType[] = [
  { id: 1, label: 'Self check-in via lockbox', value: 'selfCheck' },
  { id: 2, label: 'Key handover by agent', value: 'viaAgent' },
];
