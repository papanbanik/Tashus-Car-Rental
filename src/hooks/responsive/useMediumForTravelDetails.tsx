import { useMediaQuery } from '@mui/material';

const useMediumForTravelDetails = () => {
  return useMediaQuery('(max-width: 1366px)');
};

export default useMediumForTravelDetails;
