'use client';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { BsCalendar2Check } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FaCar } from 'react-icons/fa';
import { GiRoad } from 'react-icons/gi';
import { IoIosSettings } from 'react-icons/io';
import { LuCalendarDays } from 'react-icons/lu';
import { MdPayment, MdSecurity } from 'react-icons/md';
import { RiCoinsFill } from 'react-icons/ri';
import { MdOutlineMoneyOff } from 'react-icons/md';

//Updated
const EarningsUpdated = dynamic(() => import('@/components/UserProfileUpdated/Earnings/Earnings'));
const AccountSecurityUpdated = dynamic(() => import('@/components/UserProfileUpdated/Setting/AccountSecurity/AccountSecurity'));
const PaymentOptionUpdated = dynamic(() => import('@/components/UserProfileUpdated/Setting/PayoutOptions/PayoutOptions'));
const CurrentReservationsUpdated = dynamic(() => import('@/components/UserProfileUpdated/Reservations/CurrentReservations'));
const PastReservationsUpdated = dynamic(() => import('@/components/UserProfileUpdated/Reservations/PastReservations'));
const UpcomingReservationsUpdated = dynamic(() => import('@/components/UserProfileUpdated/Reservations/UpcomingReservations'));
const CurrentTravelsUpdated = dynamic(() => import('@/components/UserProfileUpdated/Travels/CurrentTravels'));
const PastTravelsUpdated = dynamic(() => import('@/components/UserProfileUpdated/Travels/PastTravels'));
const UpcomingTravelsUpdated = dynamic(() => import('@/components/UserProfileUpdated/Travels/UpcomingTravels'));
const OutstandingDues = dynamic(() => import('@/features/profile/outstanding-dues/components/OutstandingDues'));

export interface TabMultipleComponents {
  reservationCompo?: ReactNode;
  travelCompo?: ReactNode;
}

export interface TabListType {
  id: string;
  label: string | ReactNode;
  component?: ReactNode | TabMultipleComponents;
  routeName: string;
  subTabList?: TabListType[];
}

export const editVehicleTabList: TabListType[] = [
  {
    id: '1',
    label: 'Vehicle Information',
    routeName: 'vehicle-info',
  },
  {
    id: '2',
    label: 'Location',
    routeName: 'vehicle-location',
  },
  {
    id: '3',
    label: 'Availability',
    routeName: 'availability',
  },
  {
    id: '4',
    label: 'Rates',
    routeName: 'rates',
  },
  {
    id: '5',
    label: 'Guidelines',
    routeName: 'guidelines',
  },
  {
    id: '6',
    label: 'Photos',
    routeName: 'photos',
  },
  {
    id: '7',
    label: 'Distance',
    routeName: 'distance',
  },
  {
    id: '8',
    label: 'Partnership Policy',
    routeName: 'insurance-policy',
  },
  {
    id: '9',
    label: 'Calendar',
    routeName: 'calendar',
  },
  {
    id: '10',
    label: 'Key Handover',
    routeName: 'key-handover',
  },
  {
    id: '11',
    label: 'Status',
    routeName: 'vehicle-status',
  },
];

export const userReservationsTabList: TabListType[] = [
  {
    id: '1',
    label: 'Current',
    routeName: 'current',
    component: {
      reservationCompo: <CurrentReservationsUpdated />,
      travelCompo: <CurrentTravelsUpdated />,
    },
  },
  {
    id: '2',
    label: 'Upcoming',
    routeName: 'upcoming',
    component: {
      reservationCompo: <UpcomingReservationsUpdated />,
      travelCompo: <UpcomingTravelsUpdated />,
    },
  },
  {
    id: '3',
    label: 'Past',
    routeName: 'past',
    component: {
      reservationCompo: <PastReservationsUpdated />,
      travelCompo: <PastTravelsUpdated />,
    },
  },
];
//Updated Profile Layout Lists
export const userReservationsNewTabList: TabListType[] = [
  {
    id: '1',
    label: 'Current',
    routeName: 'current',
    component: <CurrentReservationsUpdated />,
  },
  {
    id: '2',
    label: 'Upcoming',
    routeName: 'upcoming',
    component: <UpcomingReservationsUpdated />,
  },
  {
    id: '3',
    label: 'Past',
    routeName: 'past',
    component: <PastReservationsUpdated />,
  },
];
export const userTravelsNewTabList: TabListType[] = [
  {
    id: '1',
    label: 'Current',
    routeName: 'current',
    component: <CurrentTravelsUpdated />,
  },
  {
    id: '2',
    label: 'Upcoming',
    routeName: 'upcoming',
    component: <UpcomingTravelsUpdated />,
  },
  {
    id: '3',
    label: 'Past',
    routeName: 'past',
    component: <PastTravelsUpdated />,
  },
];

export const userSettingTabList: TabListType[] = [
  {
    id: '1',
    label: 'Account Security',
    routeName: 'account-security',
    component: <AccountSecurityUpdated />,
  },
  {
    id: '2',
    label: 'Payout Options',
    routeName: 'payment-option',
    component: <PaymentOptionUpdated />,
  },
];

export const userProfileGuestNewTabList: TabListType[] = [
  {
    id: '1',
    label: 'Profile Info',
    routeName: 'profile-info',
  },
  {
    id: '2',
    label: 'Travels',
    routeName: 'travels/current',
  },
  {
    id: '3',
    label: 'Transactions',
    component: <EarningsUpdated />,
    routeName: 'transactions',
  },
  {
    id: '4',
    label: 'Outstanding Dues',
    component: <OutstandingDues />,
    routeName: 'outstanding-dues',
  },
  {
    id: '5',
    label: 'Settings',
    routeName: 'setting',
    subTabList: userSettingTabList,
  },
];

export const userProfileNewTabList: TabListType[] = [
  {
    id: '1',
    label: 'Profile Info',
    routeName: 'profile-info',
  },
  {
    id: '2',
    label: 'Vehicles',
    routeName: 'vehicles',
  },
  {
    id: '3',
    label: 'Reservations',
    routeName: 'reservations/current',
    // subTabList: userReservationsNewTabList,
  },
  {
    id: '4',
    label: 'Travels',
    routeName: 'travels/current',
    // subTabList: userTravelsNewTabList,
  },
  {
    id: '5',
    label: 'Calendar',
    routeName: 'calendar',
  },
  {
    id: '6',
    label: 'Transactions',
    component: <EarningsUpdated />,
    routeName: 'transactions',
  },
  {
    id: '7',
    label: 'Outstanding Dues',
    component: <OutstandingDues />,
    routeName: 'outstanding-dues',
  },
  {
    id: '8',
    label: 'Settings',
    routeName: 'setting',
    subTabList: userSettingTabList,
  },
];

export const iconArrayForProfileTabList: IconType[] = [CgProfile, FaCar, BsCalendar2Check, GiRoad, LuCalendarDays, RiCoinsFill, MdOutlineMoneyOff, IoIosSettings];

export const subArrayForProfileTabList: IconType[] = [MdSecurity, MdPayment];
