import { HookFormComponentProps } from '@/types/componentTypes';
import React from 'react';
import SectionHeader from '../SectionHeader';
import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import { noticeHourList } from '@/utils/Lists/carListInfo';

const AdvanceNotice = ({
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
      <SectionHeader title="Notice in Advance"></SectionHeader>
      <span className="text-left">
        <IosSwitch
          control={control}
          registerName="noticeInAdvance.alwaysAvailableImmediately"
          size="large"
          label="No notice is required"
          required={!watch('noticeInAdvance.hoursRequired')}
        ></IosSwitch>
      </span>

      {!watch('noticeInAdvance.alwaysAvailableImmediately') && (
        <div className="grid grid-cols-12 items-center">
          <div className="lg:col-span-7 md:col-span-8 col-span-12 text-left">
            <p>How many hours do you need to make the car ready for Guest?</p>
          </div>
          <div className="lg:col-span-2 md:col-span-3 col-span-5 relative flex">
            <div style={{ minWidth: '200px', marginRight: '2rem' }}>
              <SearchableDropdown
                control={control}
                registerName="noticeInAdvance.hoursRequired"
                options={noticeHourList}
                label="Notice Hours "
                defaultValue={watch('noticeInAdvance.hoursRequired')}
                required={!watch('noticeInAdvance.alwaysAvailableImmediately')}
              ></SearchableDropdown>
            </div>

            {!!watch('noticeInAdvance.hoursRequired') && (
              <span className="absolute left-12 top-2 p-0">{watch('noticeInAdvance.hoursRequired') === 1 ? 'Hour' : 'Hours'}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvanceNotice;
