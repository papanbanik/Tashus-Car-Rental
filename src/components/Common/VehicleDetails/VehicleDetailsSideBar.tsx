import CarRating from '@/components/CarListing/CarViewPost/CarRating';
import React from 'react';
import VehiclePickupReturnUpdate from './PriceUpdate/VehiclePickupReturnUpdate';
import DeliveryLocation from './VehicleDelivery/DeliveryLocation';

interface VehicleDetailsSideBarProps {
  // baseUrl: string;
  scrollToCarAvailability: () => void;
}

const VehicleDetailsSideBar: React.FC<VehicleDetailsSideBarProps> = ({ scrollToCarAvailability }) => {
  return (
    <div className="sticky md:top-[215px] lg:top-[70px] col-span-4">
      <div className="col-span-1 bg-[#E4E3E4] py-4 px-6 rounded-t-lg ">
        {/* <Link target="_blank" href={baseUrl} className="no-underline">
          <CommonTextIcon
            className="flex justify-center items-center text-primary font-bold underline "
            text="Verify your ID"
            endIcon={<FaArrowRight className="text-primary ml-2" />}
          />
        </Link> */}
        <VehiclePickupReturnUpdate />
      </div>

      <div className="py-4 px-6 bg-white">
        {/* <CustomReservationLocation></CustomReservationLocation> */}
        <DeliveryLocation />
      </div>

      <CarRating onCheckAvailability={scrollToCarAvailability}></CarRating>
    </div>
  );
};

export default VehicleDetailsSideBar;
