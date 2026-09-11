'use client';
import CommonRating from '@/components/Common/CommonRating';
import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { MdPeopleAlt } from 'react-icons/md';
import { TiStar } from 'react-icons/ti';
import JourneyDark from '../../../../public/icons/VehicleIcons/JourneyDark.svg';
import { TBasicVehicleInfo } from '../types/publicProfileTypes';

const PublicProfileVehicleCard = ({ vehicleList, ownerName }: { vehicleList: TBasicVehicleInfo[]; ownerName?: string }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const carsPerPage = 4;

  // Paginate data
  const startIndex = (currentPage - 1) * carsPerPage;
  const paginatedCars = vehicleList?.slice(startIndex, startIndex + carsPerPage);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-xl font-bold m-0 p-0">
          Listed Vehicles of <span className="text-primary">{`${ownerName ?? 'User'}`}</span>
        </h2>
        <span className="helping_text">
          This section shows the vehicles listed by the user on the platform. Click on a vehicle to view more details.
        </span>
        <br />
        <span className="text-sm text-gray-600 my-1">
          Total Listed {getSingularPluralNoun('Vehicle', vehicleList?.length)}: <span className="font-semibold">{vehicleList?.length}</span>
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paginatedCars?.map((car) => (
          <div
            onClick={() => router.push(`/search/${car?.listingId}/vehicle-details`)}
            key={car?.listingId}
            className="cursor-pointer flex w-full bg-white shadow-md shadow-secondary rounded-lg hover:bg-secondary transition duration-300 ease-in-out transform hover:scale-105 z-0"
          >
            {/* Image Side and Nickname */}
            <div className="w-2/5 relative max-h-full">
              <Image src={car?.photos} alt="CarImage" className="object-cover rounded-l-lg" fill />
              <span className="bg-primary text-white text-xs absolute bottom-0 w-full text-center rounded-bl-lg">{car?.carNickName}</span>
            </div>

            {/* Information Side */}
            <div className="w-3/5 rounded-lg p-4">
              <div className="flex w-full justify-between items-center">
                <span className="text-primary md:text-sm text-xs">{car?.listingId}</span>
                <span className="bg-purple-100 text-primary px-2 py-1 rounded-full text-xs font-semibold">{car?.carType}</span>
              </div>

              {/* Vehicle Model, Make */}
              <div className="font-bold text-sm md:text-lg flex justify-between">
                <span className="flex items-center justify-start">{car?.carName}</span>
              </div>

              {/* Daily/Hr Amount and Trips */}
              <div className="font-semibold text-xs md:text-sm flex justify-between">
                <span className="flex items-center justify-start">
                  ${car.dailyRates}/day | ${car.hourlyRates}/hr
                </span>
                <div className="flex items-center justify-end">
                  <CommonTextIcon
                    text={`${car.totalTrips ?? 0} ${car.totalTrips > 1 ? 'Trips' : 'Trip'}`}
                    className="font-semibold text-sm md:text-md"
                    startIcon={<JourneyDark className="text-primary text-sm md:text-md mr-2" />}
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="flex md:text-sm text-xs text-start gap-2 py-2">
                <CommonRating
                  initialRating={
                    car.ratingsReceivedFrom === 0 || car.ratingsReceivedFrom === undefined
                      ? 0
                      : Math.ceil((car?.totalRatings / car?.ratingsReceivedFrom) * 10) / 10
                  }
                  precision={0.1}
                  emptyIcon={<TiStar />}
                  readOnly
                  showRatingNumber={true}
                  typographyProps={{ className: 'text-sm md:text-md' }}
                  size="small"
                />
                <CommonTextIcon
                  className="text-sm md:text-md"
                  text={`${car?.ratingsReceivedFrom ?? 0}`}
                  startIcon={<MdPeopleAlt className="text-primary text-sm md:text-md mr-1" />}
                />
              </div>
              {/* Location */}
              <div className="text-xs text-start flex items-center">
                <FaLocationDot className="text-primary text-xs mr-2" />
                <span>{car?.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 my-2">
        <IconButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="bg-primary text-white disabled:opacity-50 hover:bg-purple-700 transition-colors duration-200"
        >
          <IoChevronBack className="w-5 h-5" />
        </IconButton>
        <span className="text-sm">{`Page ${currentPage} of ${Math.ceil(vehicleList?.length / carsPerPage)}`}</span>
        <IconButton
          disabled={startIndex + carsPerPage >= vehicleList?.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="bg-primary text-white disabled:opacity-50 hover:bg-purple-700 transition-colors duration-200"
        >
          <IoChevronForward className="w-5 h-5" />
        </IconButton>
      </div>
    </div>
  );
};
export default PublicProfileVehicleCard;
