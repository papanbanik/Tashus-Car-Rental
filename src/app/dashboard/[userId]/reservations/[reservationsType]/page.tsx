/**
 * This page handles reservations type dynamically. Reservations type are following:
 * - current
 * - upcoming
 * - past
 */

import Reservations from '@/components/UserProfileUpdated/Reservations/Reservations';

export const metadata = {
  title: 'Reservations | Tashus: Drive Smarter, Share Together',
  description: '',
};

const UserReservationsTypeRoute = () => {
  return (
    <div>
      <Reservations />
    </div>
  );
};

export default UserReservationsTypeRoute;
