'use client';

import CommonRating from '@/components/Common/CommonRating';
import { TSearchedCar, TSearchPriceMode } from '@/types/car-search/carSearchType';
import { getSearchCardNoticeHourText } from '@/utils/Functions/searchCommonFn';
import Chip from '@mui/material/Chip';
import Image from 'next/image';
import { TiStar } from 'react-icons/ti';
import SingleSearchVehicleFeature from './SingleSearchVehicleFeature';

interface VehicleCardProps {
  searched: TSearchedCar;
  priceMode: TSearchPriceMode;
}

const SingleSearchVehicleCardMobile = ({ searched, priceMode }: VehicleCardProps) => {
  const { photos, car, ratingsReceivedFrom, rates, totalRatings, isNoticeHourRequired, availability } = searched ?? {};

  // Fallback values for seats and fuelType
  const seats = car?.seats ?? 0; // Default to 0 seats if undefined
  const fuelType = car?.fuelType ?? 'N/A'; // Default to N/A if undefined

  // Handle ratingsReceivedFrom possibly being undefined
  const validRatingsReceivedFrom = ratingsReceivedFrom ?? 0; // Default to 0 if undefined

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden mx-2">
      {/* Image Section */}
      <div className="w-full h-[180px] relative">
        <Image
          src={photos?.coverPhoto?.imageInfo?.secure_url || '/default-image.jpg'} // Fallback image if no image is available
          alt={car?.make || 'Car Image'}
          layout="fill"
          className="object-cover rounded-t-2xl"
        />
      </div>

      <div className="px-4">
        {/* Title and Model */}
        <div className="py-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 m-0 capitalize">{car?.make ?? ''}</h3>
            <p className="text-sm text-gray-600 m-0 capitalize font-bold">{car?.carType ?? ''}</p>
          </div>
          <p className="text-sm font-light text-gray-600 m-0 capitalize">{car?.model ?? ''}</p>
        </div>

        {/* Features Section */}
        <div className="h-[1px] bg-gray-200 my-1" />

        <div className="py-1">
          <SingleSearchVehicleFeature
            transmissionType={car?.transmissionType === 'Automatic' ? 'Automatic' : 'Manual'}
            seats={seats} // Use the fallback value if undefined
            fuelType={fuelType} // Use the fallback value if undefined
          />
        </div>

        <div className="h-[1px] bg-gray-200 mt-2" />
        <div className="w-full py-2 flex justify-between items-center text-xs">
          {/* Price per Day */}
          <div className="flex flex-row items-center justify-center">
            <p className="text-sm text-gray-500 m-0 p-0">Per Day:</p>
            <div className="text-sm font-bold text-gray-700  m-0 p-0 ml-2">AUD ${rates?.dailyRates?.amount || '$0.00'}</div>
          </div>

          {/* Price per Hour */}
          <div className="flex flex-row items-center justify-center">
            <p className="text-sm text-gray-500 m-0 p-0">Per Hour:</p>
            <div className="text-sm font-semibold m-0 p-0 text-green-700 ml-2">AUD ${rates?.hourlyRates?.amount || '$0.00'}</div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-0" />
        {/* Rating and Pricing Section */}
        <div className="flex justify-between items-center mt-2 mb-3">
          <div className=" flex items-center">
            <p className="text-sm text-gray-500 mr-2 my-0">Ratings:</p>
            <CommonRating
              initialRating={
                validRatingsReceivedFrom === 0 ? 0 : parseFloat((totalRatings! / validRatingsReceivedFrom).toFixed(2)) // Handle ratingsReceivedFrom being 0 or undefined
              }
              emptyIcon={<TiStar />}
              readOnly
              size="small"
              showRatingNumber={true}
              noMaxRating={true}
              typographyProps={{ className: 'text-sm md:text-md text-gray-500 ' }}
            />
          </div>
          <div className="flex justify-end">
            {isNoticeHourRequired && (
              <Chip color="warning" className="text-xs p-0" size="small" label={getSearchCardNoticeHourText(availability?.noticeInAdvance)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSearchVehicleCardMobile;
