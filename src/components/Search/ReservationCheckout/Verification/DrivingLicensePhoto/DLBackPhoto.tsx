'use client';
import ImageUploader from '@/components/Common/HookFormFields/ImageUploader';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ControlledFieldProps } from '@/types/componentTypes';
import { Button, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { AiOutlineCamera } from 'react-icons/ai';
import { FiUpload } from 'react-icons/fi';
interface IFileUploadProps extends ControlledFieldProps {
  limit: number;
  multiple: boolean;
  name?: string;
  profileUrl?: string | undefined;
  // profileUrl?: Blob | undefined;
  setProfileUrl?: Dispatch<SetStateAction<string>>;
  singleFile?: File[];
  setSingleFile?: Dispatch<SetStateAction<File[]>>;
  fileList?: File[];
  setFileList?: Dispatch<SetStateAction<File[]>>;
  deleteFileList?: File[];
  setDeleteFileList?: Dispatch<SetStateAction<File[]>>;
  photoUrlList?: string[];
  setPhotoUrlList?: Dispatch<SetStateAction<string[]>>;
  isDisabledData?: boolean;
}
const DLBackPhoto: React.FC<IFileUploadProps> = ({
  limit,
  multiple,
  name,
  control,
  registerName,
  profileUrl,
  setProfileUrl,
  singleFile,
  setSingleFile,
  fileList,
  setFileList,
  photoUrlList,
  setPhotoUrlList,
  setValue,
  trigger,
  deleteFileList,
  setDeleteFileList,
  isDisabledData,
}) => {
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | undefined>('');
  const { field } = useController({ name: 'backPicture', control });
  const { userProfileInfo } = useUserCredContext();
  const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const newFiles = Object.values(target.files).map((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      return file;
    });
    field.onChange(newFiles[0]);
  };
  useEffect(() => {
    if (userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url) {
      setSelectedProfileImage(userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url);
    }
  }, [userProfileInfo?.guestVerification?.drivingLicensePhotoBackside]);
  return (
    <div className="md:flex gap-8 w-full">
      <div className="md:w-1/2 w-full">
        <div className="w-full relative h-48">
          <Image
            // src={SelfieWithLicenseSample}
            src="/Images/Guest-Verification/tashus-dl-back.png"
            alt="Tashus Driver's License Photo Example"
            style={{ objectFit: 'cover' }}
            className="rounded-lg z-0"
            fill={true}
          ></Image>
        </div>
        <p className="text-center mt-2">{`Sample Back Photo (optional)`}</p>
      </div>

      <div className="md:w-1/2 w-full">
        {selectedProfileImage ? (
          <div className="flex flex-col justify-center items-center w-full">
            <div className={`relative h-48 w-full`}>
              <Image src={selectedProfileImage} alt="cover-photo" className="rounded-lg" style={{ objectFit: 'cover' }} fill={true}></Image>
              <div className="w-full h-8 absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10 rounded-full flex justify-center items-center gap-4">
                <Tooltip enterTouchDelay={0} title="Replace" placement="top">
                  <IconButton size="large" className="bg-gray-400">
                    <AiOutlineCamera className="text-lg" />
                    <ImageUploader
                      control={control}
                      registerName="backPicture"
                      onChangeFn={onFileDrop}
                      multiple={false}
                      required={false}
                      disabled={isDisabledData}
                    ></ImageUploader>
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        ) : (
          <Button variant="outlined" size="large" className="flex flex-col gap-2 justify-center items-center w-full md:h-48 h-32">
            <FiUpload size={20} />
            <span>Upload</span>
            <ImageUploader
              control={control}
              registerName="backPicture"
              onChangeFn={onFileDrop}
              multiple={false}
              required={false}
              disabled={isDisabledData}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DLBackPhoto;
