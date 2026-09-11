import EmailVerModal from '@/components/Search/ReservationCheckout/Verification/EmailVerModal';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { ECommonText } from '@/utils/Functions/randomCommonFn';
import { Button, useMediaQuery } from '@mui/material';
const ProfileEmailVerify = () => {
  const { userProfileInfo, userCred } = useUserCredContext();
  const { openModal } = useModalContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const handleVerifyEmail = () => {
    openModal({
      title: 'Email Verification',
      content: <EmailVerModal></EmailVerModal>,
    });
  };
  return (
    <div className="flex flex-col md:flex-row md:justify-between">
      <span className="text-gray-400">{userCred?.email}</span>
      {userProfileInfo?.verificationInfo?.email?.isVerified ? (
        <span className="text-success">{`${isSmallScreen ? '(Verified)' : 'Verified'}`}</span>
      ) : (
        <div>
          <Button
            size="small"
            disabled={
              isPartnerRestrict(partnerAccess) || isPartnerSuspended(partnerAccess) || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)
            }
            className="normal-case underline text-md font-semibold"
            onClick={handleVerifyEmail}
          >
            {'Verify'}
            {ECommonText.RequiredSign}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileEmailVerify;
