'use client';

import { TravelDetailsState } from '@/types/travels/typeTravels';
import {
  TPartnerTransactionHistory,
  TransactionsState,
  TTransactionHistory,
  TUserRole,
  TUserTransaction,
} from '@/types/user-profile/transactionsTypes';
import { UserProfileVerificationInfo } from '@/types/user-verification/userVerificationTypes';
import { AccountVerificationStep, TPhoneNumberVerification } from '@/types/user-verification/verificationListingSteps';
import { defaultCurrentAccountVerification, getAccountVerificationSteps } from '@/utils/Functions/verification/verificationStepsFn';

import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
type ProfileInfoProviderProps = {
  children: ReactNode;
};
type ProfileSummaryType = {
  partner: string | undefined;
  guest: string | undefined;
};
type TravelsDetailsType = {
  travels: any;
};
type ReservationDetailsType = {
  reservations: any;
};

type PhotoUploading = {
  travelStartPhotos: boolean;
};

type ContactType = {
  contactDetails: {
    residentialAddress: string;
    postalAddress: string;
    email: string;
    residentialAddressInfo?: any;
  };
  phone: {
    isVerified: boolean;
    number: string;
    code: string;
    country: string;
    shortCode: string;
  };
  secondaryContact: {
    name: string;
    phone: {
      isVerified: boolean;
      number: string;
      code: string;
      country: string;
      shortCode: string;
    };
  };
};

type payoutDetailsType = {
  accountName: string | undefined;
  accountNumber: string | undefined;
  bsb: string | undefined;
};

export type ProfileGeneralInfo = {
  firstName: string | undefined;
  middleName?: string | undefined;
  lastName: string | undefined;
  picture?: {
    status?: string;
    imageInfo: {
      public_id: string | undefined;
      secure_url: string | undefined;
      format: string | undefined;
      bytes: number | undefined;
      originalWidth: number | undefined;
      originalHeight: number | undefined;
    };
    storageProvider: string | undefined;
  };
};

type ProfileInfoContextType = {
  profileSummary: ProfileSummaryType;
  setProfileSummary: Dispatch<SetStateAction<ProfileSummaryType>>;
  profileContactDetails: ContactType;
  setProfileContactDetails: Dispatch<SetStateAction<ContactType>>;
  payoutDetails: payoutDetailsType;
  setPayoutDetails: Dispatch<SetStateAction<payoutDetailsType>>;
  vehicleDetails: any;
  setVehicleDetails: Dispatch<SetStateAction<any>>;
  travelDetails: TravelDetailsState;
  setTravelDetails: Dispatch<SetStateAction<TravelDetailsState>>;
  reservationDetails: ReservationDetailsType;
  setReservationDetails: Dispatch<SetStateAction<ReservationDetailsType>>;
  travelList: any[];
  setTravelList: Dispatch<SetStateAction<any[]>>;
  tempTravelList: any[];
  setTempTravelList: Dispatch<SetStateAction<any[]>>;
  notificationList: any[];
  setNotificationList: Dispatch<SetStateAction<any[]>>;
  tempReservationList: any[];
  setTempReservationList: Dispatch<SetStateAction<any[]>>;
  vehicleSelect: string | undefined;
  setVehicleSelect: Dispatch<SetStateAction<string | undefined>>;
  reservationSelect: number | null;
  setReservationSelect: Dispatch<SetStateAction<number | null>>;
  sortCriteria: string;
  setSortCriteria: Dispatch<SetStateAction<string>>;
  detailsId: number;
  setDetailsId: Dispatch<SetStateAction<number>>;
  isTravelStart: boolean;
  setTravelStart: Dispatch<SetStateAction<boolean>>;
  isUploading: PhotoUploading;
  setIsUploading: Dispatch<SetStateAction<PhotoUploading>>;
  eachCalenderDetails: any;
  setEachCalenderDetails: Dispatch<SetStateAction<any>>;
  allCalenderDetails: any;
  setAllCalenderDetails: Dispatch<SetStateAction<any>>;
  calendarErrorText: string;
  setCalendarErrorText: Dispatch<SetStateAction<string>>;
  profileGeneralInfo: ProfileGeneralInfo;
  setProfileGeneralInfo: Dispatch<SetStateAction<ProfileGeneralInfo>>;
  signInMethod: string;
  setSignInMethod: Dispatch<SetStateAction<string>>;
  driverApproved: boolean;
  setDriverApproved: Dispatch<SetStateAction<boolean>>;
  driverDeclined: boolean;
  setDriverDeclined: Dispatch<SetStateAction<boolean>>;
  driverError: string;
  setDriverError: Dispatch<SetStateAction<string>>;
  transactionDetails: TUserTransaction;
  setTransactionDetails: Dispatch<SetStateAction<TUserTransaction>>;
  role: TUserRole;
  setRole: Dispatch<SetStateAction<TUserRole>>;
  transactions: any[];
  setTransactions: Dispatch<SetStateAction<any[]>>;
  supportVehicleID: any;
  setSupportVehicleID: Dispatch<SetStateAction<any>>;
  supportTicketID: any;
  setSupportTicketID: Dispatch<SetStateAction<any>>;
  partnerAccess: any;
  setPartnerAccess: Dispatch<SetStateAction<any>>;
  guestAccess: any;
  setGuestAccess: Dispatch<SetStateAction<any>>;
  //Verification Steps State
  accountVerificationStepsList: AccountVerificationStep[];
  setAccountVerificationStepsList: Dispatch<SetStateAction<AccountVerificationStep[]>>;
  currentVerificationStep: AccountVerificationStep | undefined;
  setCurrentVerificationStep: Dispatch<SetStateAction<AccountVerificationStep | undefined>>;
  handleSaveCurrentVerificationStep: (stepId: number) => void;
  updateCurrentVerificationStep: (stepId: number) => void;
  userProfileVerificationInfo: UserProfileVerificationInfo; //ProfileVerification
  setUserProfileVerificationInfo: Dispatch<SetStateAction<UserProfileVerificationInfo>>; //profile
  //verify otp
  otpVerifyAttempt: number;
  setOTPVerifyAttempt: Dispatch<SetStateAction<number>>;
  timeInterval: number;
  setTimeInterval: Dispatch<SetStateAction<number>>;
  phoneVerificationDetails: TPhoneNumberVerification;
  setPhoneVerificationDetails: Dispatch<SetStateAction<TPhoneNumberVerification>>;
  isTNCAgreed: boolean;
  setIsTNCAgreed: Dispatch<SetStateAction<boolean>>;
  isCountryAustralia: boolean; //checking for address verification
  setIsCountryAustralia: Dispatch<SetStateAction<boolean>>;
};

