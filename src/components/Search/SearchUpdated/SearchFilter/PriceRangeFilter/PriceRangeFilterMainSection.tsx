'use client';

import { useSearchContext } from '@/context/SearchProvider';
import { TSearchedCar, TSearchPriceMode } from '@/types/car-search/carSearchType';
import React, { useEffect, useState } from 'react';
import { PriceRangeFilter } from './PriceRangeFilter';
import { PriceRangeFilterHour } from './PriceRangeFilterHour';

interface Car {
  rates?: {
    dailyRates?: {
      amount: number;
    };
    hourlyRates?: {
      amount: number;
    };
  };
}
interface PriceRangeFilterMainSectionProps {
  availableCarList: TSearchedCar[];
  priceMode: TSearchPriceMode;
}
const PriceRangeFilterMainSection: React.FC<PriceRangeFilterMainSectionProps> = ({ availableCarList, priceMode }) => {
  const { filteredCarList } = useSearchContext();
  // console.log('availableCarListNew', availableCarList);
  // console.log(priceMode, 'is clicked');

  const [initialRange, setInitialRange] = useState<{ min: number; max: number } | null>(null);

  useEffect(() => {
    if (availableCarList && availableCarList.length > 0) {
      const rates = availableCarList.map((car: Car) =>
        priceMode === 'Hour' ? car.rates?.hourlyRates?.amount || 0 : car.rates?.dailyRates?.amount || 0
      );
      const min = 0;
      const max = Math.max(...rates);
      setInitialRange({ min, max });
    } else {
      setInitialRange({ min: 0, max: 80 }); // Default values if the list is empty
    }
  }, [availableCarList, priceMode]); // Dependency array includes priceMode

  if (!initialRange) {
    // Optionally, display a loading state until initialRange is set
    return <div>Loading price range...</div>;
  }

  // console.log('Initial Range:', initialRange);

  return (
    <div>
      <div>
        {priceMode === 'Hour' ? (
          <PriceRangeFilterHour
            initialRange={initialRange}
            onChange={(range) => console.log('Price range changed:', range)}
            availableCarList={availableCarList}
          />
        ) : (
          <PriceRangeFilter
            initialRange={initialRange}
            onChange={(range) => console.log('Price range changed:', range)}
            availableCarList={availableCarList}
          />
        )}
      </div>
    </div>
  );
};

export default PriceRangeFilterMainSection;
