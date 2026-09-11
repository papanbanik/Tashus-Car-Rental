'use client';
import CommonImageUpload from '@/components/Common/Verification/CommonImageUpload';
import { ILicenseFileUploadProps } from '@/types/user-verification/verificationListingSteps';
import { useController } from 'react-hook-form';
const LicenseFrontPhoto = ({ control, isDisabledData, setFrontPhotoUrl, frontPhotoUrl }: ILicenseFileUploadProps) => {
  const { field } = useController({ name: 'picture', control });

  const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const newFile = Object.values(target.files).map((file: File) => file);
    if (newFile.length > 0 && newFile[0] instanceof Blob && setFrontPhotoUrl) {
      field.onChange(newFile[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setFrontPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(newFile[0]);
    } else {
      console.error('Invalid file type provided.');
    }
  };

  return (
    <CommonImageUpload
      title="License Front Photo"
      selectedImage={frontPhotoUrl ?? ''}
      onFileDrop={onFileDrop}
      control={control}
      registerName="picture"
      required={true}
      disabled={isDisabledData}
      isMandatory={true}
    />
  );
};

export default LicenseFrontPhoto;
