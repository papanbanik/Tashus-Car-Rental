'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReservationDetails } from '@/hooks/reservation/useReservationDetails';
import { Tab, Tabs, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { AiFillWechat } from 'react-icons/ai';
import { BiBookContent } from 'react-icons/bi';
import { BsFillCarFrontFill } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdPhotos } from 'react-icons/io';
import { RiBillFill } from 'react-icons/ri';
import ReservationBasics from './ReservationDetails/ReservationBasics';
import ReservationBilling from './ReservationDetails/ReservationBilling';
import ReservationCondition from './ReservationDetails/ReservationCondition';
import ReservationInfo from './ReservationDetails/ReservationInfo';
import ReservationLocation from './ReservationDetails/ReservationLocation';
import ReservationMessage from './ReservationDetails/ReservationMessage';
import ReservationPhotos from './ReservationDetails/ReservationPhotos';

const tabData = [
  { label: 'Details', icon: <BsFillCarFrontFill size={20} className="text-primary" /> },
  { label: 'Location', icon: <FaLocationDot size={20} className="text-primary" /> },
  { label: 'Condition', icon: <BiBookContent size={20} className="text-primary" /> },
  { label: 'Photos', icon: <IoMdPhotos size={20} className="text-primary" /> },
  { label: 'Billing', icon: <RiBillFill size={20} className="text-primary" /> },
  { label: 'Message', icon: <AiFillWechat size={20} className="text-primary" /> },
];

const ReservationDetails = () => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { data } = useReservationDetails();
  // console.log(data);
  const { vehicleDetails } = useProfileInfoContext();
  // console.log(vehicleDetails);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
    //  className="relative w-full "
    >
      <div className=" sticky top-[98px]  bg-neutral  z-50 flex justify-center items-center ">
        {/* <div
        className={`sticky top-[98px] bg-neutral z-50 flex justify-center items-center ${isSmallScreen && 'w-full max-w-[400px] overflow-x-auto '}`}
      > */}
        {isSmallScreen ? (
          <>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              // variant={isSmallScreen ? 'scrollable' : 'fullWidth'}
              variant="scrollable"
              // centered
              // scrollButtons="auto"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="Reservation Tabs"
              // sx={{ backgroundColor: 'transparent', position: 'sticky', top: 0, zIndex: 1000 }}
              className={`${isSmallScreen && 'w-full max-w-[400px] overflow-x-auto '}`}
            >
              {tabData.map((tab, index) => (
                <Tab
                  className="px-12 normal-case text-black font-bold"
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  onClick={() => scrollToSection(`section${index}`)}
                />
              ))}
            </Tabs>
          </>
        ) : (
          <>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              // variant={isSmallScreen ? 'scrollable' : 'fullWidth'}
              variant="scrollable"
              // centered
              // scrollButtons="auto"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="Reservation Tabs"
              // sx={{ backgroundColor: 'transparent', position: 'sticky', top: 0, zIndex: 1000 }}
              className={`${isSmallScreen && 'w-full max-w-[400px] overflow-x-auto '}`}
            >
              {tabData.map((tab, index) => (
                <Tab className="normal-case text-black font-bold" key={index} label={tab.label} onClick={() => scrollToSection(`section${index}`)} />
              ))}
            </Tabs>
          </>
        )}
      </div>
      <div>
        <div id="section0" className={`${isSmallScreen && `p-4 my-6 flex justify-center items-center`}`}>
          {!isSmallScreen && <ReservationBasics reservationData={data} />}
          <ReservationInfo />
        </div>
        <div className="my-12 grid md:grid-cols-2 grid-cols-1 md:p-4">
          {/* <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 lg:gap-8"> */}
          <div id="section2" className={`lg:w-2/3 md:1/2 ${isSmallScreen && `px-6 flex justify-center items-center`}`}>
            <ReservationCondition />
          </div>
          <div id="section1" className={` ${isSmallScreen && `my-6 flex justify-center items-center`}`}>
            <ReservationLocation />
          </div>
        </div>
        <div id="section3" className={`md:p-4 ${isSmallScreen && `p-4 my-6 flex justify-center items-center`}`}>
          <ReservationPhotos />
        </div>
        <div className="my-12 grid md:grid-cols-2 grid-cols-1 md:p-4">
          {/* <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 lg:gap-8"> */}
          <div id="section4" className={`lg:w-2/3 md:1/2 ${isSmallScreen && `flex justify-center items-center`}`}>
            <ReservationBilling />
          </div>
          <div id="section5" className={`${isSmallScreen && `my-6 flex justify-center items-center`}`}>
            <ReservationMessage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
