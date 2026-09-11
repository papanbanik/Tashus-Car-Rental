import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { EDeliveryRequestType, TDeliveryRequestInfo } from '@/types/reservations/reservationDeliveryTypes';
import { getCarShortLocation } from '@/utils/Functions/carListingCommonFn';
import { Alert } from '@mui/material';
import { LuDollarSign, LuMapPin, LuNavigation } from 'react-icons/lu';
import AssignedDriver from './AssignedDriver';
import CancelledDelivery from './CancelledDelivery';
import DeliveryTracking from './DeliveryTracking';
import { getDarkStatusColor } from './utils/functions/deliveryInfoStyleFn';

interface CommonDeliveryInfoProps {
  title?: string;
  subtitle?: string;
  requestInfo?: TDeliveryRequestInfo;
}
const CommonDeliveryInfo = ({ title, subtitle, requestInfo }: CommonDeliveryInfoProps) => {
  const {
    requestType,
    requestStatus,
    deliveryLocation,
    distanceKm,
    pricing,
    assignedDriver,
    deliveryTracker = [],
    cancellationDetails,
    pickupLocation,
  } = requestInfo || {};
  const { deliveryTotalFee = 0 } = pricing || {};
  const isDelivery = requestType === EDeliveryRequestType.Delivery;
  const { travelDetails } = useProfileInfoContext();
  const { pickupAddress } = travelDetails;
  return (
    <div>
      <div className="flex flex-col my-2">
        <div className="flex items-center justify-between">
          <span className="md:text-xl text-md font-bold">{title ?? ''}</span>{' '}
          {!!requestStatus && (
            <div
              // className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium inline-block capitalize ${getDeliveryRequestStatusColor(
              //   requestStatus
              // )}`}
              className={`mt-2 md:mt-0 px-4 py-1 text-white text-sm font-medium inline-block capitalize`}
              style={{
                backgroundColor: getDarkStatusColor(requestStatus),
                clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)',
              }}
            >
              {requestStatus}
            </div>
          )}
        </div>

        <span className="helping_text">
          {requestInfo ? subtitle ?? '' : 'Kindly ensure the vehicle is returned to its original pickup location.'}
        </span>
      </div>
      {requestInfo ? (
        <>
          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Location */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <LuMapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-600">Pickup Location</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {isDelivery ? getCarShortLocation(pickupAddress) : pickupLocation?.address || ''}
              </span>
            </div>

            {/* Delivery Location */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <LuMapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-600">Delivery Location</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {isDelivery ? deliveryLocation?.address || '' : getCarShortLocation(pickupAddress)}
              </span>
            </div>
          </div>
          {/* Distance and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="flex gap-2">
              <div className="flex items-center space-x-1">
                <LuNavigation className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-600">Delivery Distance:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{`${distanceKm}KM`}</span>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center space-x-1">
                <LuDollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-600">Delivery Cost:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{`$${deliveryTotalFee}`}</span>
            </div>
          </div>
          {!!cancellationDetails?.canceledBy ? (
            <CancelledDelivery cancellation={cancellationDetails} isDelivery={isDelivery} />
          ) : (
            <>
              {/* Assigned Driver */}
              {!!assignedDriver?.username && <AssignedDriver driver={assignedDriver} />}
              {/* Delivery Tracking */}
              {deliveryTracker?.length > 0 && <DeliveryTracking trackerData={deliveryTracker} isDelivery={isDelivery} />}
            </>
          )}
        </>
      ) : (
        <Alert severity="info" className="mt-2">
          {`As return delivery has not been selected, please ensure the vehicle is returned to its original pickup location. The drop-off location is
          highlighted on the map and listed under the Pickup & Drop-off section. `}
        </Alert>
      )}
    </div>
  );
};

export default CommonDeliveryInfo;
