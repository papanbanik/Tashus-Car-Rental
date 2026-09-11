'use client';

import { featureNames, iconMap } from './types/Features';
import CarDetailsSectionTitle from '@/components/Common/VehicleDetails/CarDetailsSectionTitle';
import CarDetailsSectionDivider from '@/components/Common/VehicleDetails/CarDetailsSectionDivider';
import useExpanded from '@/hooks/custom-hooks/useExpanded';
import MoreLessButton from '@/components/Common/Buttons/MoreLessButton';

interface CarFeaturesProps {
  features: string[];
}

const CarFeatures = ({ features }: CarFeaturesProps) => {
  const [isExpanded, toggleExpand] = useExpanded();

  const maxShow = 6;
  const carFeatures = features ?? [];
  const featuresArray = carFeatures as string[];
  const slicedFeatures = isExpanded ? featuresArray : featuresArray?.slice(0, maxShow);

  return (
    <div>
      <CarDetailsSectionTitle sectionTitle="Features"></CarDetailsSectionTitle>

      <div className="grid md:grid-cols-3 grid-cols-2 gap-x-6 gap-y-2 mb-2">
        {slicedFeatures?.map((feature, index) => {
          const FeatureIcon = iconMap[feature];
          if (!FeatureIcon) return null;
          const featureName = featureNames[feature] || feature;
          return (
            <div key={index} className="flex items-center">
              <FeatureIcon className="mr-2" size={24} />
              <span>{featureName}</span>
            </div>
          );
        })}
      </div>

      {features?.length > maxShow && <MoreLessButton isExpanded={isExpanded} toggleExpand={toggleExpand}></MoreLessButton>}

      <CarDetailsSectionDivider></CarDetailsSectionDivider>
    </div>
  );
};

export default CarFeatures;
