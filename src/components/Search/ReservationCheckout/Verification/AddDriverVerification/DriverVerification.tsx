'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useApproveDriver } from '@/hooks/car-listing/additional-drivers/useApproveDriver';
import { useDeclineDriver } from '@/hooks/car-listing/additional-drivers/useDeclineDriver';
import { useFindDriver } from '@/hooks/car-listing/additional-drivers/useFindDriver';
import { Alert, Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
// import DriverVerificationOptions from './DriverVerificationOption';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import VerificationSteps from '@/components/GuestVerification/VerificationSteps';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';

const DriverVerification = () => {
  useFindDriver();
  const { userCred } = useUserCredContext();
  const isIPadPro = useIPadProQuery();
  //   console.log(userCred?.email);
  const { driverApproved, driverDeclined, driverError, guestAccess } = useProfileInfoContext();
  // const params = useParams();
  const { requestId } = useParams<{ requestId: string }>();
  const router = useRouter();
  const { openSnackBar } = useSnackBarContext();
  const { mutateAsync: driverApproval, isLoading, isSuccess } = useApproveDriver(); //Driver approval
  const { mutateAsync: driverDecline, isLoading: declineLoading, isSuccess: declineSuccess } = useDeclineDriver(); //Driver decline
  //   console.log(params);
  const { guestVerificationFlags, verificationStatusFlags } = useSearchContext();
  //   For Approval
  const handleApprove = async () => {
    try {
      await driverApproval({
        requestId: requestId,
        email: userCred?.email,
      });
      openSnackBar({
        message: 'Request Accepted',
        severity: 'success',
        hideDuration: 3000,
      });
      router.push('/');
    } catch (error: any) {
      console.log(error);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Request Accept Error',
        severity: 'error',
      });
    }
  };
  // For Decline
  const handleDecline = async () => {
    try {
      await driverDecline({
        requestId: requestId,
        email: userCred?.email,
      });
      openSnackBar({
        message: 'Request Declined',
        severity: 'success',
        hideDuration: 3000,
      });
      router.push('/');
    } catch (error: any) {
      console.log(error);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Request Decline Error',
        severity: 'error',
      });
    }
  };
  //   console.log(guestVerificationFlags);
  // const excludedFlags = ['isProfilePhotoVerified', 'isLicenseFaceVerified'];
  // const isApproveButtonDisabled = Object.entries(guestVerificationFlags).some(([key, value]) => !excludedFlags.includes(key) && value === false);
  //   console.log(isApproveButtonDisabled);
  return (
    <div className="flex items-normal justify-normal md:items-center md:justify-center">
      <div className={`py-2 px-2 md:px-12 md:py-4 bg-white rounded-xl shadow-lg w-full ${isIPadPro ? 'w-5/6' : 'md:w-5/6 lg:w-1/2'} `}>
        {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
        {isGuestSuspended(guestAccess) && <CommonAccStatusAlert isGuest={true} isSuspend={true} />}
        <span className="flex justify-center text-sm md:text-lg lg:text-xl font-bold">Additional Driver Verification</span>
        {driverApproved && !driverDeclined && (
          <div className="w-full flex">
            <Alert severity="info" className="w-full">
              The request is already approved
            </Alert>
          </div>
        )}
        {!driverApproved && driverDeclined && (
          <div className="w-full flex">
            <Alert severity="info" className="w-full">
              The request is already declined
            </Alert>
          </div>
        )}
        {driverError && (
          <div className="w-full flex">
            <Alert severity="info" className="w-full">
              {driverError}
            </Alert>
          </div>
        )}
        {!driverApproved && !driverDeclined && (driverError === undefined || driverError === '') && (
          <>
            <div className="my-4">
              {/* <DriverVerificationOptions /> */}
              <VerificationSteps />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outlined" color="error" className="normal-case font-semibold" onClick={handleDecline}>
                Decline
              </Button>
              <Button
                variant="outlined"
                color="primary"
                // disabled={isApproveButtonDisabled}
                disabled={
                  Object.values(verificationStatusFlags).some((value) => value === false) ||
                  isLoading ||
                  isGuestRestrict(guestAccess) ||
                  isGuestSuspended(guestAccess)
                }
                className="normal-case font-semibold"
                onClick={handleApprove}
              >
                Approve
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DriverVerification;
