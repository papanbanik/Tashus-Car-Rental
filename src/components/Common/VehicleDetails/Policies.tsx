import CoverageBenefitList from '@/components/Common/VehicleDetails/CoverageBenifitList/CoverageBenefitList';
import { useCarListingContext } from '@/context/CarListingProvider';
import Typography from '@mui/material/Typography/Typography';
import { IoInfiniteSharp } from 'react-icons/io5';

const Policies = () => {
  const { carData } = useCarListingContext();
  const additionalFee = `${carData?.distance?.additionalFeePerKilometer}`;
  const fuelCost = carData?.distance?.fuelEconomy?.fuelCost ?? 0;
  const carDistance = `${carData?.distance?.maximumDailyDistance}`;
  const keyHandover = carData?.keyHandovers && carData?.keyHandovers?.length > 0 ? carData?.keyHandovers?.slice(-1)?.[0]?.value : undefined;

  return (
    <div>
      {carData?.distance?.unlimitedTravel ? (
        <>
          <div className="grid grid-cols-[auto,1fr] items-start pb-4">
            <div className="w-20 text-center">
              <IoInfiniteSharp size={40} className="text-primary" />
            </div>
            <div className="ml-4">
              <Typography className="font-bold text-md">Unlimited Distance</Typography>
              <span className="text-sm">Enjoy your unlimited journey</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-[auto,1fr] items-start pb-4">
            <div className="w-20">
              <Typography className="flex flex-col justify-center items-center text-primary text-[16px] font-bold">
                <span>{`${carDistance}`}</span>
                <span>KM/Day</span>
              </Typography>
            </div>
            <div className="ml-4">
              <Typography className="font-bold text-base sm:text-lg md:text-md">Distance Included</Typography>
              <span className="font-bold text-sm sm:text-base md:text-base"> {`${additionalFee}`}¢</span>
              <span className="text-sm sm:text-base md:text-base">/km for additional kilometer driven</span>
            </div>
          </div>
        </>
      )}

      <CoverageBenefitList fuelCost={fuelCost} keyOption={keyHandover} />
    </div>
  );
};

export default Policies;
