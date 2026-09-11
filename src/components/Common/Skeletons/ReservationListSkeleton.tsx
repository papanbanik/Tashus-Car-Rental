import { Grid, Skeleton } from '@mui/material';

const ReservationListSkeleton = () => {
  return (
    <>
      {/* {[...Array(3)].map((_, index) => (
        <div key={index} className="w-full flex flex-col items-center justify-center">
          <Skeleton variant="text" width={1010} height={20} className="my-2" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton variant="rounded" width={500} height={100} />
            <div className="grid grid-cols-1">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} variant="rounded" width={500} height={Math.floor((100 - 2 * 6) / 3)} />
              ))}
            </div>
          </div>
        </div>
      ))} */}
      {[...Array(3)].map((_, index) => (
        <Grid container key={index} direction="column" alignItems="center" justifyContent="center" component="div" spacing={2}>
          {/* 1st row */}
          <Grid item className="w-full">
            <Skeleton variant="text" height={20} />
          </Grid>
          {/* 2nd row */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Skeleton variant="rounded" height={100} component="div" />
            </Grid>
            <Grid item xs={8}>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} variant="text" height={Math.floor((100 - 2 * 6) / 3)} animation="wave" />
              ))}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default ReservationListSkeleton;
