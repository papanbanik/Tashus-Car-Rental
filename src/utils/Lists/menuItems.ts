import { IconType } from 'react-icons';
import { AiOutlineUnorderedList, AiOutlineSchedule } from 'react-icons/ai';

export interface MenuItemType {
  id: number;
  name: string;
  redirectUrl: string;
  icon?: IconType;
  fn?: (param: any) => void | undefined;
}

export const publicMenuItemList: MenuItemType[] = [
  {
    id: 1,
    name: 'Login',
    redirectUrl: 'car-listing',
    // fn: (param: any) => handleSignUpMenu('guest')
  },
  {
    id: 2,
    name: 'Be a Guest',
    redirectUrl: 'car-listing',
    // fn: (param: any) => handleSignUpMenu('guest')
  },
];

export const protectedMenuItemList: MenuItemType[] = [
  {
    id: 1,
    name: 'Car Information',
    redirectUrl: 'car-listing',
  },
  {
    id: 2,
    name: 'Car Features',
    redirectUrl: 'car-listing',
  },
  {
    id: 3,
    name: 'Pick up & drop off location',
    redirectUrl: 'car-location',
  },
  {
    id: 4,
    name: 'Car Availability',
    redirectUrl: 'availability',
  },
  {
    id: 5,
    name: 'Pricing',
    redirectUrl: 'pricing',
  },
  {
    id: 6,
    name: 'Car Photos',
    redirectUrl: 'photos',
  },
  {
    id: 7,
    name: 'Owner Contact Information',
    redirectUrl: 'host-details',
  },
  {
    id: 8,
    name: 'Partnership Policy',
    // name: 'Insurance Policy',
    redirectUrl: 'insurance-policy',
  },
];
