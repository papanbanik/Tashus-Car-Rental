import { TSearchedCar } from '@/types/car-search/carSearchType';

export interface PriceDataPoint {
  price: number;
  count: number;
  endPrice: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface PriceRangeFilterProps {
  initialRange: PriceRange;
  onChange: (range: PriceRange) => void;
  availableCarList: TSearchedCar[];
}
