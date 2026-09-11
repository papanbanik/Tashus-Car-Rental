import CarDetailsSectionDivider from '@/components/Common/VehicleDetails/CarDetailsSectionDivider';
import CarDetailsSectionTitle from '@/components/Common/VehicleDetails/CarDetailsSectionTitle';
import React from 'react';
import BulletCheckIcon from '../../../../public/icons/bullet-check.svg';
import useExpanded from '@/hooks/custom-hooks/useExpanded';
import MoreLessButton from '@/components/Common/Buttons/MoreLessButton';

interface CarAdditionalFeaturesProps {
  additionalFeatures: string[];
}

const CarAdditionalFeatures = ({ additionalFeatures }: CarAdditionalFeaturesProps) => {
  const [isExpanded, toggleExpand] = useExpanded();
  const maxShow = 8;

  const slicedAdditionalFeatures = isExpanded ? additionalFeatures : additionalFeatures?.slice(0, maxShow);

  return (
    <div>
      <CarDetailsSectionTitle sectionTitle="Additional Features"></CarDetailsSectionTitle>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-x-6 gap-y-2 mb-2">
        {slicedAdditionalFeatures?.map((feature: string, index: number) => (
          <div key={index} className="flex items-center gap-2 justify-start">
            <div className="flex justify-start items-center">
              <BulletCheckIcon className="text-xl" />
            </div>
            <p className="p-0 m-0">{feature}</p>
          </div>
        ))}
      </div>

      {additionalFeatures?.length > maxShow && <MoreLessButton isExpanded={isExpanded} toggleExpand={toggleExpand}></MoreLessButton>}

      <CarDetailsSectionDivider></CarDetailsSectionDivider>
    </div>
  );
};

export default CarAdditionalFeatures;
