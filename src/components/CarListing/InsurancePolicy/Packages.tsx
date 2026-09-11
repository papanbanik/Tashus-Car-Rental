import { IconType } from 'react-icons';
import EightyPercent from '../../../../public/CarListing/PolicyPackages/policy-eighty.svg';
import NinetyPercent from '../../../../public/CarListing/PolicyPackages/policy-ninety.svg';
import SeventyPercent from '../../../../public/CarListing/PolicyPackages/policy-seventy.svg';
import SixtyPercent from '../../../../public/CarListing/PolicyPackages/policy-sixty.svg';

export interface IPolicyPackagesList {
  id: string;
  name: string;
  coverageType: string;
  coveragePercentage: string;
  excessFee: string;
  icon: IconType;
  dents: string;
  tyres: string;
  interior: string;
}

export const policyPackagesList: IPolicyPackagesList[] = [
  {
    id: 'sixty',
    name: 'Premium Assurance',
    coverageType: 'premium',
    coveragePercentage: '60',
    icon: SixtyPercent,
    excessFee: '0',
    dents: 'Minor, not exceeding 5 cm',
    tyres: 'Normal wear consistent with regular use',
    interior: 'Minor wear, including minor stains and scuffs',
  },
  {
    id: 'seventy',
    name: 'Standard Shield',
    coverageType: 'standard',
    coveragePercentage: '70',
    icon: SeventyPercent,
    excessFee: '500',
    dents: 'Not exceeding 10 cm',
    tyres: 'Standard wear, consistent with regular use',
    interior: 'Standard wear including small spills or stains',
  },
  {
    id: 'eighty',
    name: 'Standard Coverage',
    coverageType: 'enhanced',
    coveragePercentage: '80',
    icon: EightyPercent,
    excessFee: '850',
    dents: 'Not exceeding 15 cm',
    tyres: 'Moderate wear, consistent with regular use',
    interior: 'Obvious wear including visible stains or scuffs',
  },
  {
    id: 'ninety',
    name: 'Basic Guard',
    coverageType: 'basic',
    coveragePercentage: '90',
    icon: NinetyPercent,
    excessFee: '1200',
    dents: 'Not exceeding 20 cm',
    tyres: 'Substantial wear, consistent with regular use',
    interior: 'Substantial wear, including notable stains, scuffs or damage',
  },
];
