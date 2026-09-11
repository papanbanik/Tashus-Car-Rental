'use client';
import { saveSingleImageToCloudinary, urlToFile } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useDriverLicensePhoto } from '@/hooks/guest-verification/useDriverLicensePhoto';
import { DriverLicensePhotoType } from '@/types/checkout/secondaryIDCheck';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { isTimeExpired, photoStorageProvider } from '@/utils/Functions/randomCommonFn';
import { Alert, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import DLBackPhoto from './DLBackPhoto';
import DLFrontPhoto from './DLFrontPhoto';

const DriverLicenseVerModal = () => {
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } =
    useForm<DriverLicensePhotoType>({
      shouldFocusError: false,
      mode: 'onChange',
    });
  const { isValid } = formState;
  const { userCred, userProfileInfo } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { mutateAsync, isLoading, isSuccess, isError, error } = useDriverLicensePhoto();
  const [profileUrl, setProfileUrl] = useState('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);
  const commonUploadProps = {
    control,
    profileUrl,
    singleFile,
    setSingleFile,
    setProfileUrl,
    registerName: 'picture',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
  };

  // console.log(userProfileInfo?.guestVerification?.drivingLicensePhoto?.status);
  //To Disabled on pending status
  useEffect(() => {
    if (
      isTimeExpired(userProfileInfo?.guestVerification?.drivingLicensePhoto?.createdAt) &&
      userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo &&
      userProfileInfo?.guestVerification?.drivingLicensePhoto?.status === 'pending'
    ) {
      setIsDisableData(true);
    } else {
      setIsDisableData(false);
    }
  }, [userProfileInfo?.guestVerification?.drivingLicensePhoto]);

  useEffect(() => {
    const getUpdatedPhotos = async () => {
      if (userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url) {
        const frontUrl = userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url;
        const parts = frontUrl.split('/');
        const filename = parts[parts.length - 1];
        const frontPhotoFile: any = await urlToFile(
          frontUrl,
          filename,
          `image/${userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.format}`
        );
        setValue('picture', frontPhotoFile);
        // console.log(frontPhotoFile);
      }
      if (userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url) {
        const backUrl = userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url;
        const parts = backUrl.split('/');
        const filename = parts[parts.length - 1];
        const backPhotoFile: any = await urlToFile(
          backUrl,
          filename,
          `image/${userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.format}`
        );
        setValue('backPicture', backPhotoFile);
        // console.log(backPhotoFile);
      }
    };
    getUpdatedPhotos();
  }, [userProfileInfo?.guestVerification]);

  const onDriverLicensePhoto: SubmitHandler<DriverLicensePhotoType> = async (data: any) => {
    // console.log('onDriverLicensePhoto', data);
    const status = userProfileInfo?.guestVerification?.drivingLicensePhoto?.status;
    try {
      const [frontImage, backImage] = await Promise.all([
        saveSingleImageToCloudinary(data?.picture, `profile-image/${userCred?.userId}`),
        // saveSingleImageToCloudinary(data?.backPicture, `profile-image/${userCred?.userId}`),
        data?.backPicture ? saveSingleImageToCloudinary(data?.backPicture, `profile-image/${userCred?.userId}`) : undefined,
      ]);

      userCred?.userId &&
        (await mutateAsync({
          imageInfo: frontImage?.imageUrl?.imageInfo,
          storageProvider: frontImage?.imageUrl?.storageProvider ?? photoStorageProvider,
          drivingLicensePhotoItemId: status === 'pending' ? userProfileInfo?.guestVerification?.drivingLicensePhoto?._id : undefined,
          // drivingLicensePhotoBackside: {
          //   imageInfo: backImage?.imageUrl?.imageInfo,
          //   storageProvider: backImage?.imageUrl?.storageProvider,
          // },
          ...(backImage && {
            drivingLicensePhotoBackside: {
              imageInfo: backImage?.imageUrl?.imageInfo,
              storageProvider: backImage?.imageUrl?.storageProvider,
            },
          }),
          userId: userCred?.userId,
        }));

      isSuccess && closeModal();
    } catch (error) {
      console.error('onDriverLicensePhoto error', error);
    }
  };

  return (
    <CommonForm handleFunction={handleSubmit(onDriverLicensePhoto)}>
      {isPartnerRestrict(partnerAccess) && isGuestRestrict(guestAccess) ? (
        <CommonAccStatusAlert isPartner={true} isGuest={true} isRestrict={true} />
      ) : (
        <>
          {isPartnerRestrict(partnerAccess) && <CommonAccStatusAlert isPartner={true} isRestrict={true} />}
          {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
        </>
      )}
      {isPartnerSuspended(partnerAccess) && isGuestSuspended(guestAccess) ? (
        <CommonAccStatusAlert isPartner={true} isGuest={true} isSuspend={true} />
      ) : (
        <>
          {isPartnerSuspended(partnerAccess) && <CommonAccStatusAlert isPartner={true} isSuspend={true} />}
          {isGuestSuspended(guestAccess) && <CommonAccStatusAlert isGuest={true} isSuspend={true} />}
        </>
      )}
      {/* For Front Photo */}
      <DLFrontPhoto {...commonUploadProps} isDisabledData={isDisabledData} />

      {/* For Back Photo */}
      <DLBackPhoto {...commonUploadProps} isDisabledData={isDisabledData} />
      {!isDisabledData ? (
        <div className="flex justify-center col-span-12 p-0">
          <Button
            variant="contained"
            color="success"
            className="md:mt-6 mt-10"
            type="submit"
            // disabled={!watch('picture') || isLoading || isSuccess}
            disabled={
              !isValid ||
              isLoading ||
              isSuccess ||
              isPartnerRestrict(partnerAccess) ||
              isPartnerSuspended(partnerAccess) ||
              isGuestRestrict(guestAccess) ||
              isGuestSuspended(guestAccess)
            }
          >
            {isLoading ? 'Saving' : isSuccess ? 'Saved' : 'Save'}
          </Button>
          {isError && <p className="bg-red-200 md:text-sm text-xs text-center p-2 text-error rounded">Error Saving </p>}
        </div>
      ) : (
        <Alert severity="info" className="bg-cyan-100">
          {`Your request is currently awaiting approval from the support agent`}
        </Alert>
      )}
    </CommonForm>
  );
};

export default DriverLicenseVerModal;
