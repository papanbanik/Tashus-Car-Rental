'use client';
import CommonImageUpload from '@/components/Common/Verification/CommonImageUpload';
import { ILicenseFileUploadProps } from '@/types/user-verification/verificationListingSteps';
import { useEffect } from 'react';
import { useController } from 'react-hook-form';
const SecondaryIDPhoto = ({
  control,
  shouldReset,
  isDisabledData,
  frontPhotoUrl: secondaryIDPhotoUrl,
  setFrontPhotoUrl: setSecondaryIDPhotoUrl,
}: ILicenseFileUploadProps) => {
  const { field } = useController({ name: 'picture', control });
  const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const newFile = Object.values(target.files).map((file: File) => file);
    if (newFile.length > 0 && newFile[0] instanceof Blob && setSecondaryIDPhotoUrl) {
      field.onChange(newFile[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setSecondaryIDPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(newFile[0]);
    } else {
      console.error('Invalid file type provided.');
    }
  };
  useEffect(() => {
    if (shouldReset === true && setSecondaryIDPhotoUrl) {
      setSecondaryIDPhotoUrl('');
    }
  }, [shouldReset]);
  return (
    <CommonImageUpload
      selectedImage={secondaryIDPhotoUrl ?? ''}
      onFileDrop={onFileDrop}
      control={control}
      registerName="picture"
      required={true}
      disabled={isDisabledData}
    />
  );
};

export default SecondaryIDPhoto;
