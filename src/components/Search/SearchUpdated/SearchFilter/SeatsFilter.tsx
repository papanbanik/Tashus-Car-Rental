import CommonForm from '@/components/Common/CommonForm';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import FilterButton from '@/components/Search/Carfiltering/FilterButton';
import ResetButton from '@/components/Search/Carfiltering/ResetButton';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { seatFilterList } from '@/utils/Lists/carListInfo';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export type CarSeatFilters = {
  numberOfSeats?: string | number;
  // numberOfSeats2: number[];
};

const defaultValues: CarSeatFilters = {
  numberOfSeats: '',
  // numberOfSeats2: [5, 9],
};

const SeatFilter = () => {
  const { control, setValue, handleSubmit, watch } = useForm<CarSeatFilters>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const { closeModal } = useModalContext();
  const { filteredCarList, searchedCarList, setFilteredCarList, selectedFilters, setSelectedFilters } = useSearchContext();

  // set form values when filter changes
  useEffect(() => {
    const isSeatApplied: any = selectedFilters.find((item) => item.name === 'seat');

    if (isSeatApplied) {
      const parsedNum = parseInt(isSeatApplied?.options[0].split('+')[0]);
      setValue('numberOfSeats', parsedNum, { shouldValidate: true });
    } else {
      setValue('numberOfSeats', '');
    }
  }, [selectedFilters]);

  const resetSeat = () => {
    setValue('numberOfSeats', '');
    const updatedList = selectedFilters.filter((item) => item.name !== 'seat');
    setSelectedFilters(updatedList);
    closeModal();
  };

  const applySeatFilter: SubmitHandler<CarSeatFilters> = async (data) => {
    // console.log(data);
    if (!data?.numberOfSeats) {
      resetSeat();
      return;
    }

    const isSeatApplied: any = selectedFilters.find((item) => item.name === 'seat');

    if (isSeatApplied) {
      const updatedList = selectedFilters.map((item) => {
        if (item.name === 'seat') {
          return { ...item, options: [`${data?.numberOfSeats}+ seats`] };
        }
        return item;
      });
      setSelectedFilters(updatedList);
    } else {
      const tempSelection = [...selectedFilters];
      tempSelection.push({
        name: 'seat',
        options: [`${data?.numberOfSeats}+ seats`],
      });

      setSelectedFilters(tempSelection);
    }

    closeModal();
  };

  return (
    <div>
      <CommonForm handleFunction={handleSubmit(applySeatFilter)}>
        <SearchableDropdown
          control={control}
          registerName="numberOfSeats"
          options={seatFilterList}
          label="Number of seats"
          defaultValue={watch('numberOfSeats')}
        ></SearchableDropdown>
        {watch('numberOfSeats') && <p className="mt-0 text-xs text-gray-400">{watch('numberOfSeats')} or more</p>}

        {/* <p className="mt-12">{`Number of Seats (${watch('numberOfSeats2')[0]} - ${watch('numberOfSeats2')[1]})`}</p>
        <CustomRangeSlider
          control={control}
          watch={watch}
          registerName="numberOfSeats2"
          setValue={setValue}
          defaultValue={watch('numberOfSeats2')}
          maxValue={12}
          minValue={1}
        ></CustomRangeSlider> */}
        <div className="flex items-center justify-center gap-6">
          <ResetButton resetFn={resetSeat}></ResetButton>
          <FilterButton></FilterButton>
        </div>
      </CommonForm>
    </div>
  );
};

export default SeatFilter;
