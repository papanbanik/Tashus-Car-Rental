'use client';
import { saveSingleImageToCloudinary, urlToFile } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useLicensePhotoSave } from '@/hooks/profile/verification-steps/useLicensePhotoSave';
import { DriverLicensePhotoType } from '@/types/checkout/secondaryIDCheck';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Alert, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LicenseBackPhoto from './LicenseBackPhoto';
import LicenseFrontPhoto from './LicenseFrontPhoto';

const LicensePhotoVerify = () => {
  const { partnerAccess, guestAccess, userProfileVerificationInfo } = useProfileInfoContext();
  const { control, handleSubmit, formState, setValue, watch } = useForm<DriverLicensePhotoType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid } = formState;
  const { userCred } = useUserCredContext();
  // const { mutateAsync, isLoading, isError } = useDriverLicensePhoto();
  const { mutateAsync: saveLicensePhoto, isLoading, isError } = useLicensePhotoSave();
  const [frontPhotoUrl, setFrontPhotoUrl] = useState<string>('');
  const [singleFrontFile, setSingleFrontFile] = useState<File[]>([]);
  const [backPhotoUrl, setBackPhotoUrl] = useState<string>('');
  const [singleBackFile, setSingleBackFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);

  // New loading state
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const commonUploadProps = {
    control,
    frontPhotoUrl: frontPhotoUrl,
    setFrontPhotoUrl: setFrontPhotoUrl,
    singleFrontFile: singleFrontFile,
    setSingleFrontFile: setSingleFrontFile,
    backPhotoUrl: backPhotoUrl,
    setBackPhotoUrl: setBackPhotoUrl,
    singleBackFile: singleBackFile,
    setSingleBackFile: setSingleBackFile,
    registerName: 'picture',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
    isDisabledData,
  };
  // useEffect(() => {
  //   if (
  //     isTimeExpired(userProfileInfo?.guestVerification?.drivingLicensePhoto?.createdAt) &&
  //     userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo &&
  //     userProfileInfo?.guestVerification?.drivingLicensePhoto?.status === 'pending' &&
  //     isAllVerificationStepsCompleted &&
  //     !verificationFieldFlags?.isDLPhotoIncorrect &&
  //     !verificationFieldFlags?.isDLBackPhotoIncorrect
  //   ) {
  //     setIsDisableData(true);
  //   } else {
  //     setIsDisableData(false);
  //   }
  // }, [userProfileInfo?.guestVerification?.drivingLicensePhoto]);

  useEffect(() => {
    const getUpdatedPhotos = async () => {
      if (userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url) {
        const frontUrl = userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url;
        const parts = frontUrl.split('/');
        const filename = parts[parts.length - 1];
        const frontPhotoFile: any = await urlToFile(
          frontUrl,
          filename,
          `image/${userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.format}`
        );
        setValue('picture', frontPhotoFile);
        setFrontPhotoUrl(frontUrl);
        setSingleFrontFile([frontPhotoFile]);
      }
      if (userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url) {
        const backUrl = userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url;
        const parts = backUrl.split('/');
        const filename = parts[parts.length - 1];
        const backPhotoFile: any = await urlToFile(
          backUrl,
          filename,
          `image/${userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.format}`
        );
        setValue('backPicture', backPhotoFile);
        setBackPhotoUrl(backUrl);
        setSingleBackFile([backPhotoFile]);
      }
    };
    getUpdatedPhotos();
  }, [userProfileVerificationInfo?.guestVerification]);

  //Save Button Disable Issue
  const hasDataChanged = (): boolean => {
    // Check if the front image URL is present and compare file names
    const hasFrontImageChanged = userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url
      ? userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url !== frontPhotoUrl
      : !!watch('picture');

    //Check if the back image URL is present and compare file names
    const hasBackImageChanged = userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url
      ? userProfileVerificationInfo?.guestVerification?.drivingLicensePhotoBackside?.imageInfo?.secure_url !== backPhotoUrl
      : !!watch('backPicture');
    return hasFrontImageChanged || hasBackImageChanged;
  };

  const onDriverLicensePhoto: SubmitHandler<DriverLicensePhotoType> = async (data: any) => {
    setIsButtonLoading(true);
    // const status = userProfileInfo?.guestVerification?.drivingLicensePhoto?.status;
    try {
      const [frontImage, backImage] = await Promise.all([
        saveSingleImageToCloudinary(data?.picture, `profile-image/${userCred?.userId}`),
        data?.backPicture ? saveSingleImageToCloudinary(data?.backPicture, `profile-image/${userCred?.userId}`) : undefined,
      ]);

      userCred?.userId &&
        // (await mutateAsync({
        //   imageInfo: frontImage?.imageUrl?.imageInfo,
        //   storageProvider: frontImage?.imageUrl?.storageProvider ?? photoStorageProvider,
        //   drivingLicensePhotoItemId:
        //     status === 'pending' &&
        //     isAllVerificationStepsCompleted &&
        //     !verificationFieldFlags?.isDLPhotoIncorrect &&
        //     !verificationFieldFlags?.isDLBackPhotoIncorrect
        //       ? userProfileInfo?.guestVerification?.drivingLicensePhoto?._id
        //       : undefined,
        //   ...(backImage && {
        //     drivingLicensePhotoBackside: {
        //       imageInfo: backImage?.imageUrl?.imageInfo,
        //       storageProvider: backImage?.imageUrl?.storageProvider,
        //     },
        //   }),
        //   userId: userCred?.userId,
        // }));
        (await saveLicensePhoto({
          userId: userCred?.userId,
          drivingLicensePhoto: {
            imageInfo: frontImage?.imageUrl?.imageInfo,
            storageProvider: frontImage?.imageUrl?.storageProvider,
          },
          drivingLicensePhotoBackside: {
            imageInfo: backImage?.imageUrl?.imageInfo,
            storageProvider: backImage?.imageUrl?.storageProvider,
          },
        }));
      setFrontPhotoUrl(frontImage?.imageUrl?.imageInfo?.secure_url);
      setSingleFrontFile([]);
      setBackPhotoUrl(backImage?.imageUrl?.imageInfo?.secure_url ?? '');
      setSingleBackFile([]);
    } catch (error) {
      console.log('onDriverLicensePhoto error', error);
    } finally {
      setIsButtonLoading(false);
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
      <LicenseFrontPhoto {...commonUploadProps} />

      {/* For Back Photo */}
      <div className="my-4">
        <LicenseBackPhoto {...commonUploadProps} />
      </div>
      {!isDisabledData ? (
        <div>
          <Button
            variant="contained"
            color="success"
            className="normal-case mt-2"
            type="submit"
            disabled={
              !isValid ||
              isLoading ||
              isButtonLoading ||
              isPartnerRestrict(partnerAccess) ||
              isPartnerSuspended(partnerAccess) ||
              isGuestRestrict(guestAccess) ||
              isGuestSuspended(guestAccess) ||
              !hasDataChanged()
            }
          >
            {isButtonLoading || isLoading ? 'Saving...' : 'Save'}
          </Button>
          {isError && <p className="bg-red-200 md:text-sm text-xs text-center p-2 text-error rounded">Error Saving </p>}
        </div>
      ) : (
        <Alert severity="info" className="bg-cyan-100 my-2">
          {`Your request is currently awaiting approval from the support agent`}
        </Alert>
      )}
    </CommonForm>
  );
};

export default LicensePhotoVerify;
