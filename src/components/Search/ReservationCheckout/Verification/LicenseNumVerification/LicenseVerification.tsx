import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TDate } from '@/types/commonTypes';
import { isDrivingAgeValid, isLicenseExpired } from '@/utils/Functions/dateTimeCommonFn';
import { isTimeExpired } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Chip from '@mui/material/Chip/Chip';
import IconButton from '@mui/material/IconButton/IconButton';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import VerificationContainer from '../VerificationContainer';
import LicenseModal from './LicenseModal';

export interface ILicenseNumVerification {
  returnDate?: TDate;
  isPreviousStepVerified?: boolean;
}

const LicenseNumVerification = ({ returnDate, isPreviousStepVerified }: ILicenseNumVerification) => {
  const { userProfileInfo } = useUserCredContext();
  const { openModal } = useModalContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isExpired = userProfileInfo?.guestVerification?.drivingLicenseInfo?.expiryDate
    ? isLicenseExpired(userProfileInfo?.guestVerification?.drivingLicenseInfo?.expiryDate)
    : false;

  const isAgeValid = userProfileInfo?.dateOfBirth ? isDrivingAgeValid(userProfileInfo?.dateOfBirth) : true;

  const handleVerifyLicenseNum = () => {
    openModal({
      title: 'Driver License Verification',
      content: (
        <LicenseModal
          drivingLicenseData={userProfileInfo?.guestVerification?.drivingLicenseInfo}
          dateOfBirth={userProfileInfo?.dateOfBirth}
          returnDate={returnDate}
        ></LicenseModal>
      ),
    });
  };
  const is30minsOver = isTimeExpired(userProfileInfo?.guestVerification?.drivingLicenseInfo?.createdAt);
  const not30minsOver = !!userProfileInfo?.guestVerification?.drivingLicenseInfo?.createdAt && !is30minsOver;
  return (
    <VerificationContainer
      isStatusError={userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'declined'}
      isError={isExpired || !isAgeValid}
      isVerified={
        ((is30minsOver && userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'pending') ||
          userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'approved') &&
        !!userProfileInfo?.guestVerification?.drivingLicenseInfo
      }
      isNotDisabledData={not30minsOver && userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'pending'}
      showStatus={true}
      statusBadgeProps={{ status: userProfileInfo?.guestVerification?.drivingLicenseInfo?.status || 'pending', showTooltip: true }}
      title="Driver License"
      toolTip={`Legal authorization to drive a vehicle.`}
      // buttonTitle={`${isSmallScreen ? 'Add' : 'Add License Details'}`}
      // buttonTitle={`${isSmallScreen ? `${!is30minsOver ? 'Edit' : 'Add'}` : `${!is30minsOver ? 'Edit License Details' : 'Add License Details'}`}`}
      buttonTitle={`${not30minsOver ? 'Edit' : 'Add'}`}
      handleOnClick={handleVerifyLicenseNum}
      verifiedData={userProfileInfo?.guestVerification?.drivingLicenseInfo?.licenseNumber}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
    >
      {!isAgeValid && (
        <div className="flex justify-start items-start">
          <Tooltip
            enterTouchDelay={0}
            className="flex"
            title="Age needs to be between 21 to 75 years. To ensure accurate age validation, please contact our support team"
            placement="top"
          >
            <IconButton size="small">
              <AiOutlineExclamationCircle className="text-error" size={22} />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {isAgeValid && isExpired && (
        <div className="flex justify-start items-start">
          <Chip color="error" size="small" variant="outlined" label="Expired"></Chip>
          <Button size="small" className="normal-case underline text-md font-semibold p-0" onClick={handleVerifyLicenseNum}>
            Update
          </Button>
        </div>
      )}
    </VerificationContainer>
  );
};

export default LicenseNumVerification;
