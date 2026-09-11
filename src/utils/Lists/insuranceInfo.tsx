import { CustomizeCoverage } from '@/types/user-profile/customHoldTypes';
import { IconType } from 'react-icons';
import FortyPercent from '../../../public/Images/Guest-Verification/insurance-forty.svg';
import ThirtyPercent from '../../../public/Images/Guest-Verification/insurance-thirty.svg';
import TwentyPercent from '../../../public/Images/Guest-Verification/insurance-twenty.svg';
import ZeroPercent from '../../../public/Images/Guest-Verification/insurance-zero.svg';

export interface IGuestInsuranceList {
  id: string;
  // id: 'economy' | 'standard' | 'premium' | 'ultimate' | 'no-coverage';
  name: string;
  coveragePercentage: string;
  excessFee: string;
  minimum?: string;
  icon: IconType;
}

export const guestInsuranceList: IGuestInsuranceList[] = [
  {
    id: 'ultimate',
    name: 'Ultimate Adventurer',
    coveragePercentage: '40',
    minimum: '90',
    icon: FortyPercent,
    excessFee: '500',
  },
  {
    id: 'premium',
    name: 'Premium Cruiser',
    coveragePercentage: '30',
    minimum: '60',
    icon: ThirtyPercent,
    excessFee: '1000',
  },
  {
    id: 'standard',
    name: 'Standard Voyager',
    coveragePercentage: '20',
    minimum: '30',
    icon: TwentyPercent,
    excessFee: '1500',
  },
  {
    id: 'economy',
    name: 'Economy Explorer',
    coveragePercentage: '0',
    icon: ZeroPercent,
    excessFee: '2000',
  },
  // {
  //   id: 'no-coverage',
  //   name: 'No Coverage',
  //   coveragePercentage: '',
  //   icon: TenPercent,
  //   excessFee: '',
  // },
];

//For Customize Hold Amount
export const updateExcessFees = (insuranceList: IGuestInsuranceList[], coverage: CustomizeCoverage): IGuestInsuranceList[] => {
  return insuranceList?.map((insurance) => {
    switch (insurance?.id) {
      case 'ultimate':
        return {
          ...insurance,
          excessFee: !!coverage?.ultimate?.customHoldAmount ? `${coverage?.ultimate?.customHoldAmount}` : insurance?.excessFee,
        };
      case 'premium':
        return {
          ...insurance,
          excessFee: !!coverage?.premium?.customHoldAmount ? `${coverage?.premium?.customHoldAmount}` : insurance?.excessFee,
        };
      case 'standard':
        return {
          ...insurance,
          excessFee: !!coverage?.standard?.customHoldAmount ? `${coverage?.standard?.customHoldAmount}` : insurance?.excessFee,
        };
      case 'economy':
        return {
          ...insurance,
          excessFee: !!coverage?.economy?.customHoldAmount ? `${coverage?.economy?.customHoldAmount}` : insurance?.excessFee,
        };
      default:
        return insurance;
    }
  });
};

export const getGuestMinimumCoverage = (coverageType: string) => {
  switch (coverageType) {
    case 'ultimate':
      return '$90';
    case 'premium':
      return '$60';
    case 'standard':
      return '$30';
    default:
      return ' ';
  }
};
