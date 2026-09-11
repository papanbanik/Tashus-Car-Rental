import { IMapFormattedResult } from '@/types/mapLocations';

type InitialAddress = IMapFormattedResult & {
  locality?: string;
  stateShortCode: string;
  countryShortCode: string;
};

export const getInitialLocation = (): InitialAddress[] => {
  return [
    {
      country: 'Australia',
      region: 'New South Wales',
      // place: 'Blacktown',
      place: 'Sydney',
      // locality: 'Sydney Central Business District',
      address: 'Macquarie St',
      postcode: '2000',
      complete_address: 'Sydney, New South Wales, Australia',
      // complete_address: 'State Library of New South Wales, Macquarie St, Sydney, New South Wales 2000, Australia',
      coordinates: [-33.866275, 151.21310699999998],
      // coordinates: [151.21310699999998, -33.866275],
      stateShortCode: 'AU-NSW',
      countryShortCode: 'au',
    },
    // {
    //   country: 'manual',
    //   region: '',
    //   place: '',
    //   locality: '',
    //   address: '',
    //   postcode: '',
    //   complete_address: 'Enter Address Details Yourself',
    //   coordinates: [],
    // },
  ];
};
