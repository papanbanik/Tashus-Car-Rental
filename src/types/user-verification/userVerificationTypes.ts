import { ImageInfoType } from '@/context/SearchProvider';
import { TDate } from '../commonTypes';
import { TVerificationFieldFlags } from '../profileInfoTypes';

export type ResidentialAddressType = {
  address: string;
  proofOfAddress?: any;
  picture?: Blob;
};

export type ResidentialAddressInfoType = {
  // residentialAddressInfo: {
  //   unitNumber: string;
  //   streetNumber: string;
  //   streetName: string;
  //   suburb: string;
  //   state: string;
  //   postcode: number;
  //   country: string;
  // };
  residentialAddressInfo?: TAddressInfo;
  postalAddress?: string;
  postalAddressInfo?: TAddressInfo;
  australianAddressInfo?: TAddressInfo;
  proofOfAddressPhoto?: TProofOfAddress;
  picture?: Blob;
  isAgreed?: boolean;
};

export type TOptions = {
  id: string;
  label: string;
  value?: string;
};

export type LicenseNumVerType = {
  drivingLicenseInfo: TDrivingLicenseInfo;
  gender: string;
  dateOfBirth?: Date | null;
};

export interface ILicenseNumVerModal {
  // drivingLicenseData?: TDrivingLicenseInfo;
  // dateOfBirth?: TDate;
  // returnDate?: TDate;
  isDisabledData?: boolean;
}

export interface IMapSearchResidential {
  id?: number;
  country?: any;
  region?: any;
  place?: any;
  locality?: any;
  city?: any; // locality
  address?: string;
  postcode?: any; //postcode
  complete_address?: string;
  coordinates?: number[]; // longitude, latitude
  streetType?: string;
}

export interface Slide {
  imageUrl: string;
  header: string;
  subheader: string;
}

export const slides: Slide[] = [
  {
    imageUrl: '/Images/Guest-Verification/Verification-Illustrations/Frame1.svg',
    header: 'Get Verified, Get Riding!',
    subheader: 'Seamless Access Anytime, Anywhere',
  },
  {
    imageUrl: '/Images/Guest-Verification/Verification-Illustrations/Frame2.svg',
    header: 'Secure your Journey',
    subheader: 'Verification for Seamless Car Rental',
  },
  {
    imageUrl: '/Images/Guest-Verification/Verification-Illustrations/Frame3.svg',
    header: 'Verified and on the Go',
    subheader: 'Instant Ride Access for Verified Users',
  },
];

export interface ConfirmVerificationType {
  isAgreed: boolean;
}

export type colorType = 'error' | 'default' | 'success' | 'info' | 'warning' | 'primary' | 'secondary';

export type TProfileInfo = {
  picture?: {
    status?: string;
    imageInfo: {
      public_id: string;
      secure_url: string;
      format: string;
      bytes: number;
      originalWidth: number;
      originalHeight: number;
    };
    storageProvider: string;
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
  dateOfBirth: Date | null;
  gender: string;
};

export interface IResidentialAddressInfo {
  country: string;
  postcode: string;
  state: string;
  streetName: string;
  streetNumber: string;
  suburb: string;
  unitNumber: string;
  streetType: string;
  streetAddress: string;
}

export type TResidentialAddress = {
  residentialAddressInfo: IResidentialAddressInfo;
  proofOfAddressPhoto?: any;
  postalAddress?: string;
  status: string;
  _id?: string;
  createdAt?: any;
  updatedAt?: any;
};
export type TDrivingLicenseInfo = {
  licenseName?: string;
  licenseNumber?: string;
  country: string;
  state?: string;
  expiryDate?: Date | null;
  status?: string;
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
  imageInfo?: ImageInfoType;
  storageProvider?: string;
  status?: string;
};

export type TImageInfo = {
  imageInfo?: ImageInfoType;
  storageProvider?: string;
  status?: string;
};
export type TAddressInfo = {
  unitNumber?: string;
  streetNumber?: string;
  streetName?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  streetAddress?: string;
  streetType?: string;
};

export type TProofOfAddress = {
  imageInfo?: ImageInfoType;
  storageProvider?: string;
};

export type TAddressDetails = {
  residentialAddressInfo?: TAddressInfo;
  postalAddress?: string;
  postalAddressInfo?: TAddressInfo;
  australianAddressInfo?: TAddressInfo;
  proofOfAddressPhoto?: TProofOfAddress;
  status?: string;
};
export type TMandatoryFields = {
  isAustralianAddressRequired: boolean;
  isProfilePhotoRequired: boolean;
  isProofOfAddressRequired: boolean;
  isSecondaryIdRequired: boolean;
  // createdAt: string;
  // updatedAt: string;
};

export type TGuestVerification = {
  finalVerificationStatus?: string;
  drivingLicense?: string;
  drivingLicenseInfo?: TDrivingLicenseInfo;
  drivingLicenseWithFace?: TImageInfo;
  //Secondary ID Info
  secondaryIdInfo?: TSecondaryIDInfo;
  //Driving Front Photo Validation
  drivingLicensePhoto?: TImageInfo;
  //Driving Back Photo Validation
  drivingLicensePhotoBackside?: TImageInfo;
  residentialAddress?: TAddressDetails;
  isAgreed?: boolean;
  requestVerificationInfo: TRequestVerificationInfo;
  mandatoryFields: TMandatoryFields;
};

export type TRequestVerificationInfo = {
  verificationInfoFlags?: TVerificationFieldFlags;
  createdAt?: TDate;
};
export type UserProfileVerificationInfo = {
  profileInfo: TProfileInfo;
  guestVerification: TGuestVerification;
};

export type TIndividualVerificationState = {
  isProfileStepComplete: boolean;
  isLicenseStepComplete: boolean;
  isAddressStepComplete: boolean;
};
