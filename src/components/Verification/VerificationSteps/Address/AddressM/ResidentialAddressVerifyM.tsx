'use client';
import { saveSingleImageToCloudinary, urlToFile } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { ImageInfoType } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useAddressDetailsSave } from '@/hooks/profile/verification-steps/useAddressDetailsSave';
import { ResidentialAddressInfoType } from '@/types/user-verification/userVerificationTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { getCountryCodeByName, getStateCodeByName } from '@/utils/Functions/randomCommonFn';
import { compareAddressFields, isValidPostalAddressInfo, setAddressValues } from '@/utils/Functions/verification/verificationFn';
import { Button } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdCheckCircle, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import AustralianAddressDetails from './AustralianAddressDetails';
import PostalAddressM from './PostalAddressM';
import ResidentialAddressDetailsM from './ResidentialAddressDetailsM';
import ResidentialPhotoUploadM from './ResidentialPhotoUploadM';

const ResidentialAddressVerifyM = () => {
  const router = useRouter();
  const pathName = usePathname();

  const { partnerAccess, guestAccess, userProfileVerificationInfo, setIsCountryAustralia, isCountryAustralia } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<ResidentialAddressInfoType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid } = formState;
  const { userCred, isAllVerificationStepsCompleted } = useUserCredContext();
  // const { mutateAsync, isLoading } = useAddressVerification();
  const { mutateAsync: saveAddressDetails, isLoading } = useAddressDetailsSave();

  //Photo
  const [addressProofUrl, setAddressProofUrl] = useState<string>('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
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
  //To get photo upload url
  useEffect(() => {
    const getUpdatedPhoto = async () => {
      if (userProfileVerificationInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url) {
        const url = userProfileVerificationInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url;
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const residentialFile: any = await urlToFile(
          url,
          filename,
          `image/${userProfileVerificationInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.format}`
        );
        // console.log(residentialFile);
        setValue('picture', residentialFile);
        setAddressProofUrl(url);
        setSingleFile([residentialFile]);
      }
    };
    getUpdatedPhoto();
  }, [userProfileVerificationInfo?.guestVerification?.residentialAddress]);

  //API call and request body pass
  const onResidentialAddressSave: SubmitHandler<ResidentialAddressInfoType> = async (data) => {
    setIsButtonLoading(true);
    try {
      const shouldIncludeProofOfAddress = data?.picture !== undefined;
      let imageInfo = {} as ImageInfoType;
      let storageProvider = '';
      if (data?.picture) {
        const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(data.picture, `profile-image/${userCred?.userId}`);
        imageInfo = imageUrl?.imageInfo || {};
        storageProvider = imageUrl?.storageProvider ?? '';
        setAddressProofUrl(uploadedUrl);
        setSingleFile([]);
      }
      userCred?.userId &&
        (await saveAddressDetails({
          userId: userCred?.userId,
          residentialAddressInfo: data?.residentialAddressInfo,
          ...(data.postalAddress?.trim() ? { postalAddress: data?.postalAddress } : undefined),
          ...(isValidPostalAddressInfo(data?.postalAddressInfo) ? { postalAddressInfo: data?.postalAddressInfo } : undefined),
          ...(data?.australianAddressInfo?.country ? { australianAddressInfo: data?.australianAddressInfo } : undefined),
          proofOfAddressPhoto: shouldIncludeProofOfAddress
            ? {
                imageInfo: imageInfo,
                storageProvider: storageProvider,
              }
            : undefined,
        }));
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsButtonLoading(false); // Reset loading state after API call
      if (isAllVerificationStepsCompleted && pathName.includes('/verify-account')) {
        router.push(`/au/verify-account/${userCred?.userId}/pending-approval`);
      }
    }
  };

  //Set the Data
  useEffect(() => {
    if (userProfileVerificationInfo?.guestVerification?.residentialAddress) {
      const { residentialAddressInfo, proofOfAddressPhoto, postalAddressInfo, postalAddress, australianAddressInfo } =
        userProfileVerificationInfo?.guestVerification?.residentialAddress;
      // setValue('address', residentialAddress);
      setAddressValues('residentialAddressInfo', residentialAddressInfo, setValue);
      setValue('proofOfAddressPhoto.imageInfo.secure_url', proofOfAddressPhoto?.imageInfo?.secure_url ?? '');
      if (!!australianAddressInfo?.country) {
        setAddressValues('australianAddressInfo', australianAddressInfo, setValue);
      }
      if (!!postalAddressInfo?.country) {
        setAddressValues('postalAddressInfo', postalAddressInfo, setValue);
      }
      if (!!postalAddress) {
        setValue('postalAddress', postalAddress);
      }
    } else if (userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country) {
      const licenseCountry = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country ?? '';
      const licenseState = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.state ?? '';
      const licenseCountryCode = getCountryCodeByName(licenseCountry);
      const licenseStateCode = getStateCodeByName(licenseCountryCode, licenseState);
      setValue('residentialAddressInfo.country', licenseCountryCode);
      setValue('residentialAddressInfo.state', licenseStateCode);
    }
    if (userProfileVerificationInfo?.guestVerification?.isAgreed) {
      setValue('isAgreed', userProfileVerificationInfo?.guestVerification?.isAgreed);
    }
  }, [userProfileVerificationInfo?.guestVerification?.residentialAddress]);
  // console.log(watch('residentialAddressInfo.streetName'));
  const watchCountry = watch('australianAddressInfo.country') || watch('residentialAddressInfo.country');
  const watchState = watch('australianAddressInfo.state') || watch('residentialAddressInfo.state');
  useEffect(() => {
    if (
      !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo &&
      watch('australianAddressInfo.streetName') !== undefined
    ) {
      const { australianAddressInfo } = userProfileVerificationInfo?.guestVerification?.residentialAddress;
      if (
        watch('australianAddressInfo.country') !== australianAddressInfo?.country ||
        watch('australianAddressInfo.state') !== australianAddressInfo?.state
      ) {
        setValue('proofOfAddressPhoto.imageInfo.secure_url', '');
        setAddressProofUrl('');
        setShouldReset(true);
      } else {
        setShouldReset(false);
      }
    } else if (
      !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo &&
      watch('residentialAddressInfo.streetName') !== undefined
    ) {
      const { residentialAddressInfo } = userProfileVerificationInfo?.guestVerification?.residentialAddress;
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
  }, [userProfileVerificationInfo?.guestVerification?.residentialAddress, watchCountry, watchState]);

  useEffect(() => {
    if (shouldReset) {
      setValue('picture', undefined);
      setAddressProofUrl('');
    }
  }, [shouldReset]);

  //set aus country
  useEffect(() => {
    const licenseCountry = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country ?? '';
    const checkLicenseCountry = !!licenseCountry ? licenseCountry === 'Australia' : true;
    const watchResidentialCountry = watch('residentialAddressInfo.country') ?? '';
    const checkResidentialCountry = !!watchResidentialCountry ? watchResidentialCountry === 'AU' : true;
    const isCountryAustralia = checkLicenseCountry && checkResidentialCountry;
    setIsCountryAustralia(isCountryAustralia);
  }, [userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo, watch('residentialAddressInfo.country')]);
  // console.log('addressProofUrl', addressProofUrl);
  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (userProfileVerificationInfo?.guestVerification?.residentialAddress) {
      const { residentialAddressInfo, proofOfAddressPhoto, postalAddressInfo, postalAddress, australianAddressInfo } =
        userProfileVerificationInfo?.guestVerification?.residentialAddress;
      const residentialAddressChanged = !!residentialAddressInfo
        ? compareAddressFields(residentialAddressInfo, 'residentialAddressInfo', watch)
        : false;
      const australianAddressChanged = !!australianAddressInfo
        ? compareAddressFields(australianAddressInfo, 'australianAddressInfo', watch)
        : !!watch('australianAddressInfo.country');
      const postalAddressChanged = !!postalAddressInfo
        ? compareAddressFields(postalAddressInfo, 'postalAddressInfo', watch)
        : !!watch('postalAddressInfo.country');
      const proofAddressImage = proofOfAddressPhoto?.imageInfo?.secure_url ?? '';
      const watchedPictureName = addressProofUrl ?? '';
      const proofAddressChanged = proofOfAddressPhoto?.imageInfo?.secure_url ? proofAddressImage !== watchedPictureName : !!watch('picture');
      return (
        residentialAddressChanged ||
        proofAddressChanged ||
        postalAddress !== watch('postalAddress') ||
        australianAddressChanged ||
        postalAddressChanged
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
      <ResidentialAddressDetailsM {...commonProps} />
      {(!isCountryAustralia || userProfileVerificationInfo?.guestVerification?.mandatoryFields?.isAustralianAddressRequired) && (
        <AustralianAddressDetails {...commonProps} />
      )}
      {(!isCountryAustralia || userProfileVerificationInfo?.guestVerification?.mandatoryFields?.isProofOfAddressRequired) && (
        <ResidentialPhotoUploadM {...commonUploadProps} />
      )}
      <PostalAddressM {...commonProps} />
      <div className="my-2">
        <CheckBox
          control={control}
          registerName="isAgreed"
          htmlLabel={
            <span className="font-bold whitespace-nowrap text-xs md:text-sm text-black">
              {`I ${userProfileVerificationInfo?.guestVerification?.isAgreed ? 'agreed' : 'agree'} to the `}
              <Link target="_blank" href={'/legals/terms-and-conditions'} className="text-primary inline-block no-underline">
                terms and conditions
              </Link>
            </span>
          }
          required={true}
          disabled={userProfileVerificationInfo?.guestVerification?.isAgreed}
          icon={<MdOutlineRadioButtonUnchecked className="text-xl" />}
          checkedIcon={<MdCheckCircle className="text-xl text-primary" />}
          isCustomIcon={true}
          helpingText={
            userProfileVerificationInfo?.guestVerification?.isAgreed
              ? ''
              : 'Please tick the checkbox to confirm that you have agreed to the terms and conditions'
          }
        />
      </div>
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
        className="normal-case"
      >
        {isButtonLoading || isLoading ? 'Saving' : 'Save'}
      </Button>
    </CommonForm>
  );
};

export default ResidentialAddressVerifyM;
