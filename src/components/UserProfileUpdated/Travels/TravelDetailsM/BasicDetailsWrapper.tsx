import ReservationBasicsM from '../../Reservations/ReservationDetails/ReservationBasicsM';
import TravelBasicM from './TravelBasicM';

const BasicDetailsWrapper = ({ pathName }: { pathName: string }) => {
  return pathName?.includes('reservations') ? <ReservationBasicsM /> : <TravelBasicM />;
};

export default BasicDetailsWrapper;
