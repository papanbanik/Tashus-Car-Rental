'use client';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import { HookFormComponentProps } from '@/types/componentTypes';
import SectionHeader from '../SectionHeader';

const ReturnInformation = ({
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
  const { errors } = formState;
  return (
    <div>
      <SectionHeader title="Return Information" subtitle="Share any specific instructions about how guest will return vehicle and keys" />
      <div className="listing_section_content text-left">
        <RichEditor
          control={control}
          registerName="guidelines.returnInformation"
          label="Guidelines to your return information..."
          required={true}
          errors={errors?.guidelines?.returnInformation}
        />
      </div>
    </div>
  );
};

export default ReturnInformation;
