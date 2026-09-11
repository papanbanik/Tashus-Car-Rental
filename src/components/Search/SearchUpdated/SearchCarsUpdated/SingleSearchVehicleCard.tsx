'use client';

import Image from 'next/image';
import CommonRating from '@/components/Common/CommonRating';
import { TiStar } from 'react-icons/ti';
import SingleSearchVehicleFeature from './SingleSearchVehicleFeature';
import { TSearchedCar, TSearchPriceMode } from '@/types/car-search/carSearchType';
import Chip from '@mui/material/Chip';
import { getSearchCardNoticeHourText } from '@/utils/Functions/searchCommonFn';

interface VehicleCardProps {
  image: string;
  title: string;
  model: string;
  automatic: boolean;
  seats: number;
  fuel: string;
  rating: number;
  pricePerDay: number;
  pricePerHour: number;
}

export interface IVehicleCardProps {
  searchedCar: TSearchedCar;
  priceMode: TSearchPriceMode;
}

const SingleSearchVehicleCard = ({ searchedCar, priceMode }: IVehicleCardProps) => {
  return (
    <div className="flex bg-white shadow-md rounded-2xl overflow-hidden h-40">
      {/* Image Column */}
      <div className="w-[40%] relative">
        <Image src={searchedCar?.photos?.coverPhoto?.imageInfo?.secure_url} alt="Searched Car" fill className="object-cover" />
        {/* Transparent Overlay */}
        <div
          className="absolute top-0 right-0 h-full"
          style={{
            width: '43%',
            background: 'linear-gradient(to left, rgba(255, 255, 255, 1.0), rgba(255, 255, 255, 0))',
          }}
        />
      </div>

      {/* Details Column */}
      <div className="w-[42%] p-2 py-4 flex flex-col justify-between space-y-1">
        {/* Row 1: Title and Model */}
        <div className="m-0">
          <h3 className="text-lg font-bold text-gray-700 m-0 p-0">
            {`${searchedCar?.car?.make} ${searchedCar?.car?.model}`.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())}
          </h3>
          <p className="text-sm font-light text-gray-600 m-0">
            {searchedCar?.car?.carType?.toLowerCase()?.replace(/\b\w/g, (char: string) => char.toUpperCase())}
          </p>
        </div>

        {/* Separation Line */}
        <div className="h-[1px] bg-gray-200 my-0" />
        {/* Row 2: Features */}
        <SingleSearchVehicleFeature
          transmissionType={searchedCar?.car?.transmissionType}
          seats={searchedCar?.car?.seats}
          fuelType={searchedCar?.car?.fuelType}
        ></SingleSearchVehicleFeature>
        {/* Separation Line */}
        <div className="h-[1px] bg-gray-200 my-0" />
        {/* Row 3: Rating */}
        {/* <div className="flex items-center gap-1 m-0">
          <span className="text-sm text-gray-600 mr-2">Rating:</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={16} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
        </div> */}
        <CommonRating
          initialRating={
            searchedCar?.ratingsReceivedFrom === 0 ? 0 : parseFloat((searchedCar?.totalRatings / searchedCar?.ratingsReceivedFrom).toFixed(2))
          }
          emptyIcon={<TiStar />}
          readOnly
          size="small"
          showRatingNumber={true}
          noMaxRating={true}
          typographyProps={{ className: 'text-sm md:text-md text-gray-500' }}
        />
      </div>
      <div className="h-[120px] w-[1px] my-auto bg-gray-200 items-center " />
      {/* Pricing Column */}
      <div className="w-[18%] px-4 py-3 flex flex-col justify-center items-end">
        {searchedCar?.isNoticeHourRequired && (
          <Chip
            color="warning"
            className="text-xs p-0 mb-1"
            size="small"
            label={getSearchCardNoticeHourText(searchedCar?.availability?.noticeInAdvance)}
          />
        )}

        {priceMode === 'Day' ? (
          <>
            <div className="text-right mb-3">
              <div className="text-xl font-bold text-green-700 m-0 p-0">AUD ${searchedCar?.rates?.dailyRates?.amount || '$20.00'}</div>
              <p className="text-xs text-gray-500 m-0 p-0">Per Day</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700 m-0 p-0">AUD ${searchedCar?.rates?.hourlyRates?.amount || '$20.00'}</div>
              <p className="text-xs text-gray-500 m-0 p-0">Per Hour</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-right mb-3">
              <div className="text-xl font-bold text-green-700 m-0 p-0">AUD ${searchedCar?.rates?.hourlyRates?.amount || '$20.00'}</div>
              <p className="text-xs text-gray-500 m-0 p-0">Per Hour</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700 m-0 p-0">AUD ${searchedCar?.rates?.dailyRates?.amount || '$20.00'}</div>
              <p className="text-xs text-gray-500 m-0 p-0">Per Day</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleSearchVehicleCard;
