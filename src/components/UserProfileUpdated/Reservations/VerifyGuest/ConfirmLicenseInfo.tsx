import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import { getFilesByUrls, saveMultipleImageToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonForm from '@/components/Common/CommonForm';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TPutTGuestLicenseInfoByPartner, useConfirmGuestLicenseInfo } from '@/hooks/reservation/useConfirmGuestLicenseInfo';
import { TFormVerifyGuestInfo } from '@/types/reservations/typeReservationsActions';
import Alert from '@mui/material/Alert/Alert';
import Button from '@mui/material/Button/Button';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const ConfirmLicenseInfo = () => {
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, setError, clearErrors, trigger } =
    useForm<TFormVerifyGuestInfo>({
      shouldFocusError: false,
      mode: 'onChange',
    });

  const { isValid } = formState;

  const router = useRouter();
  const pathName = usePathname();
  // const reservationId = params['reservation-id'];
  const { reservationId } = useParams<{ reservationId: string }>();
  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isPhotoSaving, setIsPhotoSaving] = useState<boolean>(false);
  // const [isUploadConfirm, setIsUploadConfirm] = useState<boolean>(false);

  // const { openModal, closeModal } = useModalContext();
  const { travelDetails } = useProfileInfoContext();
  const { verifyGuestInfoByPartner, setVerifyGuestInfoByPartner } = useTravelContext();

  const { mutateAsync, isLoading } = useConfirmGuestLicenseInfo();
  // console.log(verifyGuestInfoByPartner);

  const handleImagesRequired = () => {
    const matched = verifyGuestInfoByPartner?.guestLicenseVerificationConfirmation?.isLicenseInfoMatched;
    const filteredFileList = fileList?.filter((file: any) => !file?.publicId);
    return matched && filteredFileList?.length === 0;
  };

  const commonProps = {
    control,
    photoUrlList,
    fileList,
    setFileList,
    setPhotoUrlList,
    registerName: 'licenseImagesByPartner',
    limit: 10,
    multiple: true,
    setValue,
    trigger,
    deleteFileList,
    setDeleteFileList,
    multipleRequired: verifyGuestInfoByPartner?.guestLicenseVerificationConfirmation?.isLicenseInfoMatched ? true : false,
    disableDelete: true,
  };

  // useEffect(() => {
  //   if (isUploadConfirm) {
  //     saveToDb();
  //   }
  // }, [isUploadConfirm]);

  useEffect(() => {
    setFileList([]);
    setPhotoUrlList([]);
    setDeleteFileList([]);
    setIsPhotoSaving(false);
    // setIsUploadConfirm(false);
    reset();
  }, []);

  // If partner once verified driving license match, then set form value true as it is updating in db each time photo uploaded
  useEffect(() => {
    const imageList = verifyGuestInfoByPartner?.guestLicenseVerificationConfirmation?.licenseImagesByPartner;
    if (verifyGuestInfoByPartner?.guestLicenseVerificationConfirmation?.isLicenseInfoMatched) {
      setValue('isLicenseInfoMatched', true);
    }
    if (imageList && imageList?.length > 0) {
      getUploadedImages(imageList);
    }
  }, [verifyGuestInfoByPartner]);

  const getUploadedImages = async (imageList: any[]) => {
    if (imageList?.length > 0) {
      const { secureUrls, updatedFiles } = await getFilesByUrls(imageList);

      // console.log('updatedFiles', updatedFiles);
      // console.log('secureUrls', secureUrls);
      setPhotoUrlList(secureUrls);
      setFileList(updatedFiles);
      await setValue('licenseImagesByPartner', updatedFiles);
    }
  };

  // const handleConfirmation = () => {
  //   setIsUploadConfirm(true);
  //   closeModal();
  // };

  const saveToDb = async () => {
    try {
      setIsPhotoSaving(true);

      const imageList = watch('licenseImagesByPartner');
      const isLicenseInfoMatched = watch('isLicenseInfoMatched');

      let verificationInfoByPartner: TPutTGuestLicenseInfoByPartner = {
        isLicenseInfoMatched,
        guestId: travelDetails?.guestId,
      };

      if (imageList) {
        const { imageUrlList, uploadedUrls } = await saveMultipleImageToCloudinary(
          imageList,
          `reservations/${reservationId}/license-verification-photos`
        );
        verificationInfoByPartner.licenseImagesByPartner = imageUrlList;
        // console.log(imageUrlList, uploadedUrls);
        // await saveStartTravelPhotos({ guestId, imageUrlList, reservationId: parseInt(reservationId) });
        // await deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId));
        // setPhotoUrlList(uploadedUrls);

        // setIsUploadConfirm(false);
      }
      await mutateAsync({ reservationId, verificationInfoByPartner });
      setIsPhotoSaving(false);
      router.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}`);
    } catch (error) {
      console.log('Guest License confirmation by partner error ', error);
    }
  };

  const onVerifyGuestLicenseInfoSave: SubmitHandler<TFormVerifyGuestInfo> = async (data) => {
    try {
      // console.log('onVerifyGuestLicenseInfoSave', data);
      await saveToDb();
      // const { licenseImagesByPartner } = data;
      // openModal({
      //   content: (
      //     <ConfirmationCheck
      //       title="Are you sure to save?"
      //       subTitle={licenseImagesByPartner ? 'Please be informed that uploaded photos cannot be removed later' : ''}
      //       agreeButtonText="Yes"
      //       disagreeButtonText="No"
      //       agreeButtonAction={handleConfirmation}
      //       disagreeButtonAction={closeModal}
      //     ></ConfirmationCheck>
      //   ),
      // });
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(fileList);
  // console.log(photoUrlList);
  // console.log(deleteFileList);
  // console.log(watch('licenseImagesByPartner'));

  return (
    <CommonForm handleFunction={handleSubmit(onVerifyGuestLicenseInfoSave)}>
      <div className="lg:mt-12">
        <p className="text-xl font-bold mb-0">Verify Guest Driver License Information</p>
        <p className="helping_text mb-4">
          {
            "Please verify that the driver license information provided in the guest's profile accurately corresponds to their official driver's license. You may upload photos of guest's driver license as a part of verification process"
          }
        </p>

        {verifyGuestInfoByPartner?.guestLicenseVerificationConfirmation?.isLicenseInfoMatched ? (
          <Alert severity="success" className="bg-lime-100">
            You have already verified driving license information of guest
          </Alert>
        ) : (
          <CheckBox
            control={control}
            registerName="isLicenseInfoMatched"
            label="I confirm the accuracy of the provided driving license information"
            required={true}
          />
        )}

        <div className={`grid md:grid-cols-3 grid-cols-2 gap-4 max-h-[4000px] mt-6`}>
          <FileUpload2 {...commonProps} />
        </div>
      </div>
      <div className="my-6 flex justify-center items-center">
        <Button
          disabled={!isValid || isPhotoSaving || handleImagesRequired()}
          type="submit"
          variant="contained"
          color="primary"
          className="normal-case font-bold text-md"
        >
          {isPhotoSaving ? 'Saving' : 'Save'}
        </Button>
      </div>
    </CommonForm>
  );
};

export default ConfirmLicenseInfo;
