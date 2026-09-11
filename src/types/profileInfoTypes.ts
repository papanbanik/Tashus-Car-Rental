import { Dispatch, SetStateAction } from 'react';
import { ControlledFieldProps } from './componentTypes';

export type ProfileInfoUpdateType = {
  firstName: string | undefined;
  lastName: string | undefined;
  dateOfBirth?: Date;
  picture?: Blob;
  // picture?: {
  //   imageInfo: UserProfilePhotoValues;
  //   // imageInfo: {
  //   //   public_id: string | undefined;
  //   //   secure_url: string | undefined;
  //   //   format: string | undefined;
  //   //   bytes: number | undefined;
  //   //   originalWidth: number | undefined;
  //   //   originalHeight: number | undefined;
  //   // };
  //   storageProvider: string | undefined;
  // };
};

//Profile Summary Type
export type ProfileSummaryUpdateType = {
  partner: string | undefined;
  guest: string | undefined;
};

//Account Security Type
export type AccountSecurityUpdateType = {
  email: string | undefined;
  oldPassword: string | undefined;
  newPassword: string | undefined;
  otp: number | undefined;
};

export type ContactDetailsType = {
  contactData: {
    contactDetails: {
      residentialAddress: string;
      postalAddress: string;
      phone: {
        isVerified: boolean;
        number?: string;
        code?: string;
        country?: string;
        shortCode?: string;
      };
      email: string;
    };
    secondaryContact: {
      name: string | undefined;
      phone: {
        isVerified: boolean;
        number?: string;
        code?: string;
        country?: string;
        shortCode?: string;
      };
    };
  };
};

export type PayoutOptionsType = {
  bsb: string | undefined;
  accountNumber: string | undefined;
  accountName: string | undefined;
};

export type ImageUploadType = {
  picture?: Blob;
};

//Reservation Type
export interface Condition {
  context: string;
  value: any;
  description: string;
}

export interface Bill {
  amountType: 'increase' | 'decrease' | 'general';
  label: string;
  amount: any;
  helpingText?: string;
  useBorder?: boolean;
}

//Travel Type
export type TravelStartPhotos = {
  imageUrlList?: Blob[];
  odometerPhoto?: Blob;
};
//Vehicles Type
export type BlockDates = {
  blockedDates: [
    {
      start: Date;
      end: Date;
      title?: string | undefined;
    }
  ];
};

export type BlockDatesView = {
  start: Date;
  end: Date;
  title: string;
};

export type CalenderTimePick = {
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  // title: string;
};

export type TPayoutInformation = {
  payoutType: string; // bank/card
  bankInfo: PayoutOptionsType;
  // bankInfo: {
  //   bsb: string;
  //   accountNumber: string;
  //   accountName: string;
  //   updatedAt: Date;
  // };
};

export type secondaryContactType = {
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

export interface IPhotoUploadProps extends ControlledFieldProps {
  photoUrl?: string | undefined;
  setPhotoUrl?: Dispatch<SetStateAction<string>>;
  singleFile?: File[];
  setSingleFile?: Dispatch<SetStateAction<File[]>>;
}

export type TVerificationFieldFlags = {
  isProfileIncorrect: boolean;
  isDLInfoIncorrect: boolean; //DL represent Driving License
  isDLPhotoIncorrect: boolean;
  isDLBackPhotoIncorrect: boolean;
  isDLSelfieIncorrect: boolean;
  isSecondaryIdIncorrect: boolean;
  isSecondaryIdPhotoIncorrect: boolean;
  isAddressIncorrect: boolean;
};
