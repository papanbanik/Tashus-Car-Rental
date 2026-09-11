'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { getVerificationStatusInfo } from '@/utils/Functions/verification/verificationStepsFn';
import { getTextColorClass } from '@/utils/Functions/verification/verificationStyleFn';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import DrivingApproval from '../../../../public/Images/Profile/drivingFrame.png';

const Verified = () => {
  const router = useRouter();
  const { userCred, setIsAllVerificationStepsCompleted, isAllVerificationStepsCompleted } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerificationInfo = userProfileVerificationInfo?.guestVerification;
  const [conditionalStatus, setConditionalStatus] = useState<string>('incomplete');
  const [conditionalText, setConditionalText] = useState<string | JSX.Element>('');
  const [dynamicSearchParams, setDynamicSearchParams] = useState<string>('profile');
  useEffect(() => {
    const { verificationStatus, dynamicText, isAllStepsCompleted, dynamicSearchParams } = getVerificationStatusInfo(
      profileInfo,
      guestVerificationInfo
    );
    setConditionalText(dynamicText);
    setConditionalStatus(verificationStatus);
    setDynamicSearchParams(dynamicSearchParams);
    if (isAllStepsCompleted) {
      setIsAllVerificationStepsCompleted(isAllStepsCompleted);
    }
  }, [profileInfo, guestVerificationInfo]);
  return (
    <div className="flex flex-col md:flex-row border border-solid border-accent rounded-lg my-6">
      <div className="relative flex justify-start h-28">
        <Image src={DrivingApproval} alt="Verified" objectFit="contain" className="h-full" />
      </div>
      <div className="flex flex-col gap-2 p-4 w-full">
        <div className="flex justify-between">
          <b>Driving Approval</b>
          <span className="capitalize">
            <b>Status: </b>
            <span className={`text-${getTextColorClass(conditionalStatus)}`}> {conditionalStatus}</span>
          </span>
        </div>
        <span className="text-xs text-gray-500 italic"> {typeof conditionalText === 'string' ? `“${conditionalText}”` : conditionalText}</span>
        {!isAllVerificationStepsCompleted && (
          <div className="flex justify-start">
            <Button
              variant="contained"
              size="small"
              color="success"
              className="normal-case mt-2 text-xs"
              endIcon={<FaArrowRight />}
              onClick={() => router.push(`/au/verify-account/${userCred?.userId}?step=${dynamicSearchParams}`)}
            >
              Complete Verification
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verified;
