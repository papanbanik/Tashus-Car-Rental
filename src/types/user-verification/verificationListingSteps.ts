import { TSecondaryIDInfo } from '@/context/UserCredProvider';
import { ControlledFieldProps, HookFormComponentProps } from '@/types/componentTypes';
import { IconButtonProps } from '@mui/material';
import { Dispatch, ReactNode, SetStateAction, SyntheticEvent } from 'react';
import { TDate } from '../commonTypes';

//Verification Steps
export interface VerificationStep {
  id: number;
  label: string;
  description: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export interface AccountVerificationStep {
  id: number;
  label: string;
  description: string;
  component?: ReactNode;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface VerificationResult {
  verificationStatus: string;
  dynamicText: string | JSX.Element;
  isAllStepsCompleted: boolean;
  dynamicSearchParams: string;
  hasDiscrepancies?: boolean;
}

//Common Components
export interface CommonImageUploadProps extends ControlledFieldProps {
  title?: string;
  selectedImage?: string;
  onFileDrop: (e: SyntheticEvent<EventTarget>) => void;
  isMandatory?: boolean;
}
export interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export interface CommonExpandProps {
  title: string;
  children: ReactNode;
  isNotExpand?: boolean;
  showStatus?: boolean;
  status?: string;
  helpingText?: string;
  message?: string;
  isMandatory?: boolean;
  showRequiredHelpingText?: boolean;
}

export interface CommonExtendedExpandProps extends CommonExpandProps {
  isExpanded: boolean;
  handleExpand: () => void;
  showIcon: boolean;
  handleIconClick: () => void;
}

export interface CommonHelpingBoxProps {
  title: string;
  pictures?: string[];
  descriptions: string[] | string;
  showBorder?: boolean;
}

export interface VerificationStatusProps {
  status: string;
  text: string | JSX.Element;
}

export interface MultipleHelpingBoxProps {
  helpingBoxes: CommonHelpingBoxProps[];
  setDrawerOpen?: Dispatch<SetStateAction<boolean>>;
}

export interface ExpandableHelpingBoxProps extends CommonExpandProps, MultipleHelpingBoxProps {
  expanded?: boolean;
  onToggle?: () => void;
}

//Components
export interface ILicenseFileUploadProps extends ControlledFieldProps {
  limit: number;
  multiple: boolean;
  name?: string;
  frontPhotoUrl?: string;
  setFrontPhotoUrl?: Dispatch<SetStateAction<string>>;
  singleFrontFile?: File[];
  setSingleFrontFile?: Dispatch<SetStateAction<File[]>>;
  backPhotoUrl?: string;
  setBackPhotoUrl?: Dispatch<SetStateAction<string>>;
  singleBackFile?: File[];
  setSingleBackFile?: Dispatch<SetStateAction<File[]>>;
  shouldReset?: boolean;
  isDisabledData?: boolean;
}

export type SecondaryIDVerType = {
  secondaryIdInfo: TSecondaryIDInfo;
  picture?: Blob;
  secondaryIdItemId?: string;
};

export interface ISecondaryPhotoIDModal {
  secondaryIdData?: TSecondaryIDInfo;
  returnDate?: TDate;
}

export interface ResidentialAddressDetailsProps extends HookFormComponentProps {
  isDisabledData?: boolean;
}

export interface ISecondaryPhotoIDModal {
  returnDate?: TDate;
  isDisabledData?: boolean;
}

export interface ContactOTPModalProps {
  phoneNumber: string;
}

export type TPhoneNumberVerification = {
  expiry: string; // Date string in ISO format
  lastOtpRequest: string; // Date string in ISO format
  // otp: number; // OTP as a number
  otpRequests: number; // Count of OTP requests
  verified: boolean; // Whether the phone number is verified
};
