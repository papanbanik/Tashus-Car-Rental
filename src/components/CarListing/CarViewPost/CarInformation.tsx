'use client';

import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface CarInformationProps {
  children?: ReactNode;
  carTitle: string;
  carNickname: string;
  dailyRate: number;
  discountText: string;
}

const CarInformation = ({ children, carNickname, carTitle, dailyRate, discountText }: CarInformationProps) => {
  return (
    <div className="mb-8">
      <Typography component={'h1'} className="font-bold lg:text-3xl md:text-2xl text-lg flex justify-between items-center">
        <span>{carTitle}</span>
        <span>
          ${dailyRate}/<sub className="text-sm">day</sub>
        </span>
      </Typography>
      <Typography className="text-xs flex justify-between items-center text-gray-500">
        <span>{carNickname}</span>
        <span>{discountText}</span>
      </Typography>
    </div>
  );
};

export default CarInformation;
