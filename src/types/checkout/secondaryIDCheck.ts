import { IconType } from 'react-icons';

export interface OptionType {
  id: number;
  label: string;
  value?: string;
  icon?: IconType;
}
export const secondaryIDList: OptionType[] = [
  { id: 1, label: 'National ID', value: 'NationalId' },
  { id: 2, label: 'Passport', value: 'PassportId' },
  { id: 3, label: 'Student ID', value: 'StudentId' },
  { id: 4, label: 'Other', value: 'Other' },
];

//Driver Photo
export type DriverLicensePhotoType = {
  picture?: Blob;
  backPicture?: Blob;
};

export type SecondaryIDPhotoType = {
  picture?: Blob;
};
