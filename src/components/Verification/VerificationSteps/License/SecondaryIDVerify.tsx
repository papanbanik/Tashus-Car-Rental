'use client';
import { saveSingleImageToCloudinary, urlToFile } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useSecondaryIDSave } from '@/hooks/profile/verification-steps/useSecondaryIDSave';
import { ISecondaryPhotoIDModal, SecondaryIDVerType } from '@/types/user-verification/verificationListingSteps';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Alert, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SecondaryIDDetails from './SecondaryIDDetails';
import SecondaryIDPhoto from './SecondaryIDPhoto';

const defaultValues: SecondaryIDVerType = {
  secondaryIdInfo: {
    idType: '',
    idNumber: '',
    expiryDate: null,
    state: '',
    country: '',
    // picture: undefined,
    imageInfo: {
      public_id: '',
      secure_url: '',
      format: '',
    },
    storageProvider: '',
  },
};

const SecondaryIDVerify = ({ secondaryIdData }: ISecondaryPhotoIDModal) => {
  const { partnerAccess, guestAccess, userProfileVerificationInfo } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<SecondaryIDVerType>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { isValid } = formState;
  const { mutateAsync: saveSecondaryID, isLoading } = useSecondaryIDSave();
  const { userCred } = useUserCredContext();
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);
  //Photo
  const [secondaryIDPhotoUrl, setSecondaryIDPhotoUrl] = useState<string>('');
  const [singleSecondaryIDFile, setSingleSecondaryIDFile] = useState<File[]>([]);
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
    frontPhotoUrl: secondaryIDPhotoUrl,
    setFrontPhotoUrl: setSecondaryIDPhotoUrl,
    singleFrontFile: singleSecondaryIDFile,
    setSingleFrontFile: setSingleSecondaryIDFile,
    registerName: 'picture',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
  };
  //To Disabled on pending status
  // useEffect(() => {
  //   if (
  //     isTimeExpired(userProfileInfo?.guestVerification?.secondaryIdInfo?.createdAt) &&
  //     userProfileInfo?.guestVerification?.secondaryIdInfo?.idType &&
  //     userProfileInfo?.guestVerification?.secondaryIdInfo?.status === 'pending' &&
  //     isAllVerificationStepsCompleted &&
  //     !verificationFieldFlags?.isSecondaryIdIncorrect &&
  //     !verificationFieldFlags?.isSecondaryIdPhotoIncorrect
  //   ) {
  //     setIsDisableData(true);
  //   } else {
  //     setIsDisableData(false);
  //   }
  // }, [userProfileInfo?.guestVerification?.secondaryIdInfo]);
  // Reset when IdType changes
  const idType = watch('secondaryIdInfo.idType');

  useEffect(() => {
    if (idType !== undefined) {
      if (idType !== secondaryIdData?.idType) {
        setShouldReset(true);
        const currentValues = getValues();
        reset({
          ...currentValues,
          secondaryIdInfo: {
            ...defaultValues?.secondaryIdInfo,
            idType,
            country: currentValues?.secondaryIdInfo?.country, // Preserve country
          },
        });
      } else {
        setShouldReset(false);
      }
    }
  }, [idType, secondaryIdData]);

  const isCountryAustralia = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country === 'Australia';
  //set idType
  useEffect(() => {
    if (!isCountryAustralia && !secondaryIdData) {
      setValue('secondaryIdInfo.idType', 'PassportId');
    }
  }, [userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country, secondaryIdData]);
  // set saved data when updating info
  useEffect(() => {
    if (secondaryIdData) {
      const { idType, otherTypeName, institutionName, issuingAuthority, idNumber, state, country, expiryDate, imageInfo } = secondaryIdData;
      if (!isCountryAustralia && idType !== 'PassportId') {
        setShouldReset(true);
        setValue('secondaryIdInfo.idType', 'PassportId');
        if (userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country) {
          setValue('secondaryIdInfo.country', userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country, { shouldValidate: true });
        }
      } else {
        setValue('secondaryIdInfo.idType', idType, { shouldValidate: true });
        setValue('secondaryIdInfo.otherTypeName', otherTypeName, { shouldValidate: true });
        setValue('secondaryIdInfo.institutionName', institutionName, { shouldValidate: true });
        setValue('secondaryIdInfo.issuingAuthority', issuingAuthority, { shouldValidate: true });
        setValue('secondaryIdInfo.idNumber', idNumber, { shouldValidate: true });
        setValue('secondaryIdInfo.country', country, { shouldValidate: true });
        setValue('secondaryIdInfo.state', state, { shouldValidate: true });
        if (expiryDate !== null || expiryDate !== undefined) {
          setValue('secondaryIdInfo.expiryDate', dayjs(expiryDate).toDate(), { shouldValidate: true });
        } else {
          setValue('secondaryIdInfo.expiryDate', null, { shouldValidate: true });
        }
        setValue('secondaryIdInfo.imageInfo.secure_url', imageInfo?.secure_url, { shouldValidate: true });
      }
    } else if (userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country) {
      setValue('secondaryIdInfo.country', userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country, { shouldValidate: true });
    }
  }, [secondaryIdData]);

  useEffect(() => {
    const getUpdatedPhoto = async () => {
      if (
        userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.secure_url &&
        !(!isCountryAustralia && userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType !== 'PassportId')
      ) {
        const url = userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.secure_url;
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const secondaryIDFile: any = await urlToFile(
          url,
          filename,
          `image/${userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.format}`
        );
        setValue('picture', secondaryIDFile);
        setSecondaryIDPhotoUrl(url);
        setSingleSecondaryIDFile([secondaryIDFile]);
      } else if (shouldReset) {
        setValue('picture', undefined);
        setSecondaryIDPhotoUrl('');
        setSingleSecondaryIDFile([]);
      }
    };
    getUpdatedPhoto();
  }, [userProfileVerificationInfo?.guestVerification, shouldReset]);

  const onSecondaryIDInfoSave: SubmitHandler<SecondaryIDVerType> = async (data) => {
    setIsButtonLoading(true);
    // console.log(data);
    try {
      if (data?.picture) {
        const { expiryDate, institutionName, country, state, issuingAuthority, otherTypeName, ...restSecondaryIdInfo } = data.secondaryIdInfo;
        // Only include expiryDate not null, otherType not empty, and idType is not "NationalId"
        const secondaryIdInfoToSend = {
          ...restSecondaryIdInfo,
          ...(expiryDate !== null && { expiryDate }),
          ...(issuingAuthority && { issuingAuthority }),
          ...(institutionName && { institutionName }),
          ...(country && { country }),
          ...(state && { state }),
          ...(otherTypeName && { otherTypeName }),
        };

        const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(data.picture, `profile-image/${userCred?.userId}`);
        const imageInfo = imageUrl?.imageInfo || {};
        const storageProvider = imageUrl?.storageProvider;
        // const status = userProfileInfo?.guestVerification?.secondaryIdInfo?.status;
        userCred?.userId &&
          (await saveSecondaryID({
            userId: userCred?.userId,
            secondaryIdInfo: {
              ...secondaryIdInfoToSend,
              imageInfo,
              storageProvider,
            },
            // secondaryIdItemId:
            //   status === 'pending' &&
            //   isAllVerificationStepsCompleted &&
            //   !verificationFieldFlags?.isSecondaryIdIncorrect &&
            //   !verificationFieldFlags?.isSecondaryIdPhotoIncorrect
            //     ? userProfileInfo?.guestVerification?.secondaryIdInfo?._id
            //     : undefined,
          }));
        setSecondaryIDPhotoUrl(uploadedUrl);
        setSingleSecondaryIDFile([]);
      }
    } catch (error) {
      console.log('onSecondaryIDInfoSave error', error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (!!secondaryIdData) {
      const { idType, otherTypeName, institutionName, issuingAuthority, idNumber, country, expiryDate, imageInfo } = secondaryIdData;
      const hasSecondaryIDImageChanged = !!imageInfo?.secure_url ? imageInfo?.secure_url !== secondaryIDPhotoUrl : false;
      return (
        idType !== watch('secondaryIdInfo.idType') ||
        (!!otherTypeName ? otherTypeName !== watch('secondaryIdInfo.otherTypeName') : false) ||
        (!!institutionName ? institutionName !== watch('secondaryIdInfo.institutionName') : false) ||
        (!!issuingAuthority ? issuingAuthority !== watch('secondaryIdInfo.issuingAuthority') : false) ||
        idNumber !== watch('secondaryIdInfo.idNumber') ||
        country !== watch('secondaryIdInfo.country') ||
        (!!expiryDate ? !dayjs(expiryDate).isSame(dayjs(watch('secondaryIdInfo.expiryDate'))) : false) ||
        hasSecondaryIDImageChanged
      );
    }
    return true;
  };
  return (
    <div>
      <CommonForm handleFunction={handleSubmit(onSecondaryIDInfoSave)}>
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
        <SecondaryIDDetails {...commonProps} isDisabledData={isDisabledData} />
        <div className="mt-4">
          <SecondaryIDPhoto {...commonUploadProps} shouldReset={shouldReset} isDisabledData={isDisabledData} />
        </div>
        {/* {userProfileInfo?.guestVerification?.secondaryIdInfo?.idType && !isDisabledData && (
          <>
            <Typography className="my-4 text-justify text-sm text-accent">
              <b>{`N.B:`}</b> {`The modification for the Secondary ID will be effective after validate the information from support agent`}
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
    </div>
  );
};

export default SecondaryIDVerify;
