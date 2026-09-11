import CarDetailsSectionTitle from '@/components/Common/VehicleDetails/CarDetailsSectionTitle';
import { CarState } from '@/types/car-listing/carInfoTypes';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import Grid from '@mui/material/Grid';
import React from 'react';
import CarDoorIcon from '../../../../public/CarListing/View-Post/CarDoor.svg';
import CarSeatIcon from '../../../../public/CarListing/View-Post/CarSeat.svg';
import CarWindowIcon from '../../../../public/CarListing/View-Post/CarWindow.svg';
import CarFuelIcon from '../../../../public/CarListing/View-Post/EcoFuel.svg';
import CarTransmissionIcon from '../../../../public/CarListing/View-Post/EcoFuel.svg';
import CarDetailsSectionDivider from '@/components/Common/VehicleDetails/CarDetailsSectionDivider';
import CarDetailsTextContent from './CarDetailsTextContent';
import { FaCar } from 'react-icons/fa6';
import { BsFuelPumpFill } from 'react-icons/bs';
import { GiGearStickPattern } from 'react-icons/gi';
import CommonTooltip from '@/components/Common/CommonTooltip';

interface CarDetailsOverviewProps {
  car: CarState;
  carDescription: string;
}

const CarDetailsOverview = ({ car, carDescription }: CarDetailsOverviewProps) => {
  const iconColor = 'text-[#484444]';
  const { doors, seats, windows, fuelType, transmissionType, carType } = car ?? {};

  const overviewList = [
    {
      name: `${carType}`,
      overviewIcon: <FaCar className={`${iconColor}`} />,
    },
    {
      name: `${doors ?? 0} ${getSingularPluralNoun('Door', doors)}`,
      overviewIcon: <CarDoorIcon />,
    },
    {
      name: `${seats} ${getSingularPluralNoun('Seat', seats)}`,
      overviewIcon: <CarSeatIcon />,
    },
    {
      name: `${windows} ${getSingularPluralNoun('Window', windows)}`,
      overviewIcon: <CarWindowIcon />,
    },
    {
      name: `${fuelType}`,
      overviewIcon: <BsFuelPumpFill className={`${iconColor}`} />,
    },
    {
      name: `${transmissionType}`,
      overviewIcon: <GiGearStickPattern className={`${iconColor}`} />,
    },
  ];

  return (
    <div className="w-full">
      <CarDetailsSectionTitle sectionTitle="Car Overview"></CarDetailsSectionTitle>

      <Grid container className="w-full" gap={1}>
        {overviewList?.map(({ name, overviewIcon }, index) => (
          <Grid xs={5} md={3} key={index} item style={{ border: '1px solid gray' }} className="p-2 rounded-lg flex flex-col items-center">
            <span className="text-4xl text-primary">{overviewIcon}</span>
            <CommonTooltip title={name} arrow={true} placement="top">
              <span className="text-ellipsis overflow-hidden whitespace-nowrap w-full text-center">{name}</span>
            </CommonTooltip>
          </Grid>
        ))}
      </Grid>

      <CarDetailsSectionDivider></CarDetailsSectionDivider>

      <CarDetailsSectionTitle sectionTitle="Description"></CarDetailsSectionTitle>

      <CarDetailsTextContent textContent={carDescription}></CarDetailsTextContent>

      <CarDetailsSectionDivider></CarDetailsSectionDivider>
    </div>
  );
};

export default CarDetailsOverview;
