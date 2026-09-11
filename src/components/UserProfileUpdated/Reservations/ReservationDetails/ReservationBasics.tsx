'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { Button, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect } from 'react';
import { BiSupport } from 'react-icons/bi';
import { LuCalendarCheck2 } from 'react-icons/lu';
import { TbCalendarTime } from 'react-icons/tb';

const ReservationBasics = (props: any) => {
  const { reservationData } = props;
  const { vehicleDetails } = useProfileInfoContext();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const formatDate = (dateString: string) => {
    const formattedDate = dayjs(dateString).format('DD MMM YYYY | h:mm A');
    return formattedDate;
  };

  return (
    <div className="my-6">
      <div className="grid md:grid-cols-4 grid-cols-2 gap-8 bg-white shadow-lg shadow-secondary rounded-lg p-4 justify-between">
        <div className="relative my-2">
          {/* <span className="flex justify-start w-2/3 my-2 bg-primary text-white p-2 rounded-r-3xl">XYZ's Reservation</span> */}
          <span
            className="z-10 relative inline-block font-bold bg-primary text-white p-2 w-2/3"
            style={{
              // clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)',
              clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
              zIndex: 100,
            }}
          >
            XYZ &apos;s Reservation
          </span>
        </div>
        <div className="flex flex-row">
          <div className="grid grid-cols-1 w-4 md:my-0">
            <Image
              src="/icons/FromTo/EnabledFromTo.svg"
              alt="FromTo"
              width={300}
              height={200}
              className="object-cover rounded-lg w-auto h-auto m-1"
            />
          </div>
          <div className="flex flex-row ml-2">
            <div className={`${isSmallScreen && `font-bold`}`}>
              <div>
                <span>From</span>
              </div>
              <div>To</div>
            </div>
            <div className=" ml-2 md:font-bold">
              <div>
                <span>{formatDate(vehicleDetails?.startDate)}</span>
              </div>
              <span>{formatDate(vehicleDetails?.endDate)}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-row">
            <div className={`${isSmallScreen && `font-bold`}`}>
              <div>
                <TbCalendarTime className="text-primary" size={20} />
              </div>
              <div>
                <LuCalendarCheck2 className="text-primary" size={20} />
              </div>
            </div>
            <div className=" ml-2">
              <div>
                <span>
                  Duration: <span className="font-bold">{'3 days'}</span>
                </span>
              </div>
              <div>
                Reservation ID: <span className="font-bold">{vehicleDetails?.reservationId}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button
            href={`/support/support-center/${reservationData?.data?.reservationId}?role=partner&from=reservation`}
            className="search text-white normal-case font-bold text-md"
            variant="contained"
            startIcon={<BiSupport />}
          >
            Support
            {/* <Typography className="flex flex-row">
              <span>
                <BiSupport size={22} />
              </span>
              <span className="ml-2 text-bold text-md">Support</span>
            </Typography> */}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationBasics;
