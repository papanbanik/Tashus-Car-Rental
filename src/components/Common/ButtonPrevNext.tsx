'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { ButtonPrevNextProps } from '@/types/componentTypes';
import { Button } from '@mui/material';

const ButtonPrevNext = ({ prevRoute, nextRoute, disable }: ButtonPrevNextProps) => {
  const { getSubString, handlePrevNextBtn } = useCarListingContext();
  const substring = getSubString();

  return (
    <div className="flex justify-between">
      <Button variant="outlined" className='normal-case' onClick={() => handlePrevNextBtn(prevRoute)} disabled={substring === 'car-listing' || disable}>
        Prev
      </Button>
      <Button variant="outlined" className='normal-case' onClick={() => handlePrevNextBtn(nextRoute)} disabled={!nextRoute || disable}>
        Next
      </Button>
    </div>
  );
};

export default ButtonPrevNext;
