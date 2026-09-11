'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetVerificationInfo } from '@/hooks/profile/verification-steps/useGetVerificationInfo';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { AccountVerificationStep } from '@/types/user-verification/verificationListingSteps';
import { ECommonText } from '@/utils/Functions/randomCommonFn';
import { getIndividualVerificationCompleteState, getVerificationStatusInfo } from '@/utils/Functions/verification/verificationStepsFn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CommonBreadCrumb from '../Common/Breadcrumbs/CommonBreadCrumb';
import VerificationSkeleton from './VerificationSkeleton';
import VerificationStatus from './VerificationSteps/VerificationStatus';
import VerifyStepper from './VerificationSteps/VerifyStepper';

const AccountVerify = ({ noBC, isFullWidth }: { noBC?: boolean; isFullWidth?: boolean }) => {
  useGetVerificationInfo();
  useHealthCheck();
  const { currentVerificationStep, accountVerificationStepsList, setAccountVerificationStepsList, updateCurrentVerificationStep } =
    useProfileInfoContext();
  const { userCred, setIsAllVerificationStepsCompleted } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const profileInfo = userProfileVerificationInfo?.profileInfo ?? {};
  const guestVerificationInfo = userProfileVerificationInfo?.guestVerification ?? {};
  const [stepParam, setStepParam] = useState<string>('profile');

  const { isProfileStepComplete, isLicenseStepComplete, isAddressStepComplete } = getIndividualVerificationCompleteState(userProfileVerificationInfo);

  //Check Query Params
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const vehicleId = searchParams.get('vehicle');

  //Add router
  const router = useRouter();

  const updateStepState = () => {
    const updatedSteps = accountVerificationStepsList.map((step) => {
      switch (step.label) {
        case 'Profile':
          return { ...step, isCompleted: isProfileStepComplete };
        case 'License':
          return { ...step, isCompleted: isLicenseStepComplete };
        case 'Address':
          return { ...step, isCompleted: isAddressStepComplete };
        default:
          return step;
      }
    });
    setAccountVerificationStepsList(updatedSteps as AccountVerificationStep[]);
  };
  useEffect(() => {
    updateStepState();
  }, [userProfileVerificationInfo]);

  //Set Query Params wise Step
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const step = queryParams.get('step');
    setStepParam(step ?? 'profile');
  }, []);
  useEffect(() => {
    if (stepParam) {
      const stepIndex = accountVerificationStepsList?.findIndex((step) => step?.label?.toLowerCase() === stepParam?.toLowerCase());
      if (stepIndex !== -1) {
        const newStepId = accountVerificationStepsList[stepIndex]?.id;
        updateCurrentVerificationStep(newStepId);
      }
    }
  }, [stepParam]);

  // Back to checkout page
  useEffect(() => {
    const { isAllStepsCompleted, verificationStatus } = getVerificationStatusInfo(profileInfo, guestVerificationInfo);
    if (isAllStepsCompleted) {
      setIsAllVerificationStepsCompleted(isAllStepsCompleted);
    }
    if ((verificationStatus === 'approved' || verificationStatus === 'pending') && source === 'checkout' && !!vehicleId) {
      router.push(`/search/${vehicleId}/checkout`);
    }
  }, [profileInfo, guestVerificationInfo, vehicleId, source]);

  const accountVerifyBreadcrumbItems = [
    { label: 'Home', href: '/' },
    // { label: 'Get Verified', href: '/get-verified' },
    source === 'checkout' ? { label: 'Checkout', href: `/search/${vehicleId}/checkout` } : { label: 'Get Verified', href: '/get-verified' },
    { label: `Complete Verification` },
  ];
  return (
    <>
      <div className="flex items-normal justify-normal  md:justify-center">
        {noBC ? (
          ''
        ) : (
          <div className="w-full md:w-2/3 md:m-4 rounded-lg">
            <CommonBreadCrumb items={accountVerifyBreadcrumbItems} />
          </div>
        )}
      </div>
      <div className="flex items-normal justify-normal md:items-center md:justify-center">
        <div className={`bg-white w-full ${isFullWidth ? '' : 'md:w-2/3'} p-4 md:m-4 rounded-lg`}>
          <div className={`sticky z-40`}>{userCred?.loggedIn ? <VerifyStepper /> : <VerificationSkeleton />}</div>
          {userCred?.loggedIn && currentVerificationStep && (
            <>
              <VerificationStatus />
              <span className="helping_text py-1">{ECommonText.RequiredHelpingText}</span>
              {currentVerificationStep?.component}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountVerify;
