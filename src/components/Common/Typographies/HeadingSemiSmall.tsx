'use client';

import Typography from '@mui/material/Typography';
import React from 'react';
import SectionDescriptionLightXs from './SectionDescriptionLightXs';

interface HeadingSemiSmallProps {
  title: string;
  description?: string;
}

const HeadingSemiSmall: React.FC<HeadingSemiSmallProps> = ({ title, description }) => {
  return (
    <div>
      <Typography className={`text-sm font-semibold ${!description && 'mb-4'}`}>{title}</Typography>
      {description && <SectionDescriptionLightXs description={description}></SectionDescriptionLightXs>}
    </div>
  );
};

export default HeadingSemiSmall;
