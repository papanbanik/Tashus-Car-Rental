import ReservationsLayout from '@/components/Layouts/UserProfileUpdated/ReservationsLayout';
import React from 'react';

const UserReservationsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-24 w-full">
      <ReservationsLayout>{children}</ReservationsLayout>
    </div>
  );
};

export default UserReservationsLayout;
