import { saveSingleImageToCloudinary, urlToFile } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
// import { useProfilePhotoSave } from '@/hooks/guest-verification/useProfilePhotoSave';
import { useProfilePhotoSave } from '@/hooks/profile/verification-steps/useProfilePhotoSave';
import { ImageUploadType } from '@/types/profileInfoTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { photoStorageProvider } from '@/utils/Functions/randomCommonFn';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ProfilePhoto from './ProfilePhoto';

const ProfilePhotoVerify = () => {
  const { partnerAccess, guestAccess, userProfileVerificationInfo } = useProfileInfoContext();
  const { control, handleSubmit, watch, formState, setValue } = useForm<ImageUploadType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid } = formState;
  const { userCred } = useUserCredContext();
  // const { mutateAsync, isLoading } = useProfilePhotoSave();
  const { mutateAsync: saveProfilePhoto, isLoading } = useProfilePhotoSave();

  //Photo
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);

  // New loading state
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const commonUploadProps = {
    control,
    photoUrl: profileUrl,
    singleFile,
    setSingleFile,
    setPhotoUrl: setProfileUrl,
    registerName: 'picture',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
  };

  const onProfilePhotoSave: SubmitHandler<ImageUploadType> = async (data: any) => {
    setIsButtonLoading(true);
    try {
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
      setProfileUrl(uploadedUrl);
      setSingleFile([]);
    } catch (error: any) {
      console.log('onProfilePhotoSave error', error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  useEffect(() => {
    const getUpdatedPhotos = async () => {
      if (!!userProfileVerificationInfo?.profileInfo?.picture?.imageInfo?.secure_url) {
        const profileUrl = userProfileVerificationInfo?.profileInfo?.picture?.imageInfo?.secure_url;
        const parts = profileUrl.split('/');
        const filename = parts[parts.length - 1];
        const profilePhotoFile: any = await urlToFile(
          profileUrl,
          filename,
          `image/${userProfileVerificationInfo?.profileInfo?.picture?.imageInfo?.format}`
        );
        setValue('picture', profilePhotoFile);
        setProfileUrl(userProfileVerificationInfo?.profileInfo?.picture?.imageInfo?.secure_url);
        setSingleFile([profilePhotoFile]);
      }
    };
    getUpdatedPhotos();
  }, [userProfileVerificationInfo?.profileInfo?.picture]);

  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (!!userProfileVerificationInfo?.profileInfo?.picture?.imageInfo) {
      // const profilePhotoImage = profileImage ? profileImage?.name : '';
      // const watchedPictureName = watch('picture') ? (watch('picture') as File)?.name : '';
      const profilePhotoImage = userProfileVerificationInfo?.profileInfo?.picture?.imageInfo?.secure_url ?? '';
      const watchedPictureName = profileUrl ?? '';
      return profilePhotoImage !== watchedPictureName;
    }
    return true;
  };

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
      {/* For Profile Photo */}
      <ProfilePhoto {...commonUploadProps} />
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
    </CommonForm>
  );
};

export default ProfilePhotoVerify;
