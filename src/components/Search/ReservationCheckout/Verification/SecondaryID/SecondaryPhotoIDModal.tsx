'use client';
import { saveSingleImageToCloudinary, urlToFile } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { TSecondaryIDInfo, useUserCredContext } from '@/context/UserCredProvider';
import { useSecondaryIDSave } from '@/hooks/guest-verification/useSecondaryIDSave';
import { TDate } from '@/types/commonTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { isTimeExpired } from '@/utils/Functions/randomCommonFn';
import { Alert, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SecondaryIDDetails from './SecondaryIDDetails';
import SecondaryIDPhotoUpload from './SecondaryIDPhotoUpload';

export type SecondaryIDVerType = {
  secondaryIdInfo: TSecondaryIDInfo;
  picture?: Blob;
  secondaryIdItemId?: string;
};

export interface ISecondaryPhotoIDModal {
  secondaryIdData?: TSecondaryIDInfo;
  returnDate?: TDate;
}

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

const SecondaryPhotoIDModal = ({ secondaryIdData, returnDate }: ISecondaryPhotoIDModal) => {
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<SecondaryIDVerType>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { errors, isValid } = formState;
  const { mutateAsync, isLoading, isSuccess } = useSecondaryIDSave();
  const { userCred, userProfileInfo } = useUserCredContext();
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);
  //Photo
  const [profileUrl, setProfileUrl] = useState('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
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
    // setError,
    // clearErrors,
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

  // console.log(userProfileInfo?.guestVerification?.secondaryIdInfo?.status);
  //To Disabled on pending status
  useEffect(() => {
    if (
      isTimeExpired(userProfileInfo?.guestVerification?.secondaryIdInfo?.createdAt) &&
      userProfileInfo?.guestVerification?.secondaryIdInfo?.idType &&
      userProfileInfo?.guestVerification?.secondaryIdInfo?.status === 'pending'
    ) {
      setIsDisableData(true);
    } else {
      setIsDisableData(false);
    }
  }, [userProfileInfo?.guestVerification?.secondaryIdInfo]);
  // Reset when IdType changes
  const idType = watch('secondaryIdInfo.idType');
  useEffect(() => {
    if (idType !== undefined) {
      if (idType !== secondaryIdData?.idType) {
        // Update only the idType field if it's different
        setValue('secondaryIdInfo.idType', idType);
        setValue('secondaryIdInfo.otherTypeName', '');
        setValue('secondaryIdInfo.institutionName', '');
        setValue('secondaryIdInfo.issuingAuthority', '');
        setValue('secondaryIdInfo.idNumber', '');
        setValue('secondaryIdInfo.country', '');
        setValue('secondaryIdInfo.state', '');
        setValue('secondaryIdInfo.expiryDate', null);
        setValue('secondaryIdInfo.imageInfo.secure_url', '');
        setShouldReset(true);
      } else {
        setShouldReset(false);
      }
    }
  }, [idType, secondaryIdData]);

  // set saved data when updating info
  useEffect(() => {
    if (secondaryIdData) {
      const { idType, otherTypeName, institutionName, issuingAuthority, idNumber, state, country, expiryDate, imageInfo } = secondaryIdData;
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
  }, [secondaryIdData, setValue]);

  useEffect(() => {
    const getUpdatedPhoto = async () => {
      if (userProfileInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.secure_url) {
        const url = userProfileInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.secure_url;
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const secondaryIDFile: any = await urlToFile(
          url,
          filename,
          `image/${userProfileInfo?.guestVerification?.secondaryIdInfo?.imageInfo?.format}`
        );
        // console.log(secondaryIDFile);
        setValue('picture', secondaryIDFile);
      }
    };
    getUpdatedPhoto();
  }, [userProfileInfo?.guestVerification?.secondaryIdInfo]);

  useEffect(() => {
    if (shouldReset) {
      setValue('picture', undefined);
    }
  }, [shouldReset]);

  const onSecondaryIDInfoSave: SubmitHandler<SecondaryIDVerType> = async (data) => {
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
        const status = userProfileInfo?.guestVerification?.secondaryIdInfo?.status;
        userCred?.userId &&
          (await mutateAsync({
            userId: userCred?.userId,
            secondaryIdInfo: {
              ...secondaryIdInfoToSend,
              imageInfo,
              storageProvider,
            },
            secondaryIdItemId: status === 'pending' ? userProfileInfo?.guestVerification?.secondaryIdInfo?._id : undefined,
          }));
      }
    } catch (error) {
      console.log('onSecondaryIDInfoSave error', error);
    }
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
          <SecondaryIDPhotoUpload {...commonUploadProps} shouldReset={shouldReset} isDisabledData={isDisabledData} />
        </div>
        {userProfileInfo?.guestVerification?.secondaryIdInfo?.idType && !isDisabledData && (
          <>
            <Typography className="my-4 text-justify text-sm text-accent">
              <b>{`N.B:`}</b> {`The modification for the Secondary ID will be effective after validate the information from support agent`}
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
    </div>
  );
};

export default SecondaryPhotoIDModal;
