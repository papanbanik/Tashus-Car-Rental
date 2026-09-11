'use client';
// Import necessary libraries and components
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import React from 'react';

// Functional component representing the mobile download section
const AppDownload: React.FC = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="max-w-[1000px]">
        <div
          style={{ backgroundColor: '#F6F1F6' }}
          className="flex items-center  px-4 md:px-6 lg:px-10 container shadow-lg mx-auto p-4 rounded-2xl lg:mb-24 lg:mt-0"
        >
          {/* Image Div (Hidden on Small Devices) */}
          <div className="flex-2 relative hidden sm:block w-300 h-400 sm:w-1/2 sm:max-w-[300px] sm:h-auto pr-4">
            <Image src="/Images/Tashus-Mobile-app.png" alt="Your Image" layout="responsive" width={300} height={400} />
          </div>

          {/* Text Div */}
          <div className="flex-3 ml-4 sm:ml-0 sm:mt-4 sm:flex sm:items-center md:items-start my-6 text-center sm:text-left">
            <div>
              <Typography variant="h2" className="text-[24px] lg:text-[32px] text-black font-bold mb-8">
                Download <span className="tashus text-primary font-flighter">TASHUS </span>Mobile App
              </Typography>
              <Typography variant="body1" className="mb-4 sm:text-center md:text-start">
                Unleash the Tashus experience at your fingertips! Download the app now for seamless car rental adventures on both Android and iPhone.
              </Typography>
              <div className="flex justify-center sm:justify-start">
                <a href="TASHUS_play_store_link" target="_blank" rel="noopener noreferrer">
                  <Image src="/Images/playStore.webp" alt="Tashus - Play Store Icon" width={120} height={40} className="mr-2 sm:mr-4" />
                </a>
                <a href="yTASHUS_app_store_link" target="_blank" rel="noopener noreferrer">
                  <Image src="/Images/appStore.webp" alt="Tashus - App Store Icon" width={120} height={40} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
