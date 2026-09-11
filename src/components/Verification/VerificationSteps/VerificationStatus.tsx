import CommonVerificationStatus from '@/components/Common/Verification/CommonVerificationStatus';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { getVerificationStatusInfo } from '@/utils/Functions/verification/verificationStepsFn';
import { useEffect, useState } from 'react';

const VerificationStatus = () => {
  const { setIsAllVerificationStepsCompleted } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const [statusText, setStatusText] = useState<string>('incomplete');
  const [dynamicText, setDynamicText] = useState<string | JSX.Element>('');

  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerificationInfo = userProfileVerificationInfo?.guestVerification;

  useEffect(() => {
    const { verificationStatus, dynamicText, isAllStepsCompleted } = getVerificationStatusInfo(profileInfo, guestVerificationInfo);
    setStatusText(verificationStatus);
    setDynamicText(dynamicText);
    if (isAllStepsCompleted) {
      setIsAllVerificationStepsCompleted(isAllStepsCompleted);
    }
  }, [profileInfo, guestVerificationInfo]);

  return (
    <div>
      <CommonVerificationStatus status={statusText} text={dynamicText} />
    </div>
  );
};

export default VerificationStatus;
