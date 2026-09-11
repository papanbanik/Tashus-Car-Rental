'use client';
import { Skeleton } from '@mui/material';

const NotificationSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col justify-between">
        <Skeleton variant="text" width="30%" height={40} animation="wave" />
      </div>
      <div className="flex flex-row gap-4">
        <Skeleton variant="text" width="10%" height={20} animation="wave" />
        <Skeleton variant="text" width="10%" height={20} animation="wave" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex gap-2">
            <Skeleton variant="circular" width={60} height={60} />
            <div className="flex flex-col w-full">
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="30%" height={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSkeleton;
