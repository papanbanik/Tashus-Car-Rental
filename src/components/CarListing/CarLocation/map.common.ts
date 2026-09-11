import { IMapFormattedResult, IMapLocation } from '@/types/mapLocations';
import { covertMetToKm } from '@/utils/Functions/randomCommonFn';
import { streetTypeTable } from '@/utils/Functions/verification/verificationFn';
import { Dispatch, SetStateAction } from 'react';

type SetSelectedResult = Dispatch<SetStateAction<IMapFormattedResult | undefined>>;

const accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_V1}`;

// Formats mapbox API location
export const transformGeocodingResult = (result: IMapLocation[]): IMapFormattedResult[] => {
  // export const transformGeocodingResult = async (result: IMapLocation[]): Promise<IMapFormattedResult[]> => {
  const formattedLocationResults = result.map((feature) => {
    const {
      context = [],
      geometry: { coordinates = [] } = {},
      place_name: complete_address,
      place_type = [],
      properties: { address = '', short_code: propertyShortCode = '', category = '' } = {},
      text,
    } = feature || {};

    const placeType = place_type[0] || '';

    const formattedContext =
      context?.reduce((acc: Record<string, { text: string; short_code: string }>, item: any) => {
        const type = item?.id.split('.')[0]; // Extract the context type (e.g., country, region, locality, etc.)
        acc[type] = {
          text: item?.text,
          short_code: item?.short_code || '', // Not all context items may have a short_code
        };
        return acc;
      }, {}) || {};

    // console.log(formattedContext);

    const addFormattedContext = (type: string, defaultShortCode = '') => {
      if (!formattedContext[type] && placeType === type) {
        formattedContext[type] = {
          text: text || '',
          short_code: defaultShortCode,
        };
      }
    };

    addFormattedContext('place');
    addFormattedContext('region', propertyShortCode);
    addFormattedContext('country', propertyShortCode);
    addFormattedContext('postcode');

    // console.log(formattedContext);
    //street type initialize
    let streetType = '';

    if (placeType === 'address' || placeType === 'street') {
      streetType = 'Street';
    } else if (placeType === 'poi') {
      const categoriesArray = category.split(',').map((cat) => cat.trim());
      for (const cat of categoriesArray) {
        if (streetTypeTable[cat]) {
          streetType = cat;
          break;
        }
      }
    }

    // Validate the extracted street type against the lookup table
    const validStreetType = streetTypeTable[streetType] || streetType;

    return {
      ...formattedContext,
      coordinates,
      complete_address,
      address,
      streetType: validStreetType,
    };
  });

  return formattedLocationResults;
};

const getLocationById = (id: any, data: any[]) => {
  return data?.find((item) => item.id.startsWith(id));
};

export async function fetchForwardGeocoding(searchText: string): Promise<IMapLocation[]> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    searchText
  )}.json?country=au&limit=8&language=en&autocomplete=true&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      return data.features;
    } else {
      throw new Error(data.message || 'Failed to fetch geocoding results');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
export async function fetchReverseGeocoding(lat: number, lng: number): Promise<IMapLocation[]> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?country=au&limit=1&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      return data.features;
    } else {
      throw new Error(data.message || 'Failed to fetch geocoding results');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const fnSetInitialLocation = ({ setSelectedResult }: { setSelectedResult: SetSelectedResult }): void => {
  setSelectedResult({
    country: {
      text: 'Australia',
      short_code: 'au',
    },
    region: {
      text: 'New South Wales',
      short_code: 'AU-NSW',
    },
    place: {
      text: '',
    },
    city: {
      text: '',
    },
    address: '',
    postcode: {
      text: '',
    },
    complete_address: 'New South Wales, Australia',
    coordinates: [151.2099, -33.8688],
  });
};

// Returns driving distance between two coordinates
export const getDrivingDistance = async (start: string, end: string): Promise<number | string> => {
  const startCoordinates = encodeURIComponent(start); //'long, lat'
  const endCoordinates = encodeURIComponent(end); //'long, lat'

  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates};${endCoordinates}?access_token=${accessToken}`
  );

  if (!response.ok) {
    return 'Could not fetch driving distance';
    // throw new Error('Could not fetch driving distance');
  }

  const data = await response.json();
  const distance = data.routes[0].distance; // distance in meters
  const kmDistance = covertMetToKm(distance);
  return kmDistance;
};

//other countries
export const fetchAllCountryGeocoding = async (searchText: string, countryCode?: string): Promise<IMapLocation[]> => {
  const baseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json`;
  const queryParams = new URLSearchParams({
    ...(countryCode && { country: countryCode }), // Conditionally add 'country' param
    limit: '8',
    autocomplete: 'true',
    access_token: accessToken,
  });

  const url = `${baseUrl}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch geocoding results');
    }

    return data.features;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
