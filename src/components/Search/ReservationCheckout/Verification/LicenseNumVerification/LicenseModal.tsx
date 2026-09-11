'use client';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { TDrivingLicenseInfo, useUserCredContext } from '@/context/UserCredProvider';
import { useDriverLicenseSave } from '@/hooks/guest-verification/useDriverLicenseSave';
import { TDate } from '@/types/commonTypes';

import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { isDrivingAgeValid } from '@/utils/Functions/dateTimeCommonFn';
import { isTimeExpired } from '@/utils/Functions/randomCommonFn';
import { Alert, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LicenseNumVerType } from '../LicenseNumVerModal';
import LicenseInfoDetails from './LicenseInfoDetails';

const defaultValues: LicenseNumVerType = {
  drivingLicenseInfo: {
    licenseName: '',
    gender: '',
    licenseNumber: '',
    country: '',
    state: '',
    expiryDate: null,
    dateOfBirth: null,
  },
};
export interface ILicenseNumVerModal {
  drivingLicenseData?: TDrivingLicenseInfo;
  dateOfBirth?: TDate;
  returnDate?: TDate;
  isDisabledData?: boolean;
}
const LicenseModal = ({ drivingLicenseData, dateOfBirth, returnDate }: ILicenseNumVerModal) => {
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<LicenseNumVerType>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { isValid } = formState;
  const { mutateAsync, isLoading } = useDriverLicenseSave();
  const { userCred, userProfileInfo } = useUserCredContext();
  const isAgeValid = userProfileInfo?.dateOfBirth ? isDrivingAgeValid(userProfileInfo?.dateOfBirth) : true;
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

  // console.log(userProfileInfo);
  // console.log(drivingLicenseData);
  //Data disabled edit
  useEffect(() => {
    if (isTimeExpired(drivingLicenseData?.createdAt) && drivingLicenseData?.licenseNumber && drivingLicenseData?.status === 'pending') {
      setIsDisableData(true);
    } else {
      setIsDisableData(false);
    }
  }, [drivingLicenseData]);

  // set saved data when updating info
  useEffect(() => {
    if (drivingLicenseData) {
      const { country, state, licenseName, licenseNumber, expiryDate } = drivingLicenseData;
      setValue('drivingLicenseInfo.licenseName', licenseName, { shouldValidate: true });
      setValue('drivingLicenseInfo.licenseNumber', licenseNumber, { shouldValidate: true });
      setValue('drivingLicenseInfo.dateOfBirth', dayjs(dateOfBirth).toDate(), { shouldValidate: true });
      setValue('drivingLicenseInfo.country', country, { shouldValidate: true });
      setValue('drivingLicenseInfo.state', state);
      setValue('drivingLicenseInfo.expiryDate', dayjs(expiryDate).toDate(), { shouldValidate: true });
    }
    if (userProfileInfo?.gender) {
      setValue('drivingLicenseInfo.gender', userProfileInfo?.gender, { shouldValidate: true });
    }
  }, [drivingLicenseData, userProfileInfo?.gender]);

  const onLicenseInfoSave: SubmitHandler<LicenseNumVerType> = async (data) => {
    // console.log(data);
    const status = drivingLicenseData?.status;
    try {
      userCred?.userId &&
        (await mutateAsync({
          userId: userCred?.userId,
          // drivingLicenseInfo: data?.drivingLicenseInfo
          drivingLicenseInfo: {
            ...data?.drivingLicenseInfo,
            licenseNumber: data?.drivingLicenseInfo?.licenseNumber.toUpperCase(),
          },
          drivingLicenseInfoItemId: status === 'pending' ? drivingLicenseData?._id : undefined,
        }));
    } catch (error) {
      console.log('onLicenseInfoSave error', error);
    }
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
        <LicenseInfoDetails
          {...commonProps}
          drivingLicenseData={drivingLicenseData}
          dateOfBirth={dateOfBirth}
          returnDate={returnDate}
          isDisabledData={isDisabledData}
        />
        {userProfileInfo?.guestVerification?.drivingLicenseInfo && !isDisabledData && (
          <>
            <Typography className="my-4 text-justify text-sm text-accent">
              <b>{`N.B:`}</b>
              {` The modification for the Driver's License will be effective after validate the information from support agent`}
            </Typography>
          </>
        )}
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

export default LicenseModal;
