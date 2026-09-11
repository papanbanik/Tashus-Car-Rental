'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { getUpdatedUrl } from '@/utils/Functions/verification/verificationStepsFn';
import { VerificationStepConnector, VerificationStepIconRoot } from '@/utils/Functions/verification/verificationStyleFn';
import { Step, StepIconProps, StepLabel, Stepper, useMediaQuery, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
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

const VerifyStepper = () => {
  const { accountVerificationStepsList, currentVerificationStep, updateCurrentVerificationStep } = useProfileInfoContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const pathname = usePathname();

  const handleStepClick = (stepId: number) => {
    // Define the step query parameter based on the stepId
    const stepMap: Record<number, string> = {
      1: 'profile',
      2: 'license',
      3: 'address',
    };
    // Update the current step
    updateCurrentVerificationStep(stepId);
    // Set query parameter
    const stepParam = stepMap[stepId];
    if (stepParam) {
      // const queryParams = new URLSearchParams({ step: stepParam }).toString();
      // const url = `${pathname}?${queryParams}`;
      // router.push(url);
      router.push(getUpdatedUrl(pathname, stepParam));
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div>
        <Stepper alternativeLabel activeStep={currentVerificationStep?.id} connector={<VerificationStepConnector />}>
          {accountVerificationStepsList?.length > 0 &&
            accountVerificationStepsList?.map((step) => (
              <Step
                active={step?.isCurrent}
                completed={step?.isCompleted}
                key={step?.id}
                data-step-id={step?.id}
                // onClick={() => updateCurrentVerificationStep(step?.id)}
                onClick={() => handleStepClick(step?.id)}
              >
                <StepLabel
                  className={`${step?.isCompleted || step?.isCurrent ? 'cursor-pointer' : ''} flex items-center justify-center`}
                  StepIconComponent={VerificationStepIcon}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-center text-md md:text-xl">{step?.label}</span>
                    {!isSmallScreen ? <span className="md:text-xs">{step?.description}</span> : ''}
                  </div>
                </StepLabel>
              </Step>
            ))}
        </Stepper>
      </div>
    </div>
  );
};

export default VerifyStepper;
