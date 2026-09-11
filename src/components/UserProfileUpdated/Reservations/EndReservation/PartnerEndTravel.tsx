// const PartnerEndTravel = () => {
//   return <div>PartnerEndTravel</div>;
// };

// export default PartnerEndTravel;
'use client';

import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import { saveSingleImageToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonForm from '@/components/Common/CommonForm';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useModalContext } from '@/context/ModalProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { usePartnerEndReservation } from '@/hooks/reservation/end-reservation/usePartnerEndReservation';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type TPartnerReservationEnd = {
  carKeyReceived: boolean;
  odometerValue?: number;
  odometerPhoto?: Blob | File;
};

const PartnerEndTravel = ({ refetch }: { refetch: () => void }) => {
  const { control, handleSubmit, formState, setValue } = useForm<TPartnerReservationEnd>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid, errors } = formState;
  const { mutateAsync: partnerTravelEnd, isLoading } = usePartnerEndReservation();
  const [endOdometer, setEndOdometer] = useState<number | undefined>(undefined);
  const { closeModal } = useModalContext();
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const { userId: hostId, reservationId } = useParams<{ userId: string; reservationId: string }>();
  const { redirectToReview } = useReviewRatingContext();
  const handleOdometerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setEndOdometer(value);
  };
  const isOdometerInvalid: boolean = Number(endOdometer ?? 0) < 0 || Number(endOdometer ?? 0) > 300000000;
  const commonProps = {
    control,
    coverUrl,
    singleFile,
    setSingleFile,
    setCoverUrl,
    registerName: 'odometerPhoto',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
    singleRequired: false,
    setValue,
  };
  const uploadOdometerPhoto = async (odometerPhoto: Blob) => {
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

  const handleEndReservation: SubmitHandler<TPartnerReservationEnd> = async (data) => {
    try {
      const { carKeyReceived, odometerPhoto } = data;
      let imageInfo;
      if (odometerPhoto) {
        imageInfo = await uploadOdometerPhoto(odometerPhoto);
      }
      await partnerTravelEnd({
        reservationId: parseInt(reservationId),
        carKeyReceived,
        endTravelOdometer: {
          odometerValue: endOdometer ?? 0,
          odometerPhoto: imageInfo,
        },
      });
      refetch();
      redirectToReview(reservationId, hostId);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={'/UserProfile/Travels/Key.svg'} alt="Key" height={150} width={150} />
      <span className="helping_text text-center">
        {"Kindly confirm that you have received the vehicle's keys upon the completion of the travel. Your acknowledgment is greatly appreciated."}
      </span>
      <CommonForm handleFunction={handleSubmit(handleEndReservation)}>
        <div className="font-bold text-lg my-4 w-full">
          <CheckBox control={control} registerName="carKeyReceived" label="I have received the key" required={true} />
        </div>
        <div>
          <p className="text-xl font-semibold mb-2">Odometer</p>
          <Typography>Please provide the current odometer reading</Typography>
          <div className="mt-2">
            <TextField
              size="small"
              className="p-0 md:w-1/2 w-full"
              label="Odometer Value"
              type="number"
              value={endOdometer}
              onChange={handleOdometerChange}
              error={isOdometerInvalid}
              helperText={<span className="text-error">{isOdometerInvalid ? 'Provide valid odometer reading' : ''}</span>}
              sx={{
                '& .MuiOutlinedInput-root': {
                  paddingRight: 0,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment className="bg-gray-200 px-2 m-0 h-10 rounded-e-md max-h-10" position="end">
                    <p>KM</p>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <p className="text-xl font-semibold mb-2">Upload Odometer Photo</p>
          <Typography>Upload the picture of the odometer reading of the vehicle</Typography>
          <div className={`grid grid-cols-4 gap-4 max-h-96`}>
            <FileUpload2 {...commonProps} />
          </div>
        </div>
        <Button disabled={!isValid || isLoading} type="submit" variant="contained" color="primary" fullWidth className="my-4 normal-case font-bold">
          {isLoading ? 'Saving' : 'Save'}
        </Button>
      </CommonForm>
    </div>
  );
};

export default PartnerEndTravel;
