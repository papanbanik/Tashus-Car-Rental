'use client';

import Typography from '@mui/material/Typography/Typography';
import Link from 'next/link';
import React from 'react';
import { BsArrowRight } from 'react-icons/bs';

export interface IPhotoGuidelinesButton {
  buttonText?: string;
}

const PhotoGuidelinesButton = ({ buttonText }: IPhotoGuidelinesButton) => {
  return (
    <Link target="_blank" href={'/help/photo-upload-guide'} className="text-primary inline-block font-bold italic my-4">
      <div className="flex items-center">
        <Typography>{buttonText || 'View photo taking guidelines'}</Typography>
        <BsArrowRight size={18} className="ml-2" />
      </div>
    </Link>
  );
};

export default PhotoGuidelinesButton;
