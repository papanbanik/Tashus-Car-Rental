import CommonForm from '@/components/Common/CommonForm';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useSaveAdditionalPhotos } from '@/hooks/car-listing/useCarPhotos';
import { CarAdditionalPhotosValues } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Box, Button, CircularProgress, CircularProgressProps, LinearProgress, LinearProgressProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SectionHeader from '../SectionHeader';
import FileUpload2 from './FileUpload';
import { deleteFromCloudinary, getFilesByUrls, saveImageListToCloudinary } from './photosCommonFn';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
import CommonWarningAlert from './CommonWarningAlert';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const AdditionalPhotos = () => {
  const { partnerAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, setError, clearErrors, trigger } =
    useForm<CarAdditionalPhotosValues>({
      shouldFocusError: false,
      mode: 'onChange',
    });
  const [open, setOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isShowWarningMsg, setIsShowWarningMsg] = useState<boolean>(false);

  const { listingId, isUploading, setIsUploading, carData, getUpdatedSteps, handleSaveCurrentStep } = useCarListingContext();
  const { openSnackBar } = useSnackBarContext();

  const { mutateAsync: saveCarAdditionalPhotos, isSuccess, isError, error } = useSaveAdditionalPhotos();

  const watchedPhotos = watch('additionalPhotosUrl');

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
      if (!photos?.additionalPhotos) {
        reset();
        return;
      }
      // console.log('photos', photos);

      const { additionalPhotos } = photos;
      const { secureUrls, updatedFiles } = await getFilesByUrls(additionalPhotos);

      // console.log('updatedFiles', updatedFiles);
      // console.log('secureUrls', secureUrls);
      setPhotoUrlList(secureUrls);
      setFileList(updatedFiles);
      await setValue('additionalPhotosUrl', updatedFiles);
    };
    getUpdatedInfo();
  }, [listingId, carData?.photos?.additionalPhotos]);

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
    registerName: 'additionalPhotosUrl',
    limit: 20,
    multiple: true,
    setValue,
    trigger,
    deleteFileList,
    setDeleteFileList,
    multipleRequired: true,
    handleOpen,
  };

  const onAdditionalPhotoSave: SubmitHandler<CarAdditionalPhotosValues> = async (data) => {
    // console.log('car photos data', data);
    // console.log('deleteFileList', deleteFileList);
    setIsUploading({ ...isUploading, additionalPhotos: true });
    try {
      const { imageUrlList, uploadedUrls } = await saveImageListToCloudinary(data?.additionalPhotosUrl, listingId);
      // const { imageUrlList, uploadedUrls } = await saveImageListToCloudinary(data?.additionalPhotosUrl, listingId, setUploadProgress);
      // console.log('Uploaded URLs:', uploadedUrls);
      // const shouldStepSave = !!(carData?.photos?.coverPhoto && carData?.photos?.initialConditionPhotos?.length > 0);
      const shouldStepSave = !!(
        carData?.photos?.coverPhoto &&
        carData?.photos?.initialConditionPhotos?.length > 0 &&
        carData?.photos?.vehicleInspectionPhotos?.length > 0
      ); //Inspection Photo
      const tempSteps = shouldStepSave ? await getUpdatedSteps(6) : [];
      await saveCarAdditionalPhotos({ listingId, imageUrlList, listingSteps: tempSteps });
      await Promise.all(deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId)));

      console.log(uploadedUrls);
      console.log(fileList);
      setPhotoUrlList(uploadedUrls);
      const { updatedFiles } = await getFilesByUrls(imageUrlList);
      setFileList(updatedFiles);
      setValue('additionalPhotosUrl', updatedFiles, { shouldValidate: true });
      setIsUploading({ ...isUploading, additionalPhotos: false });
      shouldStepSave ? handleSaveCurrentStep(6, parseInt(listingId)) : '';
      openSnackBar({
        message: 'Additional Photos Saved Successfully',
        severity: 'success',
        hideDuration: 4000,
      });

      setUploadProgress(0);
    } catch (error: any) {
      console.error('onAdditionalPhotoSave error', error);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Error Saving Additional Photos',
        severity: 'error',
      });
      setUploadProgress(0);
      setIsUploading({ ...isUploading, additionalPhotos: false });
    }
  };

  // console.log(watch('additionalPhotosUrl'));
  // console.log(photoUrlList);
  // console.log(fileList);

  const isNewImage =
    watch('additionalPhotosUrl')?.some((photo) => !photo?.publicId) ||
    carData?.photos?.additionalPhotos?.length !== watch('additionalPhotosUrl')?.length;

  return (
    <div>
      <SectionHeader title="Additional Photos" subtitle="Max 20 Photos"></SectionHeader>

      <CommonForm handleFunction={handleSubmit(onAdditionalPhotoSave)}>
        {/* Warning Alert */}
        <CommonWarningAlert
          isShow={isShowWarningMsg}
          title="You must upload at least one additional photo to continue. Please add a photo before saving."
        />

        <div className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 max-h-[4000px]`}>
          <FileUpload2 {...commonProps} />
        </div>

        {/* <div className="flex justify-between items-center mt-8 w-full">
          <LinearProgressWithLabel value={uploadProgress} />
          <LinearProgress value={uploadProgress} color="primary" />
          <Typography variant="body2" color="text.secondary">
            {uploadProgress}
          </Typography>
        </div> */}

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
            {isUploading?.additionalPhotos && commonProps?.registerName === 'additionalPhotosUrl' ? 'Saving' : 'Save'}
          </Button>
        </div>

        {/* <div className="flex justify-center md:mt-8 mt-4 md:mb-12 mb-8">
          {isUploading?.additionalPhotos ? (
            <CircularProgressWithLabel value={uploadProgress} />
          ) : (
            <Button
              disabled={
                !formState?.isValid || !formState?.isDirty || isUploading?.additionalPhotos || isUploading?.coverPhoto || isUploading?.initialPhotos
              }
              type="submit"
              variant="contained"
              color="primary"
            >
              {isUploading?.additionalPhotos && commonProps?.registerName === 'additionalPhotosUrl' ? 'Saving' : 'Save'}
            </Button>
          )}
        </div> */}
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

export default AdditionalPhotos;
