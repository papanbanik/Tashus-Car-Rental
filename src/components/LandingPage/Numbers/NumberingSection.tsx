'use client'
import { Box, Typography } from '@mui/material';
import React from 'react';
import { numberingData } from './Numbers';

const NumberingSection: React.FC = () => {
  return (
    <Box className="flex md:flex-row flex-col justify-center items-center gap-10 mt-40 mb-40">
      {numberingData.map((item, index) => (
        <React.Fragment key={index}>
          <Typography className="flex flex-col items-center md:mx-2 ">
            <span className="text-primary font-semibold lg:text-[56px] text-[40px]">{item.number}</span>
            <span className="text-center lg:text-[24px] text-[18px] font-bold">{item.name}</span>
          </Typography>
          {index < numberingData.length - 1 && <Box className="h-5 md:h-12 w-2  bg-success justify-center" />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default NumberingSection;