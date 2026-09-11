import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TDate } from '@/types/commonTypes';
import { isDrivingAgeValid, isLicenseExpired } from '@/utils/Functions/dateTimeCommonFn';
import { useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Chip from '@mui/material/Chip/Chip';
import IconButton from '@mui/material/IconButton/IconButton';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import LicenseModal from './LicenseNumVerification/LicenseModal';
import VerificationContainer from './VerificationContainer';

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

  // console.log(isExpired);
  // console.log(isAgeValid);

  const handleVerifyLicenseNum = () => {
    openModal({
      title: 'Driver License Verification',
      content: (
        // <LicenseNumVerModal
        //   drivingLicenseData={userProfileInfo?.guestVerification?.drivingLicenseInfo}
        //   dateOfBirth={userProfileInfo?.dateOfBirth}
        //   returnDate={returnDate}
        // ></LicenseNumVerModal>
        <LicenseModal
          drivingLicenseData={userProfileInfo?.guestVerification?.drivingLicenseInfo}
          dateOfBirth={userProfileInfo?.dateOfBirth}
          returnDate={returnDate}
        />
      ),
    });
  };
  // console.log(!isAgeValid);
  return (
    <VerificationContainer
      // isVerified={false}
      isStatusError={userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'declined'}
      isError={isExpired || !isAgeValid}
      // isVerified={!!userProfileInfo?.guestVerification?.drivingLicenseInfo}
      isVerified={
        (userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'pending' ||
          userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'approved') &&
        !!userProfileInfo?.guestVerification?.drivingLicenseInfo
      }
      showStatus={true}
      statusBadgeProps={{ status: userProfileInfo?.guestVerification?.drivingLicenseInfo?.status || 'pending', showTooltip: true }}
      title="Driver License"
      // toolTip={`Upload an image of your driver's license for identity verification purposes. Ensure it is clearly readable`}
      toolTip={`Legal authorization to drive a vehicle.`}
      buttonTitle={`${isSmallScreen ? 'Add' : 'Add License Details'}`}
      handleOnClick={handleVerifyLicenseNum}
      verifiedData={userProfileInfo?.guestVerification?.drivingLicenseInfo?.licenseNumber}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
    >
      {!isAgeValid && (
        <div className="flex justify-start items-start">
          <Tooltip
            enterTouchDelay={0}
            className="flex"
            // title="Age needs to be between 21 to 75 years"
            title="Age needs to be between 21 to 75 years. To ensure accurate age validation, please contact our support team"
            // title={<Chip className="bg-white" color="error" size="small" variant="outlined" label="Age needs to be between 21 to 75 years"></Chip>}
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
