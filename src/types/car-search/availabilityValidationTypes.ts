import { TCommonDateRange } from '../commonTypes';

export type TCarBlockDate = {
  start: Date;
  end: Date;
  title: string;
  _id: string;
  createdAt: Date;
};

export type TSingleCarBlockDate = {
  allDayList: TCarBlockDate[];
  customList: TCarBlockDate[];
};

export type TVehicleCalendarData = {
  start: Date;
  end: Date;
  title: string;
  allDay?: boolean;
};

export type TCalendarIndicatorList = {
  status: 'reserved' | 'unavailable' | 'user' | 'blocked' | 'today';
  color: string;
  active: boolean;
  label: string;
};

export interface ISearchLocation {
  pickupAddress: {
    coordinates: [number, number];
    city: string;
    street: string;
  };
  car: {
    licensePlate: {
      number: string;
      state: string;
    };
    make: string;
    model: string;
    year: string;
  };
  rates: {
    hourlyRates: {
      currency: string;
      amount: number;
    };
    dailyRates: {
      currency: string;
      amount: number;
    };
  };
  photos: {
    coverPhotoUrl: string;
  };
}

export interface ISearchMapProps {
  filteredCarList?: ISearchLocation[];
}
