import { saveSingleImageToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import ImageUploader from '@/components/Common/HookFormFields/ImageUploader';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useLicenseSelfieSave } from '@/hooks/guest-verification/useLicenseSelfieSave';
import { ImageUploadType } from '@/types/profileInfoTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { isTimeExpired, photoStorageProvider } from '@/utils/Functions/randomCommonFn';
import { Alert, Button, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { AiOutlineCamera } from 'react-icons/ai';
import { FiUpload } from 'react-icons/fi';
import SelfieWithLicenseSample from '../../../../../public/Images/Guest-Verification/license-selfie.png';

const LicenseSelfieVerModal = () => {
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } = useForm<ImageUploadType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid } = formState;
  const { userCred, userProfileInfo } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { mutateAsync, isLoading, isSuccess, isError, error } = useLicenseSelfieSave();
  // console.log(watch('picture'));
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | undefined>('');
  const { field } = useController({ name: 'picture', control });

  const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const newFile = Object.values(target.files).map((file: File) => file);
    field.onChange(newFile[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedProfileImage(reader.result as string);
    };
    reader.readAsDataURL(newFile[0]);
  };

  // console.log(userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status);
  //To Disabled on pending status
  useEffect(() => {
    if (
      isTimeExpired(userProfileInfo?.guestVerification?.drivingLicenseWithFace?.createdAt) &&
      userProfileInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo &&
      userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status === 'pending'
    ) {
      setIsDisableData(true);
    } else {
      setIsDisableData(false);
    }
  }, [userProfileInfo?.guestVerification?.drivingLicenseWithFace]);

  const onLicenseSelfieSave: SubmitHandler<ImageUploadType> = async (data: any) => {
    const status = userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status;
    try {
      // console.log('onLicenseSelfieSave', data);
      const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(data?.picture, `profile-image/${userCred?.userId}`);
      // console.log(imageUrl);
      // console.log(uploadedUrl);
      userCred?.userId &&
        (await mutateAsync({
          imageInfo: imageUrl?.imageInfo,
          storageProvider: imageUrl?.storageProvider ?? photoStorageProvider,
          userId: userCred?.userId,
          drivingLicenseFaceItemId: status === 'pending' ? userProfileInfo?.guestVerification?.drivingLicenseWithFace?._id : undefined,
        }));
      isSuccess && closeModal();
    } catch (error) {
      console.log('onLicenseSelfieSave error', error);
    }
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
      <div className="md:flex gap-8 w-full">
        <div className="md:w-1/2 w-full">
          <div className="w-full relative h-48">
            <Image
              src={SelfieWithLicenseSample}
              // src="/Images/Guest-Verification/license-selfie.png"
              alt="cover-photo"
              style={{ objectFit: 'cover' }}
              className="rounded-lg z-0"
              fill={true}
            ></Image>
          </div>
          <p className="text-center mt-2">Sample Photo</p>
        </div>

        <div className="md:w-1/2 w-full">
          {selectedProfileImage ? (
            <div className="flex flex-col justify-center items-center w-full">
              <div className={`relative h-48 w-full`}>
                <Image src={selectedProfileImage} alt="cover-photo" className="rounded-lg" style={{ objectFit: 'cover' }} fill={true}></Image>
                <div className="w-full h-8 absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10 rounded-full flex justify-center items-center gap-4">
                  <Tooltip enterTouchDelay={0} title="Replace" placement="top">
                    <IconButton size="large" className="bg-gray-400">
                      <AiOutlineCamera className="text-lg" />
                      <ImageUploader
                        control={control}
                        registerName="picture"
                        onChangeFn={onFileDrop}
                        multiple={false}
                        required={true}
                        disabled={isDisabledData}
                      ></ImageUploader>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              {!isDisabledData && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    className="md:mt-6 mt-10"
                    type="submit"
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
                </>
              )}
            </div>
          ) : (
            <Button variant="outlined" size="large" className="flex flex-col gap-2 justify-center items-center w-full md:h-48 h-32">
              <FiUpload size={20} />
              <span>Upload</span>
              <ImageUploader
                control={control}
                registerName="picture"
                onChangeFn={onFileDrop}
                multiple={false}
                required={true}
                disabled={isDisabledData}
              />
            </Button>
          )}
        </div>
      </div>
      {isDisabledData && (
        <Alert severity="info" className="bg-cyan-100">
          {`Your request is currently awaiting approval from the support agent`}
        </Alert>
      )}
    </CommonForm>
  );
};

export default LicenseSelfieVerModal;
