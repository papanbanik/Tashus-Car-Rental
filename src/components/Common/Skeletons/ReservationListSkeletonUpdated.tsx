import { Skeleton } from '@mui/material';

const ReservationListSkeletonUpdated = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-full container p-4">
          <div>
            <Skeleton variant="text" height={20} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Skeleton variant="rounded" height={100} component="div" />
            </div>
            <div>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} variant="text" height={Math.floor((100 - 2 * 6) / 3)} animation="wave" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ReservationListSkeletonUpdated;