export const ProfileInfo = createContext<ProfileInfoContextType | undefined>(undefined);

export const useProfileInfoContext = (): ProfileInfoContextType => {
  const context = useContext(ProfileInfo);
  if (!context) {
    throw new Error('useContext must be used within a ProfileInfoProvider');
  }
  return context;
};

export const ProfileInfoProvider: FC<ProfileInfoProviderProps> = ({ children }) => {
  const [profileSummary, setProfileSummary] = useState<ProfileSummaryType>({ partner: '', guest: '' });
  const [profileContactDetails, setProfileContactDetails] = useState<ContactType>({} as ContactType);
  const [payoutDetails, setPayoutDetails] = useState<payoutDetailsType>({ accountName: '', accountNumber: '', bsb: '' });
  const [vehicleDetails, setVehicleDetails] = useState<any>({});
  const [travelDetails, setTravelDetails] = useState<TravelDetailsState>({} as TravelDetailsState);
  const [reservationDetails, setReservationDetails] = useState<ReservationDetailsType>({
    reservations: undefined,
  });
  const [travelList, setTravelList] = useState<any[]>([]);
  const [tempTravelList, setTempTravelList] = useState<any[]>([]);
  const [tempReservationList, setTempReservationList] = useState<any[]>([]);
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [vehicleSelect, setVehicleSelect] = useState<string | undefined>('');
  const [reservationSelect, setReservationSelect] = useState<number | null>(null);
  const [sortCriteria, setSortCriteria] = useState<string>('');
  const [detailsId, setDetailsId] = useState<number>(0);
  const [isTravelStart, setTravelStart] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<PhotoUploading>({
    travelStartPhotos: false,
  });
  const [eachCalenderDetails, setEachCalenderDetails] = useState<any>({});
  const [allCalenderDetails, setAllCalenderDetails] = useState<any>({});
  const [calendarErrorText, setCalendarErrorText] = useState<string>('');
  const [profileGeneralInfo, setProfileGeneralInfo] = useState<ProfileGeneralInfo>({} as ProfileGeneralInfo);
  const [signInMethod, setSignInMethod] = useState<string>('');
  const [driverApproved, setDriverApproved] = useState<boolean>(false);
  const [driverDeclined, setDriverDeclined] = useState<boolean>(false);
  const [driverError, setDriverError] = useState<string>('');
  const [transactionDetails, setTransactionDetails] = useState<TUserTransaction>({} as TUserTransaction);
  const [transactions, setTransactions] = useState<TransactionsState>([]);
  const [role, setRole] = useState<TUserRole>('guest');
  const [supportVehicleID, setSupportVehicleID] = useState<any>(undefined);
  const [supportTicketID, setSupportTicketID] = useState<number>(23);
  const [partnerAccess, setPartnerAccess] = useState<any>({});
  const [guestAccess, setGuestAccess] = useState<any>({});
  //Verification Steps State
  const [accountVerificationStepsList, setAccountVerificationStepsList] = useState<AccountVerificationStep[]>([...getAccountVerificationSteps()]);
  const [currentVerificationStep, setCurrentVerificationStep] = useState<AccountVerificationStep | undefined>(defaultCurrentAccountVerification);
  const [userProfileVerificationInfo, setUserProfileVerificationInfo] = useState<UserProfileVerificationInfo>({} as UserProfileVerificationInfo);
  const [isCountryAustralia, setIsCountryAustralia] = useState<boolean>(false);
  // saves the current step
  const handleSaveCurrentVerificationStep = (stepId: number) => {
    const stepToUpdate = accountVerificationStepsList?.find((step) => step?.id === stepId);
    const nextStep = accountVerificationStepsList?.find((step) => step?.id === stepId + 1);
    if (!stepToUpdate || !nextStep) {
      return accountVerificationStepsList;
    }
    stepToUpdate.isCompleted = true;
    nextStep.isCurrent = true;
    setAccountVerificationStepsList([...accountVerificationStepsList]);
  };

  const updateCurrentVerificationStep = (stepId: number) => {
    const updatedSteps = accountVerificationStepsList.map((step) => ({
      ...step,
      isCurrent: step.id === stepId,
    }));
    setAccountVerificationStepsList(updatedSteps);
    const currentStep = updatedSteps.find((step) => step.id === stepId);
    setCurrentVerificationStep(currentStep);
  };
  //verify otp
  const [otpVerifyAttempt, setOTPVerifyAttempt] = useState<number>(0);
  const [timeInterval, setTimeInterval] = useState<number>(0);
  const [phoneVerificationDetails, setPhoneVerificationDetails] = useState<TPhoneNumberVerification>({} as TPhoneNumberVerification);
  //terms n condition agree
  const [isTNCAgreed, setIsTNCAgreed] = useState<boolean>(false);

  const contextValue: ProfileInfoContextType = {
    profileSummary,
    setProfileSummary,
    profileContactDetails,
    setProfileContactDetails,
    reservationDetails,
    setReservationDetails,
    vehicleDetails,
    setVehicleDetails,
    travelDetails,
    setTravelDetails,
    travelList,
    setTravelList,
    tempTravelList,
    setTempTravelList,
    tempReservationList,
    setTempReservationList,
    notificationList,
    setNotificationList,
    vehicleSelect,
    setVehicleSelect,
    reservationSelect,
    setReservationSelect,
    sortCriteria,
    setSortCriteria,
    detailsId,
    setDetailsId,
    isTravelStart,
    setTravelStart,
    isUploading,
    setIsUploading,
    eachCalenderDetails,
    setEachCalenderDetails,
    allCalenderDetails,
    setAllCalenderDetails,
    calendarErrorText,
    setCalendarErrorText,
    payoutDetails,
    setPayoutDetails,
    profileGeneralInfo,
    setProfileGeneralInfo,
    signInMethod,
    setSignInMethod,
    driverApproved,
    setDriverApproved,
    driverDeclined,
    setDriverDeclined,
    driverError,
    setDriverError,
    transactionDetails,
    setTransactionDetails,
    role,
    setRole,
    transactions,
    setTransactions,
    supportVehicleID,
    setSupportVehicleID,
    supportTicketID,
    setSupportTicketID,
    partnerAccess,
    setPartnerAccess,
    guestAccess,
    setGuestAccess,
    //Verification Step State
    accountVerificationStepsList,
    setAccountVerificationStepsList,
    currentVerificationStep,
    setCurrentVerificationStep,
    handleSaveCurrentVerificationStep,
    updateCurrentVerificationStep,
    userProfileVerificationInfo,
    setUserProfileVerificationInfo,
    //verify otp
    otpVerifyAttempt,
    setOTPVerifyAttempt,
    timeInterval,
    setTimeInterval,
    phoneVerificationDetails,
    setPhoneVerificationDetails,
    //terms and condition agree
    isTNCAgreed,
    setIsTNCAgreed,
    isCountryAustralia,
    setIsCountryAustralia,
  };
  return <ProfileInfo.Provider value={contextValue}>{children}</ProfileInfo.Provider>;
};
