import { useSearchContext } from '@/context/SearchProvider';
import { SelectedFiltersType } from '@/types/searchingTypes';
import { Button, IconButton } from '@mui/material';
import React from 'react';
import { TiDelete } from 'react-icons/ti';

const ActiveOptions = () => {
  const { selectedFilters, setSelectedFilters, removeAppliedFilter } = useSearchContext();

  const removeFilterOption = (filterName: string, optionName: string) => {
    // console.log(filterName, optionName);
    console.log(filterName, 'filter name is clicked');
    if (filterName === 'seat') {
      removeAppliedFilter(filterName);
    }

    if (filterName === 'transmission') {
      const transFilter: SelectedFiltersType[] = selectedFilters
        ?.filter((fil) => fil?.name === 'transmission')[0]
        ?.options.filter((trans: string) => trans !== optionName);

      if (transFilter?.length === 0) {
        removeAppliedFilter(filterName);
      } else {
        const updatedList = selectedFilters?.map((item) => {
          if (item.name === 'transmission') {
            return { ...item, options: transFilter };
          }
          return item;
        });
        setSelectedFilters(updatedList);
      }
    }

    if (filterName === 'carType') {
      const carTypeFilter: SelectedFiltersType[] = selectedFilters
        ?.find((fil) => fil?.name === 'carType')
        ?.options.filter((trans: string) => trans !== optionName);

      if (carTypeFilter?.length === 0) {
        removeAppliedFilter(filterName);
      } else {
        const updatedList = selectedFilters?.map((item) => {
          if (item.name === 'carType') {
            return { ...item, options: carTypeFilter };
          }
          return item;
        });
        setSelectedFilters(updatedList);
      }
    }

    if (filterName === 'price') {
      const isPriceAppliedIndex = selectedFilters.findIndex((item) => item.name === 'price');

      if (isPriceAppliedIndex !== -1) {
        let prevFilters = [...selectedFilters];
        // Clone the priceFilter object to maintain immutability
        const priceFilter = { ...selectedFilters[isPriceAppliedIndex] };

        if (optionName === 'dayPriceRange') {
          // Remove dayPriceRange from options
          const updatedOptions = { ...priceFilter.options };
          delete updatedOptions.dayPriceRange;
          priceFilter.options = updatedOptions;
        }
        if (optionName === 'hourPriceRange') {
          // Remove hourPriceRange from options
          const updatedOptions = { ...priceFilter.options };
          delete updatedOptions.hourPriceRange;
          priceFilter.options = updatedOptions;
        }

        // Check if the price options object is empty
        if (Object.keys(priceFilter?.options).length === 0) {
          prevFilters = [...prevFilters.slice(0, isPriceAppliedIndex), ...prevFilters.slice(isPriceAppliedIndex + 1)];
        } else {
          prevFilters[isPriceAppliedIndex] = priceFilter;
        }
        console.log(prevFilters, 'price +  is clicked');
        setSelectedFilters(prevFilters);
        console.log(selectedFilters, 'selectedFiltersNew');
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-4 md:mt-0 mt-4">
      {selectedFilters?.map((filter) =>
        filter?.name !== 'price' ? (
          filter?.options.map((option: any, index: number) => (
            <div key={index} className="bg-secondary text-primary px-2 rounded-xl text-sm flex justify-between items-center gap-1">
              <span>{option}</span>
              <IconButton className="p-0 text-red-500" onClick={() => removeFilterOption(filter?.name || '', option)}>
                <TiDelete size={16} />
              </IconButton>
            </div>
          ))
        ) : (
          <>
            {filter?.options?.dayPriceRange && (
              <div className="bg-secondary text-primary px-2 rounded-xl text-sm flex justify-between items-center gap-1">
                <span>
                  {'$'}
                  {filter?.options?.dayPriceRange[0]}
                  {'- $'}
                  {filter?.options?.dayPriceRange[1]}
                  {' /day'}
                </span>
                <IconButton className="p-0 text-red-500" onClick={() => removeFilterOption(filter?.name || '', 'dayPriceRange')}>
                  <TiDelete size={16} />
                </IconButton>
              </div>
            )}
            {filter?.options?.hourPriceRange && (
              <div className="bg-secondary text-primary px-2 rounded-xl text-sm flex justify-between items-center gap-1">
                <span>
                  {'$'}
                  {filter?.options?.hourPriceRange[0]}
                  {'- $'}
                  {filter?.options?.hourPriceRange[1]}
                  {' /hour'}
                </span>
                <IconButton className="p-0 text-red-500" onClick={() => removeFilterOption(filter?.name || '', 'hourPriceRange')}>
                  <TiDelete size={16} />
                </IconButton>
              </div>
            )}
          </>
        )
      )}
      {selectedFilters?.length > 0 && (
        <span
          className="bg-secendary text-primary px-2 rounded-xl text-sm flex justify-between items-center gap-1 cursor-pointer underline hover:text-red-500 hover:underline-offset-2 transition-all duration-200"
          color="error"
          onClick={() => setSelectedFilters([])}
        >
          Clear All
        </span>
      )}
    </div>
  );
};

export default ActiveOptions;
