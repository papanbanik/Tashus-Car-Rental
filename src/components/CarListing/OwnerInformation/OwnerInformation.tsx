'use client';

import React, { useEffect } from 'react';
import ButtonPrevNext from '../../Common/ButtonPrevNext';
import { useCarListingContext } from '@/context/CarListingProvider';
import { Button } from '@mui/material';

const OwnerInformation = () => {
  const { handleSaveCurrentStep, updateCurrentStep, listingId } = useCarListingContext();
  useEffect(() => {
    updateCurrentStep();
  }, []);

  return (
    <div>
      <Button
        type="submit"
        variant="contained"
        color="success"
        className="mb-4 justify-end"
        onClick={() => handleSaveCurrentStep(7, parseInt(listingId))}
      >
        Save
      </Button>
      <ButtonPrevNext prevRoute={`${listingId}/photos`} nextRoute={`${listingId}/insurance-policy`}></ButtonPrevNext>
    </div>
  );
};

export default OwnerInformation;
