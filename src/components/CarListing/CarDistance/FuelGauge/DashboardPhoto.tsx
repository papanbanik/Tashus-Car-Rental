'use client';
import CommonTooltip from '@/components/Common/CommonTooltip';
import ImageUploader from '@/components/Common/HookFormFields/ImageUploader';
import { useCarListingContext } from '@/context/CarListingProvider';
import { ControlledFieldProps } from '@/types/componentTypes';
import { Button, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { TbReplaceFilled } from 'react-icons/tb';
import SectionHeader from '../../SectionHeader';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
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
}
const DashboardPhoto: React.FC<IFileUploadProps> = ({
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
}) => {
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | undefined>('');

  const { field } = useController({ name: 'fuelPicture', control });
  const { carData } = useCarListingContext();
  const [open, setOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');
  const handleOpen = (photoUrl: string) => {
    setModalImageSrc(photoUrl);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (carData?.distance?.fuelGauges?.length > 0) {
      const { distance } = carData || {};
      const { fuelGauges: fuelGauges } = distance || {};
      if (fuelGauges && fuelGauges.length > 0) {
        const lastIndex = fuelGauges.length - 1;
        const lastServiceLog = fuelGauges[lastIndex];
        const { attachmentOfFuelGauge } = lastServiceLog;
        if (attachmentOfFuelGauge?.imageInfo?.secure_url) {
          setSelectedProfileImage(attachmentOfFuelGauge?.imageInfo?.secure_url);
        } else {
          setSelectedProfileImage('');
        }
      }
    }
  }, [carData?.carServiceLog]);
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
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <SectionHeader title="Photo of Fuel Gauge (Dashboard)" textSize="text-md" fontStyle="font-normal" noMargin={true}>
          {/* <span className="text-xs text-gray-600">{`  (optional)`}</span> */}
          <CommonTooltip
            title="To assist our system in documenting the fuel range accurately and resolving any potential fuel gap claims, please upload a clear picture of your car's dashboard that includes the fuel range display"
            placement="right"
            arrow
          >
            <IconButton size="small">
              <IoInformationCircleOutline className="text-gray-400 ml-4" size={18} />
            </IconButton>
          </CommonTooltip>
        </SectionHeader>
        {selectedProfileImage ? (
          <div
            className={`w-full bg-gray-400 relative rounded-lg flex min-h-[150px] justify-center items-center group
     `}
          >
            <Image
              src={selectedProfileImage || '/UserProfile/NoImage.png'}
              alt="secondaryIDImage"
              className="object-contain w-full h-full cursor-pointer"
              fill={true}
              onClick={(event) => {
                handleOpen(selectedProfileImage);
              }}
            ></Image>

            {/* Black Overlay    */}
            <div className="w-full h-8 absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10 rounded-full flex justify-center items-center gap-4">
              <Tooltip enterTouchDelay={0} title="Replace" placement="top">
                <IconButton size="large" className="bg-gray-400">
                  <TbReplaceFilled className="text-lg" />
                  <ImageUploader
                    control={control}
                    registerName="fuelPicture"
                    onChangeFn={onFileDrop}
                    multiple={false}
                    required={false}
                  ></ImageUploader>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ) : (
          <Button variant="outlined" size="large" className="flex flex-col gap-2 justify-center items-center w-full h-[150px]">
            <FiUpload size={20} />
            <span>Upload</span>
            <ImageUploader control={control} registerName="fuelPicture" onChangeFn={onFileDrop} multiple={false} required={false} />
          </Button>
        )}
      </div>
      <UpdatedCommonImgZoomInOutModal handleClose={handleClose} open={open} modalImageSrc={modalImageSrc} />
    </>
  );
};

export default DashboardPhoto;
