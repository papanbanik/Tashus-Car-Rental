import { useEffect } from 'react';
import MultiSelection from '../../Common/HookFormFields/MultiSelection';
import { carTypeList } from '@/utils/Lists/carListInfo';
import FilterButton from './FilterButton';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useModalContext } from '@/context/ModalProvider';
import CommonForm from '../../Common/CommonForm';
import { useSearchContext } from '@/context/SearchProvider';
import ResetButton from './ResetButton';

export type CarTypeFilters = {
  carTypes?: string[];
};

const defaultValues: CarTypeFilters = {
  carTypes: [],
};

const CarTypeFilter = () => {
  const { control, setValue, handleSubmit, watch } = useForm<CarTypeFilters>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const { closeModal } = useModalContext();
  const { selectedFilters, setSelectedFilters } = useSearchContext();

  useEffect(() => {
    // console.log(selectedFilters);
    const carTypeObject: any = selectedFilters.find((item) => item.name === 'carType');
    if (carTypeObject) {
      setValue('carTypes', carTypeObject?.options);
    }
  }, [selectedFilters]);

  const resetCarType = () => {
    // console.log(selectedFilters);
    setValue('carTypes', []);
    const updatedList = selectedFilters.filter((item) => item.name !== 'carType');
    // console.log(updatedList);
    setSelectedFilters(updatedList);
    closeModal();
  };

  const applyCarTypeFilter: SubmitHandler<CarTypeFilters> = async (data) => {
    // console.log(data);
    if (data?.carTypes?.length === 0) {
      resetCarType();
      return;
    }

    const isCarTypeApplied: any = selectedFilters.find((item) => item.name === 'carType');

    if (isCarTypeApplied) {
      const updatedList = selectedFilters.map((item) => {
        if (item.name === 'carType') {
          return { ...item, options: data?.carTypes }; // Replace with your new options
        }
        return item;
      });
      setSelectedFilters(updatedList);
    } else {
      const tempSelection = [...selectedFilters];
      tempSelection.push({
        name: 'carType',
        options: data?.carTypes,
      });
      setSelectedFilters(tempSelection);
    }
    closeModal();
  };

  return (
    <CommonForm handleFunction={handleSubmit(applyCarTypeFilter)}>
      <MultiSelection control={control} registerName="carTypes" required={false} options={carTypeList}></MultiSelection>
      <div className="flex items-center justify-center gap-6">
        <ResetButton resetFn={resetCarType}></ResetButton>
        <FilterButton></FilterButton>
      </div>
    </CommonForm>
  );
};

export default CarTypeFilter;
