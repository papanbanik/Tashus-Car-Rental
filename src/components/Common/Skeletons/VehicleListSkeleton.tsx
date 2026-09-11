'use client';
import { Grid, Skeleton } from '@mui/material';

const VehicleListSkeleton = () => {
  return (
    // <div className="w-2/3">
    <div>
      <div className="flex flex-row justify-between">
        <Skeleton variant="text" width="30%" height={20} animation="wave" />
        <Skeleton variant="text" width="60%" height={20} animation="wave" />
      </div>
      <Grid container spacing={2}>
        {[...Array(6)].map((_, index) => (
          <Grid item key={index} xs={12} md={6}>
            <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default VehicleListSkeleton;
