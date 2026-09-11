import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetVerificationInfo } from '@/hooks/profile/verification-steps/useGetVerificationInfo';
import { getVerificationStatusInfo } from '@/utils/Functions/verification/verificationStepsFn';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';

const GetVerifiedStepsButton = () => {
  useGetVerificationInfo();
  const { userCred, isAllVerificationStepsCompleted, setIsAllVerificationStepsCompleted } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerificationInfo = userProfileVerificationInfo?.guestVerification;
  const isFinalApproved = isAllVerificationStepsCompleted && userProfileVerificationInfo?.guestVerification?.finalVerificationStatus === 'approved';
  const router = useRouter();

  useEffect(() => {
    const { isAllStepsCompleted } = getVerificationStatusInfo(profileInfo, guestVerificationInfo);
    if (isAllStepsCompleted) {
      setIsAllVerificationStepsCompleted(isAllStepsCompleted);
    }
  }, [profileInfo, guestVerificationInfo]);

  return (
    <div>
      {isFinalApproved ? (
        <span className="flex items-center">
          <MdVerified className="text-success" /> Verified and ready to Go!{'  '}
          <Link target="_blank" href={'/search'}>
            Find your vehicles
          </Link>
        </span>
      ) : isAllVerificationStepsCompleted ? (
        <Button variant="contained" className="normal-case" onClick={() => router.push(`/au/verify-account/${userCred?.userId}`)}>
          Pending Verification...
        </Button>
      ) : (
        <Button
          variant="contained"
          color="success"
          className="normal-case"
          endIcon={<FaArrowRight />}
          onClick={() => router.push(`/au/verify-account/${userCred?.userId}`)}
        >
          Complete Verification
        </Button>
      )}
    </div>
  );
};

export default GetVerifiedStepsButton;
