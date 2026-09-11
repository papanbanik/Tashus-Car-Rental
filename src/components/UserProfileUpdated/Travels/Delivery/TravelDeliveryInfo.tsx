import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetDeliveryDetails } from '@/hooks/delivery-request/useGetDeliveryDetails';
import { getCarShortLocation } from '@/utils/Functions/carListingCommonFn';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { BiTrip } from 'react-icons/bi';
import { BsArrowLeftRight, BsArrowRight, BsCurrencyDollar } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';

const TravelDeliveryInfo = () => {
  useGetDeliveryDetails();
  const { travelDetails } = useProfileInfoContext();
  const { reservationDeliveryDetails } = useTravelContext();
  //destruct
  const { pickupAddress, reservationInfo } = travelDetails;
  const { isReturnEnabled } = reservationInfo;
  const { deliveryRequest } = reservationDeliveryDetails;
  const { distanceKm, pricing, deliveryLocation } = deliveryRequest ?? {};
  const totalDistance = isReturnEnabled ? parseFloatWithPrecision((distanceKm ?? 0) * 2) : parseFloatWithPrecision(distanceKm ?? 0);
  const totalFee = isReturnEnabled
    ? parseFloatWithPrecision((pricing?.deliveryTotalFee ?? 0) * 2)
    : parseFloatWithPrecision(pricing?.deliveryTotalFee ?? 0);
  return (
    <div className="border border-solid border-accent rounded-lg p-2">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        {/* Location */}
        <div className="flex justify-between gap-1 w-full md:w-3/4">
          <CommonTextIcon
            wrapAround={true}
            text={getCarShortLocation(pickupAddress)}
            startIcon={<FaLocationDot className="text-primary" />}
            textClassName="text-xs inline-block"
          />
          <div className="flex items-center">
            {/* <div className="flex items-center justify-center bg-primary rounded-full h-5 w-5 p-1"> */}
            {isReturnEnabled ? <BsArrowLeftRight className="text-primary" /> : <BsArrowRight className="text-primary" />}
            {/* </div> */}
          </div>
          <CommonTextIcon
            wrapAround={true}
            text={deliveryLocation?.address ?? ''}
            startIcon={<FaLocationDot className="text-primary" />}
            textClassName="text-xs inline-block"
          />
        </div>
        {/* Distance & Price */}
        <div className="my-2 md:my-0">
          <CommonTextIcon
            text={
              <span>
                Total Distance: <b>{totalDistance}KM</b>
              </span>
            }
            startIcon={<BiTrip className="text-primary" />}
            className="text-xs"
          />
          <CommonTextIcon
            text={
              <span>
                Total Delivery Fee: <b>${totalFee}</b>
              </span>
            }
            startIcon={<BsCurrencyDollar className="text-primary" />}
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default TravelDeliveryInfo;
