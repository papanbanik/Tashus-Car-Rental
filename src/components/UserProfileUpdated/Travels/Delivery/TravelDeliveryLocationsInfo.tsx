import { useTravelContext } from '@/context/TravelProvider';
import { Divider } from '@mui/material';
import TravelSectionHeader from '../TravelDetails/TravelSectionHeader';
import CommonDeliveryInfo from './CommonDeliveryInfo';

const TravelDeliveryLocationsInfo = () => {
  const { reservationDeliveryDetails } = useTravelContext();
  const { deliveryRequest, returnRequest } = reservationDeliveryDetails ?? {};
  return (
    <div>
      <TravelSectionHeader title="Vehicle Delivery Details" />
      <span className="helping_text">
        {'This section includes the delivery and return details of the vehicle, such as addresses and scheduled times.'}
      </span>
      <CommonDeliveryInfo
        title="Delivery Information"
        subtitle="A driver will pick up the vehicle from the pickup location and deliver it to your delivery location."
        requestInfo={deliveryRequest}
      />
      <Divider sx={{ my: 4, borderBottomWidth: '2px', borderColor: 'primary.main' }} />
      <CommonDeliveryInfo
        title="Return Information"
        subtitle="A driver will pick up the vehicle from your delivery location and return it to the pickup location."
        requestInfo={returnRequest}
      />
    </div>
  );
};

export default TravelDeliveryLocationsInfo;
