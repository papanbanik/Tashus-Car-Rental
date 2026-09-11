import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import { HookFormComponentProps } from '@/types/componentTypes';
import SectionHeader from '../../SectionHeader';

const FuelGauge = ({ register, control, watch, formState, setValue, reset, getValues, trigger, setError, clearErrors }: HookFormComponentProps) => {
  return (
    <div>
      <SectionHeader
        title="Fuel Range"
        subtitle="Make sure you provide the fuel range or fuel economy and a picture as proof. This information is crucial for calculating the fuel gap accurately."
      >
        <div className="ml-28">
          <IosSwitch control={control} registerName="fuelInfoAdd" size="large" />
        </div>
      </SectionHeader>
    </div>
  );
};

export default FuelGauge;
