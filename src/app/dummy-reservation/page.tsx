import BeforeOpenLockBox from '@/components/dummy-reservation/30minBeforeOpenLockBox';
import BeforeTravelStartsCard from '@/components/dummy-reservation/BeforeTravelStarts';
import EndTravelCardReservation from '@/components/dummy-reservation/EndTravelCardReservation';
import OpenLockBox from '@/components/dummy-reservation/OpenLockBoxCard';
import PastTravelCardReservation from '@/components/dummy-reservation/PastTravelCardReservation';
import StartTravelCard from '@/components/dummy-reservation/StartTravelCardReservation';
import Sidebar from '@/components/dummy-reservation/testMenuUsingStyle';
import SidebarTailwind from '@/components/dummy-reservation/testMenuUsingTailwind';

import React from 'react';

function page() {
  return (
    <div className="flex w-40%">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-gray-100 flex flex-row">
        <Sidebar />
        <SidebarTailwind />
      </div>

      {/* Main Content Area */}
      {/* <div className="w-60% flex flex-col p-4">
        <BeforeTravelStartsCard />
        <div className="mt-4"></div>
        <BeforeOpenLockBox />
        <div className="mt-4"></div>
        <OpenLockBox />
        <div className="mt-4"></div>
        <StartTravelCard />
        <div className="mt-4"></div>
        <EndTravelCardReservation />
        <div className="mt-4"></div>
        <PastTravelCardReservation />
        <div className="mt-4 "></div>

        <div className="mt-4 mb-4"></div>
      </div> */}
    </div>
  );
}

export default page;
