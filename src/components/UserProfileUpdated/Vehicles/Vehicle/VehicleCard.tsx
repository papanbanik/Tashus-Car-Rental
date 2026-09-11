'use client';
import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { TCarListInfo } from '@/types/user-profile/vehicleListType';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { FaClock, FaStar } from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { MdPeopleAlt } from 'react-icons/md';
import { RiPinDistanceFill } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';
import VehicleCardMobile from './VehicleCardMobile';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserCredContext } from '@/context/UserCredProvider';
interface VehicleCardProps {
  vehicleDetails: TCarListInfo;
  editVehicle: (listingId: number) => void;
}

const VehicleCard = ({ vehicleDetails, editVehicle }: VehicleCardProps) => {
  const { userCred } = useUserCredContext();
  const pathName = usePathname();
  const updatedPathname = pathName.slice(0, pathName.lastIndexOf('/'));
  const isSmallScreen = useMediaQuery('(max-width:850px)');
  return (
    <div key={vehicleDetails?.listingId} className="flex w-full bg-[#FAF6F6] shadow-md shadow-secondary rounded-lg">
      {isSmallScreen ? (
        <>
          <VehicleCardMobile vehicleDetails={vehicleDetails} editVehicle={editVehicle} />
        </>
      ) : (
        <>
          <div className="w-1/5 flex items-center justify-center max-h-full ml-3 relative my-3">
            <div className="relative w-32 h-32">
              <Image
                // src={`${vehicleDetails?.photos?.coverPhoto?.imageInfo?.secure_url}`}
                src={`${vehicleDetails?.photos?.coverPhoto?.imageInfo?.secure_url}`}
                alt="CarImage"
                className="object-cover rounded-full"
                fill={true}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-2">
              <div className="bg-white rounded-full py-0.5 px-1 shadow-md flex items-center bg-opacity-80">
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
          <div className="flex-grow md:p-4 py-2 px-1 w-3/4">
            <div className="flex w-full justify-between items-center">
              <span className="text-primary md:text-sm font-semibold text-xs">{vehicleDetails?.carNickName}</span>
              {/* <span className="text-primary md:text-sm text-xs">{vehicleDetails?.listingId}</span> */}
            </div>
            <div className="grid grid-cols-[auto,1fr] font-bold md:text-xl text-sm lg:mb-1">
              <span className="md:whitespace-nowrap text-start">{vehicleDetails?.car?.model}</span>
            </div>
            <div className="flex items-center my-1">
              <div className="flex items-center mr-2 p-0 m-0">
                <FaCalendarDays className="text-primary text-md mr-1" />
                <p className="text-gray-700 text-md m-0 p-0">{`$${vehicleDetails?.rates?.dailyRates?.amount}/day `}</p>
              </div>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <div className="flex items-center p-0 m-0">
                <FaClock className="text-primary text-md mr-1" />
                <p className="text-gray-700 text-md m-0 p-0">{` $${vehicleDetails?.rates?.hourlyRates?.amount}/h`}</p>
              </div>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <div className="flex items-center mr-2 p-0 m-0">
                <RiPinDistanceFill className="text-primary text-md mr-1" />
                <p className="text-gray-700 text-md m-0 p-0">{`${vehicleDetails?.totalTrips ?? 0} ${
                  vehicleDetails?.totalTrips > 1 ? 'Trips' : 'Trip'
                }`}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-start mt-1 ml-0 pl-0">
              <LocationOnIcon className="mr-1 text-primary" />
              <span>{vehicleDetails?.location?.pickupAddress?.street}</span>
            </div>
          </div>
          <div className="w-1/4 flex flex-col  p-4 rounded-lg ">
            <span className="text-black md:text-sm text-xs text-end mb-2 items-end font-medium">ID:{vehicleDetails?.listingId}</span>
            <div className="flex w-full justify-between items-center">
              <div className="flex justify-end w-full">
                <div
                  className={`${
                    vehicleDetails?.listingStatus === 'listed'
                      ? 'bg-green-100 text-success'
                      : vehicleDetails?.listingStatus === 'pending'
                      ? 'bg-yellow-100 text-warning'
                      : vehicleDetails?.listingStatus === 'unlisted'
                      ? 'bg-red-100 text-error'
                      : vehicleDetails?.listingStatus === 'unlistedByTashus'
                      ? 'bg-red-100 text-error'
                      : 'text-info'
                  } px-2 py-1 rounded-full text-right text-sm`}
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
            <div className="flex flex-col justify-around items-end">
              <Link
                className="flex items-center justify-center no-underline bg-[#5C8D07] text-white border-[.7px] rounded-md py-2 px-4 mt-2 w-full cursor-pointer  hover:scale-105 hover:shadow-lg transition-transform duration-200 ease-in-out"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/vehicles/${vehicleDetails?.listingId}/vehicle-info`}
                passHref
              >
                <button
                  className="flex items-center justify-center bg-[#5C8D07] text-white border-none outline-none  w-full cursor-pointer "
                  // onClick={() => editVehicle(vehicleDetails?.listingId)}
                  key={vehicleDetails?.listingId}
                >
                  <TbListDetails className="mr-2" />
                  View Details
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleCard;
