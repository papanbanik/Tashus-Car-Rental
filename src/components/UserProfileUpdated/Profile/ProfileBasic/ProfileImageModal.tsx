import { saveSingleImageToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import ImageUploader from '@/components/Common/HookFormFields/ImageUploader';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useProfilePhotoSave } from '@/hooks/profile/verification-steps/useProfilePhotoSave';
import { ImageUploadType } from '@/types/profileInfoTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { photoStorageProvider } from '@/utils/Functions/randomCommonFn';
import { Button, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { AiOutlineCamera } from 'react-icons/ai';
import { FiUpload } from 'react-icons/fi';

const ProfileImageModal = () => {
  const { control, handleSubmit, watch, formState } = useForm<ImageUploadType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid } = formState;
  const { userCred } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { setVerificationAlertMessage, verificationAlertMessage } = useSearchContext();
  // const { mutateAsync, isLoading, isSuccess, isError, error } = useProfilePhotoSave();
  const { mutateAsync: saveProfilePhoto, isLoading, isSuccess, isError } = useProfilePhotoSave();
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | undefined>('');
  const { field } = useController({ name: 'picture', control });
  // New loading state
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

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

  const onProfilePhotoSave: SubmitHandler<ImageUploadType> = async (data: any) => {
    setIsButtonLoading(true);
    try {
      // console.log('onProfilePhotoSave', data);
      const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(data?.picture, `profile-image/${userCred?.userId}`);
      userCred?.userId &&
        // (await mutateAsync({
        //   imageInfo: imageUrl?.imageInfo,
        //   storageProvider: imageUrl?.storageProvider ?? photoStorageProvider,
        //   userId: userCred?.userId,
        // }));
        (await saveProfilePhoto({
          profilePhoto: {
            imageInfo: imageUrl?.imageInfo,
            storageProvider: imageUrl?.storageProvider ?? photoStorageProvider,
          },
          userId: userCred?.userId,
        }));
      // console.log(isSuccess);
      closeModal();
    } catch (error: any) {
      console.log('onProfilePhotoSave error', error);
      const errorText = error?.response?.status === 401 ? error?.response?.statusText : error?.response?.data?.messages;
      setVerificationAlertMessage({ messageType: 'error', message: errorText });
    } finally {
      setIsButtonLoading(false);
    }
  };
  const helpingText =
    'Please note that your profile picture is public. Do not upload sensitive documents, such as licenses or other personal identification, as your profile picture.';
  return (
    <CommonForm handleFunction={handleSubmit(onProfilePhotoSave)}>
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
      <div className="md:flex gap-8 w-full justify-center items-start">
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center">
          <div className="relative h-48 w-48 rounded-full flex justify-center items-center bg-error">
            <Image
              src="/Images/Guest-Verification/profile-image.png"
              alt="cover-photo"
              style={{ objectFit: 'cover' }}
              className="rounded-full"
              fill={true}
            ></Image>
          </div>
          <p className="mt-2">Sample Photo</p>
        </div>

        <div className="md:w-1/2 w-full">
          {selectedProfileImage ? (
            <div className="flex flex-col justify-center items-center">
              <div className={`relative h-48 w-48 rounded-full`}>
                <Image src={selectedProfileImage} alt="cover-photo" className="rounded-full" style={{ objectFit: 'cover' }} fill={true}></Image>
                {/* <Avatar
                    src={selectedProfileImage}
                    className="bg-error"
                    alt="Profile Photo"
                    sx={{ width: 100, height: 100, borderRadius: '50%', border: '1px solid gray' }}
                  /> */}
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
                      ></ImageUploader>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <Button
                variant="contained"
                className="mt-6 normal-case"
                type="submit"
                disabled={
                  !isValid ||
                  isLoading ||
                  isButtonLoading ||
                  isSuccess ||
                  isPartnerRestrict(partnerAccess) ||
                  isPartnerSuspended(partnerAccess) ||
                  isGuestRestrict(guestAccess) ||
                  isGuestSuspended(guestAccess)
                }
              >
                {isButtonLoading || isLoading ? 'Saving' : isSuccess ? 'Saved' : 'Save'}
              </Button>
              {isError && (
                <p className="bg-red-200 md:text-sm text-xs text-center p-2 text-error rounded">
                  {verificationAlertMessage?.message ?? 'Error Saving'}
                </p>
              )}
            </div>
          ) : (
            <Button
              variant="outlined"
              size="large"
              className="flex flex-col gap-2 justify-center items-center md:w-48 w-full md:h-48 h-32 rounded-full"
            >
              <FiUpload size={20} />
              <span>Upload</span>
              <ImageUploader control={control} registerName="picture" onChangeFn={onFileDrop} multiple={false} required={true} />
            </Button>
          )}
        </div>
      </div>
      {!!helpingText && <span className="font-bold text-sm text-error text-justify">{helpingText}</span>}
    </CommonForm>
  );
};

export default ProfileImageModal;
