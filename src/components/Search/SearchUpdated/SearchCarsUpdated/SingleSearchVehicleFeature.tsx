import React from 'react';
import { GiGearStickPattern } from 'react-icons/gi';
import { LuFuel } from 'react-icons/lu';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

interface SingleSearchVehicleFeatureProps {
  transmissionType: string;
  seats: number;
  fuelType: string;
}

const SingleSearchVehicleFeature = ({ transmissionType, seats, fuelType }: SingleSearchVehicleFeatureProps) => {
  return (
    <div className="flex justify-between text-sm text-gray-600 gap-2 m-0">
      <div className="flex items-center gap-1">
        <GiGearStickPattern size={16} className="text-gray-500" />
        <span>{transmissionType}</span>
      </div>
      <div className="flex items-center gap-1">
        <MdAirlineSeatReclineNormal size={16} className="text-gray-500" />
        <span>{seats}</span>
      </div>
      <div className="flex items-center gap-1">
        <LuFuel size={16} className="text-gray-500" />
        <span>{fuelType}</span>
      </div>
    </div>
  );
};

export default SingleSearchVehicleFeature;
