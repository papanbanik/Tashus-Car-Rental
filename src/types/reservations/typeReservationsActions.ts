import { ImageInfoType } from '@/context/SearchProvider';
import { TDrivingLicenseInfo } from '@/context/UserCredProvider';

export type TDrivingLicenseWithFace = {
  valid?: boolean;
  imageInfo?: ImageInfoType;
};

export type TDrivingLicenseInfoWithDateExpiry = TDrivingLicenseInfo & {
  expiryDate: Date;
};

export type TVerifyGuestInfoByPartner = {
  drivingLicenseInfo: TDrivingLicenseInfoWithDateExpiry;
  drivingLicenseWithFace: TDrivingLicenseWithFace;
  guestLicenseVerificationConfirmation?: TGuestLicenseInfoByPartner;
};

export type TFormVerifyGuestInfo = TGuestLicenseInfoByPartner & {
  licenseImagesByPartner?: Blob[];
};

export type TGuestLicenseInfoByPartner = {
  isLicenseInfoMatched: boolean;
  licenseImagesByPartner?: ImageInfoType[];
};
