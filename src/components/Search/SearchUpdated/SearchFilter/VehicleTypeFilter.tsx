import { useEffect, useRef } from 'react';

import { carTypeList } from '@/utils/Lists/carListInfo';
import { Control, useForm } from 'react-hook-form';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';

import CommonForm from '@/components/Common/CommonForm';
import MultiSelection from '@/components/Common/HookFormFields/MultiSelection';

export type CarTypeFilters = {
  carTypes?: string[];
};

const VehicleTypeFilter = ({ vehicleType }: { vehicleType?: string }) => {
  const { control, setValue } = useForm<CarTypeFilters>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: {
      carTypes: vehicleType ? [vehicleType] : [],
    },
  });
  const { closeModal } = useModalContext();
  const { selectedFilters, setSelectedFilters } = useSearchContext();
  const initializedVehicleType = useRef<string>();

  const applyCarTypeFilter = (selected: string[]) => {
    setSelectedFilters((prev) => {
      const filtered = prev.filter((item) => item.name !== 'carType');

      if (selected.length === 0) {
        return filtered;
      }

      return [
        ...filtered,
        {
          name: 'carType',
          options: selected,
        },
      ];
    });
  };

  useEffect(() => {
    if (!vehicleType || initializedVehicleType.current === vehicleType) return;

    initializedVehicleType.current = vehicleType;
    setValue('carTypes', [vehicleType]);
    applyCarTypeFilter([vehicleType]);
  }, [vehicleType, setValue, setSelectedFilters]);

  useEffect(() => {
    const carTypeObject = selectedFilters.find((item) => item.name === 'carType');
    setValue('carTypes', carTypeObject?.options ?? []);
  }, [selectedFilters, setValue]);

  const resetCarType = () => {
    setValue('carTypes', []);
    const updatedList = selectedFilters.filter((item) => item.name !== 'carType');
    setSelectedFilters(updatedList);
    closeModal();
  };

  return (
    <CommonForm handleFunction={() => {}}>
      {' '}
      <div className="ml-4">
        <MultiSelection
          control={control as unknown as Control<any>}
          registerName="carTypes"
          required={false}
          options={carTypeList}
          onSelectionChange={applyCarTypeFilter}
        />
      </div>
    </CommonForm>
  );
};

export default VehicleTypeFilter;
