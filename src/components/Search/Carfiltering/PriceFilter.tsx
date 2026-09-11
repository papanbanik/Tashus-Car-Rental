'use client';

import { useEffect, useState } from 'react';
import CustomRangeSlider from '../../Common/HookFormFields/CustomRangeSlider';
import FilterButton from './FilterButton';
import IosSwitch from '../../Common/HookFormFields/IosSwitch';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useModalContext } from '@/context/ModalProvider';
import CommonForm from '../../Common/CommonForm';
import { useSearchContext } from '@/context/SearchProvider';
import ResetButton from './ResetButton';

export type CarPriceFilters = {
  hourPriceRange: number[];
  dayPriceRange: number[];
  applyDayPriceRange: boolean;
  applyHourPriceRange: boolean;
};

const PriceFilter = () => {
  const [maxRangeValues, setMaxRangeValues] = useState({
    dailyMaxRange: 0,
    hourlyMaxRange: 0,
  });
  const defaultValues: CarPriceFilters = {
    // dayPriceRange: [50, 200],
    dayPriceRange: [50, maxRangeValues?.dailyMaxRange],
    applyDayPriceRange: true,
    hourPriceRange: [10, 100],
    applyHourPriceRange: true,
  };
  const { control, setValue, handleSubmit, watch } = useForm<CarPriceFilters>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { closeModal } = useModalContext();
  const { selectedFilters, setSelectedFilters, searchedCarList } = useSearchContext();

  useEffect(() => {
    // console.log(selectedFilters);
    const isPriceApplied: any = selectedFilters.find((item) => item.name === 'price');
    if (isPriceApplied) {
      setValue('dayPriceRange', isPriceApplied?.options?.dayPriceRange || [50, 70]);
      setValue('hourPriceRange', isPriceApplied?.options?.hourPriceRange || [10, 100]);
      setValue('applyDayPriceRange', isPriceApplied?.options?.dayPriceRange ? true : false);
      setValue('applyHourPriceRange', isPriceApplied?.options?.hourPriceRange ? true : false);
    }
  }, [selectedFilters]);

  useEffect(() => {
    if (searchedCarList?.length > 0) {
      const hourlyRates = searchedCarList.map((car: any) => car.rates.hourlyRates.amount);
      const dailyRates = searchedCarList.map((car: any) => car.rates.dailyRates.amount);

      const maxHourlyRate = Math.max(...hourlyRates);
      const maxDailyRate = Math.max(...dailyRates);
      setMaxRangeValues({
        dailyMaxRange: maxDailyRate,
        hourlyMaxRange: maxHourlyRate,
      });
      const defaultDay = getDefaultMinMax(maxDailyRate);
      const defaultHour = getDefaultMinMax(maxHourlyRate);
      setValue('dayPriceRange', [defaultDay?.defaultMin, defaultDay?.defaultMax]);
      setValue('hourPriceRange', [defaultHour?.defaultMin, defaultHour?.defaultMax]);
    }
  }, [searchedCarList]);

  // calculates average min max default values0
  const getDefaultMinMax = (maxRate: number) => {
    const defaultMax = Math.ceil(maxRate / 2);
    const defaultMin = Math.ceil(defaultMax / 2);
    return { defaultMax, defaultMin };
  };

  const resetPriceFilter = () => {
    setValue('dayPriceRange', [50, maxRangeValues?.dailyMaxRange]);
    setValue('hourPriceRange', [10, maxRangeValues?.hourlyMaxRange]);
    setValue('applyDayPriceRange', false);
    setValue('applyHourPriceRange', false);
    const updatedList = selectedFilters.filter((item) => item.name !== 'price');
    setSelectedFilters(updatedList);
    closeModal();
  };

  const applyPriceFilter: SubmitHandler<CarPriceFilters> = async (data) => {
    // console.log(data);
    const { dayPriceRange, hourPriceRange, applyDayPriceRange, applyHourPriceRange } = data;
    if (!applyDayPriceRange && !applyHourPriceRange) {
      resetPriceFilter();
      return;
    }
    const isPriceApplied: any = selectedFilters.find((item) => item.name === 'price');
    const tempPrice = { ...(applyDayPriceRange && { dayPriceRange }), ...(applyHourPriceRange && { hourPriceRange }) };

    if (isPriceApplied) {
      const updatedList = selectedFilters.map((item) => {
        if (item.name === 'price') {
          return { ...item, options: tempPrice }; // Replace with your new options
        }
        return item;
      });
      // console.log(updatedList);
      setSelectedFilters(updatedList);
    } else {
      const tempSelection = [...selectedFilters];
      tempSelection.push({
        name: 'price',
        options: tempPrice,
      });
      // console.log(tempSelection);
      setSelectedFilters(tempSelection);
    }
    closeModal();
  };

  return (
    <CommonForm handleFunction={handleSubmit(applyPriceFilter)}>
      {/* Daily Price Range */}
      <div className="flex justify-start items-center">
        <IosSwitch control={control} registerName="applyDayPriceRange" size="small" watch={watch}></IosSwitch>
        <p className={`${watch('applyDayPriceRange') ? '' : 'text-gray-400'}`}>{`$${watch('dayPriceRange')[0]} - $${
          watch('dayPriceRange')[1]
        } /day`}</p>
      </div>
      <CustomRangeSlider
        control={control}
        watch={watch}
        registerName="dayPriceRange"
        setValue={setValue}
        // defaultValue={[20, 37]}
        // maxValue={1000}
        maxValue={maxRangeValues?.dailyMaxRange}
        minValue={1}
        disabled={!watch('applyDayPriceRange')}
      ></CustomRangeSlider>

      {/* Hourly Price Range */}
      <div className="flex justify-start items-center mt-4">
        <IosSwitch control={control} registerName="applyHourPriceRange" size="small" watch={watch}></IosSwitch>
        <p className={`${watch('applyHourPriceRange') ? '' : 'text-gray-400'}`}>{`$${watch('hourPriceRange')[0]} - $${
          watch('hourPriceRange')[1]
        } /hour`}</p>
      </div>
      <CustomRangeSlider
        control={control}
        watch={watch}
        registerName="hourPriceRange"
        setValue={setValue}
        // defaultValue={[5, 15]}
        // maxValue={500}
        maxValue={maxRangeValues?.hourlyMaxRange}
        minValue={1}
        disabled={!watch('applyHourPriceRange')}
      ></CustomRangeSlider>
      <div className="flex items-center justify-center gap-6">
        <ResetButton resetFn={resetPriceFilter}></ResetButton>
        <FilterButton></FilterButton>
      </div>
    </CommonForm>
  );
};

export default PriceFilter;
