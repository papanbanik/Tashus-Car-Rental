'use client';
import { Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const ReservationDetailsSkeleton = () => {
  return (
    <Stack direction="column" spacing={2}>
      {/* First row */}
      <Skeleton variant="text" width="100%" />
      {/* 2nd row */}
      <div className="grid grid-cols-2 gap-2">
        {/* 2,1 */}
        <Skeleton variant="rounded" width="100%" height={200} />
        {/* 2,2 */}
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <Skeleton variant="rounded" width="48%" height={20} />
            <Skeleton variant="rounded" width="48%" height={20} />
          </div>
          <div className="flex flex-row my-4 gap-2">
            <Skeleton variant="circular" width={60} height={60} />
            <div className="flex flex-col w-full">
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
            </div>
          </div>
          <div className="w-full">
            <Skeleton variant="rounded" width="100%" height={90} />
          </div>
        </div>
      </div>
    </Stack>
  );
};
export default ReservationDetailsSkeleton;
