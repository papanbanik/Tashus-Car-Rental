import BeforeOpenLockBox from '@/components/dummy-reservation/30minBeforeOpenLockBox';
import BeforeTravelStartsCard from '@/components/dummy-reservation/BeforeTravelStarts';

import EndTravelCardReservation from '@/components/dummy-reservation/EndTravelCardReservation';
import OpenLockBox from '@/components/dummy-reservation/OpenLockBoxCard';
import PastTravelCardReservation from '@/components/dummy-reservation/PastTravelCardReservation';
import Search from '@/components/Search/SearchUpdated/SearchUpdated';

// import ReservationDetailsCardNew from '@/components/dummy-components/ReservationdeatilsCardnew';

import StartTravelCard from '@/components/dummy-reservation/StartTravelCardReservation';

import React from 'react';

function page() {
  return (
    <div className=" min-h-screen lg:px-30 xl:px-52 md:px-24 px-2  max-w-[1600px] mx-auto">
      {/* <Sidebar />

      <div className="w-full flex flex-col">
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

      <Search />
    </div>
  );
}

export default page;
