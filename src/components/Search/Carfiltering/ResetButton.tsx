import { Button } from '@mui/material';
import React from 'react';

export interface ResetButtonProps {
  resetFn: () => void;
}

const ResetButton = ({ resetFn }: ResetButtonProps) => {
  return (
    <div className="flex justify-center items-center mt-4">
      <Button variant="contained" className="normal-case bg-red-500" onClick={resetFn}>
        Clear
      </Button>
    </div>
  );
};

export default ResetButton;
