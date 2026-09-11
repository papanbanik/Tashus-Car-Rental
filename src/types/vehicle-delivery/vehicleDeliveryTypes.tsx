import { IconType } from 'react-icons';

interface IDeliveryLocation {
  address: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}
interface IDeliveryPricing {
  deliveryTotalFee: number;
}

export interface IDeliveryVehicle {
  pickupLocation: IDeliveryLocation;
  distanceKm: number;
  deliveryLocation: IDeliveryLocation;
  pricing: IDeliveryPricing;
  returnEnabled: boolean;
}

export type TDeliveryDetails = {
  deliveryVehicle: IDeliveryVehicle;
  totalDeliveryFee?: number;
  totalReturnFee?: number;
  deliveryFeeDiscount?: number;
  returnFeeDiscount?: number;
  isDeliveryEnabled: boolean;
  isReturnEnabled: boolean;
};

//Functions
export type TReason = {
  icon?: IconType;
  primary: string;
  secondary: string | string[];
};

export type DeliveryInfoData = {
  label: string;
  value?: number;
  icon: IconType;
  tooltipText?: string;
  isDistance?: boolean;
};
