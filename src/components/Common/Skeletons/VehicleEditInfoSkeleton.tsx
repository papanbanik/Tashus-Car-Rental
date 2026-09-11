import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function VehicleEditInfoSkeleton() {
  return (
    <Stack spacing={1} className="w-full mt-0">
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

      <Skeleton variant="rounded" width="100%" height={300} />
    </Stack>
  );
}
