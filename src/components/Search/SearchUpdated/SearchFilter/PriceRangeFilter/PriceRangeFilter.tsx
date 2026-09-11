import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PriceRangeFilterProps, PriceRange } from './types';
import { Histogram } from './Histogram';
import { RangeSlider } from './RangeSlider';
import { useSearchContext } from '@/context/SearchProvider';
import { FaCheck, FaCheckCircle, FaRegLightbulb } from 'react-icons/fa';
import { TSearchedCar } from '@/types/car-search/carSearchType';

const generateHistogramData = (availableCarList: TSearchedCar[]): Array<{ price: number; count: number; endPrice: number }> => {
  const maxPrice = Math.ceil(Math.max(...availableCarList.map((car) => car.rates.dailyRates.amount || 0), 10));
  const segmentSize = 10;
  const totalBars = Math.ceil(maxPrice / segmentSize);

  return Array.from({ length: totalBars }, (_, index) => {
    const startPrice = index * segmentSize;
    const endPrice = startPrice + segmentSize;
    const count = availableCarList.filter((car) => {
      const dailyRate = car.rates.dailyRates.amount;
      return dailyRate >= startPrice && (dailyRate < endPrice || (index === totalBars - 1 && dailyRate === maxPrice));
    }).length;

    return { price: startPrice, count, endPrice };
  });
};

export function PriceRangeFilter({ initialRange, onChange, availableCarList }: PriceRangeFilterProps) {
  const [range, setRange] = useState<PriceRange>(initialRange);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const hasUserChangedRange = useRef<boolean>(false);

  const { setFilteredCarList } = useSearchContext();

  const data = useMemo(() => generateHistogramData(availableCarList), [availableCarList]);

  useEffect(() => {
    if (!hasUserChangedRange.current) return;

    const filteredArray = availableCarList.filter((car) => {
      const dailyRate = car.rates?.dailyRates?.amount;
      return dailyRate >= range.min && dailyRate <= range.max;
    });
    setFilteredCarList(filteredArray);
  }, [range]);

  const maxCount = useMemo(() => Math.max(...data.map((d) => d.count)), [data]);

  useEffect(() => {
    setRange(initialRange);
  }, [initialRange]);

  const handleRangeChange = (key: keyof PriceRange) => (e: React.ChangeEvent<HTMLInputElement>) => {
    hasUserChangedRange.current = true;
    const value = Number(e.target.value);
    let newRange: PriceRange;

    if (key === 'min') {
      newRange = { min: Math.min(value, range.max), max: range.max };
    } else {
      newRange = { min: range.min, max: Math.max(value, range.min) };
    }

    setRange(newRange);
    onChange(newRange);
    setAlertMessage('Price range Applied');
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const handleInputChange = (key: keyof PriceRange) => (e: React.ChangeEvent<HTMLInputElement>) => {
    hasUserChangedRange.current = true;
    let value = e.target.value;

    if (value === '') value = '0';
    if (value && Number(value) > 0) value = value.replace(/^0+/, '');

    const numberValue = Number(value);
    const maxPrice = Math.ceil(Math.max(...availableCarList.map((car) => car.rates.dailyRates.amount || 0), 10));

    let newRange: PriceRange;

    if (key === 'min') {
      const updatedMin = Math.max(0, numberValue);
      newRange = { min: updatedMin, max: range.max };
    } else {
      const updatedMax = Math.min(Math.max(numberValue, range.min), maxPrice);
      newRange = { min: range.min, max: updatedMax };
    }

    setRange(newRange);
    onChange(newRange);
    setAlertMessage('Price range applied');
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!['ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  };
  // console.log('setIsFocused', isFocused);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between mb-6">
        <div className="bg-purple-50 px-3 py-2 rounded-lg mr-4">
          <p className="text-md text-gray-600 mb-0">Price From</p>
          <input
            type="text"
            value={range.min}
            className="text-2xl font-semibold w-full bg-transparent border-none outline-none cursor-default caret-transparent p-0 m-0"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            readOnly
            onKeyDown={(e) => e.preventDefault()} // Prevent backspace and other keys
            onInput={(e) => e.preventDefault()} // Prevent mobile keyboard input
          />
        </div>
        <div className="bg-purple-50 px-3 py-2 rounded-lg">
          <p className="text-md text-gray-600 mb-0">Price To</p>
          <input
            type="text"
            value={range.max}
            className="text-2xl font-semibold w-full bg-transparent border-none outline-none cursor-default caret-transparent p-0 m-0"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            readOnly
            onKeyDown={(e) => e.preventDefault()} // Prevent backspace and other keys
            onInput={(e) => e.preventDefault()} // Prevent mobile keyboard input
          />
        </div>
      </div>

      <Histogram data={data} currentRange={range} maxCount={maxCount} />

      <RangeSlider
        range={range}
        initialRange={{
          min: initialRange.min,
          max: Math.ceil(Math.max(...availableCarList.map((car) => car.rates.dailyRates.amount || 0))),
        }}
        onRangeChange={handleRangeChange}
      />

      {alertMessage && (
        <div className="bg-[#ADCD77] text-gray-600 p-2 rounded-lg mt-4 text-center flex items-center justify-center space-x-2">
          <FaCheck className="text-gray-600" size={20} />
          <span>{alertMessage}</span>
        </div>
      )}

      <div className={`flex items-center space-x-2 text-sm mt-4 ${isFocused ? 'text-red-600 animate-shake font-semibold ' : 'text-gray-700'}`}>
        <FaRegLightbulb className={isFocused ? 'text-red-600' : 'text-gray-600'} size={16} />
        <span>Drag the sliders or click the track to adjust the range.</span>
      </div>
    </div>
  );
}
