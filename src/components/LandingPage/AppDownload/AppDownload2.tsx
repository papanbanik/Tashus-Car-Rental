'use client';
import { Popover, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const AppDownload2 = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <div>
      <div className="flex flex-col justify-center items-center text-center  commonMarginBottom">
        <Typography variant="h2" className="text-black  lg:text-[40px] text-[24px] font-bold ">
          Download Our
          <span className="text-primary"> Mobile App</span>
        </Typography>
        <Typography className="mx-6">
          {`Download the Tashus app for effortless car rentals, whether you're exploring the city or escaping to the countryside. Enjoy convenience and flexibility in the palm of your hand!`}
        </Typography>
        <div className="flex justify-center items-center sm:justify-start mt-4 cursor-pointer">
          {/* <a href="https://play.google.com/store/apps/details?id=com.tashus.app&hl=en" target="_blank" rel="noopener noreferrer"> */}
          <button onClick={handleClick} className="border-none cursor-pointer">
            <Image src="/Images/playStore.webp" alt="Tashus - Play Store Icon" width={120} height={40} className="mr-2 sm:mr-4" />
          </button>
          {/* </a> */}
          <Link href="https://play.google.com/store/apps/details?id=com.tashus.app&hl=en" target="_blank" rel="noopener noreferrer">
            <Image src="/Images/appStore.webp" alt="Tashus - App Store Icon" width={120} height={40} />
          </Link>
        </div>
        <div className="mt-6">
          <Image
            src="/Hero/TashusMobileApp.png"
            alt="Your vehicle can help you earn money Tashus"
            className="max-w-full h-auto rounded-lg"
            width={910}
            height={390}
          />
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography className="p-2">Coming Soon...</Typography>
        </Popover>
      </div>
    </div>
  );
};

export default AppDownload2;
