// useIPadProQuery.js
import { useMediaQuery } from '@mui/material';

const useIPadProQuery = () => {
  return useMediaQuery('(min-width: 1024px) and (max-width: 1366px)');
};

export default useIPadProQuery;
