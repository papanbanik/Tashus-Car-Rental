'use client';

import {
  deleteFromCloudinary,
  getFilesByUrls,
  saveMultipleImageToCloudinary,
  saveSingleImageToCloudinary,
} from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGuestReturnPhotosSave } from '@/hooks/travel/useGuestReturnPhotosSave';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { TEndingInfoByGuest, useTravelEndByGuest } from '@/hooks/travel/useTravelEndByGuest';
import { TravelStartPhotos } from '@/types/profileInfoTypes';
import Button from '@mui/material/Button/Button';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import EndTravelPhotos from './EndTravelPhotos';
import EndTravelQueries from './EndTravelQueries';
import EndTravelReview from './EndTravelReview';

export type TEndQueries = {
  // isCarCheckedByGuest: boolean;
  isCarParkedByGuest: boolean;
  isCarLockedByGuest: boolean;
  isAnythingLeftChecked: boolean;
  isKeyReturnedByGuest: boolean;
};

const EndTravel = () => {
  const router = useRouter();
  const pathName = usePathname();
  // const params = useParams();
  // const guestId = guestId;
  // const reservationId = reservationId;
  const { userId: guestId, travelId: reservationId } = useParams<{ userId: string; travelId: string }>();
  const searchParams = useSearchParams(); //parking, photos, queries
  const endView = searchParams.get('view');

  const methods = useForm<TravelStartPhotos>({
    shouldFocusError: false,
    mode: 'onChange',
  });

  const { watch, handleSubmit } = methods;

  const { mutateAsync, isLoading } = useTravelEndByGuest();
  const { mutateAsync: saveGuestReturnPhotos } = useGuestReturnPhotosSave();

  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [saveUrlList, setSaveUrlList] = useState<any[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [disableNext, setDisableNext] = useState<boolean>(false);
  const [endQueries, setEndQueries] = useState<TEndQueries>({
    isCarParkedByGuest: false,
    isCarLockedByGuest: false,
    isAnythingLeftChecked: false,
    isKeyReturnedByGuest: false,
  });
  const [endOdometer, setEndOdometer] = useState<number | undefined>(undefined);
  // const [endQueries, setEndQueries] = useState<TEndQueries>({
  //   isCarCheckedByGuest: false,
  // });
  const [isPhotoSaving, setIsPhotoSaving] = useState<boolean>(false);
  // const [isUploadConfirm, setIsUploadConfirm] = useState<boolean>(false);

  const { data } = useTravelDetails();

  const { travelDetails } = useProfileInfoContext();
  // const { openModal, closeModal } = useModalContext();
  const { updatedTravelData } = useTravelContext();
  const { redirectToReview } = useReviewRatingContext();
  // console.log(travelDetails);

  useEffect(() => {
    const getUpdatedInfo = async () => {
      const storedPhotoList = travelDetails?.tripInformation?.guestTravelEndPhotos || [];

      if (storedPhotoList?.length <= 0) {
        methods.reset();
        return;
      }

      if (storedPhotoList?.length > 0) {
        const { secureUrls, updatedFiles } = await getFilesByUrls(storedPhotoList);

        // console.log('updatedFiles', updatedFiles);
        // console.log('secureUrls', secureUrls);
        setPhotoUrlList(secureUrls);
        setFileList(updatedFiles);
        await methods.setValue('imageUrlList', updatedFiles);
      }
    };
    getUpdatedInfo();
  }, [travelDetails]);

  // useEffect(() => {
  //   if (isUploadConfirm) {
  //     saveToDb(methods.watch('imageUrlList'));
  //   }
  // }, [isUploadConfirm]);

  useEffect(() => {
    // if (searchParams.get('view') === 'parking') {
    //   endQueries.isCarParkedByGuest ? setDisableNext(false) : setDisableNext(true);
    // }
    if (searchParams.get('view') === 'queries') {
      Object.values(endQueries).includes(false) ? setDisableNext(true) : setDisableNext(false);
    }
  }, [endQueries, searchParams.get('view')]);

  const handleTravelView = async (redirectType: string) => {
    // if (endView === 'parking') {
    //   router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=photos`);
    // }
    if (endView === 'photos') {
      updatedTravelData?.travelType === 'past'
        ? router.push(
            `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${guestId}/travels/${
              pathName?.includes('details-new') ? 'details-new' : 'details'
            }/${reservationId}?view=travel-photos`
          )
        : router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=queries`);
    }
    if (endView === 'queries') {
      let endingInfoByGuest: TEndingInfoByGuest = { ...endQueries };
      if (saveUrlList?.length > 0) {
        endingInfoByGuest = { ...endQueries, imageUrlList: saveUrlList };
      }
      let imageInfo;
      const odometerPhoto = watch('odometerPhoto');
      if (odometerPhoto) {
        imageInfo = await uploadOdometerPhoto(odometerPhoto);
      }
      endingInfoByGuest.endTravelOdometer = { ...(imageInfo && { imageInfo }), ...(endOdometer && { odometerValue: endOdometer }) };
      await mutateAsync({ reservationId: parseInt(reservationId), endingInfoByGuest });
      setIsPhotoSaving(false);
      redirectToReview(reservationId, guestId);
      // router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/profile/${guestId}/travels/details/${reservationId}`); //redirect to review page
    }
  };

  const saveToDb = async (imageList: Blob[] | undefined) => {
    if (imageList) {
      setIsPhotoSaving(true);
      const newImages = imageList.filter((img) => !(img as any)?.publicId);
      let deleteList = [];
      const publicId = `reservations/${reservationId}/guest-travel-end-photos`;
      try {
        const { imageUrlList, uploadedUrls } = await saveMultipleImageToCloudinary(newImages, publicId);
        deleteList = imageUrlList;
        setPhotoUrlList(uploadedUrls);
        setSaveUrlList(imageUrlList);
        if (updatedTravelData?.travelType === 'past') {
          await saveGuestReturnPhotos({ guestId, imageUrlList, reservationId: parseInt(reservationId) });
        }
        handleTravelView('next');
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

  const uploadOdometerPhoto = async (odometerPhoto: Blob) => {
    setIsPhotoSaving(true);
    const publicId = `reservations/${reservationId}`;
    const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(odometerPhoto, publicId);
    const imageInfo = {
      secureUrl: imageUrl?.imageInfo?.secure_url,
      publicId: imageUrl?.imageInfo?.public_id,
      format: imageUrl?.imageInfo?.format,
      storageProvider: 'cloudinary',
    };
    return imageInfo;
  };

  const handlePhotoSaveToCloudinary: SubmitHandler<TravelStartPhotos> = async (data) => {
    try {
      // console.log('handlePhotoSaveToCloudinary', data);
      const { imageUrlList } = data;
      if (!imageUrlList) {
        handleTravelView('next');
      } else {
        await saveToDb(imageUrlList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disablePhotoSaveButton =
    !methods.watch('imageUrlList') || methods.watch('imageUrlList')?.length === travelDetails?.tripInformation?.guestTravelEndPhotos?.length;

  const isOdometerInvalid: boolean = Number(endOdometer ?? 0) < 0 || Number(endOdometer ?? 0) > 300000000;

  console.log(watch('odometerPhoto'));

  return (
    <CommonForm handleFunction={handleSubmit(handlePhotoSaveToCloudinary)}>
      <div className="w-full flex flex-col items-center">
        {/* {endView === 'parking' && <EndTravelParking endQueries={endQueries} setEndQueries={setEndQueries}></EndTravelParking>} */}
        {endView === 'photos' && (
          <FormProvider {...methods}>
            <EndTravelPhotos
              photoUrlList={photoUrlList}
              setPhotoUrlList={setPhotoUrlList}
              fileList={fileList}
              setFileList={setFileList}
              deleteFileList={deleteFileList}
              setDeleteFileList={setDeleteFileList}
              handlePhotoSkip={handleTravelView}
              disableSkip={isPhotoSaving}
              endQueries={endQueries}
            ></EndTravelPhotos>
          </FormProvider>
        )}
        {endView === 'queries' && (
          <FormProvider {...methods}>
            <EndTravelQueries
              endQueries={endQueries}
              setEndQueries={setEndQueries}
              returnInformation={travelDetails?.carInfo?.guidelines?.returnInformation}
              endOdometer={endOdometer}
              setEndOdometer={setEndOdometer}
              isOdometerInvalid={isOdometerInvalid}
            ></EndTravelQueries>
          </FormProvider>
        )}
        {endView === 'review' && <EndTravelReview></EndTravelReview>}

        <div className="flex items-center gap-4 mt-8">
          {/* {endView !== 'parking' && updatedTravelData?.travelType !== 'past' && ( */}
          {endView !== 'photos' && updatedTravelData?.travelType !== 'past' && (
            // <Button variant="outlined" className="w-28" onClick={() => handleTravelView('previous')}>
            <Button variant="outlined" className="w-28 normal-case" onClick={() => router.back()} disabled={isPhotoSaving}>
              Previous
            </Button>
          )}

          {endView === 'photos' && (
            <Button disabled={disablePhotoSaveButton || isLoading || isPhotoSaving} type="submit" variant="contained" className="w-28 normal-case">
              {updatedTravelData?.travelType === 'past' && !isPhotoSaving && 'Save'}
              {updatedTravelData?.travelType !== 'past' && !isPhotoSaving && 'Next'}
              {isPhotoSaving && 'Uploading'}
            </Button>
          )}

          {endView !== 'photos' && updatedTravelData?.travelType !== 'past' && (
            <Button
              disabled={disableNext || isLoading || isOdometerInvalid || isPhotoSaving}
              variant="contained"
              className="normal-case"
              onClick={() => handleTravelView('next')}
            >
              {isLoading || isPhotoSaving ? 'Saving' : 'End Travel'}
            </Button>
          )}
        </div>
      </div>
    </CommonForm>
  );
};

export default EndTravel;
