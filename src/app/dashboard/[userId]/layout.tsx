import ProfileLayoutUpdated from '@/components/Layouts/UserProfileUpdated/ProfileLayoutUpdated';
import React from 'react';

const UserProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex justify-center px-4 lg:px-0">
      <div className="w-full max-w-[1400px] mb-20 -mt-12 lg:mt-0">
        <ProfileLayoutUpdated>{children}</ProfileLayoutUpdated>
      </div>
    </div>
  );
};

export default UserProfileLayout;
