import React, { useEffect } from 'react';
import SelectRadioBtn from '../../Common/HookFormFields/SelectRadioBtn';
import { SubmitHandler, useForm } from 'react-hook-form';
import { transmissionList2 } from '@/utils/Lists/carListInfo';
import CommonForm from '../../Common/CommonForm';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import FilterButton from './FilterButton';
import ResetButton from './ResetButton';

export type CarTransmissionFilters = {
  transmissionTypes?: string[];
};

const defaultValues: CarTransmissionFilters = {
  transmissionTypes: [],
};

const TransmissionFilter = () => {
  const { control, setValue, handleSubmit, watch } = useForm<CarTransmissionFilters>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const { closeModal } = useModalContext();
  const { filteredCarList, searchedCarList, setFilteredCarList, selectedFilters, setSelectedFilters } = useSearchContext();

  useEffect(() => {
    // console.log(selectedFilters);
    const isTransmissionApplied: any = selectedFilters.find((item) => item.name === 'transmission');
    if (isTransmissionApplied) {
      setValue('transmissionTypes', isTransmissionApplied?.options);
    } else {
      setValue('transmissionTypes', []);
    }
  }, [selectedFilters]);

  const resetTransmission = () => {
    // console.log(selectedFilters);
    setValue('transmissionTypes', []);
    const updatedList = selectedFilters.filter((item) => item.name !== 'transmission');
    // console.log(updatedList);
    setSelectedFilters(updatedList);
    closeModal();
  };

  const applyTransmissionFilter: SubmitHandler<CarTransmissionFilters> = async (data) => {
    // console.log(data);
    const isCarTypeApplied: any = selectedFilters.find((item) => item.name === 'transmission');

    if (data?.transmissionTypes?.length === 0) {
      resetTransmission();
      return;
    }

    if (isCarTypeApplied) {
      const updatedList = selectedFilters.map((item) => {
        if (item.name === 'transmission') {
          return { ...item, options: data?.transmissionTypes };
        }
        return item;
      });
      setSelectedFilters(updatedList);
    } else {
      const tempSelection = [...selectedFilters];
      tempSelection.push({
        name: 'transmission',
        options: data?.transmissionTypes,
      });

      setSelectedFilters(tempSelection);
    }

    closeModal();
  };

  return (
    <div>
      <CommonForm handleFunction={handleSubmit(applyTransmissionFilter)}>
        <SelectRadioBtn
          control={control}
          registerName="transmissionTypes"
          options={transmissionList2}
          exclusive={false}
          buttonWidth="w-full"
        ></SelectRadioBtn>
        <div className="flex items-center justify-center gap-6">
          <ResetButton resetFn={resetTransmission}></ResetButton>
          <FilterButton></FilterButton>
        </div>
      </CommonForm>
    </div>
  );
};

export default TransmissionFilter;
