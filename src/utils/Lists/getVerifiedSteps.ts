import { VerificationStep } from '@/types/user-verification/verificationListingSteps';

// export const getCarVerificationSteps = () => {
export const userVerificationSteps: VerificationStep[] = [
  {
    id: 1,
    label: 'Sign Up',
    description: 'Create your account in just a few minutes.',
    isCompleted: false,
    isCurrent: true,
  },
  {
    id: 2,
    label: 'Get-Verified',
    description: 'Complete our quick and secure verification.',
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 3,
    label: 'Hit The Road',
    description: 'Choose your vehicle and start your journey!',
    isCompleted: false,
    isCurrent: false,
  },
];
//   return userVerificationSteps;
// };

// Function to update the completion status of the steps
// export const getUserVerificationSteps = (
//   userCred: { loggedIn: boolean },
//   guestVerificationFlags: { [key: string]: boolean },
//   verificationStatusFlags: { [key: string]: boolean }
// ): VerificationStep[] => {
//   return userVerificationSteps?.map((step) => {
//     switch (step.id) {
//       case 1:
//         return {
//           ...step,
//           isCompleted: userCred?.loggedIn,
//         };
//       case 2:
//         return {
//           ...step,
//           isCompleted: Object.values(guestVerificationFlags).every((value) => value === true),
//         };
//       case 3:
//         return {
//           ...step,
//           isCompleted: Object.values(verificationStatusFlags).every((value) => value === true),
//         };
//       default:
//         return step;
//     }
//   });
// };

export const getUserVerificationSteps = (isLoggedIn: boolean, isAllCompleted: boolean, isApproved: boolean): VerificationStep[] => {
  let currentStepSet = false;

  return userVerificationSteps?.map((step) => {
    let isCompleted = false;

    switch (step.id) {
      case 1:
        isCompleted = isLoggedIn;
        break;
      case 2:
        isCompleted = isAllCompleted;
        break;
      case 3:
        isCompleted = isApproved;
        break;
    }

    // Set isCurrent to true for the first step that is not completed
    const isCurrent = !currentStepSet && !isCompleted;
    if (isCurrent) {
      currentStepSet = true;
    }

    return {
      ...step,
      isCompleted,
      isCurrent,
    };
  });
};
