import { Skeleton } from '@mui/material';

const AdditionalFeeFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} variant="text" />
      ))}
    </div>
  );
};

export default AdditionalFeeFormSkeleton;
