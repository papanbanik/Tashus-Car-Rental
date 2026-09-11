'use client';
import ImageUploader from '@/components/Common/HookFormFields/ImageUploader';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ControlledFieldProps } from '@/types/componentTypes';
import { Button, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import { TbReplaceFilled } from 'react-icons/tb';
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
  shouldReset?: Boolean;
  isDisabledData?: boolean;
}
const SecondaryIDPhotoUpload: React.FC<IFileUploadProps> = ({
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
  shouldReset,
  isDisabledData,
}) => {
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | undefined>('');
  const { userProfileInfo } = useUserCredContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width: 1024px)');
  const { field } = useController({ name: 'picture', control });
  //reset on idType Change
  useEffect(() => {
    setSelectedProfileImage('');
  }, [shouldReset]);
  useEffect(() => {
    if (userProfileInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.secure_url) {
      setSelectedProfileImage(userProfileInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.secure_url);
    }
  }, [userProfileInfo?.guestVerification?.secondaryIdInfo]);
  // const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
  //   const target = e.target as HTMLInputElement;
  //   if (!target.files) return;
  //   const newFile = Object.values(target.files).map((file: File) => file);
  //   field.onChange(newFile[0]);
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setSelectedProfileImage(reader.result as string);
  //   };
  //   reader.readAsDataURL(newFile[0]);
  // };
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

  return (
    <>
      {selectedProfileImage ? (
        <div
          className={`w-full bg-gray-400 relative rounded-lg flex min-h-[150px] justify-center items-center group
     `}
        >
          <Image
            src={selectedProfileImage || '/UserProfile/NoImage.png'}
            alt="secondaryIDImage"
            className="object-contain w-full h-full"
            fill={true}
          ></Image>

          {/* Black Overlay    */}

          {/* <div className="hover_black_overlay flex justify-center items-center rounded-lg">
        <Button startIcon={<FiUpload className="mr-4" size={20} />} size="small" className="normal-case text-lg font-semibold p-0 text-white">
          <ImageUploader control={control} registerName={'picture'} onChangeFn={onFileDrop} multiple={false} required={true} />
          Update
        </Button>
      </div> */}
          <div className="w-full h-8 absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10 rounded-full flex justify-center items-center gap-4">
            <Tooltip enterTouchDelay={0} title="Replace" placement="top">
              <IconButton size="large" className="bg-gray-400">
                <TbReplaceFilled className="text-lg" />
                <ImageUploader
                  control={control}
                  registerName="picture"
                  onChangeFn={onFileDrop}
                  multiple={false}
                  required={!selectedProfileImage}
                  disabled={isDisabledData}
                ></ImageUploader>
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        <Button variant="outlined" size="large" className="flex flex-col gap-2 justify-center items-center w-full md:h-48 h-32">
          <FiUpload size={20} />
          <span>Upload</span>
          <ImageUploader
            control={control}
            registerName="picture"
            onChangeFn={onFileDrop}
            multiple={false}
            required={!selectedProfileImage}
            disabled={isDisabledData}
          />
        </Button>
      )}
    </>
  );
};

export default SecondaryIDPhotoUpload;
