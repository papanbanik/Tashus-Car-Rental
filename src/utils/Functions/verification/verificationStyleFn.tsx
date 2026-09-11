import { ExpandMoreProps } from '@/types/user-verification/verificationListingSteps';
import { IconButton, StepConnector, stepConnectorClasses, styled } from '@mui/material';

export const VerificationStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 40,
    '@media (max-width: 600px)': {
      top: 20,
    },
    // top: 'calc(50% - 7px)', // Adjust this value for alignment
    // '@media (max-width: 600px)': {
    //   top: 'calc(50% - 2px)', // Adjust for small screens if needed
    // },
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#800080',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#800080',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: '14px',
    backgroundColor: '#D4BBFC',
    border: '0',
    '@media (max-width: 600px)': {
      height: '4px',
    },
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
}));

export const VerificationStepIconRoot = styled('div')<{
  verifyState: { completed?: boolean; active?: boolean };
  isSmallScreen: boolean;
}>(({ theme, verifyState, isSmallScreen }) => ({
  zIndex: 1,
  borderRadius: '4px', // Square corners
  width: isSmallScreen ? 50 : 100,
  height: isSmallScreen ? 50 : 100,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: verifyState?.active || verifyState.completed ? '#800080' : '#D4BBFC',
  color: verifyState?.active || verifyState.completed ? 'white' : 'black',
  fontSize: isSmallScreen ? '18px' : '36px',
  fontWeight: 'bold',
  borderBottom: verifyState?.active ? '4px solid #5C8D07' : 'none',
  borderLeft: verifyState?.active ? '4px solid #5C8D07' : 'none',
}));

export const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: 'transform 0.3s',
}));

export const getTextColorClass = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'info';
    case 'approved':
      return 'success';
    case 'declined':
      return 'error';
    case 'resubmitted':
      return 'primary';
    default:
      return 'error';
  }
};
