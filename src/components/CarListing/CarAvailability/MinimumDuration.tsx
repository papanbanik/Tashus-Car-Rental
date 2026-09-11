import React from 'react';
import SectionHeader from '../SectionHeader';
import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import { HookFormComponentProps } from '@/types/componentTypes';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import SelectRadioBtn from '@/components/Common/HookFormFields/SelectRadioBtn';
import { minTripDays, minTripDuration, minTripHours, minTripWeeks } from '@/utils/Lists/carListInfo';

const MinimumDuration = ({
  register,
  control,
  watch,
  formState,
  setValue,
  reset,
  getValues,
  trigger,
  setError,
  clearErrors,
}: HookFormComponentProps) => {
  return (
    <div className="mt-12">
      <SectionHeader title="Minimum Duration of Trip"></SectionHeader>
      <span className="text-left">
        <IosSwitch
          control={control}
          registerName="minTripDuration.noMinimum"
          size="large"
          label="No Minimum"
          required={!watch('minTripDuration.shortestDuration')}
        ></IosSwitch>
      </span>
      {!watch('minTripDuration.noMinimum') && (
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="md:col-span-7 col-span-12 text-left">
            <p>What is the shortest period of time guest can borrow your vehicle?</p>
          </div>
          <div className="md:col-span-3 col-span-6">
            <SelectRadioBtn control={control} registerName="minTripDuration.unit" options={minTripDuration} exclusive={true}></SelectRadioBtn>
          </div>
          <div className="md:col-span-2 col-span-4 relative flex">
            <div style={{ minWidth: '120px', marginRight: '2rem' }}>
              <SearchableDropdown
                control={control}
                registerName="minTripDuration.shortestDuration"
                options={
                  watch('minTripDuration.unit') === 'hours' ? minTripHours : watch('minTripDuration.unit') === 'days' ? minTripDays : minTripWeeks
                }
                label="Duration"
                defaultValue={watch('minTripDuration.shortestDuration')}
                required={!watch('minTripDuration.noMinimum')}
              ></SearchableDropdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimumDuration;
