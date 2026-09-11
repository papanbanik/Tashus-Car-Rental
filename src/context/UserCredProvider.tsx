'use client';

import { TPayoutInformation, TVerificationFieldFlags } from '@/types/profileInfoTypes';
import { CustomizeCoverage } from '@/types/user-profile/customHoldTypes';
import { DVerificationFieldFlags } from '@/utils/Functions/verification/verificationFn';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
import { ImageInfoType } from './SearchProvider';

type UserCredType = {
  userId: string | undefined;
  email: string | undefined;
  loggedIn: boolean;
};

type SignUpStepType = {
  current: string | undefined;
  previous: string | undefined;
};

type UserCredProviderProps = {
  children: ReactNode;
};

type SocialProvider = {
  id: string;
  name: string;
  type: string;
};

type UserType = {
  userType: 'partner' | 'guest' | 'guest-booking' | 'general';
};

type SocialProvidersResponse = {
  [key: string]: SocialProvider;
};

export type TDrivingLicenseInfo = {
  licenseName: string;
  gender: string; //Added Gender
  licenseNumber: string;
  country: string;
  state: string;
  expiryDate: Date | null;
  dateOfBirth: Date | null;
  status?: string; //Added Admin status from check
  _id?: string;
  createdAt?: any;
};

export type TSecondaryIDInfo = {
  idType: string;
  otherTypeName?: string;
  issuingAuthority?: string;
  institutionName?: string;
  idNumber: string;
  expiryDate?: Date | null;
  state?: string;
  country?: string;
  // picture?: Blob;
  imageInfo?:
    | {
        public_id?: string;
        secure_url?: string;
        format?: string;
      }
    | undefined;
  storageProvider?: string;
  status?: string; //Added Admin status from check
  _id?: string;
  createdAt?: any;
};

export type TResidentialAddressInfo = {
  email: string;
  residentialAddressInfo: any;
  residentialAddress: string;
  proofOfAddressPhoto?: {
    imageInfo: {
      public_id: string;
      secure_url: string;
      format: string;
    };
    storageProvider: string;
  };
  status: string;
  residentialAddressItemId: string;
};

