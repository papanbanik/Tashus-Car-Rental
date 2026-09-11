'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useEffect } from 'react';
import StepContainer from '../StepContainer';
import StepHeader from '../StepHeader';
import AdditionalPhotos from './AdditionalPhotos';
import CoverPhoto from './CoverPhoto';
import InitialPhotos from './InitialPhotos';
import InspectionPhoto from './InspectionPhoto';

const CarPhotos = () => {
  const { updateCurrentStep, listingId } = useCarListingContext();
  useEffect(() => {
    updateCurrentStep();
  }, []);

  return (
    <StepContainer>
      <StepHeader title="Photos"></StepHeader>
      <CoverPhoto></CoverPhoto>
      <AdditionalPhotos></AdditionalPhotos>
      <InitialPhotos></InitialPhotos>
      <InspectionPhoto />
    </StepContainer>
  );
};

export default CarPhotos;
