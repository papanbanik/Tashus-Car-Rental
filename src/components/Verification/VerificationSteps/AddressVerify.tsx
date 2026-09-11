'use client';
import ExpandableHelpingBox from '@/components/Common/Verification/CombineSection';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { getRequestVerificationMessages } from '@/utils/Functions/verification/verificationFn';
import { getIndividualVerificationCompleteState, getUpdatedUrl } from '@/utils/Functions/verification/verificationStepsFn';
import { addressHelpingData } from '@/utils/Lists/verificationStepList';
import { Button } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import ResidentialAddressVerifyM from './Address/AddressM/ResidentialAddressVerifyM';

const AddressVerify = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { handleSaveCurrentVerificationStep, updateCurrentVerificationStep, userProfileVerificationInfo, isCountryAustralia } =
    useProfileInfoContext();
  const { isAddressStepComplete } = getIndividualVerificationCompleteState(userProfileVerificationInfo);

  const handleBack = () => {
    if (isAddressStepComplete) {
      handleSaveCurrentVerificationStep(3);
    }
    updateCurrentVerificationStep(2);
    // const queryParams = new URLSearchParams({ step: 'license' }).toString();
    // const url = `${pathname}?${queryParams}`;
    // router.push(url);
    router.push(getUpdatedUrl(pathname, 'license'));
  };

  const { addressMessage } = getRequestVerificationMessages(userProfileVerificationInfo);
  return (
    <div>
      {/* <CommonVerificationStatus status={statusText ?? 'incomplete'} text="Add your address to complete your verification process" /> */}
      <ExpandableHelpingBox
        title="Address"
        helpingBoxes={
          isCountryAustralia && !userProfileVerificationInfo?.guestVerification?.mandatoryFields?.isProofOfAddressRequired
            ? addressHelpingData.slice(0, 1)
            : addressHelpingData
        }
        isNotExpand={true}
        showStatus={!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.status}
        status={userProfileVerificationInfo?.guestVerification?.residentialAddress?.status}
        message={addressMessage}
        isMandatory={true}
      >
        <ResidentialAddressVerifyM />
      </ExpandableHelpingBox>
      <div>
        <span className="helping_text">
          {`Please confirm that you have completed all verification steps. Generally, it takes 24 hours for verifying account from the admin. If it's taking longer, please `}
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_DOMAIN}/support/support-center/general`}
            className="text-primary inline-block no-underline font-bold italic"
          >
            contact support
          </Link>
          {` for further assistance.`}
        </span>
      </div>
      {/* <div className="w-full lg:w-2/3 flex justify-between"> */}
      <Button variant="outlined" startIcon={<FaArrowLeft />} className="normal-case" color="primary" onClick={handleBack}>
        Previous
      </Button>
      {/* {!userProfileVerificationInfo?.guestVerification?.isAgreed && (
          <Button variant="contained" className="normal-case" disabled={!isAddressStepComplete} onClick={handleContinue}>
            {'Complete Verification'}
          </Button>
        )} */}
      {/* </div> */}
    </div>
  );
};

export default AddressVerify;
