import ConfirmLicenseInfo from './ConfirmLicenseInfo';
import { useGetGuestLicenseInfoForPartner } from '@/hooks/reservation/useGetGuestLicenseInfoForPartner';
import GuestDrivingLicenseInfo from './GuestDrivingLicenseInfo';
import { useTravelContext } from '@/context/TravelProvider';

const VerifyGuest = () => {
  const { data } = useGetGuestLicenseInfoForPartner();

  const {
    verifyGuestInfoByPartner: { drivingLicenseInfo, drivingLicenseWithFace },
  } = useTravelContext();

  return (
    <div className="lg:px-32 mt-12">
      <div className="travel_container w-full">
        <p className="text-xl font-bold">Guest Driver License Information</p>
        <div className="md:flex md:gap-4">
          <GuestDrivingLicenseInfo
            drivingLicenseInfo={drivingLicenseInfo}
            drivingLicenseWithFace={drivingLicenseWithFace}
            source="reservation"
          ></GuestDrivingLicenseInfo>
        </div>

        <ConfirmLicenseInfo></ConfirmLicenseInfo>
      </div>
    </div>
  );
};

export default VerifyGuest;
