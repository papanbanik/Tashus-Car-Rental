import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { getVerificationStatusInfo, getVerificationStepsHighlight } from '@/utils/Functions/verification/verificationStepsFn';
import { getTextColorClass } from '@/utils/Functions/verification/verificationStyleFn';
import { Button, Collapse, Divider } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsPatchExclamationFill } from 'react-icons/bs';

const CheckoutVerification = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { userCred, setIsAllVerificationStepsCompleted } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerificationInfo = userProfileVerificationInfo?.guestVerification;
  const [status, setStatus] = useState<string>('incomplete');
  const [dynamicText, setDynamicText] = useState<string | JSX.Element>('');
  const [dynamicSearchParams, setDynamicSearchParams] = useState<string>('profile');
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [verificationHightLights, setVerificationHightLights] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const { verificationStatus, dynamicText, isAllStepsCompleted, dynamicSearchParams } = getVerificationStatusInfo(
      profileInfo,
      guestVerificationInfo,
      pathName
    );
    setDynamicText(dynamicText);
    setStatus(verificationStatus);
    setDynamicSearchParams(dynamicSearchParams);
    if (isAllStepsCompleted) {
      setIsAllVerificationStepsCompleted(isAllStepsCompleted);
    }
    const verificationHightLights = getVerificationStepsHighlight(profileInfo, guestVerificationInfo);
    setVerificationHightLights(verificationHightLights);
  }, [profileInfo, guestVerificationInfo, userCred]);

  const baseUrl =
    status !== 'Incomplete'
      ? `/dashboard/${userCred?.userId}/profile-info?source=checkout&vehicle=${vehicleId}`
      : `/au/verify-account/${userCred?.userId}?step=${dynamicSearchParams}&source=checkout&vehicle=${vehicleId}`;

  return (
    <div className={`bg-white shadow-lg shadow-secondary rounded-lg w-full md:my-6 mb-3`}>
      <div className="flex justify-between">
        <span className="md:p-4 px-2 font-bold">Verification Status</span>
        <span className={`md:p-4 px-2 capitalize text-${getTextColorClass(status)}`}>{status}</span>
      </div>
      <Divider />
      <div className="col-span-3 flex justify-between items-center gap-2 md:p-4 px-2">
        <div>
          <BsPatchExclamationFill size={20} className="text-primary" />
        </div>
        <div>
          <span className="text-xs sm:text-sm md:text-base lg:text-md font-semibold text-justify">{dynamicText}</span>
        </div>
        {status !== 'pending' && status !== 'manualDeclined' && (
          <div>
            <Button variant="contained" color="success" className="normal-case" onClick={() => router.push(baseUrl)}>
              {status !== 'Incomplete' ? 'Edit' : 'Complete'}
            </Button>
          </div>
        )}
      </div>
      {status === 'Incomplete' && (
        <>
          <Divider />
          <div className="p-2">
            <Collapse in={isExpand}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {Object.entries(verificationHightLights).map(([category, steps]) =>
                  steps.length > 0 ? (
                    <div key={category} className="border">
                      <span className="font-bold">{category}:</span>
                      {steps.map((step, index) => (
                        <span key={index} className="block">
                          - {step}
                        </span>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            </Collapse>
            {isExpand && <Divider className="my-1 w-full" />}
            <span
              onClick={() => setIsExpand(!isExpand)}
              className="w-full flex justify-center items-center text-center text-primary underline cursor-pointer"
            >
              {isExpand ? 'Hide Details' : 'Show Details'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutVerification;
