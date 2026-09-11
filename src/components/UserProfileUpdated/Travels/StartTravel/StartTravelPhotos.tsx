'use client';

import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import { deleteFromCloudinary, getFilesByUrls, saveMultipleImageToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import PhotoGuidelinesButton from '@/components/Common/Buttons/PhotoGuidelinesButton';
import CommonForm from '@/components/Common/CommonForm';
import CommonSnackBar from '@/components/Common/CommonSnackBar';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useStartTravelPhotos } from '@/hooks/travel/start-travel/useStartTravelPhotos';
import { TravelStartPhotos } from '@/types/profileInfoTypes';
import { Button, Typography } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const StartTravelPhotos = () => {
  const router = useRouter();
  // const params = useParams();
  // const reservationId = params['travel-id'];
  // const guestId = params['host-profile-id'];
  const { userId: guestId, travelId: reservationId } = useParams<{ userId: string; travelId: string }>();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, setError, clearErrors, trigger } =
    useForm<TravelStartPhotos>({
      shouldFocusError: false,
      mode: 'onChange',
    });
  const pathName = usePathname();

  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isPhotoSaving, setIsPhotoSaving] = useState<boolean>(false);
  // const [isUploadConfirm, setIsUploadConfirm] = useState<boolean>(false);

  const { travelDetails, isUploading } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  // const { openModal, closeModal } = useModalContext();
  // console.log(travelDetails);

  const { mutateAsync: saveStartTravelPhotos, isSuccess, isError, error, isLoading } = useStartTravelPhotos();

  useEffect(() => {
    const getUpdatedInfo = async () => {
      const storedPhotoList = travelDetails?.tripInformation?.guestInitialConditionPhotos || [];

      if (storedPhotoList?.length <= 0) {
        reset();
        return;
      }

      if (storedPhotoList?.length > 0) {
        const { secureUrls, updatedFiles } = await getFilesByUrls(storedPhotoList);

        setPhotoUrlList(secureUrls);
        setFileList(updatedFiles);
        await setValue('imageUrlList', updatedFiles);
      }
    };
    getUpdatedInfo();
  }, [travelDetails]);

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

  const saveToDb = async (imageList: Blob[] | undefined) => {
    if (imageList) {
      setIsPhotoSaving(true);
      const newImages = imageList.filter((img) => !(img as any)?.publicId);
      let deleteList = [];
      try {
        const { imageUrlList, uploadedUrls } = await saveMultipleImageToCloudinary(
          newImages,
          `reservations/${reservationId}/guest-travel-start-photos`
        );
        deleteList = imageUrlList;
        await saveStartTravelPhotos({ guestId, imageUrlList, reservationId: parseInt(reservationId) });
        setPhotoUrlList(uploadedUrls);
        router.push(
          `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${guestId}/travels/${
            pathName?.includes('details-new') ? 'details-new' : 'details'
          }/${reservationId}?tab=photos`
        );
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

  const onStartTravelPhotoSave: SubmitHandler<TravelStartPhotos> = async (data) => {
    // console.log('onStartTravelPhotoSave', data);
    try {
      await saveToDb(data?.imageUrlList);
      openSnackBar({
        message: 'Travel Photos Saved Successfully',
        severity: 'success',
      });
      // openModal({
      //   content: (
      //     <ConfirmationCheck
      //       title="Are you sure to upload photos?"
      //       subTitle="Please be informed that uploaded photos cannot be removed later"
      //       agreeButtonText="Yes"
      //       disagreeButtonText="No"
      //       agreeButtonAction={handleConfirmation}
      //       disagreeButtonAction={closeModal}
      //     ></ConfirmationCheck>
      //   ),
      // });
    } catch (error: any) {
      console.error(error);
      setIsPhotoSaving(false);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Error Saving Travel Photos',
        severity: 'error',
      });
    }
  };

  // console.log(watch('imageUrlList'));
  // console.log(fileList);

  const disableSaveButton =
    !watch('imageUrlList') || watch('imageUrlList')?.length === travelDetails?.tripInformation?.guestInitialConditionPhotos?.length;

  return (
    <div>
      <CommonForm handleFunction={handleSubmit(onStartTravelPhotoSave)}>
        <div className="flex flex-col justify-center items-center w-full mt-4">
          <div className="travel_container">
            <p className="text-xl font-semibold mb-2 capitalize">{'Upload vehicle photos before starting your travel'}</p>
            <Typography variant="body2" className="text-justify text-gray-400 italic">
              {
                "Upload current condition photos of the vehicle. Please note that the return condition of the vehicle will be assessed based on the photos you upload now. You can be liable of damages when you return if you don't have photos taken prior to start travel"
              }
            </Typography>

            <PhotoGuidelinesButton></PhotoGuidelinesButton>

            <div className={`grid md:grid-cols-3 grid-cols-2 gap-4 max-h-[4000px]`}>
              <FileUpload2 {...commonProps} />
            </div>

            <div className="flex items-center justify-center my-4">
              <Button
                onClick={() =>
                  router.push(
                    `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${guestId}/travels/details/${reservationId}`
                    // `${process.env.NEXT_PUBLIC_DOMAIN}/profile/${params['host-profile-id']}/travels/${params['travels-type']}/${params['travel-id']}`
                  )
                }
                disabled={isLoading}
                className="font-bold italic underline normal-case"
              >
                Skip uploading photos
              </Button>
            </div>
          </div>

          <div className="my-6">
            <Button
              disabled={disableSaveButton || isLoading || isPhotoSaving}
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

      <CommonSnackBar
        open={isSuccess || isError}
        autoHideDuration={isError ? 8000 : 5000}
        message={
          isSuccess ? 'Travel Photos Saved Successfully' : `${error?.response?.data?.message || error?.message || 'Error Saving Travel Photos'}`
        }
        severity={isSuccess ? 'success' : 'error'}
      />
    </div>
  );
};

export default StartTravelPhotos;
