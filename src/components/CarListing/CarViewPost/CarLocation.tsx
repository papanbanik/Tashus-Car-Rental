'use client';

import { Typography } from '@mui/material';
import dynamic from 'next/dynamic';
// import CustomMap from "../CarLocation/LeafletMap";
import { useCarListingContext } from '@/context/CarListingProvider';
import { showTime } from '@/utils/Functions/travelCommonFn';
// import CarMap from "./CarMap";

// const CustomMap = dynamic(() => import("../CarLocation/LeafletMap"), {
//     ssr: false, // Disable server-side rendering for CustomMap
//   });

const CarMap = dynamic(() => import('@/components/Common/CommonMap'), {
  ssr: false,
});

const CarLocation = () => {
  const { carData } = useCarListingContext();
  // const [locationData, setLocationData] = useState<any>(null);

  // useEffect(() => {
  //   if (carData?.location) {
  //     const { pickupAddress } = carData.location;
  //     setLocationData(pickupAddress);
  //   }
  // }, [carData]);

  return (
    <div>
      <Typography className="mt-6 font-bold md:text-[24px]">Pick up Location</Typography>
      {/* <span className="helping_text">{`After making a reservation, the guest will be able to view the location. A map of the location will be displayed ${showTime} minutes prior to the start of the journey.`}</span> */}
      <span className="helping_text">{`The exact location will be visible to guests ${showTime} minutes prior to the start of travel.`}</span>
      {carData?.location && (
        <>
          {/* <CustomMap
              center={[locationData.coordinates[1], locationData.coordinates[0]]}
              address={locationData.complete_address}
              setNewSelectedResult={() => {
               
              }}
            /> */}
          {/* <CarMap center={[locationData.coordinates[1], locationData.coordinates[0]]} address={locationData.street} /> */}
          <CarMap center={carData?.location?.pickupAddress?.coordinates} address={carData?.location?.pickupAddress?.street} />
        </>
      )}
    </div>
  );
};

export default CarLocation;
