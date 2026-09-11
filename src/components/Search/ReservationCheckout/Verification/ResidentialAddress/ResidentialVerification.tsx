'use client';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ContactDetailsProps } from '@/types/componentTypes';
import { isTimeExpired } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import VerificationContainer from '../VerificationContainer';
import ResidentialVerModal from './ResidentialVerModal';

const ResidentialVerification = ({ hideTitle, isPreviousStepVerified }: ContactDetailsProps) => {
  const { userProfileInfo, userCred } = useUserCredContext();
  const { openModal } = useModalContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  //   console.log(userProfileInfo?.guestVerification?.residentialAddress?.residentialAddress);
  const handleVerifyAddress = () => {
    openModal({
      title: 'Residential Address Verification',
      content: <ResidentialVerModal />,
    });
  };
  const is30minsOver = isTimeExpired(userProfileInfo?.guestVerification?.residentialAddress?.createdAt);
  const not30minsOver = !!userProfileInfo?.guestVerification?.residentialAddress?.createdAt && !is30minsOver;
  return (
    <VerificationContainer
      isStatusError={userProfileInfo?.guestVerification?.residentialAddress?.status === 'declined'}
      isVerified={
        ((is30minsOver && userProfileInfo?.guestVerification?.residentialAddress?.status === 'pending') ||
          userProfileInfo?.guestVerification?.residentialAddress?.status === 'approved') &&
        !!userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo
      }
      isNotDisabledData={not30minsOver && userProfileInfo?.guestVerification?.residentialAddress?.status === 'pending'}
      showStatus={true}
      statusBadgeProps={{ status: userProfileInfo?.guestVerification?.residentialAddress?.status || 'pending', showTooltip: true }}
      // title={hideTitle ? '' : `${isSmallScreen ? 'Address' : 'Residential Address'}`}
      title={hideTitle ? '' : `Address`}
      toolTip={`Please provide your current residential address below for system validation purposes`}
      // buttonTitle={`${isSmallScreen ? `${!is30minsOver ? 'Edit' : 'Add'}` : `${!is30minsOver ? 'Edit Address' : 'Add Address'}`}`}
      buttonTitle={`${not30minsOver ? 'Edit' : 'Add'}`}
      handleOnClick={handleVerifyAddress}
      isPreviousStepVerified={isPreviousStepVerified ?? true}
    ></VerificationContainer>
  );
};

export default ResidentialVerification;
