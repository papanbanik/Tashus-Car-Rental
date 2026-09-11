'use client';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TDate } from '@/types/commonTypes';
import { isLicenseExpired } from '@/utils/Functions/dateTimeCommonFn';
import { isTimeExpired } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Chip from '@mui/material/Chip/Chip';
import VerificationContainer from '../VerificationContainer';
import SecondaryPhotoIDModal from './SecondaryPhotoIDModal';

export interface ISecondaryPhotoIDVerification {
  returnDate?: TDate;
  isPreviousStepVerified?: boolean;
}

const SecondaryPhotoIDVerification = ({ returnDate, isPreviousStepVerified }: ISecondaryPhotoIDVerification) => {
  const { userProfileInfo } = useUserCredContext();
  const { openModal } = useModalContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isExpired = userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate
    ? isLicenseExpired(userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate)
    : false;
  // console.log(isExpired);
  // console.log(isAgeValid);

  const handleVerifySecondaryIDDetails = () => {
    openModal({
      title: 'Secondary ID Verification',
      content: (
        <SecondaryPhotoIDModal secondaryIdData={userProfileInfo?.guestVerification?.secondaryIdInfo} returnDate={returnDate}></SecondaryPhotoIDModal>
      ),
    });
  };
  const is30minsOver = isTimeExpired(userProfileInfo?.guestVerification?.secondaryIdInfo?.createdAt);
  // console.log(!isTimeExpired(userProfileInfo?.guestVerification?.secondaryIdInfo?.createdAt));
  // console.log(userProfileInfo?.guestVerification?.secondaryIdInfo?.createdAt);
  // console.log(!!userProfileInfo?.guestVerification?.secondaryIdInfo?.createdAt);
  const not30minsOver = !!userProfileInfo?.guestVerification?.secondaryIdInfo?.createdAt && !is30minsOver;
  // console.log(not30minsOver);
  return (
    <VerificationContainer
      // isVerified={false}
      isStatusError={userProfileInfo?.guestVerification?.secondaryIdInfo?.status === 'declined'}
      isError={isExpired}
      // isVerified={!!userProfileInfo?.guestVerification?.secondaryIdInfo?.idType}
      isVerified={
        ((is30minsOver && userProfileInfo?.guestVerification?.secondaryIdInfo?.status === 'pending') ||
          userProfileInfo?.guestVerification?.secondaryIdInfo?.status === 'approved') &&
        !!userProfileInfo?.guestVerification?.secondaryIdInfo?.idType
      }
      isNotDisabledData={not30minsOver && userProfileInfo?.guestVerification?.secondaryIdInfo?.status === 'pending'}
      showStatus={true}
      statusBadgeProps={{ status: userProfileInfo?.guestVerification?.secondaryIdInfo?.status || 'pending', showTooltip: true }}
      title="Secondary ID"
      // toolTip={`Please provide another government issued photo ID such as a passport for secondary verification of your identity details.`}
      toolTip={`Submit an additional government-issued photo ID, such as a passport, NID etc. for secondary verification of your identity details`}
      // buttonTitle={`${isSmallScreen ? 'Add' : 'Add Secondary Details'}`}
      // buttonTitle={`${isSmallScreen ? `${!is30minsOver ? 'Edit' : 'Add'}` : `${!is30minsOver ? 'Edit Secondary Details' : 'Add Secondary Details'}`}`}
      buttonTitle={`${not30minsOver ? 'Edit' : 'Add'}`}
      handleOnClick={handleVerifySecondaryIDDetails}
      verifiedData={userProfileInfo?.guestVerification?.secondaryIdInfo?.idNumber}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
    >
      {isExpired && (
        <div className="flex justify-start items-start">
          <Chip color="error" size="small" variant="outlined" label="Expired"></Chip>
          <Button size="small" className="normal-case underline text-md font-semibold p-0" onClick={handleVerifySecondaryIDDetails}>
            Update
          </Button>
        </div>
      )}
    </VerificationContainer>
  );
};

export default SecondaryPhotoIDVerification;
