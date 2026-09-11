import React from 'react';
import VehicleInspectionPage from '@/components/VehicleInspection/vehicleInspectionPage';

export const metadata = {
  title: 'Tashus vehicle-inspection report ',
  description: `Ensuring the accurate documentation of any damages found on your vehicle is crucial to maintaining its condition and ensuring a smooth experience for all users. To report damages, please download our Damage Report Form by clicking here. `,
};

function Page() {
  return <VehicleInspectionPage />;
}

export default Page;
