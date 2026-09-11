import Travels from '@/components/UserProfileUpdated/Travels/Travels';

/**
 * This page handles travels type dynamically. Travels type are following:
 * - current
 * - upcoming
 * - past
 */
export const metadata = {
  title: 'Travels | Tashus: Drive Smarter, Share Together',
  description: '',
};
const UserTravelsTypeRoute = () => {
  return (
    <div>
      <Travels />
    </div>
  );
};

export default UserTravelsTypeRoute;
