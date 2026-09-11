import CommonForm from '@/components/Common/CommonForm';
import CommonSnackBar from '@/components/Common/CommonSnackBar';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSaveCarCoverPhoto } from '@/hooks/car-listing/useCarPhotos';
import { CarCoverPhotosValues } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SectionHeader from '../SectionHeader';
import FileUpload2 from './FileUpload';
import { deleteFromCloudinary, getCloudinaryPublicId, getOriginalHeightWidth, minimizeSize, urlToFile } from './photosCommonFn';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
import CommonWarningAlert from './CommonWarningAlert';

const CoverPhoto = () => {
  const { partnerAccess } = useProfileInfoContext();
  const { control, handleSubmit, formState, reset, setValue } = useForm<CarCoverPhotosValues>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const [open, setOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isShowWarningMsg, setIsShowWarningMsg] = useState<boolean>(false);

  const { listingId, isUploading, setIsUploading, getUpdatedSteps, carData, handleSaveCurrentStep } = useCarListingContext();

  const { mutateAsync: saveCoverPhoto, isError, isSuccess, error } = useSaveCarCoverPhoto();

  const handleOpen = (photoUrlOrIndex: string | number) => {
    if (typeof photoUrlOrIndex === 'string') {
      setModalImageSrc(photoUrlOrIndex);
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const getUpdatedInfo = async () => {
      if (!listingId || !carData) {
        reset();
        return;
      }

      const { photos } = carData;
      if (!photos?.coverPhoto) {
        reset();
        return;
      }

      const { coverPhoto } = photos;
      const url = coverPhoto?.imageInfo?.secure_url;
      const parts = url.split('/');
      const filename = parts[parts.length - 1]; //get the last string after /
      const coverFile: any = await urlToFile(url, filename, `image/${coverPhoto?.imageInfo?.format}`);
      coverFile.publicId = coverPhoto?.imageInfo?.public_id;
      setCoverUrl(coverPhoto?.imageInfo?.secure_url);
      setSingleFile([coverFile]);
    };
    getUpdatedInfo();
  }, [listingId, carData?.photos?.coverPhoto]);

  useEffect(() => {
    const hasPhoto = singleFile && singleFile.length === 0;
    setIsShowWarningMsg(hasPhoto);
  }, [singleFile]);

  const commonProps = {
    control,
    coverUrl,
    singleFile,
    setSingleFile,
    setCoverUrl,
    registerName: 'coverPhotoUrl',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
    singleRequired: true,
    setValue,
    handleOpen,
  };

  const onCoverPhotoSave: SubmitHandler<CarCoverPhotosValues> = async (data) => {
    // console.log('car photos data', data);
    setIsUploading({ ...isUploading, coverPhoto: true });
    try {
      const { originalWidth, originalHeight } = await getOriginalHeightWidth(data?.coverPhotoUrl);
      // @ts-ignore
      const resizedImage: Blob = await minimizeSize(data?.coverPhotoUrl);
      deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId));
      // console.log('check', originalWidth, originalHeight);
      // console.log('resizedImage', resizedImage);
      const tempPhotoName: string = data?.coverPhotoUrl?.name;
      const formData = new FormData();
      formData.append('file', resizedImage);
      formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);
      const uniquePublicId = getCloudinaryPublicId(`listing-photos/${listingId}`, tempPhotoName);
      formData.append('public_id', uniquePublicId);
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      // console.log(response);
      if (response?.status === 200) {
        const imageInfo = {
          public_id: response?.data?.public_id,
          secure_url: response?.data?.secure_url,
          format: response?.data?.format,
          bytes: response?.data?.bytes,
          originalWidth,
          originalHeight,
        };
        setCoverUrl(response?.data?.secure_url);
        setSingleFile([]);
        const shouldStepSave: boolean = !!(
          carData?.photos?.initialConditionPhotos?.length > 0 &&
          carData?.photos?.additionalPhotos?.length > 0 &&
          carData?.photos?.vehicleInspectionPhotos?.length > 0
        ); //Inspection Photo
        // console.log(shouldStepSave);
        const tempSteps = shouldStepSave ? await getUpdatedSteps(6) : [];
        await saveCoverPhoto({ listingId, imageInfo, listingSteps: tempSteps });
        shouldStepSave ? handleSaveCurrentStep(6, parseInt(listingId)) : '';
        setIsUploading({ ...isUploading, coverPhoto: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <SectionHeader title="Featured Photo"></SectionHeader>

      <CommonForm handleFunction={handleSubmit(onCoverPhotoSave)}>
        {/* Warning Alert */}
        <CommonWarningAlert isShow={isShowWarningMsg} title="Please upload a feature photo before saving. A feature photo is required." />

        <div className={`grid grid-cols-4 gap-4 max-h-96`}>
          <FileUpload2 {...commonProps} />
        </div>
        <div className="flex justify-center md:mt-8 mt-4 md:mb-12 mb-8">
          <Button
            disabled={
              !formState?.isValid ||
              isUploading?.additionalPhotos ||
              isUploading?.coverPhoto ||
              isUploading?.initialPhotos ||
              //@ts-ignore
              singleFile[0]?.publicId ||
              isPartnerRestrict(partnerAccess) ||
              isShowWarningMsg
            }
            type="submit"
            variant="contained"
            color="primary"
          >
            {isUploading?.coverPhoto && commonProps?.registerName === 'coverPhotoUrl' ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>

      <CommonSnackBar
        open={isSuccess || isError}
        autoHideDuration={isError ? 8000 : 5000}
        message={isSuccess ? 'Cover Photo Saved Successfully' : `${error?.response?.data?.message || error?.message || 'Error Saving Cover Photo'}`}
        severity={isSuccess ? 'success' : 'error'}
      ></CommonSnackBar>

      <UpdatedCommonImgZoomInOutModal handleClose={handleClose} open={open} modalImageSrc={modalImageSrc} />
    </div>
  );
};

export default CoverPhoto;
