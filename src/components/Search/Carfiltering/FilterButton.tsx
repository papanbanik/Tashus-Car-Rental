import { FilterApplyProps } from '@/types/componentTypes';
import { Button } from '@mui/material';
import React from 'react';

const FilterButton = ({ submitFn }: FilterApplyProps) => {
  return (
    <div className="flex justify-center items-center mt-4">
      <Button variant="contained" type="submit" color="success" className="normal-case">
        Apply
      </Button>
    </div>
  );
};

export default FilterButton;
