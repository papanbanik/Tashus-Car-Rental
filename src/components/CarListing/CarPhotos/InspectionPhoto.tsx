import CommonForm from '@/components/Common/CommonForm';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useSaveCarInspectionPhoto } from '@/hooks/car-listing/useCarPhotos';
import { CarInspectionPhotosValues } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoHelpCircleOutline } from 'react-icons/io5';
import FileUpload2 from './FileUpload';
import InspectionInstruction from './InspectionInstruction';
import { deleteFromCloudinary, getCloudinaryPublicId, getOriginalHeightWidth, minimizeSize, urlToFile } from './photosCommonFn';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
const InspectionPhoto = () => {
  const { partnerAccess } = useProfileInfoContext();
  const { control, handleSubmit, watch, formState, reset, setValue, setError, clearErrors, trigger } = useForm<CarInspectionPhotosValues>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const [open, setOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const { openSnackBar } = useSnackBarContext();
  const { listingId, isUploading, setIsUploading, getUpdatedSteps, carData, handleSaveCurrentStep } = useCarListingContext();
  const { userCred } = useUserCredContext();
  const { mutateAsync: saveInspectionPhoto } = useSaveCarInspectionPhoto();
  //   console.log(carData);
  const { openModal } = useModalContext();
  // useEffect(() => {
  //   const getUpdatedInfo = async () => {
  //     if (!listingId || !carData) {
  //       reset();
  //       return;
  //     }
  //     const { photos } = carData;
  //     if (!photos?.vehicleInspectionPhotos) {
  //       reset();
  //       return;
  //     }
  //     //   console.log(carData);
  //     //   console.log(photos?.vehicleInspectionPhotos);
  //     //   console.log(photos?.vehicleInspectionPhotos[photos?.vehicleInspectionPhotos.length - 1]);
  //     const { vehicleInspectionPhotos } = photos;
  //     //   console.log(vehicleInspectionPhotos);
  //     //   console.log(vehicleInspectionPhotos[vehicleInspectionPhotos.length - 1]);
  //     const latestPhoto = vehicleInspectionPhotos[vehicleInspectionPhotos.length - 1];
  //     const url = latestPhoto?.imageInfo?.secure_url;
  //     //   console.log(latestPhoto?.imageInfo?.secure_url);
  //     //   console.log(url);
  //     const parts = url.split('/');
  //     const filename = parts[parts.length - 1]; //get the last string after /
  //     const inspectionFile: any = await urlToFile(url, filename, `image/${latestPhoto?.format}`);
  //     inspectionFile.publicId = latestPhoto?.imageInfo?.public_id;
  //     setCoverUrl(latestPhoto?.imageInfo?.secure_url);
  //     setSingleFile([inspectionFile]);
  //   };
  //   getUpdatedInfo();
  // }, [listingId, carData?.photos?.inspectionPhoto]);
  useEffect(() => {
    const getUpdatedInfo = async () => {
      if (!listingId || !carData) {
        reset();
        return;
      }
      const { photos } = carData;
      // console.log(photos);
      if (!photos || !photos.vehicleInspectionPhotos) {
        reset();
        return;
      }
      const { vehicleInspectionPhotos } = photos;
      // console.log(vehicleInspectionPhotos);
      if (!vehicleInspectionPhotos || vehicleInspectionPhotos?.length === 0) {
        reset();
        return;
      }
      const latestPhoto = vehicleInspectionPhotos[vehicleInspectionPhotos?.length - 1]; //last index photo
      if (!latestPhoto || !latestPhoto.imageInfo || !latestPhoto.imageInfo.secure_url) {
        reset();
        return;
      }
      const url = latestPhoto?.imageInfo?.secure_url;
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const inspectionFile: any = await urlToFile(url, filename, `image/${latestPhoto?.imageInfo?.format}`);
      inspectionFile.publicId = latestPhoto?.imageInfo?.public_id;

      setCoverUrl(latestPhoto?.imageInfo?.secure_url);
      setSingleFile([inspectionFile]);
    };

    getUpdatedInfo();
  }, [listingId, carData?.photos?.vehicleInspectionPhotos]);

  const handleOpen = (photoUrlOrIndex: string | number) => {
    if (typeof photoUrlOrIndex === 'string') {
      setModalImageSrc(photoUrlOrIndex);
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const commonProps = {
    control,
    coverUrl,
    singleFile,
    setSingleFile,
    setCoverUrl,
    registerName: 'inspectionPhotoUrl',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
    singleRequired: true,
    setValue,
    disableDelete: true,
    handleOpen,
  };

  const onInspectionPhotoSave: SubmitHandler<CarInspectionPhotosValues> = async (data) => {
    // console.log('car photos data', data);
    setIsUploading({ ...isUploading, inspectionPhoto: true });
    try {
      const { originalWidth, originalHeight } = await getOriginalHeightWidth(data?.inspectionPhotoUrl);
      // @ts-ignore
      const resizedImage: Blob = await minimizeSize(data?.inspectionPhotoUrl);
      deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId));
      // console.log('check', originalWidth, originalHeight);
      // console.log('resizedImage', resizedImage);
      const tempPhotoName: string = data?.inspectionPhotoUrl?.name;
      const formData = new FormData();
      formData.append('file', resizedImage);
      formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);
      const uniquePublicId = getCloudinaryPublicId(`listing-photos/${listingId}`, tempPhotoName);
      formData.append('public_id', uniquePublicId);
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      console.log(response);
      if (response?.status === 200) {
        const imageInfo = {
          //   public_id: response?.data?.public_id,
          //   secure_url: response?.data?.secure_url,
          //   format: response?.data?.format,
          //   bytes:response?.data?.format
          //   originalWidth,
          //   originalHeight,
          imageInfo: {
            public_id: response?.data?.public_id,
            secure_url: response?.data?.secure_url,
            format: response?.data?.format,
            bytes: response?.data?.format,
            originalWidth,
            originalHeight,
          },
          storageProvider: 'cloudinary',
        };
        setCoverUrl(response?.data?.secure_url);
        setSingleFile([]);
        const shouldStepSave: boolean = !!(
          carData?.photos?.initialConditionPhotos?.length > 0 &&
          carData?.photos?.additionalPhotos?.length > 0 &&
          carData?.photos?.coverPhoto
        );
        // console.log(shouldStepSave);
        const tempSteps = shouldStepSave ? await getUpdatedSteps(6) : [];
        await saveInspectionPhoto({ listingId, hostId: userCred?.userId, imageUrlList: [imageInfo], listingSteps: tempSteps });
        // await deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId)); //Delete Disabled
        openSnackBar({
          message: 'Inspection Photo Saved Successfully',
          severity: 'success',
          hideDuration: 4000,
        });
        shouldStepSave ? handleSaveCurrentStep(6, parseInt(listingId)) : '';
        setIsUploading({ ...isUploading, inspectionPhoto: false });
      }
    } catch (error) {
      console.error(error);
      openSnackBar({
        message: 'Error Saving Inspection Photo',
        severity: 'error',
      });
      setIsUploading({ ...isUploading, inspectionPhoto: false });
    }
  };
  const handleHelp = () => {
    openModal({
      content: <InspectionInstruction />,
      title: 'Inspection Report Instructions',
    });
  };
  return (
    <div>
      <Typography className="font-semibold md:text-2xl text-xl text-left">
        Inspection Photo <IoHelpCircleOutline onClick={handleHelp} className=" text-primary cursor-pointer" />
      </Typography>
      <Typography className="md:text-sm text-sm font-thin text-gray-400 italic text-left mb-6">
        {`Welcome to our vehicle inspection reporting system! Ensuring the accurate documentation of any damages found on your vehicle is crucial to maintaining its condition and ensuring a smooth experience for all users.
To report damages, please download our Inspection Report Form by clicking`}{' '}
        <Link target="_blank" href={'/help/vehicle-inspection'} className="text-primary inline-block no-underline font-bold italic">
          here.
        </Link>
        {`This form is essential for listing any scratches, dents, or issues you identify during your inspections.`}{' '}
        {/* <IoHelpCircleOutline onClick={handleHelp} className=" text-primary cursor-pointer" size={16} /> */}
      </Typography>
      <CommonForm handleFunction={handleSubmit(onInspectionPhotoSave)}>
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
              isUploading?.inspectionPhoto ||
              //@ts-ignore
              singleFile[0]?.publicId ||
              isPartnerRestrict(partnerAccess)
            }
            type="submit"
            variant="contained"
            color="primary"
          >
            {isUploading?.inspectionPhoto && commonProps?.registerName === 'inspectionPhotoUrl' ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>
      <UpdatedCommonImgZoomInOutModal handleClose={handleClose} open={open} modalImageSrc={modalImageSrc} />
    </div>
  );
};

export default InspectionPhoto;
