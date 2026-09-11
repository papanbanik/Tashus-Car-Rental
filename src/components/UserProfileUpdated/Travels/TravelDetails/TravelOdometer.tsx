import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import React from 'react';
import TravelSectionHeader from './TravelSectionHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ViewReservedVehicleInfo from '../../Reservations/ReservationDetails/UpdateVehicleInformation/ViewReservedVehicleInfo';
import { Alert } from '@mui/material';

interface TravelOdometerProps {
  isTravelUpdatedPage?: boolean;
  isHost?: boolean;
}

const TravelOdometer = ({ isTravelUpdatedPage, isHost }: TravelOdometerProps) => {
  const { travelDetails } = useProfileInfoContext();
  const startOdometerPhotoSecureUrl = travelDetails?.tripInformation?.startTravelOdometer?.imageInfo?.secureUrl;
  const startOdometerValue = travelDetails?.tripInformation?.startTravelOdometer?.odometerValue;
  const endOdometerPhotoSecureUrl = travelDetails?.tripInformation?.endTravelOdometer?.imageInfo?.secureUrl;
  const endOdometerValue = travelDetails?.tripInformation?.endTravelOdometer?.odometerValue;
  return (
    <>
      {travelDetails?.isTripStarted ? (
        <div className="mt-8 mb-4">
          <TravelSectionHeader title={`Odometer Reading ${isHost ? 'by Guest' : ''}  `} isCenter={true}></TravelSectionHeader>

          <div className="w-full flex lg:flex-row flex-col lg:gap-10 gap-4">
            <div className="lg:w-1/2 w-full">
              <Typography variant="h6" className="font-semibold text-primary md:text-lg text-md">
                While Starting Travel
              </Typography>
              <ViewReservedVehicleInfo
                odometerPhotoSecureUrl={startOdometerPhotoSecureUrl}
                odometerValue={startOdometerValue}
              ></ViewReservedVehicleInfo>
            </div>
            <Divider className="lg:block hidden" orientation="vertical"></Divider>
            <Divider className="lg:hidden block" orientation="horizontal"></Divider>
            <div className="lg:w-1/2 w-full">
              <Typography variant="h6" className="font-semibold text-primary md:text-lg text-md">
                While Ending Travel
              </Typography>
              <ViewReservedVehicleInfo odometerPhotoSecureUrl={endOdometerPhotoSecureUrl} odometerValue={endOdometerValue}></ViewReservedVehicleInfo>
            </div>
          </div>
        </div>
      ) : isTravelUpdatedPage && !travelDetails?.isTripStarted ? (
        <div className="my-4">
          <TravelSectionHeader title={`Odometer Reading ${isHost ? 'by Guest' : ''}  `} isCenter={isHost ? true : false}></TravelSectionHeader>
          <Alert className="bg-neutral mt-5" severity="info">{` ${'Travel Odometer readings are not added'}`}</Alert>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default TravelOdometer;
