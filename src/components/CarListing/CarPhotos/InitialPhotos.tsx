import CommonForm from '@/components/Common/CommonForm';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useSaveInitialPhotos } from '@/hooks/car-listing/useCarPhotos';
import { CarInitialPhotosValues } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SectionHeader from '../SectionHeader';
import FileUpload2 from './FileUpload';
import { deleteFromCloudinary, getFilesByUrls, saveImageListToCloudinary } from './photosCommonFn';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
import CommonWarningAlert from './CommonWarningAlert';

const InitialPhotos = () => {
  const { partnerAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, setError, clearErrors, trigger } =
    useForm<CarInitialPhotosValues>({
      shouldFocusError: false,
      mode: 'onChange',
    });
  const [open, setOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isShowWarningMsg, setIsShowWarningMsg] = useState<boolean>(false);

  const { listingId, isUploading, setIsUploading, carData, getUpdatedSteps, handleSaveCurrentStep } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();
  const { mutateAsync: saveCarInitialPhotos, isError, isSuccess, error } = useSaveInitialPhotos();

  const watchedPhotos = watch('initialPhotosUrl');

  useEffect(() => {
    const hasPhotos = watchedPhotos && watchedPhotos.length > 0;
    setIsShowWarningMsg(!hasPhotos);
  }, [watchedPhotos]);

  useEffect(() => {
    const getUpdatedInfo = async () => {
      if (!listingId || !carData) {
        reset();
        return;
      }

      const { photos } = carData;
      if (!photos?.initialConditionPhotos) {
        reset();
        return;
      }
      // console.log('photos', photos);

      const { initialConditionPhotos } = photos;

      const { secureUrls, updatedFiles } = await getFilesByUrls(initialConditionPhotos);

      // console.log('updatedFiles', updatedFiles);
      // console.log('secureUrls', secureUrls);
      setPhotoUrlList(secureUrls);
      setFileList(updatedFiles);
      await setValue('initialPhotosUrl', updatedFiles);
    };
    getUpdatedInfo();
  }, [listingId, carData?.photos?.initialConditionPhotos]);

  const handleOpen = (photoUrlOrIndex: string | number) => {
    if (typeof photoUrlOrIndex === 'number') {
      setCurrentIndex(photoUrlOrIndex);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const commonProps = {
    control,
    photoUrlList,
    fileList,
    setFileList,
    setPhotoUrlList,
    registerName: 'initialPhotosUrl',
    limit: 40,
    multiple: true,
    setValue,
    trigger,
    deleteFileList,
    setDeleteFileList,
    multipleRequired: true,
    handleOpen,
  };

  const onInitialPhotoSave: SubmitHandler<CarInitialPhotosValues> = async (data) => {
    // console.log('car photos data', data);
    setIsUploading({ ...isUploading, initialPhotos: true });
    // @ts-ignore
    try {
      const { imageUrlList, uploadedUrls } = await saveImageListToCloudinary(data?.initialPhotosUrl, listingId);
      // const shouldStepSave = !!(carData?.photos?.coverPhoto && carData?.photos?.additionalPhotos?.length > 0);
      const shouldStepSave = !!(
        carData?.photos?.coverPhoto &&
        carData?.photos?.additionalPhotos?.length > 0 &&
        carData?.photos?.vehicleInspectionPhotos?.length > 0
      ); //Inspection Photo
      const tempSteps = shouldStepSave ? await getUpdatedSteps(6) : [];
      await saveCarInitialPhotos({ listingId, imageUrlList, listingSteps: tempSteps });
      await Promise.all(deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId)));
      setPhotoUrlList(uploadedUrls);
      const { updatedFiles } = await getFilesByUrls(imageUrlList);
      // console.log(uploadedUrls);
      // console.log(fileList);
      // console.log(updatedFiles);
      setFileList(updatedFiles);
      setValue('initialPhotosUrl', updatedFiles, { shouldValidate: true });
      setIsUploading({ ...isUploading, initialPhotos: false });
      openSnackBar({
        message: 'Initial Photos Saved Successfully',
        severity: 'success',
        hideDuration: 4000,
      });

      shouldStepSave ? handleSaveCurrentStep(6, parseInt(listingId)) : '';
    } catch (error: any) {
      console.error(error);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Error Saving Initial Photos',
        severity: 'error',
      });
      setIsUploading({ ...isUploading, initialPhotos: false });
    }
  };

  // console.log(watch('initialPhotosUrl'));
  // console.log(photoUrlList);
  // console.log(fileList);

  const isNewImage =
    watch('initialPhotosUrl')?.some((photo) => !photo?.publicId) ||
    carData?.photos?.initialConditionPhotos?.length !== watch('initialPhotosUrl')?.length;

  return (
    <div>
      <SectionHeader title="Initial Condition Photos" subtitle="Max 40 Photos"></SectionHeader>

      <CommonForm handleFunction={handleSubmit(onInitialPhotoSave)}>
        {/* Warning Alert */}
        <CommonWarningAlert
          isShow={isShowWarningMsg}
          title="You must upload at least one initial condition photo to continue. Please add a photo before saving."
        />
        <div className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 max-h-[7000px]`}>
          <FileUpload2 {...commonProps} />
        </div>
        <div className="flex justify-center md:mt-8 mt-4 md:mb-12 mb-8">
          <Button
            disabled={
              !formState?.isValid ||
              isUploading?.additionalPhotos ||
              isUploading?.coverPhoto ||
              isUploading?.initialPhotos ||
              !isNewImage ||
              isPartnerRestrict(partnerAccess) ||
              isShowWarningMsg
            }
            type="submit"
            variant="contained"
            color="primary"
          >
            {isUploading?.initialPhotos ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>
      <UpdatedCommonImgZoomInOutModal
        open={open}
        handleClose={handleClose}
        modalImageSrc={photoUrlList[currentIndex]}
        imageList={photoUrlList}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
};

export default InitialPhotos;
