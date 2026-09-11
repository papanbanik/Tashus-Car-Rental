'use client';
import IndividualPriceDisplay from '@/components/Common/VehicleDetails/PriceUpdate/IndividualPriceDisplay';
import PriceListModal from '@/components/Common/VehicleDetails/PriceUpdate/PriceListModal';
import TemporaryReservationData from '@/components/Common/VehicleDetails/TemporaryReservationData';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { ICustomPricing } from '@/types/user-profile/customPriceTypes';
import { getReservationPriceList } from '@/utils/Functions/vehiclePriceUpdateFn';
import Typography from '@mui/material/Typography/Typography';
import { useEffect, useState } from 'react';
import { IoHelpCircleOutline } from 'react-icons/io5';
import ExtendBillingUpdated from '../TravelPriceUpdated/ExtendBillingUpdated';
import VehicleAvailability from './VehicleAvailability';
// import ExtendBilling from './ExtendBilling';

const EditTravelCommon = () => {
  const [previousCustomPriceList, setPreviousCustomPriceList] = useState<ICustomPricing[]>([]);
  const [currentCustomPriceList, setCurrentCustomPriceList] = useState<ICustomPricing[]>([]);

  const { carData } = useCarListingContext();
  const { updatedTravelData, billingDetails } = useTravelContext();
  const { openModal } = useModalContext();
  const { availabilityErrorText, setReservationPriceList, setReservationCustomPriceList, reservationCustomPriceList, individualPriceList } =
    useSearchContext();

  useEffect(() => {
    const updatedReservationCustomPriceList = [...previousCustomPriceList, ...currentCustomPriceList];
    setReservationCustomPriceList(updatedReservationCustomPriceList);
  }, [previousCustomPriceList, currentCustomPriceList]);

  const handlePreviousPrice = async () => {
    const { reservationPriceList: oldPriceList } = await getReservationPriceList(
      updatedTravelData?.pickupDate,
      updatedTravelData?.returnDate,
      updatedTravelData?.basePrice?.dailyPrice,
      updatedTravelData?.basePrice?.hourlyPrice,
      updatedTravelData?.basePrice?.customPrices ?? [],
      carData?.rates?.peakIncrease,
      setPreviousCustomPriceList
    );
    setReservationPriceList(oldPriceList);
    openModal({
      title: 'Previous Price Details',
      content: <PriceListModal />,
    });
  };
  const handleNewPrice = async () => {
    const newStartDate = billingDetails?.newStartDate ? billingDetails?.newStartDate : updatedTravelData?.pickupDate;
    const newEndDate = billingDetails?.newEndDate ? billingDetails?.newEndDate : updatedTravelData?.returnDate;
    const { reservationPriceList: newPriceList } = await getReservationPriceList(
      newStartDate,
      newEndDate,
      carData?.rates?.dailyRates?.amount,
      carData?.rates?.hourlyRates?.amount,
      carData?.rates?.customPricing,
      carData?.rates?.peakIncrease,
      setCurrentCustomPriceList
    );
    setReservationPriceList(newPriceList);
    openModal({
      title: 'New Price Details',
      content: <PriceListModal />,
    });
  };
  const handleIndividualPrice = async () => {
    openModal({
      title: 'Individual Price Details',
      content: <IndividualPriceDisplay />,
    });
  };
  return (
    <div>
      {!carData?.availability?.pickupReturnHour?.alwaysAvailable && (
        <VehicleAvailability
          customAvailabilities={carData?.availability?.pickupReturnHour?.customAvailability ?? []}
          alwaysAvailable={carData?.availability?.pickupReturnHour?.alwaysAvailable}
        ></VehicleAvailability>
      )}

      <Typography variant="h6" className="font-bold flex items-center">
        Rates{' '}
        {individualPriceList?.length > 0 ? <IoHelpCircleOutline onClick={handleIndividualPrice} className=" text-primary cursor-pointer" /> : ''}
      </Typography>
      <p className="helping_text">Please be informed that your extended days pricing will be calculated according to the current rates of the car</p>

      {/* <div className="grid grid-cols-3 w-full pt-2">
        <p className="m-0 col-span-1">Price During Reservation:</p>
        <div className="col-span-2 flex gap-4">
          <p className="m-0">Daily: ${updatedTravelData?.basePrice?.dailyPrice}</p>
          <Divider orientation="vertical" className="bg-black"></Divider>
          <p className="m-0">Hourly: ${updatedTravelData?.basePrice?.hourlyPrice}</p>
        </div>
      </div> */}
      {/* <div className="grid grid-cols-3 w-full mb-4">
        <p className="m-0 col-span-1">Current price:</p>
        <div className="col-span-2 flex gap-4">
          <p className="m-0">Daily: ${carData?.rates?.dailyRates?.amount}</p>
          <Divider orientation="vertical" className="bg-black"></Divider>
          <p className="m-0">Hourly: ${carData?.rates?.hourlyRates?.amount}</p>
        </div>
      </div> */}
      {/* <div className={`${process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? 'grid grid-cols-2 gap-2 my-2' : 'my-2'}`}>
        {process.env.NEXT_PUBLIC_NODE_ENV === 'development' && (
          <Button variant="outlined" color="primary" className="normal-case" onClick={handlePreviousPrice}>
            Price During Reservation
          </Button>
        )}
        <Button variant="outlined" color="primary" className="normal-case" onClick={handleNewPrice}>
          View Price Details
        </Button>
      </div> */}

      {process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && (
        <>
          <p className="m-0">Not for Production</p>
          <TemporaryReservationData></TemporaryReservationData>
        </>
      )}

      {billingDetails?.newDuration && !availabilityErrorText && (
        //  <ExtendBilling billingDetails={billingDetails}></ExtendBilling>
        <ExtendBillingUpdated billingDetails={billingDetails} />
      )}
    </div>
  );
};

export default EditTravelCommon;
