'use client';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import { HookFormComponentProps } from '@/types/componentTypes';
import SectionHeader from '../SectionHeader';

const WordOfWelcomes = ({
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
      <SectionHeader
        title="Words of Welcome"
        // subtitle="This message will be sent shortly after borrowers book your vehicle and is an excellent opportunity to add a personal touch.
        // Along with a warm and friendly greeting to your guests during their check-in, please include any essential instructions they should know before pickup.
        // This thoughtful communication ensures a smooth and enjoyable experience, even if you can't meet them in person."
        subtitle="This message will be displayed before booking on your vehicle details page, offering an excellent opportunity to add a personal touch. Include a warm greeting and any essential instructions for guests during their check-in, ensuring a smooth and enjoyable experience, even if you can't meet them in person."
      />
      <div className="listing_section_content text-left">
        <RichEditor
          control={control}
          registerName="guidelines.wordOfWelcome"
          // label="Guidelines to your return information..."
          required={true}
          errors={errors?.guidelines?.wordOfWelcome}
        />
      </div>
    </div>
  );
};

export default WordOfWelcomes;
