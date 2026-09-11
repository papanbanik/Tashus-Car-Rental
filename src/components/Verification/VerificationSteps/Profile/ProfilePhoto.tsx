'use client';
import CommonImageUpload from '@/components/Common/Verification/CommonImageUpload';
import { IPhotoUploadProps } from '@/types/profileInfoTypes';
import React from 'react';
import { useController } from 'react-hook-form';

const ProfilePhoto = ({ control, setPhotoUrl, photoUrl }: IPhotoUploadProps) => {
  const { field } = useController({ name: 'picture', control });

  const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const newFile = Object.values(target.files).map((file: File) => file);
    if (newFile.length > 0 && newFile[0] instanceof Blob && setPhotoUrl) {
      field.onChange(newFile[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(newFile[0]);
    } else {
      console.error('Invalid file type provided.');
    }
  };

  return <CommonImageUpload selectedImage={photoUrl ?? ''} onFileDrop={onFileDrop} control={control} registerName="picture" required={true} />;
};

export default ProfilePhoto;
