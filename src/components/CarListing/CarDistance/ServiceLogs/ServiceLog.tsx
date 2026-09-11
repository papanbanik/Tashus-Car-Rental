import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import { HookFormComponentProps } from '@/types/componentTypes';
import SectionHeader from '../../SectionHeader';

const ServiceLog = ({ register, control, watch, formState, setValue, reset, getValues, trigger, setError, clearErrors }: HookFormComponentProps) => {
  return (
    <div>
      <SectionHeader
        title="Service Log"
        subtitle="This log allows you to keep track of services and repairs performed on your vehicle. Maintaining accurate service records helps ensure your vehicle's health and performance over time."
      >
        <div className="ml-28">
          <IosSwitch control={control} registerName="serviceLogAdd" size="large" />
        </div>
      </SectionHeader>
    </div>
  );
};

export default ServiceLog;
