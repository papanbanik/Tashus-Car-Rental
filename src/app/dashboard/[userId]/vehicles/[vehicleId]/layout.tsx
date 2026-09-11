import VehiclesLayout from '@/components/Layouts/UserProfileUpdated/VehiclesLayout';
import React from 'react';

const UserProfileInfoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-24 w-full">
      <VehiclesLayout>{children}</VehiclesLayout>
    </div>
  );
};

export default UserProfileInfoLayout;
