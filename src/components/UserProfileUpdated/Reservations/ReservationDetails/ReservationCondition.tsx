'use client';
import StepHeader from '@/components/CarListing/StepHeader';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { Condition } from '@/types/profileInfoTypes';
import { Accordion, AccordionDetails, AccordionSummary, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
const ReservationCondition = () => {
  const [reservationCondition, setReservationCondition] = useState<Condition[]>([]);
  const { vehicleDetails } = useProfileInfoContext();
  const [expanded, setExpanded] = useState<string | false>(false);
  // console.log(vehicleDetails);
  useEffect(() => {
    if (vehicleDetails) {
      const reservationCondition: Condition[] = [
        {
          context: 'Total Kilometers Included:',
          value: `${vehicleDetails?.reservationInfo?.totalDistanceKm || 0}KM`,
          description: 'Los Angeles',
        },
        {
          context: 'Total Kilometers Driven',
          value: `${vehicleDetails?.reservationInfo?.dailyDistanceKm || 0}KM`,
          description: 'Los Angeles',
        },
        {
          context: 'Per Kilometer over the limit',
          value: `${vehicleDetails?.reservationInfo?.totalDistanceKm || 0}KM`,
          description: 'Los Angeles',
        },
        {
          context: 'Extra Kilometer Cost',
          value: `$${vehicleDetails?.reservationInfo?.additionalDistanceFeePerKm || 0}`,
          description: 'Los Angeles',
        },
        {
          context: 'Insurance Coverage',
          value: 'Insurance Package',
          description: 'Los Angeles',
        },
      ];
      setReservationCondition(reservationCondition);
    }
  }, [vehicleDetails]);
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  //const selectedCar = reservationDetails?.reservations.find((reservation: any) => reservation['reservation-id'] === reservationID);
  return (
    <div>
      <StepHeader title="Reservation Condition" />
      {reservationCondition.map((item, index) => (
        <Accordion
          key={index}
          elevation={0}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
          className="bg-transparent"
        >
          <AccordionSummary expandIcon={<FaAngleDown className="text-primary" />}>
            <Typography>
              {item.context} : <span className="font-bold"> {item.value} </span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="text-[16px] md:text-[20px] border-none shadow-none">
            <Typography>{item.description}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ReservationCondition;
