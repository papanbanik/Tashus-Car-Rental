import { ReservationGuestInsurance } from '@/types/travels/typeTravels';
import { Divider } from '@mui/material';
import GuestCoverage from './GuestCoverage';

const PreviousCoverageInfo = ({ previousInsurance }: { previousInsurance?: ReservationGuestInsurance }) => {
  return (
    <div>
      <Divider className="border border-black my-1" />
      <span className="flex justify-between items-center px-2 bg-primary text-white">
        <span className="text-lg font-bold">Previous Guest Insurance</span>
      </span>
      <Divider className="border border-black my-1" />
      <div className="flex flex-col p-2">
        <GuestCoverage selectedPackage={previousInsurance} />
      </div>
    </div>
  );
};

export default PreviousCoverageInfo;
