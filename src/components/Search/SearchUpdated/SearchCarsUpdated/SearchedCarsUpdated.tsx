import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchContext } from '@/context/SearchProvider';
import TopImageSkeleton from '@/components/Common/Skeletons/TopImageSkeleton';
import SingleSearchVehicleCard from './SingleSearchVehicleCard';
import SingleSearchVehicleCardMobile from './SingleSearchVehicleCardMobile';
import { TSearchedCar, TSearchPriceMode } from '@/types/car-search/carSearchType';
interface SearchedCarsUpdatedProps {
  priceMode: TSearchPriceMode;
  showMap: boolean;
  searchedCarList: TSearchedCar[];
  isLoading: boolean;
}
const SearchedCarsUpdated: React.FC<SearchedCarsUpdatedProps> = ({
  priceMode, // Destructure priceMode here
  showMap,
  searchedCarList,
  isLoading,
}) => {
  const { searchParams } = useSearchContext();
  // console.log(priceMode, 'is clicked on SearchedCarsUpdated');

  // State to track screen size
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  // Update screen size on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint is 1024px
    };

    // Call initially to set screen size
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {/* Render Skeletons while loading */}
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="mb-4">
            <TopImageSkeleton height={140} />
          </div>
        ))}

      {/* Render searched cars */}
      {!isLoading &&
        searchedCarList?.map((searched, index: number) => (
          <div key={searched?._id || index} className="mb-4">
            <Link
              // !Dynamic Domain
              href={`/search/${searched?.listingId}/vehicle-details?pickup=${searchParams?.pickup}&return=${searchParams?.return}`}
              // href={`${environment.DOMAIN}/search/${searched?.listingId}/vehicle-details?pickup=${searchParams?.pickup}&return=${searchParams?.return}`}
              className="no-underline"
            >
              {/* Conditionally render based on screen size */}
              {isLargeScreen ? (
                <SingleSearchVehicleCard searchedCar={searched} priceMode={priceMode} />
              ) : (
                <SingleSearchVehicleCardMobile searched={searched} priceMode={priceMode} />
              )}
            </Link>
          </div>
        ))}

      {/* No Car Found */}
      {!isLoading && searchedCarList?.length === 0 && (
        <div className="h-96 bg-secondary rounded-lg flex justify-center items-center relative">
          <p className="absolute top-0 text-lg font-semibold text-primary">No Vehicle Found</p>
          <Image className="mt-6" style={{ objectFit: 'contain' }} src={'/CarListing/no-draft-2.svg'} alt="no draft" fill={true} />
        </div>
      )}
    </div>
  );
};

export default SearchedCarsUpdated;
