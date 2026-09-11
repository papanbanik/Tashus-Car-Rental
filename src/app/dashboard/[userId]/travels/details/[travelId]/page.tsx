import TravelDetailsMain from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelDetailsMain';
import TravelDetailsMainM from '@/components/UserProfileUpdated/Travels/TravelDetailsM/TravelDetailsMainM';

export const metadata = {
  title: 'Travel Details | Tashus: Drive Smarter, Share Together',
  description: '',
};

const UserTravelDetailsRoute = () => {
  return (
    <div>
      {/* <TravelDetailsMain></TravelDetailsMain> // Old Route */}
      <TravelDetailsMainM></TravelDetailsMainM>
    </div>
  );
};

export default UserTravelDetailsRoute;
