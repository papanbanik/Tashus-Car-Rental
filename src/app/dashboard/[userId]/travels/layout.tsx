import TravelsLayout from '@/components/Layouts/UserProfileUpdated/TravelsLayout';
import React from 'react';

const UserTravelsLayout = ({ children }: { children: React.ReactNode }) => {
  //lg:px-[350px] md:px-4 for car list
  return (
    <div className="w-full rounded-t-lg">
      <TravelsLayout>{children}</TravelsLayout>
    </div>
  );
};

export default UserTravelsLayout;
