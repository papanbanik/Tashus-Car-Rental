'use client';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import AccountVerify from '@/components/Verification/AccountVerify';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useApproveDriver } from '@/hooks/car-listing/additional-drivers/useApproveDriver';
import { useDeclineDriver } from '@/hooks/car-listing/additional-drivers/useDeclineDriver';
import { useFindDriver } from '@/hooks/car-listing/additional-drivers/useFindDriver';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Alert, Button, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import DrivingApproval from '../../../../../../public/Images/Profile/drivingFrame.png';

const DriverVerificationUpdated = () => {
  const { isLoading: driverLoading } = useFindDriver();
  const { userCred } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { guestVerification } = userProfileVerificationInfo ?? {};
  const isFinalApproved = guestVerification?.finalVerificationStatus === 'approved';
  const { driverApproved, driverDeclined, driverError, guestAccess } = useProfileInfoContext();
  const { requestId } = useParams<{ requestId: string }>();
  const router = useRouter();
  const { mutateAsync: driverApproval, isLoading } = useApproveDriver(); //Driver approval
  const { mutateAsync: driverDecline, isLoading: declineLoading } = useDeclineDriver(); //Driver decline
  //   For Approval
  const handleApprove = async () => {
    try {
      await driverApproval({
        requestId: requestId,
        email: userCred?.email,
      });
      router.push('/');
    } catch (error: any) {
      console.log('Approval Error', error);
    }
  };
  // For Decline
  const handleDecline = async () => {
    try {
      await driverDecline({
        requestId: requestId,
        email: userCred?.email,
      });
      router.push('/');
    } catch (error: any) {
      console.log('Declined Error', error);
    }
  };
  const isApproved = driverApproved && !driverDeclined;
  const isDeclined = !driverApproved && driverDeclined;
  const isError = !!driverError;
  const isShow = !driverApproved && !driverDeclined && (driverError === undefined || driverError === '');
  const infoText = isApproved ? ' The request is already approved' : isDeclined ? 'The request is already declined' : isError && driverError;
  return (
    <div className="flex justify-center  min-h-[50vh]">
      {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
      {isGuestSuspended(guestAccess) && <CommonAccStatusAlert isGuest={true} isSuspend={true} />}
      <div className="bg-white rounded-lg shadow-md shadow-secondary my-4 md:my-12 mx-2 w-full md:w-2/3">
        <span className="flex justify-center text-lg md:text-2xl font-bold my-4">Additional Driver Verification</span>
        {driverLoading ? (
          <div className="p-4">
            <Skeleton variant="text" className="rounded-lg my-4 text-lg" />
            <Skeleton variant="rectangular" height={118} className="rounded-lg" />
          </div>
        ) : (
          <>
            {(isApproved || isDeclined || isError) && (
              <>
                <div className="relative flex justify-center items-center h-28">
                  <Image src={DrivingApproval} alt="Verified" objectFit="contain" className="h-full" />
                </div>
                <div className="w-full p-4">
                  <Alert severity="info">{infoText}</Alert>
                </div>
              </>
            )}
            {isShow && (
              <div className="flex flex-col justify-center items-center">
                <div className="my-4 flex justify-center items-center w-full md:w-5/6">
                  <AccountVerify noBC={true} isFullWidth={true} />
                </div>
                <span className="font-bold p-2">{`Do you want to accept or declined additional driver request?`}</span>
                <div className="w-full grid grid-cols-2 gap-4 p-4">
                  <Button variant="outlined" color="error" className="normal-case font-semibold" onClick={handleDecline} disabled={declineLoading}>
                    {declineLoading ? 'Declining' : 'Decline'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={!isFinalApproved || isLoading || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
                    className="normal-case font-semibold"
                    onClick={handleApprove}
                  >
                    {isLoading ? 'Accepting' : 'Accept'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DriverVerificationUpdated;
