'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { VerificationStep } from '@/types/user-verification/verificationListingSteps';
import { VerificationStepConnector, VerificationStepIconRoot } from '@/utils/Functions/verification/verificationStyleFn';
import { getUserVerificationSteps, userVerificationSteps } from '@/utils/Lists/getVerifiedSteps';
import { Step, StepIconProps, StepLabel, Stepper, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { MdDone } from 'react-icons/md';

const VerificationStepIcon = (props: StepIconProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { active, completed, className, icon } = props;
  return (
    <VerificationStepIconRoot isSmallScreen={isSmallScreen} verifyState={{ completed, active }} className={className}>
      {completed ? <MdDone /> : <div>{icon}</div>}
    </VerificationStepIconRoot>
  );
};

const VerificationStepper = () => {
  const [steps, setSteps] = useState<VerificationStep[]>([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { userCred, isAllVerificationStepsCompleted } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const isFinalApproved = isAllVerificationStepsCompleted && userProfileVerificationInfo?.guestVerification?.finalVerificationStatus === 'approved';

  useEffect(() => {
    if (userCred?.loggedIn) {
      const updatedSteps = getUserVerificationSteps(userCred?.loggedIn, isAllVerificationStepsCompleted, isFinalApproved);
      setSteps(updatedSteps);
    } else {
      setSteps(userVerificationSteps);
    }
  }, [userCred?.loggedIn, userProfileVerificationInfo, isAllVerificationStepsCompleted]);

  return (
    <Stepper alternativeLabel connector={<VerificationStepConnector />} className="flex justify-center items-center w-100 md:ml-8 lg:md-0">
      {steps?.length > 0 &&
        steps?.map((step: VerificationStep, index: number) => (
          <Step className="flex justify-center items-center" active={step?.isCurrent} completed={step?.isCompleted} key={index}>
            <StepLabel className={`${step?.isCompleted ? 'cursor-pointer' : 'cursor-pointer'}`} StepIconComponent={VerificationStepIcon}>
              <span className="flex flex-col text-left md:w-[150px] md:pl-4">
                <span className="font-bold text-md md:text-xl">{step?.label}</span>
                {!isSmallScreen ? <span className="md:text-xs py-1">{step?.description}</span> : ''}
              </span>
            </StepLabel>
          </Step>
        ))}
    </Stepper>
  );
};

export default VerificationStepper;
