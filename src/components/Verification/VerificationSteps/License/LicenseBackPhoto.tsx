'use client';
import CommonImageUpload from '@/components/Common/Verification/CommonImageUpload';
import { ILicenseFileUploadProps } from '@/types/user-verification/verificationListingSteps';
import { useController } from 'react-hook-form';

const LicenseBackPhoto = ({ control, isDisabledData, setBackPhotoUrl, backPhotoUrl }: ILicenseFileUploadProps) => {
  const { field } = useController({ name: 'backPicture', control });

  const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const newFile = Object.values(target.files).map((file: File) => file);
    if (newFile.length > 0 && newFile[0] instanceof Blob && setBackPhotoUrl) {
      field.onChange(newFile[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setBackPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(newFile[0]);
    } else {
      console.error('Invalid file type provided.');
    }
  };

  return (
    <CommonImageUpload
      title="License Back Photo"
      selectedImage={backPhotoUrl ?? ''}
      onFileDrop={onFileDrop}
      control={control}
      registerName="backPicture"
      required={true}
      disabled={isDisabledData}
      isMandatory={true}
    />
  );
};

export default LicenseBackPhoto;
