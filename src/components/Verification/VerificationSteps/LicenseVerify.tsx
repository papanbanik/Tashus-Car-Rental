import ExpandableHelpingBox from '@/components/Common/Verification/CombineSection';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { getRequestVerificationMessages } from '@/utils/Functions/verification/verificationFn';
import { getIndividualVerificationCompleteState, getUpdatedUrl } from '@/utils/Functions/verification/verificationStepsFn';
import { licenseDetailsHelpingData, licenseHelpingData, licenseSelfieHelpingData, secondaryIDHelpingData } from '@/utils/Lists/verificationStepList';
import { Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import LicenseDetailsVerify from './License/LicenseDetailsVerify';
import LicensePhotoVerify from './License/LicensePhotoVerify';
import LicenseSelfieVerify from './License/LicenseSelfieVerify';
import SecondaryIDVerify from './License/SecondaryIDVerify';

const LicenseVerify = () => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { handleSaveCurrentVerificationStep, updateCurrentVerificationStep } = useProfileInfoContext();
  const router = useRouter();
  const pathname = usePathname();
  // console.log(userProfileVerificationInfo?.guestVerification);
  const isCountryAustralia = !!userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country
    ? userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country === 'Australia'
    : true;
  const { isLicenseStepComplete } = getIndividualVerificationCompleteState(userProfileVerificationInfo);

  const handleNext = () => {
    if (isLicenseStepComplete) {
      handleSaveCurrentVerificationStep(2);
    }
    updateCurrentVerificationStep(3);
    // const queryParams = new URLSearchParams({ step: 'address' }).toString();
    // const url = `${pathname}?${queryParams}`;
    // router.push(url);
    router.push(getUpdatedUrl(pathname, 'address'));
  };

  const handleBack = () => {
    updateCurrentVerificationStep(1);
    // const queryParams = new URLSearchParams({ step: 'profile' }).toString();
    // const url = `${pathname}?${queryParams}`;
    // router.push(url);
    router.push(getUpdatedUrl(pathname, 'profile'));
  };

  const { licenseMessage } = getRequestVerificationMessages(userProfileVerificationInfo);
  return (
    <div>
      {/* <CommonVerificationStatus status={statusText ?? 'incomplete'} text="Add your license information to complete your verification process" /> */}
      <ExpandableHelpingBox
        title="License photo"
        helpingBoxes={licenseHelpingData}
        showStatus={!!userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.status}
        status={userProfileVerificationInfo?.guestVerification?.drivingLicensePhoto?.status}
        message={licenseMessage?.licensePhotoMessage}
        isMandatory={true}
      >
        <LicensePhotoVerify />
      </ExpandableHelpingBox>
      <ExpandableHelpingBox
        title="License Details"
        helpingBoxes={licenseDetailsHelpingData}
        showStatus={!!userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.status}
        status={userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.status}
        message={licenseMessage?.licenseInfoMessage}
        isMandatory={true}
      >
        <LicenseDetailsVerify />
      </ExpandableHelpingBox>
      <ExpandableHelpingBox
        title="Selfie with License"
        helpingBoxes={licenseSelfieHelpingData}
        showStatus={!!userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.status}
        status={userProfileVerificationInfo?.guestVerification?.drivingLicenseWithFace?.status}
        message={licenseMessage?.licenseSelfieMessage}
        isMandatory={true}
      >
        <LicenseSelfieVerify />
      </ExpandableHelpingBox>
      {/* {(!isCountryAustralia || userProfileVerificationInfo?.guestVerification?.mandatoryFields?.isSecondaryIdRequired) && ( */}
      <ExpandableHelpingBox
        title={`${!isCountryAustralia ? 'Passport' : 'Secondary'} ID Details`}
        helpingBoxes={secondaryIDHelpingData}
        showStatus={!!userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.status}
        status={userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.status}
        message={licenseMessage?.secondaryIDMessage}
        isMandatory={true}
      >
        <SecondaryIDVerify secondaryIdData={userProfileVerificationInfo?.guestVerification?.secondaryIdInfo} />
      </ExpandableHelpingBox>
      {/* )} */}
      <div className="w-full lg:w-2/3 flex justify-between">
        <Button variant="outlined" startIcon={<FaArrowLeft />} className="normal-case" color="primary" onClick={handleBack}>
          Previous
        </Button>
        <Button
          variant="contained"
          endIcon={<FaArrowRight />}
          className="normal-case"
          // disabled={!isLicenseStepComplete}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LicenseVerify;
