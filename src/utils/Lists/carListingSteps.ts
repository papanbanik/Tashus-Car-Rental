import { IconType } from 'react-icons';
import { AiOutlineUnorderedList, AiOutlineSchedule } from 'react-icons/ai';
import { MdOutlineSettingsSuggest, MdOutlineAddLocationAlt, MdOutlineAddPhotoAlternate, MdOutlinePolicy } from 'react-icons/md';
import { RiMoneyDollarCircleLine, RiContactsLine } from 'react-icons/ri';

export interface ListingStep {
  id: number;
  name: string;
  urlString: string;
  isCompleted: boolean;
  isCurrent: boolean;
  icon?: IconType;
}

export const getCarListingSteps = () => {
  const carListingSteps: ListingStep[] = [
    {
      id: 1,
      name: 'Information',
      urlString: 'car-listing',
      isCompleted: false,
      isCurrent: true,
    },
    {
      id: 2,
      name: 'Location',
      urlString: 'car-location',
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: 3,
      name: 'Availability',
      urlString: 'availability',
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: 4,
      name: 'Rates',
      isCompleted: false,
      urlString: 'pricing',
      isCurrent: false,
    },
    {
      id: 5,
      name: 'Guidelines',
      urlString: 'guidelines',
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: 6,
      name: 'Photos',
      urlString: 'photos',
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: 7,
      name: 'Distance',
      urlString: 'distance',
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: 8,
      name: 'Policy',
      // name: 'Insurance Policy',
      urlString: 'insurance-policy',
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: 9,
      name: 'View&Post',
      urlString: 'view-post',
      isCompleted: false,
      isCurrent: false,
    },
  ];
  return carListingSteps;
};
