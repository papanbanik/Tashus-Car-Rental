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
import { Alert, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import PostalAddress from './PostalAddress';
import ResidentialAddressDetails from './ResidentialAddressDetails';
import ResidentialPhotoUpload from './ResidentialPhotoUpload';

const ResidentialAddressVerify = () => {
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<ResidentialAddressInfoType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid } = formState;
  const { userCred, userProfileInfo, isAllVerificationStepsCompleted, verificationFieldFlags } = useUserCredContext();
  const { mutateAsync, isLoading } = useAddressVerification();

  //Photo
  const [addressProofUrl, setAddressProofUrl] = useState<string>('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);
  const [shouldReset, setShouldReset] = useState<boolean>(false);
  // New loading state
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
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
    isDisabledData,
  };
  const commonUploadProps = {
    control,
    frontPhotoUrl: addressProofUrl,
    setFrontPhotoUrl: setAddressProofUrl,
    singleFrontFile: singleFile,
    setSingleFrontFile: setSingleFile,
    registerName: 'picture',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
  };

  useEffect(() => {
    if (
      isTimeExpired(userProfileInfo?.guestVerification?.residentialAddress?.createdAt) &&
      userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo &&
      userProfileInfo?.guestVerification?.residentialAddress?.status === 'pending' &&
      isAllVerificationStepsCompleted &&
      !verificationFieldFlags?.isAddressIncorrect
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
        setAddressProofUrl(url);
        setSingleFile([residentialFile]);
      }
    };
    getUpdatedPhoto();
  }, [userProfileInfo?.guestVerification?.residentialAddress]);

  //API call and request body pass
  const onResidentialAddressSave: SubmitHandler<ResidentialAddressInfoType> = async (data) => {
    setIsButtonLoading(true);
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
        setAddressProofUrl(uploadedUrl);
        setSingleFile([]);
      }
      await mutateAsync({
        userId: userCred?.userId,
        // address: data?.address,
        residentialAddressItemId:
          status === 'pending' && isAllVerificationStepsCompleted && !verificationFieldFlags?.isAddressIncorrect
            ? userProfileInfo?.guestVerification?.residentialAddress?._id
            : undefined,
        residentialAddressInfo: {
          unitNumber: unitNumber,
          streetNumber: data?.residentialAddressInfo?.streetNumber,
          streetName: data?.residentialAddressInfo?.streetName,
          suburb: data?.residentialAddressInfo?.suburb,
          state: data?.residentialAddressInfo?.state,
          postcode: data?.residentialAddressInfo?.postcode,
          country: data?.residentialAddressInfo?.country,
        },
        ...(data.postalAddress ? { postalAddress: data?.postalAddress } : undefined),
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
    } finally {
      setIsButtonLoading(false); // Reset loading state after API call
    }
  };

  //Set the Data
  useEffect(() => {
    if (userProfileInfo?.guestVerification?.residentialAddress) {
      const { residentialAddressInfo, proofOfAddressPhoto, postalAddress } = userProfileInfo?.guestVerification?.residentialAddress;
      // setValue('address', residentialAddress);
      setValue('residentialAddressInfo.country', residentialAddressInfo?.country);
      setValue('residentialAddressInfo.state', residentialAddressInfo?.state);
      setValue('residentialAddressInfo.suburb', residentialAddressInfo?.suburb);
      setValue('residentialAddressInfo.postcode', residentialAddressInfo?.postcode);
      setValue('residentialAddressInfo.unitNumber', residentialAddressInfo?.unitNumber);
      setValue('residentialAddressInfo.streetNumber', residentialAddressInfo?.streetNumber);
      setValue('residentialAddressInfo.streetName', residentialAddressInfo?.streetName);
      setValue('proofOfAddressPhoto.imageInfo.secure_url', proofOfAddressPhoto?.imageInfo?.secure_url);
      setValue('postalAddress', postalAddress);
    }
  }, [userProfileInfo?.guestVerification?.residentialAddress]);
  // console.log(watch('residentialAddressInfo.streetName'));
  useEffect(() => {
    if (userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo && watch('residentialAddressInfo.streetName') !== undefined) {
      const { residentialAddressInfo } = userProfileInfo?.guestVerification?.residentialAddress;
      // if (watch('residentialAddressInfo.streetName') !== residentialAddressInfo?.streetName || watch('residentialAddressInfo.streetName') === '') {
      if (
        watch('residentialAddressInfo.country') !== residentialAddressInfo?.country ||
        watch('residentialAddressInfo.state') !== residentialAddressInfo?.state
      ) {
        setValue('proofOfAddressPhoto.imageInfo.secure_url', '');
        setAddressProofUrl('');
        setShouldReset(true);
      } else {
        setShouldReset(false);
      }
    }
  }, [userProfileInfo?.guestVerification?.residentialAddress, watch('residentialAddressInfo.country'), watch('residentialAddressInfo.state')]);

  useEffect(() => {
    if (shouldReset) {
      setValue('picture', undefined);
      setAddressProofUrl('');
    }
  }, [shouldReset]);
  // console.log('addressProofUrl', addressProofUrl);
  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (userProfileInfo?.guestVerification?.residentialAddress) {
      const { residentialAddressInfo, proofOfAddressPhoto, postalAddress } = userProfileInfo?.guestVerification?.residentialAddress;
      const { streetName, streetNumber, unitNumber, country, state, suburb, postcode } = residentialAddressInfo;
      const unitNumberChanged = residentialAddressInfo?.unitNumber
        ? residentialAddressInfo?.unitNumber !== watch('residentialAddressInfo.unitNumber')
        : !!watch('residentialAddressInfo.unitNumber');
      // Convert File or Blob to a comparable string representation (e.g., file name or size)
      const proofAddressImage = proofOfAddressPhoto?.imageInfo?.secure_url ?? '';
      const watchedPictureName = addressProofUrl ?? '';
      const proofAddressChanged = proofOfAddressPhoto?.imageInfo?.secure_url ? proofAddressImage !== watchedPictureName : !!watch('picture');
      return (
        country !== watch('residentialAddressInfo.country') ||
        state !== watch('residentialAddressInfo.state') ||
        suburb !== watch('residentialAddressInfo.suburb') ||
        postcode !== watch('residentialAddressInfo.postcode') ||
        unitNumberChanged ||
        streetNumber !== watch('residentialAddressInfo.streetNumber') ||
        streetName != watch('residentialAddressInfo.streetName') ||
        // proofOfAddressPhoto?.imageInfo?.secure_url !== watch('proofOfAddress.imageInfo.secure_url') ||
        proofAddressChanged ||
        postalAddress !== watch('postalAddress')
      );
    }
    return true;
  };

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

      <ResidentialAddressDetails {...commonProps} />
      <div className="my-4">
        <PostalAddress {...commonProps} />
      </div>
      <ResidentialPhotoUpload {...commonUploadProps} />
      {/* {userProfileInfo?.guestVerification?.secondaryIdInfo?.idType && !isDisabledData && (
        <>
          <Typography className="my-4 text-justify text-sm text-accent">
            <b>{`N.B:`}</b> {`The modification for the Residential Address will be effective after validate the information from support agent`}
          </Typography>
        </>
      )} */}
      {!isDisabledData ? (
        <Button
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
          type="submit"
          variant="contained"
          color="success"
          className="normal-case mt-2"
        >
          {isButtonLoading || isLoading ? 'Saving' : 'Save'}
        </Button>
      ) : (
        <Alert severity="info" className="bg-cyan-100 mt-2">
          {`Your request is currently awaiting approval from the support agent`}
        </Alert>
      )}
    </CommonForm>
  );
};

export default ResidentialAddressVerify;
