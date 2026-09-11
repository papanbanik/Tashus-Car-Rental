'use client';

import DisplayRichText from '@/components/Common/DisplayRichText';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { Condition } from '@/types/profileInfoTypes';
import { getDurationHours } from '@/utils/Functions/dateTimeCommonFn';
import { getGuestCoverageDisplayName, getMaxDistance, getPartnerCoverageDisplayName } from '@/utils/Functions/travelCommonFn';
import { getGuestMinimumCoverage } from '@/utils/Lists/insuranceInfo';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RefObject, useEffect, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import TravelSectionHeader from './TravelSectionHeader';

interface ReservationConditionProps {
  isTravelUpdatedPage?: boolean;
}

const ReservationCondition = ({ isTravelUpdatedPage }: ReservationConditionProps) => {
  const [reservationCondition, setReservationCondition] = useState<Condition[]>([]);
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const [expanded, setExpanded] = useState<string | false>(false);
  // const [agreementPath, setAgreementPath] = useState<string>('rental');
  const pathName = usePathname();
  // const params = useParams();
  // useEffect(() => {
  //   if (params['reservations-type']) {
  //     setAgreementPath('owner');
  //   }
  // }, [params]);

  // const agreementPath = pathName.includes('travels') ? 'rental' : 'owner';
  const agreementPath = updatedTravelData?.isUserGuest ? 'rental' : 'owner';
  const hasMinimum =
    travelDetails?.reservationInfo?.insurance?.guestCoverageType === 'ultimate' ||
    travelDetails?.reservationInfo?.insurance?.guestCoverageType === 'standard' ||
    travelDetails?.reservationInfo?.insurance?.guestCoverageType === 'premium';
  useEffect(() => {
    if (travelDetails?.reservationInfo) {
      const calculatedTotalDistance = getMaxDistance(
        getDurationHours(updatedTravelData?.pickupDate, updatedTravelData?.returnDate),
        travelDetails?.reservationInfo?.dailyDistanceKm || 0
      );
      const reservationCondition: Condition[] = [
        {
          context: 'Total Kilometers Included',
          value: calculatedTotalDistance > 0 ? `${calculatedTotalDistance}KM` : 'Unlimited',
          description:
            calculatedTotalDistance > 0
              ? `Approximately <b>${calculatedTotalDistance}KM</b> of travel distance have been included for this vehicle by the partner`
              : 'You may travel in this vehicle without being concerned about the total distance covered. But make sure to follow the instructions from the partner.',
        },
        {
          context: 'Daily Kilometers Included',
          value: travelDetails?.reservationInfo?.dailyDistanceKm > 0 ? `${travelDetails?.reservationInfo?.dailyDistanceKm || 0}KM` : 'Unlimited',
          description:
            travelDetails?.reservationInfo?.dailyDistanceKm > 0
              ? `This vehicle is estimated to be able to travel up to <b>${travelDetails?.reservationInfo?.dailyDistanceKm}KM</b> daily. Please ensure not to exceed the vehicle's estimated range or the overall included limit to avoid any potential additional fees.`
              : 'This vehicle will be able to provide unlimited daily travel as there is no travel estimation or limits included by the partner.',
        },
        {
          context: 'Extra Kilometer Cost',
          value:
            travelDetails?.reservationInfo?.dailyDistanceKm > 0 ? `${travelDetails?.reservationInfo?.additionalDistanceFeePerKm || 0}¢/KM` : `0¢/KM`,
          description:
            travelDetails?.reservationInfo?.dailyDistanceKm > 0 && travelDetails?.reservationInfo?.additionalDistanceFeePerKm > 0
              ? `Any kilometers traveled over the estimated range or included limit will be charged an additional fee of <b>${travelDetails?.reservationInfo?.additionalDistanceFeePerKm}¢</b> per kilometer `
              : 'As there is no estimated kilometer range provided for this vehicle, there will be no additional charges for kilometers traveled.',
        },
        {
          context: 'Insurance Coverage',
          value: `${
            pathName.includes('travels')
              ? getGuestCoverageDisplayName(travelDetails?.reservationInfo?.insurance?.guestCoverageType)
              : getPartnerCoverageDisplayName(travelDetails?.reservationInfo?.vehicleInsurance?.coverageType)
          }`,
          description: pathName.includes('travels')
            ? `Insurance Excess Fee: <b>$${travelDetails?.reservationInfo?.insurance?.excessFee}</b>${
                hasMinimum
                  ? `<br/>Minimum Amount: <b>${getGuestMinimumCoverage(travelDetails?.reservationInfo?.insurance?.guestCoverageType)}</b>`
                  : ''
              }<br/>Percentage of Total Rentals: <b>${travelDetails?.reservationInfo?.insurance?.coveragePercentage}%</b>`
            : `Insurance Excess Fee: <b>$${travelDetails?.reservationInfo?.vehicleInsurance?.excessFee}</b><br/>Percentage from Rental Fees: <b>${travelDetails?.reservationInfo?.vehicleInsurance?.coveragePercentage}%</b>`,
        },
      ];
      setReservationCondition(reservationCondition);
    }
  }, [travelDetails?.reservationInfo, agreementPath]);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  //const selectedCar = reservationDetails?.reservations.find((reservation: any) => reservation['reservation-id'] === reservationID);

  return (
    <div className={`${isTravelUpdatedPage ? 'p-5' : ''}`}>
      <div className="mb-4">
        <TravelSectionHeader title="Reservation Condition" />
      </div>

      {isTravelUpdatedPage ? (
        <div className="space-y-1">
          {reservationCondition.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-start items-center">
                <h3 className="text-base font-semibold py-1.5 m-0 ">{item.context}:</h3>
                <p className="text-base font-bold capitalize text-primary pl-2 py-1.5 m-0 ">{item.value}</p>
              </div>
              <div>
                <DisplayRichText content={item.description} />
              </div>
              <Divider className="col-span-12 my-2 pt-4" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {reservationCondition.map((item, index) => (
            <Accordion
              key={index}
              elevation={0}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              className="bg-transparent"
            >
              <AccordionSummary className="p-0" expandIcon={<FaAngleDown className="text-primary" />}>
                <Typography>
                  {item.context} : <span className="font-bold capitalize"> {item.value} </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="border-none shadow-none">
                {/* <Typography>{item.description}</Typography> */}
                <DisplayRichText content={item.description} />
              </AccordionDetails>
            </Accordion>
          ))}
          <hr />
        </>
      )}

      <div className={`flex justify-between w-full ${isTravelUpdatedPage ? 'mt-2' : ''}`}>
        <Link
          className="text-primary"
          href={`${process.env.NEXT_PUBLIC_DOMAIN}/legals/${agreementPath}-agreement?reservation-id=${travelDetails?.reservationId}`}
          target="_blank"
        >
          {agreementPath === 'rental' ? 'Rental' : 'Owner'} Agreement
        </Link>
        {agreementPath === 'owner' && !isTravelUpdatedPage && (
          <Link className="text-primary" href={`${pathName}?view=update-vehicle-info`}>
            Update Odometer Reading
          </Link>
        )}
      </div>
      {/* <div className="text-center">
        <Link
          className="text-primary"
          href={`${process.env.NEXT_PUBLIC_DOMAIN}/legals/${agreementPath}-agreement?reservation-id=${travelDetails?.reservationId}`}
          target="_blank"
        >
          {agreementPath === 'rental' ? 'Rental' : 'Owner'} Agreement
        </Link>
      </div> */}
    </div>
  );
};

export default ReservationCondition;
