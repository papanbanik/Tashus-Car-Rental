import { getCoverageBenefits, TCoverageBenefit } from '@/utils/Lists/coverageBenifitList';
import CoverageBenifitItem from './CoverageBenefitItem';

const CoverageBenefitList = ({ fuelCost, keyOption }: { fuelCost: number; keyOption?: string }) => {
  const coverageBenefits = getCoverageBenefits(fuelCost ?? 0, keyOption);
  return (
    <div>
      {coverageBenefits.map((benefit: TCoverageBenefit, index: number) => (
        <CoverageBenifitItem
          key={index}
          title={benefit?.title}
          subtitle={benefit?.subtitle}
          description={benefit?.description}
          note={benefit?.note}
        />
      ))}
    </div>
  );
};

export default CoverageBenefitList;
