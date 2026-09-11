import { Skeleton } from '@mui/material';

const VerificationSkeleton = () => {
  return (
    <div>
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="text" />
      <Skeleton variant="rounded" height={200} />
    </div>
  );
};

export default VerificationSkeleton;
