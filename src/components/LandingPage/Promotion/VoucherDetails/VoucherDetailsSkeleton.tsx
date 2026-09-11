import React from 'react';
import { Skeleton, Card, Box, Grid, Typography } from '@mui/material';

const VoucherSkeleton = () => {
  const renderSkeletonRow = (count: number, height: number, width: string) =>
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} variant="text" height={height} width={width} sx={{ marginTop: index > 0 ? '4px' : 0 }} />
    ));

  const renderGridSkeletons = (columns: number, height: number, width: string) => (
    <Grid container spacing={2} padding="10px">
      {Array.from({ length: columns }).map((_, index) => (
        <Grid item xs={12} sm={3} key={index}>
          <Skeleton variant="text" height={height} width={width} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box p={2}>
      <div className="mb-2">
        <Skeleton variant="text" width="40%" />
      </div>
      {/* Banner Skeleton */}
      <Skeleton variant="rectangular" height={200} animation="wave" />

      {/* Table Skeleton */}
      <Box mt={3} sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
        {renderGridSkeletons(4, 30, '60%')}
        <Box mt={2}>{renderGridSkeletons(4, 25, '80%')}</Box>
      </Box>

      {/* Terms & Conditions Skeleton */}
      <Box mt={3} sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton variant="text" width="30%" />
        </Typography>
        <Box mt={2} padding="10px">
          {renderSkeletonRow(6, 25, '70%')}
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherSkeleton;
