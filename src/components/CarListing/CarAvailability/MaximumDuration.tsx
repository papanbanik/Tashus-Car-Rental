import { HookFormComponentProps } from '@/types/componentTypes';
import React from 'react';
import SectionHeader from '../SectionHeader';
import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import SelectRadioBtn from '@/components/Common/HookFormFields/SelectRadioBtn';
import { maxTripDays, maxTripDuration, maxTripWeeks } from '@/utils/Lists/carListInfo';

const MaximumDuration = ({
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
      <SectionHeader title="Maximum Duration of Trip"></SectionHeader>
      <span className="text-left">
        <IosSwitch
          control={control}
          registerName="maxTripDuration.noMaximum"
          size="large"
          label="No Maximum"
          required={!watch('maxTripDuration.longestDuration')}
        ></IosSwitch>
      </span>
      {!watch('maxTripDuration.noMaximum') && (
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="md:col-span-7 col-span-12 text-left">
            <p>What is the longest period of time guest can borrow your vehicle?</p>
          </div>
          <div className="md:col-span-3 col-span-6">
            <SelectRadioBtn control={control} registerName="maxTripDuration.unit" options={maxTripDuration} exclusive={true}></SelectRadioBtn>
          </div>
          <div className="md:col-span-2 col-span-4 relative flex">
            <SearchableDropdown
              control={control}
              registerName="maxTripDuration.longestDuration"
              options={watch('maxTripDuration.unit') === 'days' ? maxTripDays : maxTripWeeks}
              label="Duration"
              defaultValue={watch('maxTripDuration.longestDuration')}
              required={!watch('maxTripDuration.noMaximum')}
            ></SearchableDropdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaximumDuration;
