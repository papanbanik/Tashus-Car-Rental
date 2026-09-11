import CarDetailsSectionDivider from '@/components/Common/VehicleDetails/CarDetailsSectionDivider';
import CarDetailsSectionTitle from '@/components/Common/VehicleDetails/CarDetailsSectionTitle';
import { useCarListingContext } from '@/context/CarListingProvider';
import { Button } from '@mui/material';
import { useState } from 'react';
import TemporaryReservationData from './TemporaryReservationData';
import TemporaryTable from './TemporaryTable';

const TemporaryData = () => {
  const { carData } = useCarListingContext();
  const [showContent, setShowContent] = useState<boolean>(false);

  // Define a custom comparator function
  const compareDiscounts = (a: any, b: any) => {
    const unitOrder = { days: 1, weeks: 2 };
    // @ts-ignore
    const unitComparison = unitOrder[a?.unit] - unitOrder[b.unit];
    return unitComparison !== 0 ? unitComparison : a.value - b.value;
  };
  return (
    <div>
      <CarDetailsSectionTitle
        sectionTitle={
          <span>
            Temporary Data <span className="text-xs">(only for QA & validation testing purpose)</span>
          </span>
        }
      ></CarDetailsSectionTitle>

      <Button onClick={() => setShowContent(!showContent)}>{showContent ? 'Hide Content' : 'Show Temporary Content'}</Button>

      {showContent && (
        <>
          <div>
            <p className="font-semibold md:text-lg">Price:</p>

            <p className="my-0 py-0">
              Peak increase by {carData?.rates?.peakIncrease[0]?.percentage || carData?.rates?.peakIncrease[0]?.amount}
              {carData?.rates?.peakIncrease[0]?.increaseType === 'percentage' ? '%' : '$'} on
              <span>
                {carData?.rates?.peakIncrease?.map((peak: any, index: number) => (
                  <span key={index} className="capitalize">
                    {' '}
                    {peak?.dayOfWeek}{' '}
                  </span>
                ))}
              </span>
            </p>

            <p>Long Reservation Discounts</p>
            <TemporaryTable tableDataList={Array.from(carData?.rates?.longBookingDiscounts).sort(compareDiscounts)}></TemporaryTable>

            <p>Early Reservation Discounts</p>
            <TemporaryTable tableDataList={Array.from(carData?.rates?.advanceBookingDiscounts).sort(compareDiscounts)}></TemporaryTable>
          </div>

          <div className="lg:flex justify-between items-center">
            <p className="font-semibold md:text-lg">Availability:</p>
            <p>
              {carData?.availability?.minTripDuration?.noMinimum
                ? 'No Minimum Duration'
                : `Minimum Duration is ${carData?.availability?.minTripDuration?.shortestDuration} ${carData?.availability?.minTripDuration?.unit}`}
            </p>
            <p>
              {carData?.availability?.maxTripDuration?.noMaximum
                ? 'No Maximum Duration'
                : `Maximum duration is ${carData?.availability?.maxTripDuration?.longestDuration} ${carData?.availability?.maxTripDuration?.unit}`}
            </p>
          </div>
          <div className="font-semibold md:text-lg">Reservation data:</div>

          <TemporaryReservationData></TemporaryReservationData>
        </>
      )}

      <CarDetailsSectionDivider></CarDetailsSectionDivider>
    </div>
  );
};

export default TemporaryData;
