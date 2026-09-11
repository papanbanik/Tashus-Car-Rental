import Typography from '@mui/material/Typography';
import React, { ReactNode } from 'react';

interface CarDetailsSectionTitleProps {
  sectionTitle: string | ReactNode;
}

const CarDetailsSectionTitle = ({ sectionTitle }: CarDetailsSectionTitleProps) => {
  return <Typography className="mb-6 font-semibold">{sectionTitle}</Typography>;
};

export default CarDetailsSectionTitle;
