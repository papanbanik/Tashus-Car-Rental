import { TopImageSkeleton } from '@/types/componentTypes';
import { Skeleton } from '@mui/material';
import React from 'react';

const TopImageSkeleton = ({ variant, height, width }: TopImageSkeleton) => {
  return (
    <div>
      <Skeleton variant={variant || 'rounded'} height={height} />
      <Skeleton />
      <Skeleton width="60%" />
    </div>
  );
};

export default TopImageSkeleton;
