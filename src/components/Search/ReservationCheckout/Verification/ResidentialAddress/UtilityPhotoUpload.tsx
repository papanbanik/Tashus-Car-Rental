'use client';
import SectionHeader from '@/components/CarListing/SectionHeader';
import ImageUploader from '@/components/Common/HookFormFields/ImageUploader';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ControlledFieldProps } from '@/types/componentTypes';
import { Button, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { TbReplaceFilled } from 'react-icons/tb';
import ProofGuidelines from './ProofGuidelines';
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
  shouldReset?: Boolean;
}

const UtilityPhotoUpload: React.FC<IFileUploadProps> = ({
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
  shouldReset,
}) => {
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | undefined>('');
  const { userProfileInfo } = useUserCredContext();
  // const { openModal } = useModalContext();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width: 1024px)');
  const { field } = useController({ name: 'picture', control });
  //reset on streetName Change
  useEffect(() => {
    setSelectedProfileImage('');
  }, [shouldReset]);
  useEffect(() => {
    if (userProfileInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url) {
      setSelectedProfileImage(userProfileInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url);
    }
  }, [userProfileInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto]);
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
    if (userProfileInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url) {
      setSelectedProfileImage(userProfileInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url);
    }
  }, [userProfileInfo?.contactDetails]);
  // const handleHelp = () => {
  //   openModal({
  //     content: <ProofGuidelines />,
  //     title: 'Address Proof Guidelines',
  //   });
  // };
  return (
    <>
      <SectionHeader title="Proof of Address" textSize="text-md">
        {/* <span className="text-xs text-gray-600">{`  (optional)`}</span> */}
        {/* <CommonTooltip title="To verify your address, please upload a recent utility bill photo in JPG or PNG format" placement="right" arrow>
          <IconButton size="small">
            <IoInformationCircleOutline className="text-gray-400 ml-4" size={22} />
          </IconButton>
        </CommonTooltip> */}
        <IoHelpCircleOutline onClick={() => setModalOpen(true)} className=" text-primary cursor-pointer" size={22} />
      </SectionHeader>
      {selectedProfileImage ? (
        <div
          className={`w-full bg-gray-400 relative rounded-lg flex min-h-[150px] justify-center items-center group
       `}
        >
          <Image
            src={selectedProfileImage || '/UserProfile/NoImage.png'}
            alt="Utility Image"
            className="object-contain w-full h-full"
            fill={true}
          ></Image>
          <div className="w-full h-8 absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10 rounded-full flex justify-center items-center gap-4">
            <Tooltip enterTouchDelay={0} title="Replace" placement="top">
              <IconButton size="large" className="bg-gray-400">
                <TbReplaceFilled className="text-lg" />
                <ImageUploader
                  control={control}
                  registerName="picture"
                  onChangeFn={onFileDrop}
                  multiple={false}
                  required={false}
                  disabled={isDisabledData}
                ></ImageUploader>
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        <Button variant="outlined" size="large" className="flex flex-col gap-2 justify-center items-center w-full h-[150px]">
          <FiUpload size={20} />
          <span>Upload</span>
          <ImageUploader
            control={control}
            registerName="picture"
            onChangeFn={onFileDrop}
            multiple={false}
            required={false}
            disabled={isDisabledData}
          />
        </Button>
      )}
      <ProofGuidelines isOpen={isModalOpen} handleClose={() => setModalOpen(false)} />
    </>
  );
};

export default UtilityPhotoUpload;
