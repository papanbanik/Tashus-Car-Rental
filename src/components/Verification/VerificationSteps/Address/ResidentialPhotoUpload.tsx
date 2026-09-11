'use client';
import SectionHeader from '@/components/CarListing/SectionHeader';
import CommonImageUpload from '@/components/Common/Verification/CommonImageUpload';
import ProofGuidelines from '@/components/Search/ReservationCheckout/Verification/ResidentialAddress/ProofGuidelines';
import { ILicenseFileUploadProps } from '@/types/user-verification/verificationListingSteps';
import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { IoHelpCircleOutline } from 'react-icons/io5';

const ResidentialPhotoUpload = ({
  control,
  isDisabledData,
  shouldReset,
  frontPhotoUrl: addressPhotoUrl,
  setFrontPhotoUrl: setAddressPhotoUrl,
}: ILicenseFileUploadProps) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { field } = useController({ name: 'picture', control });

  const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const newFile = Object.values(target.files).map((file: File) => file);
    if (newFile.length > 0 && newFile[0] instanceof Blob && setAddressPhotoUrl) {
      field.onChange(newFile[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setAddressPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(newFile[0]);
    } else {
      console.error('Invalid file type provided.');
    }
  };

  useEffect(() => {
    if (shouldReset === true && setAddressPhotoUrl) {
      setAddressPhotoUrl('');
    }
  }, [shouldReset]);

  return (
    <>
      <SectionHeader title="Proof of Address" textSize="text-md">
        <IoHelpCircleOutline onClick={() => setModalOpen(true)} className=" text-primary cursor-pointer" size={22} />
      </SectionHeader>
      <CommonImageUpload
        selectedImage={addressPhotoUrl ?? ''}
        onFileDrop={onFileDrop}
        control={control}
        registerName="picture"
        required={false}
        disabled={isDisabledData}
      />
      <ProofGuidelines isOpen={isModalOpen} handleClose={() => setModalOpen(false)} />
    </>
  );
};

export default ResidentialPhotoUpload;
