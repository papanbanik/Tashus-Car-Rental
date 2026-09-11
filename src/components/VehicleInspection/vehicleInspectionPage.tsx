'use client';
// Import necessary modules and components
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import { FaCalendarAlt, FaDownload, FaFileDownload, FaList, FaPrint, FaUpload } from 'react-icons/fa';

const vehicleInspectionPage: React.FC = () => {
  const vehicles = [
    {
      type: 'Sedan',
      pdfFileName: 'car_damage_report.pdf',
      imageUrl: '/Images/reports-image/Tashus-vehicle-damage-inspection-report00.png',
      downloadUrl: '/Reports/Tashus-vehicle-damage-inspection-report-sedan.pdf', // Add the corresponding PDF download URL
    },
    {
      type: 'SUV',
      pdfFileName: 'bicycle_damage_report.pdf',
      imageUrl: '/Images/reports-image/Tashus-vehicle-damage-inspection-report01.png',
      downloadUrl: '/Reports/Tashus-vehicle-damage-inspection-report-SUV.pdf', // Add the corresponding PDF download URL
    },
    {
      type: 'Van',
      pdfFileName: 'motorcycle_damage_report.pdf',
      imageUrl: '/Images/reports-image/Tashus-vehicle-damage-inspection-report02.png',
      downloadUrl: '/Reports/Tashus-vehicle-damage-inspection-report-van.pdf', // Add the corresponding PDF download URL
    },
  ];

  const instructions = [
    {
      title: 'Download the Form',
      icon: <FaFileDownload size={22} />,
      text: 'Click on the provided link to download the Damage Report Form in PDF format.',
    },
    {
      title: 'Print and Inspect',
      icon: <FaPrint size={22} />,
      text: 'Print the form and conduct a thorough inspection of your vehicle, noting any damages.',
    },
    {
      title: 'Listing Damages',
      icon: <FaList size={22} />,
      text: 'Use the form to list and describe all damages found, marking their locations accurately.',
    },
    {
      title: 'Provide Date, Details and Name',
      icon: <FaCalendarAlt size={22} />,
      text: `Input the inspection date and include pertinent details, including the vehicle's name, concerning any damages identified`,
    },
    {
      title: 'Upload the Completed Form',
      icon: <FaUpload size={22} />,
      text: "After filling out the form, scan or take a photo and upload it using the platform's 'Damage Reporting' section.",
    },
  ];

  const handleDownload = (downloadUrl: string | URL | undefined) => {
    // Add functionality to handle download
    window.open(downloadUrl, '_blank');
  };

  const handlePrint = (downloadUrl: string | URL | undefined) => {
    // Add functionality to open print window
    const printWindow = window.open(downloadUrl, '_blank');
    if (printWindow) {
      printWindow.print();
    }
  };

  return (
    <div className="md:px-44 px-8 mb-24 relative">
      <div className={`text-center lg:text-left mt-2 lg:mt-0 mb-0 lg:mb-2`}>
        <Box>
          <Typography variant="h1" className="font-semibold text-black text-center mb-4 text-[32px] lg:text-[48px]">
            <span className="text-primary">Tashus </span>
            Vehicle Damage
            <span className="text-primary"> Inspection </span>
          </Typography>
        </Box>
      </div>
      <Typography className="mb-8 lg:mb-14 text-center">
        {`Welcome to our vehicle damage reporting system! Ensuring the accurate documentation of any damages found on your vehicle is crucial to maintaining its condition and ensuring a smooth experience for all users.
To report damages, please download our Damage Report Form by clicking here. This form is essential for listing any scratches, dents, or issues you identify during your inspections. This process ensures transparency and builds trust with
        potential renters by accurately documenting your vehicle's condition.`}
      </Typography>

      <div className="flex justify-center items-center ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="max-w-xs p-4 bg-white rounded-md shadow-md relative transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">{vehicle.type}</h2>
              <div
                style={{
                  maxWidth: '200px',
                  maxHeight: '350px',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Image
                  src={vehicle.imageUrl}
                  alt={`${vehicle.type} Image`}
                  width={200}
                  height={350}
                  className="mb-6 flex-shrink-0"
                  style={{ maxWidth: '100%' }}
                />
              </div>
              <div className="flex flex-row items-center space-x-4 absolute bottom-0 left-0 right-0 p-4">
                <button
                  className="text-white flex-grow bg-primary px-3 py-1 rounded-md"
                  onClick={() => handleDownload(vehicle.downloadUrl)}
                  style={{ cursor: 'pointer' }}
                >
                  <FaDownload className="mr-1" />
                  Download
                </button>
                <button
                  className="text-white flex-grow bg-primary px-3 py-1 rounded-md"
                  onClick={() => handlePrint(vehicle.downloadUrl)}
                  style={{ cursor: 'pointer' }}
                >
                  <FaPrint className=" mr-1" />
                  Print
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 lg:mt-14 ml-0 md:lg-[100px] lg:ml-[160px]">
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-center space-x-4 mb-6">
            <div className="text-primary text-md">{instruction.icon}</div>
            <div>
              <Typography variant="subtitle1" className="font-bold mb-1">
                {instruction.title}
              </Typography>
              <Typography variant="body1">{instruction.text}</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default vehicleInspectionPage;
