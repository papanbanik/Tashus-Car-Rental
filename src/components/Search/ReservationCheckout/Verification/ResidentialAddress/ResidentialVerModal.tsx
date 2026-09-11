'use client';
import { saveSingleImageToCloudinary, urlToFile } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useAddressVerification } from '@/hooks/guest-verification/useAddressVerification';
import { ResidentialAddressInfoType } from '@/types/user-verification/userVerificationTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { isTimeExpired } from '@/utils/Functions/randomCommonFn';
import { Alert, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ResidentialAddressInfo from './ResidentialAddressInfo';
import UtilityPhotoUpload from './UtilityPhotoUpload';

const ResidentialVerModal = () => {
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<ResidentialAddressInfoType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { errors, isValid } = formState;
  const { userCred, userProfileInfo } = useUserCredContext();
  const { mutateAsync, isLoading, isSuccess } = useAddressVerification();

  //Photo
  const [profileUrl, setProfileUrl] = useState('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);
  const [shouldReset, setShouldReset] = useState<Boolean>(false);
  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
  };
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
  // console.log(userProfileInfo?.guestVerification?.residentialAddress?.createdAt);
  // console.log(
  //   isTimeExpired(userProfileInfo?.guestVerification?.residentialAddress?.createdAt) &&
  //     userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo &&
  //     userProfileInfo?.guestVerification?.residentialAddress?.status === 'pending'
  // );
  useEffect(() => {
    if (
      isTimeExpired(userProfileInfo?.guestVerification?.residentialAddress?.createdAt) &&
      userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo &&
      userProfileInfo?.guestVerification?.residentialAddress?.status === 'pending'
    ) {
      setIsDisableData(true);
    } else {
      setIsDisableData(false);
    }
  }, [userProfileInfo?.guestVerification?.residentialAddress]);

  //To get photo upload url
  useEffect(() => {
    const getUpdatedPhoto = async () => {
      if (userProfileInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url) {
        const url = userProfileInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url;
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const residentialFile: any = await urlToFile(
          url,
          filename,
          `image/${userProfileInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.format}`
        );
        // console.log(residentialFile);
        setValue('picture', residentialFile);
      }
    };
    getUpdatedPhoto();
  }, [userProfileInfo?.guestVerification?.residentialAddress]);

  //API call and request body pass
  const onResidentialAddressSave: SubmitHandler<ResidentialAddressInfoType> = async (data) => {
    // console.log(data);
    const unitNumber = data?.residentialAddressInfo?.unitNumber === '' ? undefined : data?.residentialAddressInfo?.unitNumber;
    try {
      const shouldIncludeProofOfAddress = data?.picture !== undefined;
      let imageInfo: { public_id?: string; secure_url?: string; format?: string } = {};
      let imageDetails: { storageProvider?: string } = {};
      const status = userProfileInfo?.guestVerification?.residentialAddress?.status;
      if (data?.picture) {
        const photoName = data.picture.name;
        const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(data.picture, `profile-image/${userCred?.userId}`);
        imageInfo = imageUrl?.imageInfo || {};
        imageDetails.storageProvider = imageUrl?.storageProvider;
      }
      await mutateAsync({
        userId: userCred?.userId,
        // address: data?.address,
        residentialAddressItemId: status === 'pending' ? userProfileInfo?.guestVerification?.residentialAddress?._id : undefined,
        residentialAddressInfo: {
          unitNumber: unitNumber,
          streetNumber: data?.residentialAddressInfo?.streetNumber,
          streetName: data?.residentialAddressInfo?.streetName,
          suburb: data?.residentialAddressInfo?.suburb,
          state: data?.residentialAddressInfo?.state,
          postcode: data?.residentialAddressInfo?.postcode,
          country: data?.residentialAddressInfo?.country,
        },
        proofOfAddress: shouldIncludeProofOfAddress
          ? {
              imageInfo: {
                public_id: imageInfo?.public_id,
                secure_url: imageInfo?.secure_url,
                format: imageInfo?.format,
              },
              storageProvider: imageDetails?.storageProvider,
            }
          : undefined,
      });
    } catch (error: any) {
      console.log(error);
    }
  };
  // console.log(userProfileInfo?.guestVerification?.residentialAddress);
  //Set the Data
  useEffect(() => {
    if (userProfileInfo?.guestVerification?.residentialAddress) {
      const { residentialAddressInfo, proofOfAddressPhoto } = userProfileInfo?.guestVerification?.residentialAddress;
      // setValue('address', residentialAddress);
      setValue('residentialAddressInfo.country', residentialAddressInfo?.country);
      setValue('residentialAddressInfo.state', residentialAddressInfo?.state);
      setValue('residentialAddressInfo.suburb', residentialAddressInfo?.suburb);
      setValue('residentialAddressInfo.postcode', residentialAddressInfo?.postcode);
      setValue('residentialAddressInfo.unitNumber', residentialAddressInfo?.unitNumber);
      setValue('residentialAddressInfo.streetNumber', residentialAddressInfo?.streetNumber);
      setValue('residentialAddressInfo.streetName', residentialAddressInfo?.streetName);
      setValue('proofOfAddressPhoto.imageInfo.secure_url', proofOfAddressPhoto?.imageInfo?.secure_url);
    }
  }, [userProfileInfo?.guestVerification?.residentialAddress]);
  // console.log(watch('residentialAddressInfo.streetName'));
  useEffect(() => {
    if (userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo && watch('residentialAddressInfo.streetName') !== undefined) {
      const { residentialAddressInfo } = userProfileInfo?.guestVerification?.residentialAddress;
      if (watch('residentialAddressInfo.streetName') !== residentialAddressInfo?.streetName || watch('residentialAddressInfo.streetName') === '') {
        setValue('proofOfAddressPhoto.imageInfo.secure_url', '');
        setShouldReset(true);
      } else {
        setShouldReset(false);
      }
    }
  }, [userProfileInfo?.guestVerification?.residentialAddress, watch('residentialAddressInfo.streetName')]);

  useEffect(() => {
    if (shouldReset) {
      setValue('picture', undefined);
    }
  }, [shouldReset]);
  return (
    <CommonForm handleFunction={handleSubmit(onResidentialAddressSave)}>
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
      {/* <ResidentialInfo {...commonProps} isDisabledData={isDisabledData} /> */}
      <ResidentialAddressInfo {...commonProps} isDisabledData={isDisabledData} />
      <div className="mt-4">
        <UtilityPhotoUpload {...commonUploadProps} shouldReset={shouldReset} isDisabledData={isDisabledData} />
      </div>
      {userProfileInfo?.guestVerification?.secondaryIdInfo?.idType && !isDisabledData && (
        <>
          <Typography className="my-4 text-justify text-sm text-accent">
            <b>{`N.B:`}</b> {`The modification for the Residential Address will be effective after validate the information from support agent`}
          </Typography>
        </>
      )}
      {!isDisabledData ? (
        <div className="flex justify-center col-span-12 p-0">
          <Button
            disabled={
              !isValid ||
              isLoading ||
              isPartnerRestrict(partnerAccess) ||
              isPartnerSuspended(partnerAccess) ||
              isGuestRestrict(guestAccess) ||
              isGuestSuspended(guestAccess)
            }
            type="submit"
            variant="contained"
            color="primary"
            className="mt-4"
          >
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      ) : (
        <Alert severity="info" className="bg-cyan-100 mt-2">
          {`Your request is currently awaiting approval from the support agent`}
        </Alert>
      )}
    </CommonForm>
  );
};

export default ResidentialVerModal;
