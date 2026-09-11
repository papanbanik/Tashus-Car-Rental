'use client';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useLicenseDetailsSave } from '@/hooks/profile/verification-steps/useLicenseDetailsSave';
import { LicenseNumVerType } from '@/types/user-verification/userVerificationTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { isDrivingAgeValid } from '@/utils/Functions/dateTimeCommonFn';
import { removeFalsyValues } from '@/utils/Functions/randomCommonFn';
import { Alert, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LicenseDetails from './LicenseDetails';
dayjs.extend(utc);
const defaultValues: LicenseNumVerType = {
  drivingLicenseInfo: {
    licenseName: '',
    licenseNumber: '',
    country: '',
  },
  gender: '',
};

const LicenseDetailsVerify = () => {
  const { partnerAccess, guestAccess, userProfileVerificationInfo } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<LicenseNumVerType>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { isValid } = formState;

  // const { mutateAsync, isLoading } = useDriverLicenseSave();
  const { mutateAsync: saveLicenseDetails, isLoading } = useLicenseDetailsSave();
  const { userCred, userProfileInfo } = useUserCredContext();
  const isAgeValid = !!userProfileVerificationInfo?.profileInfo?.dateOfBirth
    ? isDrivingAgeValid(userProfileVerificationInfo?.profileInfo?.dateOfBirth)
    : true;

  const drivingLicenseData = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo;
  const dateOfBirth = !!userProfileVerificationInfo?.profileInfo?.dateOfBirth ? userProfileVerificationInfo?.profileInfo?.dateOfBirth : null;

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
  const [isDisabledData, setIsDisableData] = useState<boolean>(false);
  // New loading state
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  // console.log(userProfileInfo);
  // console.log(drivingLicenseData);
  //Data disabled edit
  // useEffect(() => {
  //   if (
  //     isTimeExpired(drivingLicenseData?.createdAt) &&
  //     drivingLicenseData?.licenseNumber &&
  //     drivingLicenseData?.status === 'pending' &&
  //     isAllVerificationStepsCompleted &&
  //     !verificationFieldFlags?.isDLInfoIncorrect
  //   ) {
  //     setIsDisableData(true);
  //   } else {
  //     setIsDisableData(false);
  //   }
  // }, [drivingLicenseData]);

  // set saved data when updating info
  useEffect(() => {
    if (drivingLicenseData) {
      const { country, state, licenseName, licenseNumber, expiryDate } = drivingLicenseData;
      setValue('drivingLicenseInfo.licenseName', licenseName, { shouldValidate: true });
      setValue('drivingLicenseInfo.licenseNumber', licenseNumber, { shouldValidate: true });
      setValue('dateOfBirth', dayjs(dateOfBirth).toDate(), { shouldValidate: true });
      setValue('drivingLicenseInfo.country', country, { shouldValidate: true });
      setValue('drivingLicenseInfo.state', state);
      setValue('drivingLicenseInfo.expiryDate', !!expiryDate ? dayjs(expiryDate).toDate() : null, { shouldValidate: true });
    } else if (userProfileInfo?.firstName && userProfileInfo?.lastName) {
      setValue('drivingLicenseInfo.licenseName', `${userProfileInfo?.firstName} ${userProfileInfo?.lastName}`, { shouldValidate: true });
    }
    if (userProfileVerificationInfo?.profileInfo?.gender) {
      setValue('gender', userProfileVerificationInfo?.profileInfo?.gender, { shouldValidate: true });
    }
  }, [drivingLicenseData, userProfileVerificationInfo?.profileInfo?.gender]);

  const onLicenseInfoSave: SubmitHandler<LicenseNumVerType> = async (data) => {
    setIsButtonLoading(true);
    // console.log(data);
    // const status = drivingLicenseData?.status;
    try {
      const selectedDayjs = dayjs(data?.dateOfBirth);
      const cleanDate = selectedDayjs.format('YYYY-MM-DD');
      const utcMidnightDate = dayjs.utc(cleanDate, 'YYYY-MM-DD').startOf('day').toDate();
      const cleanedDrivingLicenseInfo = removeFalsyValues(data.drivingLicenseInfo, ['country']);
      userCred?.userId &&
        (await saveLicenseDetails({
          userId: userCred?.userId,
          drivingLicenseInfo: cleanedDrivingLicenseInfo,
          dateOfBirth: utcMidnightDate,
          gender: data?.gender,
        }));
    } catch (error) {
      console.log('onLicenseInfoSave error', error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (drivingLicenseData) {
      const { country, state, licenseName, licenseNumber, expiryDate } = drivingLicenseData;
      const hasExpiryDateChanged = expiryDate
        ? !dayjs(expiryDate).isSame(dayjs(watch('drivingLicenseInfo.expiryDate')))
        : !!watch('drivingLicenseInfo.expiryDate');
      const hasStateChanged = !!state ? state !== watch('drivingLicenseInfo.state') : false;
      const hasDOBChanged = dateOfBirth ? !dayjs(dateOfBirth).isSame(dayjs(watch('dateOfBirth'))) : !!watch('dateOfBirth');
      return (
        licenseName !== watch('drivingLicenseInfo.licenseName') ||
        userProfileInfo?.gender !== watch('gender') ||
        country !== watch('drivingLicenseInfo.country') ||
        hasStateChanged ||
        licenseNumber !== watch('drivingLicenseInfo.licenseNumber') ||
        hasExpiryDateChanged ||
        hasDOBChanged
      );
    }
    return true;
  };

  return (
    <div>
      <CommonForm handleFunction={handleSubmit(onLicenseInfoSave)}>
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
        <LicenseDetails {...commonProps} isDisabledData={isDisabledData} />
        {!isAgeValid && (
          <Typography className="md:text-sm text-sm font-thin text-gray-400 italic text-left mb-6">
            {`To modify your DOB, please contact our `}
            <Link
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_DOMAIN}/support/support-center/general`}
              className="text-primary inline-block no-underline font-bold italic"
            >
              support team
            </Link>
          </Typography>
        )}
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
            className="normal-case mt-4"
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

export default LicenseDetailsVerify;
