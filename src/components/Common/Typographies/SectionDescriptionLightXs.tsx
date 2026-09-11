'use client';

import Typography from '@mui/material/Typography';
import React from 'react';

interface SectionDescriptionLightXsProps {
  description: string;
}

const SectionDescriptionLightXs: React.FC<SectionDescriptionLightXsProps> = ({ description }) => {
  return <Typography className="text-xs mb-4 font-light text-justify">{description}</Typography>;
};

export default SectionDescriptionLightXs;