export type TResidentialAddress = {
  residentialAddressInfo: any;
  proofOfAddressPhoto?: any;
  postalAddress?: string;
  status: string;
  _id?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type TSecondaryContactInfo = {
  name: string;
  phone: {
    isVerified: boolean;
    number: string;
    code: string;
    country: string;
    shortCode: string;
  };
};

export type UserProfileInfo = {
  firstName: string | undefined;
  middleName?: string | undefined;
  lastName: string | undefined;
  dateOfBirth?: Date | undefined;
  // picture?: Blob;
  gender: string | undefined; //Added gender
  picture?: {
    status?: string; //Added Admin status from check
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
  verificationInfo?: {
    email?: {
      isVerified: boolean;
    };
    phone?: {
      isVerified?: boolean;
      number?: string;
      code?: string;
      country?: string;
      shortCode?: string;
    };
    facebook?: {
      isVerified: boolean;
    };
  };
  contactDetails: TResidentialAddressInfo;
  secondaryContact?: TSecondaryContactInfo;
  guestVerification?: {
    finalVerificationStatus?: string;
    drivingLicense?: string;
    drivingLicenseInfo?: TDrivingLicenseInfo;
    drivingLicenseWithFace?: {
      valid?: boolean;
      imageInfo?: ImageInfoType;
      status?: string; //Added Admin status from check
      _id?: string;
      createdAt?: any;
    };
    //Secondary ID Info
    secondaryIdInfo?: TSecondaryIDInfo;
    //Driving Photo Validation
    drivingLicensePhoto?: {
      valid?: boolean;
      imageInfo?: ImageInfoType;
      status?: string; //Added Admin status from check
      _id?: string;
      createdAt?: any;
    };
    drivingLicensePhotoBackside?: {
      imageInfo?: ImageInfoType;
      status?: string; //Added Admin status from check
    };
    // residentialAddress?: TResidentialAddress;
    residentialAddress?: TResidentialAddress;
    isAgreed?: boolean;
  };
  createdAt?: Date;
  guestTotalTrips: number;
  guestRatingCount: number;
  guestRatingTotal: number;
  totalCars: number;
  hostRatingCount: number;
  hostRatingTotal: number;
  hostTotalTrips: number;
  isDepositApplicable?: boolean;
  isDepositWaived?: boolean;
  isAllowListing?: boolean;
  payoutInformation?: TPayoutInformation;
  totalAvailableCredit?: number;
  customFixedDeposit?: number;
  // email: string | undefined;
};

type EnableKeysType = {
  enableUseProfileInfo?: boolean;
};

type UserCredContextType = {
  userCred: UserCredType;
  setUserCred: Dispatch<SetStateAction<UserCredType>>;
  userType: string | undefined;
  setUserType: Dispatch<SetStateAction<string | undefined>>;
  validPassword: boolean;
  setValidPassword: Dispatch<SetStateAction<boolean>>;
  signUpStep: SignUpStepType;
  setSignUpStep: Dispatch<SetStateAction<SignUpStepType>>;
  socialProviders: SocialProvidersResponse | null;
  setSocialProviders: Dispatch<SetStateAction<SocialProvidersResponse | null>>;
  userEmail: string | undefined;
  setUserEmail: Dispatch<SetStateAction<string | undefined>>;
  userProfileInfo: UserProfileInfo; //profile
  setUserProfileInfo: Dispatch<SetStateAction<UserProfileInfo>>; //profile
  profileHookEnableKeys: EnableKeysType;
  setProfileHookEnableKeys: Dispatch<SetStateAction<EnableKeysType>>;
  customizedHoldAmount: CustomizeCoverage;
  setCustomizedHoldAmount: Dispatch<SetStateAction<CustomizeCoverage>>;
  isScrolled: boolean;
  setIsScrolled: Dispatch<SetStateAction<boolean>>;
  isAllVerificationStepsCompleted: boolean;
  setIsAllVerificationStepsCompleted: Dispatch<SetStateAction<boolean>>;
  verificationFieldFlags: TVerificationFieldFlags;
  setVerificationFieldFlags: Dispatch<SetStateAction<TVerificationFieldFlags>>;
  isDepositSetByAdmin: boolean;
  setIsDepositSetByAdmin: Dispatch<SetStateAction<boolean>>;
  isLogOut: boolean;
  setIsLogOut: Dispatch<SetStateAction<boolean>>;
  isLoginModal: boolean;
  setIsLoginModal: Dispatch<SetStateAction<boolean>>;
};

export const UserCred = createContext<UserCredContextType | undefined>(undefined);

export const useUserCredContext = (): UserCredContextType => {
  const context = useContext(UserCred);
  if (!context) {
    throw new Error('useContext must be used within a UserCredProvider');
  }
  return context;
};

export const UserCredProvider: FC<UserCredProviderProps> = ({ children }) => {
  const [userEmail, setUserEmail] = useState<string | undefined>(''); //Modal
  const [userCred, setUserCred] = useState<UserCredType>({ userId: '', email: '', loggedIn: false });
  const [userType, setUserType] = useState<string | undefined>('');
  const [validPassword, setValidPassword] = useState<boolean>(true);
  const [signUpStep, setSignUpStep] = useState<SignUpStepType>({
    current: '',
    previous: '',
  });
  const [socialProviders, setSocialProviders] = useState<SocialProvidersResponse | null>(null);
  const [userProfileInfo, setUserProfileInfo] = useState<UserProfileInfo>({} as UserProfileInfo);
  const [profileHookEnableKeys, setProfileHookEnableKeys] = useState<EnableKeysType>({});
  const [customizedHoldAmount, setCustomizedHoldAmount] = useState<CustomizeCoverage>({} as CustomizeCoverage);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isAllVerificationStepsCompleted, setIsAllVerificationStepsCompleted] = useState<boolean>(false);
  const [verificationFieldFlags, setVerificationFieldFlags] = useState<TVerificationFieldFlags>(DVerificationFieldFlags);
  const [isDepositSetByAdmin, setIsDepositSetByAdmin] = useState<boolean>(false);
  const [isLogOut, setIsLogOut] = useState<boolean>(false);
  const [isLoginModal, setIsLoginModal] = useState<boolean>(false);

  const contextValue: UserCredContextType = {
    userCred,
    setUserCred,
    userType,
    setUserType,
    validPassword,
    setValidPassword,
    signUpStep,
    setSignUpStep,
    socialProviders,
    setSocialProviders,
    userEmail,
    setUserEmail,
    userProfileInfo,
    setUserProfileInfo,
    profileHookEnableKeys,
    setProfileHookEnableKeys,
    customizedHoldAmount,
    setCustomizedHoldAmount,
    isScrolled,
    setIsScrolled,
    isAllVerificationStepsCompleted,
    setIsAllVerificationStepsCompleted,
    verificationFieldFlags,
    setVerificationFieldFlags,
    isDepositSetByAdmin,
    setIsDepositSetByAdmin,
    isLogOut,
    setIsLogOut,
    isLoginModal,
    setIsLoginModal,
  };

  return <UserCred.Provider value={contextValue}>{children}</UserCred.Provider>;
};
