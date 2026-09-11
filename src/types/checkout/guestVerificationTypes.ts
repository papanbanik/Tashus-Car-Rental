import { TDate } from '../commonTypes';

export type TPhoneVerification = {
  isVerified?: boolean;
  number?: string;
  code?: string;
  country?: string;
  shortCode?: string;
};

export type TGuestInsurance = {
  guestCoverageType: string;
  coveragePercentage: number;
  excessFee: number;
  coverageAmount: number;
};

export type TAdditionalDriverInfo = {
  _id?: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: TPhoneVerification;
  // driverContactNumber?: string;
  isActive?: boolean;
  status?: string;
  requestId?: string;
  updatedAt?: TDate;
  createdAt?: Date;
};

export type TSaveAdditionalDriverInfo = Omit<TAdditionalDriverInfo, 'driverContactNumber'> & {
  updatedAt?: Date;
};

export type TFormAdditionalDriverInfo = {
  additionalDrivers: TAdditionalDriverInfo[];
};

export const DAdditionalDriverInfo: TFormAdditionalDriverInfo = {
  additionalDrivers: [
    {
      fullName: '',
      email: '',
      // driverContactNumber: '',
      // phone: {
      //   isVerified: false,
      //   number: '',
      //   code: '',
      //   country: '',
      //   shortCode: '',
      // },
      isActive: false,
    },
  ],
};
