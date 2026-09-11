import { saveSingleImageToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import { useUpdateReservedVehicle } from '../reservation/useUpdateReservedVehicle';
import { useState } from 'react';
import { OptimizedPhotoValues, TDate, TReservationStatus } from '@/types/commonTypes';
import { dayjsUtc, getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import dayjs from 'dayjs';

type HandleOdometerUpdateParams = {
  tempOdometerPhoto?: File | Blob;
  reservationId: string;
  odometerValue?: number;
};

const useReservedVehicleInfoUpdate = (isBeforeReservation?: boolean) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [coverUrl, setCoverUrl] = useState<string>('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);

  const { mutateAsync } = useUpdateReservedVehicle();

  const handleOdometerUpdate = async ({ tempOdometerPhoto, reservationId, odometerValue }: HandleOdometerUpdateParams) => {
    setIsLoading(true);
    let odometerPhoto;
    if (tempOdometerPhoto && tempOdometerPhoto?.length !== 0) {
      odometerPhoto = await handleOdometerPhoto(tempOdometerPhoto, reservationId);
    } else {
      odometerPhoto = {} as OptimizedPhotoValues;
    }

    await mutateAsync({ reservationId, odometerPhoto, odometerValue, isBeforeReservation });
    setIsLoading(false);
    handleChangeEditable();
  };

  const handleOdometerPhoto = async (odometerPhoto: Blob, reservationId: string) => {
    const publicId = `reservations/${reservationId}`;
    const { imageUrl } = await saveSingleImageToCloudinary(odometerPhoto, publicId);
    const imageInfo = {
      secureUrl: imageUrl?.imageInfo?.secure_url,
      publicId: imageUrl?.imageInfo?.public_id,
      format: imageUrl?.imageInfo?.format,
      storageProvider: 'cloudinary',
    };
    return imageInfo;
  };

  const handleChangeEditable = () => {
    setIsEditable((prevState) => !prevState);
  };

  const shouldDisableReservedVehicle = (returnDate: TDate, reservationStatus: TReservationStatus): boolean => {
    const utcCurrentTime = getPickerTimeStringInUtc(dayjs());
    const dayDiff = utcCurrentTime?.formattedTimeDayObj.diff(dayjsUtc(returnDate), 'day');
    const isCancelled: boolean = ['cancelled', 'cancelledByGuest', 'cancelledByHost']?.includes(reservationStatus);

    return isCancelled || dayDiff > 15;
  };

  return {
    handleOdometerUpdate,
    isLoading,
    handleChangeEditable,
    isEditable,
    coverUrl,
    setCoverUrl,
    singleFile,
    setSingleFile,
    deleteFileList,
    setDeleteFileList,
    shouldDisableReservedVehicle,
  };
};

export default useReservedVehicleInfoUpdate;
