'use client';
import TravelDetailsMain from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelDetailsMain';
import TravelDetailsMainM from '@/components/UserProfileUpdated/Travels/TravelDetailsM/TravelDetailsMainM';
import { usePathname, useSearchParams } from 'next/navigation';

// export const metadata = {
//   title: 'Reservation Details | Tashus: Drive Smarter, Share Together',
//   description: '',
// };

const UserReservationDetailsRoute = () => {
  const pathName = usePathname();

  return (
    <div>
      {/* User Reservation Details */}
      {pathName.includes('details-new') ? <TravelDetailsMain /> : <TravelDetailsMainM />}
    </div>
  );
};

export default UserReservationDetailsRoute;
