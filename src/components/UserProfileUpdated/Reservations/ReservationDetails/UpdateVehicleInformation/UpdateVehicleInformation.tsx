import TravelBasics from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelBasics';
import TravelSectionHeader from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelSectionHeader';
import BeforeReservationOdometer from './BeforeReservationOdometer';
import AfterReservationOdometer from './AfterReservationOdometer';
import Divider from '@mui/material/Divider';

interface UpdateVehicleInformationProps {
  isTravelUpdatedPage?: boolean;
}

const UpdateVehicleInformation = ({ isTravelUpdatedPage }: UpdateVehicleInformationProps) => {
  return (
    <div>
      {!isTravelUpdatedPage && <TravelBasics></TravelBasics>}

      <div className={`grid grid-cols-1  md:p-8 p-4  w-full ${isTravelUpdatedPage ? '' : 'shadow-lg shadow-secondary bg-white rounded-lg'}`}>
        <TravelSectionHeader title="Update Odometer Reading as Partner" isCenter={true}></TravelSectionHeader>

        <div className="w-full flex lg:flex-row flex-col lg:gap-10 gap-4">
          <BeforeReservationOdometer></BeforeReservationOdometer>
          <Divider className="lg:block hidden" orientation="vertical"></Divider>
          <Divider className="lg:hidden block" orientation="horizontal"></Divider>
          <AfterReservationOdometer></AfterReservationOdometer>
        </div>
      </div>
    </div>
  );
};

export default UpdateVehicleInformation;
