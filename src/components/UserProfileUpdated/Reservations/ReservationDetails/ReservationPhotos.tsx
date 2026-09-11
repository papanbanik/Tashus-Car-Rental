'use client';

import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import { deleteFromCloudinary, getFilesByUrls, saveMultipleImageToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import PhotoGuidelinesButton from '@/components/Common/Buttons/PhotoGuidelinesButton';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { usePartnerPickupPhotosSave } from '@/hooks/reservation/usePartnerPickupPhotosSave';
import { usePartnerReturnPhotosSave } from '@/hooks/reservation/usePartnerReturnPhotosSave';
import { TravelStartPhotos } from '@/types/profileInfoTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Button, Typography } from '@mui/material';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface IReservationPhotos {
  uploadType?: 'pickup' | 'return';
}

const ReservationPhotos = () => {
  const router = useRouter();
  // const params = useParams();
  // const reservationId = params['reservation-id'];
  // const guestId = params['host-profile-id'];
  const { userId: guestId, reservationId } = useParams<{ userId: string; reservationId: string }>();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const { control, handleSubmit, watch, reset, setValue, trigger } = useForm<TravelStartPhotos>({
    shouldFocusError: false,
    mode: 'onChange',
  });

  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isPhotoSaving, setIsPhotoSaving] = useState<boolean>(false);
  // const [isUploadConfirm, setIsUploadConfirm] = useState<boolean>(false);

  const { travelDetails, partnerAccess } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  // const { openModal, closeModal } = useModalContext();
  // console.log(travelDetails);

  const { mutateAsync: savePickupPhotos, isLoading } = usePartnerPickupPhotosSave();
  const { mutateAsync: saveReturnPhotos, isLoading: returnIsLoading } = usePartnerReturnPhotosSave();

  useEffect(() => {
    const getUpdatedInfo = async () => {
      const storedPhotoList =
        searchParams.get('view') === 'upload-pickup-photos'
          ? travelDetails?.tripInformation?.partnerInitialConditionPhotos || []
          : searchParams.get('view') === 'upload-return-photos'
          ? travelDetails?.tripInformation?.partnerTravelEndPhotos || []
          : [];

      if (storedPhotoList?.length <= 0) {
        reset();
        return;
      }

      if (storedPhotoList?.length > 0) {
        const { secureUrls, updatedFiles } = await getFilesByUrls(storedPhotoList);

        // console.log('updatedFiles', updatedFiles);
        // console.log('secureUrls', secureUrls);
        setPhotoUrlList(secureUrls);
        setFileList(updatedFiles);
        await setValue('imageUrlList', updatedFiles);
      }
    };
    getUpdatedInfo();
  }, [travelDetails]);

  // useEffect(() => {
  //   if (isUploadConfirm) {
  //     saveToDb(watch('imageUrlList'));
  //   }
  // }, [isUploadConfirm]);

  const commonProps = {
    control,
    photoUrlList,
    fileList,
    setFileList,
    setPhotoUrlList,
    registerName: 'imageUrlList',
    // limit: 20,
    multiple: true,
    setValue,
    trigger,
    deleteFileList,
    setDeleteFileList,
    multipleRequired: false,
    disableDelete: true,
  };

  const onStartReservationPhotoSave: SubmitHandler<TravelStartPhotos> = async (data) => {
    // console.log('onStartReservationPhotoSave', data);
    try {
      await saveToDb(data?.imageUrlList);
      openSnackBar({
        message: 'Photos Saved Successfully',
        severity: 'success',
      });
    } catch (error: any) {
      console.error(error);
      setIsPhotoSaving(false);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Error Saving Photos',
        severity: 'error',
      });
    }
  };

  const saveToDb = async (imageList: Blob[] | undefined) => {
    if (imageList) {
      setIsPhotoSaving(true);
      const newImages = imageList.filter((img) => !(img as any)?.publicId);
      let deleteList = [];
      const publicId =
        view === 'upload-pickup-photos'
          ? `reservations/${reservationId}/partner-travel-start-photos`
          : view === 'upload-return-photos'
          ? `reservations/${reservationId}/partner-travel-end-photos`
          : '';
      try {
        const { imageUrlList, uploadedUrls } = await saveMultipleImageToCloudinary(newImages, publicId);
        deleteList = imageUrlList;
        // console.log(imageUrlList, uploadedUrls);
        view === 'upload-pickup-photos'
          ? await savePickupPhotos({ guestId, imageUrlList, reservationId: parseInt(reservationId) })
          : await saveReturnPhotos({ hostId: guestId, imageUrlList, reservationId: parseInt(reservationId) });
        setPhotoUrlList(uploadedUrls);
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?tab=photos`);
      } catch (error) {
        console.error(error);
        if (typeof deleteList !== 'undefined') {
          await Promise.all(deleteList.map((file: any) => deleteFromCloudinary(file.publicId)));
        }
      } finally {
        setIsPhotoSaving(false);
      }
    }
  };

  const storedPhotoList =
    searchParams.get('view') === 'upload-pickup-photos'
      ? travelDetails?.tripInformation?.partnerInitialConditionPhotos || []
      : searchParams.get('view') === 'upload-return-photos'
      ? travelDetails?.tripInformation?.partnerTravelEndPhotos || []
      : [];

  const disableSaveButton = !watch('imageUrlList') || watch('imageUrlList')?.length === storedPhotoList?.length;

  return (
    <div className="lg:px-24">
      <CommonForm handleFunction={handleSubmit(onStartReservationPhotoSave)}>
        <div className="flex flex-col justify-center items-center w-full mt-4">
          <div className="travel_container">
            <p className="text-xl font-semibold mb-2 capitalize">
              {view === 'upload-pickup-photos'
                ? `Upload vehicle photos ${pathName?.includes('reservations') ? '' : 'before starting travel'} `
                : view === 'upload-return-photos'
                ? `Upload vehicle photos ${pathName?.includes('reservations') ? '' : 'after ending travel'} `
                : ''}
            </p>
            <Typography variant="body2" className="text-justify text-gray-400 italic">
              {view === 'upload-pickup-photos'
                ? `Upload current condition photos of your vehicle ${
                    pathName?.includes('reservations') ? '' : 'prior starting the travel'
                  } . Return condition of the vehicle can be assessed based on the photos you upload now.`
                : view === 'upload-return-photos'
                ? `Upload clear photos of the condition of your vehicle at the end of your travel to ensure accurate documentation and a smooth return process`
                : ''}
            </Typography>

            <PhotoGuidelinesButton></PhotoGuidelinesButton>

            <div className={`grid md:grid-cols-3 grid-cols-2 gap-4 max-h-[4000px]`}>
              <FileUpload2 {...commonProps} />
            </div>

            <div className="flex items-center justify-center my-4">
              <Button
                onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}`)}
                disabled={isLoading}
                className="font-bold italic underline normal-case"
              >
                Skip uploading photos
              </Button>
            </div>
          </div>

          <div className="my-6">
            <Button
              disabled={disableSaveButton || isLoading || returnIsLoading || isPhotoSaving || isPartnerRestrict(partnerAccess)}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="normal-case font-bold text-md"
            >
              {isPhotoSaving ? 'Saving' : 'Save'}
            </Button>
          </div>
        </div>
      </CommonForm>
    </div>
  );
};

export default ReservationPhotos;
