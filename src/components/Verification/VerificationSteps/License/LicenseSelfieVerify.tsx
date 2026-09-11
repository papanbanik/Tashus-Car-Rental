import { saveSingleImageToCloudinary, urlToFile } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import CommonImageUpload from '@/components/Common/Verification/CommonImageUpload';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useLicenseSelfieSave } from '@/hooks/profile/verification-steps/useLicenseSelfieSave';
import { ImageUploadType } from '@/types/profileInfoTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { photoStorageProvider } from '@/utils/Functions/randomCommonFn';
import { Alert, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';

const LicenseSelfieVerify = () => {
  const { partnerAccess, guestAccess, userProfileVerificationInfo } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } = useForm<ImageUploadType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid } = formState;
  const { userCred } = useUserCredContext();
  // const { mutateAsync, isLoading } = useLicenseSelfieSave();
  const { mutateAsync: saveLicenseSelfie, isLoading } = useLicenseSelfieSave();
  // console.log(watch('picture'));
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);
  const { field } = useController({ name: 'picture', control });
  const [selfiePhotoUrl, setSelfiePhotoUrl] = useState<string>('');
  const [singleSelfieFile, setSingleSelfieFile] = useState<File[]>([]);
  // New loading state
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  useEffect(() => {
    const getUpdatedPhotos = async () => {
      if (userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url) {
        const selfieUrl = userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url;
        const parts = selfieUrl.split('/');
        const filename = parts[parts.length - 1];
        const selfiePhotoFile: any = await urlToFile(
          selfieUrl,
          filename,
          `image/${userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.format}`
        );
        setValue('picture', selfiePhotoFile);
        setSelfiePhotoUrl(selfieUrl);
        setSingleSelfieFile([selfiePhotoFile]);
      }
    };
    getUpdatedPhotos();
  }, [userProfileVerificationInfo?.guestVerification]);

  const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const newFile = Object.values(target.files).map((file: File) => file);
    field.onChange(newFile[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setSelfiePhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(newFile[0]);
  };

  // console.log(userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.status);
  //To Disabled on pending status
  // useEffect(() => {
  //   if (
  //     isTimeExpired(userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.createdAt) &&
  //     userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo &&
  //     userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.status === 'pending' &&
  //     isAllVerificationStepsCompleted &&
  //     !verificationFieldFlags?.isDLSelfieIncorrect
  //   ) {
  //     setIsDisableData(true);
  //   } else {
  //     setIsDisableData(false);
  //   }
  // }, [userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace]);

  const onLicenseSelfieSave: SubmitHandler<ImageUploadType> = async (data: any) => {
    setIsButtonLoading(true);
    const status = userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.status;
    try {
      // console.log('onLicenseSelfieSave', data);
      const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(data?.picture, `profile-image/${userCred?.userId}`);
      // console.log(imageUrl);
      // console.log(uploadedUrl);
      userCred?.userId &&
        // (await mutateAsync({
        //   imageInfo: imageUrl?.imageInfo,
        //   storageProvider: imageUrl?.storageProvider ?? photoStorageProvider,
        //   userId: userCred?.userId,
        //   drivingLicenseFaceItemId:
        //     status === 'pending' && isAllVerificationStepsCompleted && !verificationFieldFlags?.isDLSelfieIncorrect
        //       ? userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?._id
        //       : undefined,
        // }));
        (await saveLicenseSelfie({
          drivingLicenseWithFace: {
            imageInfo: imageUrl?.imageInfo,
            storageProvider: imageUrl?.storageProvider ?? photoStorageProvider,
          },
          userId: userCred?.userId,
        }));
      setSelfiePhotoUrl(uploadedUrl);
      setSingleSelfieFile([]);
    } catch (error) {
      console.log('onLicenseSelfieSave error', error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  //Save Button Disable Issue
  const hasDataChanged = (): boolean => {
    // Check if the front image URL is present and compare file names
    const hasSelfieImageChanged = userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url
      ? userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url !== selfiePhotoUrl
      : !!watch('picture');
    return hasSelfieImageChanged;
  };

  return (
    <CommonForm handleFunction={handleSubmit(onLicenseSelfieSave)}>
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
      <CommonImageUpload
        selectedImage={selfiePhotoUrl ?? ''}
        onFileDrop={onFileDrop}
        control={control}
        registerName="picture"
        required={true}
        disabled={isDisabledData}
      />
      {isDisabledData ? (
        <Alert severity="info" className="bg-cyan-100 my-2">
          {`Your request is currently awaiting approval from the support agent`}
        </Alert>
      ) : (
        <>
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
            {isButtonLoading || isLoading ? 'Saving' : 'Save'}
          </Button>
          {/* {isError && <p className="bg-red-200 md:text-sm text-xs text-center p-2 text-error rounded">Error Saving </p>} */}
        </>
      )}
    </CommonForm>
  );
};

export default LicenseSelfieVerify;
