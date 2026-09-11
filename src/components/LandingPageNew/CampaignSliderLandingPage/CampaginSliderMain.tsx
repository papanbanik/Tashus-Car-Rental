import React from 'react';
import CampaignSlider from './CampaignSlider';
import BookYourCarInThreeSteps from '../BoockYourcarInThreeSteps';

const CampaignSliderMain = () => {
  const slides = [<BookYourCarInThreeSteps key="book-your-car" />];
  return (
    <div className="w-full h-full commonMarginBottom">
      <CampaignSlider slides={slides} />
    </div>
  );
};

export default CampaignSliderMain;
