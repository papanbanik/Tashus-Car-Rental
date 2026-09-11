export interface IMapLocation {
  place_name: string;
  place_type?: string;
  text?: string;
  context: {
    id: string;
    text: string;
    short_code: string;
  }[];
  geometry: {
    coordinates: number[];
  };
  properties: {
    address?: string;
    short_code?: string;
    category?: string; //to fetch street type
  };
}

export interface IMapFormattedResult {
  id?: number;
  country?: any;
  region?: any;
  place?: any;
  city?: any; // locality
  streetType?: string; // street type
  address?: string;
  postcode?: any; //postcode
  complete_address?: string;
  coordinates?: number[]; // longitude, latitude
  parkingInstructions?: string; // longitude, latitude
}
