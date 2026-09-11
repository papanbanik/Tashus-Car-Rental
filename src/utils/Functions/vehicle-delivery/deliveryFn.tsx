import { IMapFormattedResult } from '@/types/mapLocations';
import { DeliveryInfoData, TDeliveryDetails, TReason } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import { ca } from 'date-fns/locale';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { GiPathDistance } from 'react-icons/gi';
import { MdEventAvailable } from 'react-icons/md';
import { RiContactsFill, RiMapPinTimeFill } from 'react-icons/ri';
import { TbMapPinDollar } from 'react-icons/tb';
import { calculateWithPrecision } from '../lodashHelperFn';

export const vehicleDeliveryNotes: TReason[] = [
  {
    icon: MdEventAvailable,
    primary: 'Delivery Availability',
    secondary: 'Vehicle delivery is subject to availability in your area. Please ensure your address is accurate to check for eligibility.',
  },
  {
    icon: TbMapPinDollar,
    primary: 'Free Return to Pickup Point',
    secondary:
      'You can return the vehicle to the original pickup point at no additional cost. Simply choose this option while making your reservation.',
  },
  {
    icon: FaFileInvoiceDollar,
    primary: 'Additional Charges',
    // secondary:
    //   'A delivery fee will be added based on the distance between the pickup location and your address. Delivery and retrieval times depend on traffic, distance, and driver availability.',
    secondary: [
      'A delivery fee will be added based on the distance between the pickup location and your address.',
      'Delivery and retrieval times depend on traffic, distance, and driver availability.',
    ],
  },
  {
    icon: RiMapPinTimeFill,
    primary: 'Timing Considerations',
    secondary: 'Please ensure someone is present to receive or hand over the vehicle at the specified time.',
  },
  {
    icon: FaMapLocationDot,
    primary: 'Address Accuracy',
    secondary: 'Ensure that the delivery and retrieval addresses are correct to avoid delays or extra charges.',
  },
  {
    icon: RiContactsFill,
    primary: 'Driver Contact',
    secondary: `You will receive the driver's details once the delivery is confirmed, allowing you to track the vehicle's arrival.`,
  },
];

export const getShortAddress = (result: IMapFormattedResult): string => {
  if (!result) return '';
  const { address, city, region, country } = result;
  const addressParts = [address, city?.text, region?.text, country?.text].filter(Boolean);
  return addressParts.join(', ');
};

export const deliveryCostTooltip = 'Total Cost = $20 + D x $4 [D is the Distance]. Minimum cost is $70.';

export const getDeliveryInfoData = (
  isReturnToInitialLocation: boolean,
  deliveryDistance: number,
  deliveryCost: number,
  deliveryCostTooltip?: string
): DeliveryInfoData[] => {
  return [
    {
      label: `${!isReturnToInitialLocation ? 'Round' : 'One Way'} Driving Distance`,
      value: !isReturnToInitialLocation ? Number((deliveryDistance * 2).toFixed(2)) : deliveryDistance,
      icon: GiPathDistance,
      isDistance: true,
    },
    {
      label: 'Delivery Fee',
      value: deliveryCost,
      icon: TbMapPinDollar,
      tooltipText: deliveryCostTooltip,
    },
    {
      label: 'Return Fee',
      value: !isReturnToInitialLocation ? deliveryCost : undefined,
      icon: TbMapPinDollar,
      tooltipText: deliveryCostTooltip,
    },
  ];
};

export const getDeliveryFee = (deliveryDetails: TDeliveryDetails): number => {
  if (!deliveryDetails?.isDeliveryEnabled) return 0;

  const { totalDeliveryFee = 0, totalReturnFee = 0 } = deliveryDetails;

  const subTotalFee = calculateWithPrecision('add', [totalDeliveryFee, totalReturnFee]);
  return deliveryDetails?.isReturnEnabled ? subTotalFee : totalDeliveryFee;
};
