'use client';
import CommonTextIcon from '@/components/Common/CommonTextIcon';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import Image from 'next/image';
import { MdPeopleAlt } from 'react-icons/md';
import { TbListDetails } from 'react-icons/tb';

import { TCarListInfo } from '@/types/user-profile/vehicleListType';
import { FaCalendarAlt, FaCar, FaClock, FaStar } from 'react-icons/fa';
import { useUserCredContext } from '@/context/UserCredProvider';
import Link from 'next/link';

interface VehicleCardProps {
  vehicleDetails: TCarListInfo;
  editVehicle: (listingId: number) => void;
}

const VehicleCardMobile = ({ vehicleDetails, editVehicle }: VehicleCardProps) => {
  const { userCred } = useUserCredContext();

  return (
    <div className="flex w-full  shadow-md shadow-secondary rounded-lg h-full">
      <div className="mx-auto bg-[#FAF6F6] shadow-lg rounded-lg w-full flex flex-col h-full cursor-pointer">
        <div className="px-6 pt-6 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col items-center w-[15%]">
              <div className="bg-[#F6E7F6] text-primary font-bold text-sm rounded-2xl h-6 w-14 flex items-center justify-center">
                {vehicleDetails?.listingId}
              </div>
            </div>
            <div className="flex flex-col items-center relative w-[70%]">
              <Image
                src={`${vehicleDetails?.photos?.coverPhoto?.imageInfo?.secure_url}`}
                alt="Vehicle"
                width={125}
                height={125}
                className="rounded-full h-32 w-32 object-cover"
              />
              <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center items-center">
                <div className="bg-white rounded-full py-0.5 px-1 shadow-md flex items-center bg-opacity-90">
                  <FaStar className="text-yellow-500 mr-1 text-xl" />
                  <span className="text-gray-800 text-sm font-medium mr-1">
                    {vehicleDetails?.ratingsReceivedFrom === 0 || vehicleDetails?.ratingsReceivedFrom === undefined
                      ? '0.0'
                      : (Math.ceil((vehicleDetails?.totalRatings / vehicleDetails?.ratingsReceivedFrom) * 10) / 10).toFixed(1)}
                  </span>
                  <CommonTextIcon
                    className="text-sm mr-0"
                    text={`${vehicleDetails?.ratingsReceivedFrom ?? 0}`}
                    startIcon={<MdPeopleAlt className="text-primary text-sm mr-0.5" />}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center w-[15%]">
              <div
                className={`${
                  vehicleDetails?.listingStatus === 'listed'
                    ? 'bg-green-200 text-success text-sm'
                    : vehicleDetails?.listingStatus === 'pending'
                    ? 'bg-yellow-100 text-warning text-center text-sm'
                    : vehicleDetails?.listingStatus === 'unlisted'
                    ? 'bg-red-200 text-error'
                    : vehicleDetails?.listingStatus === 'unlistedByTashus'
                    ? 'bg-red-200 text-xs absolute w-24 text-error'
                    : 'text-info'
                } px-4 py-1 rounded-full text-right text-sm`}
              >
                {vehicleDetails?.listingStatus === 'listed'
                  ? 'Listed'
                  : vehicleDetails?.listingStatus === 'pending'
                  ? 'Pending'
                  : vehicleDetails?.listingStatus === 'unlisted'
                  ? 'Unlisted'
                  : vehicleDetails?.listingStatus === 'unlistedByTashus'
                  ? 'Unlisted By Tashus'
                  : 'Unknown Status'}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4">
            <span className="text-center text-lg font-bold">{vehicleDetails?.car?.model}</span>
            <span className="text-primary md:text-sm font-semibold text-xs text-center mb-2">{vehicleDetails?.carNickName}</span>
          </div>
          <div className="h-px w-full bg-gray-300 mb-0 mt-1"></div>
          <div className="mb-0.5 flex justify-between items-center h-10">
            <div className="flex items-center text-center">
              <FaCalendarAlt className="text-primary text-lg mr-1" />
              <span className="text-gray-700 text-md">{`$${vehicleDetails?.rates?.dailyRates?.amount}/day `}</span>
            </div>
            <div className="w-px h-7 bg-gray-300 mx-2"></div>
            <div className="flex items-center text-center">
              <FaClock className="text-primary text-lg mr-1" />
              <span className="text-gray-700 text-md">{` $${vehicleDetails?.rates?.hourlyRates?.amount}/h`}</span>
            </div>
            <div className="w-px h-7 bg-gray-300 mx-2 items-center"></div>
            <div className="flex items-center text-center">
              <FaCar className="text-primary text-lg mr-1" />
              <span className="text-gray-700 text-md m-0 p-0">{`${vehicleDetails?.totalTrips ?? 0} ${
                vehicleDetails?.totalTrips > 1 ? 'Trips' : 'Trip'
              }`}</span>
            </div>
          </div>
          <div className="h-px w-full bg-gray-300 mb-0"></div>
          <div className="flex items-center text-sm text-start my-3 ml-0 pl-0">
            <LocationOnIcon className="mr-1 text-primary" />
            <span>{vehicleDetails?.location?.pickupAddress?.street}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            className="w-full bg-primary no-underline text-white py-3 border-0 rounded-bl-md rounded-br-md flex items-center justify-center cursor-pointer"
            href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/vehicles/${vehicleDetails?.listingId}/vehicle-info`}
            passHref
          >
            <button
              className="w-full bg-primary text-white  border-none outline-none flex items-center justify-center cursor-pointer"
              // onClick={() => editVehicle(vehicleDetails?.listingId)}
            >
              <TbListDetails className="mr-2" />
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCardMobile;
