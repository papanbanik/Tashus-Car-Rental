import Image from 'next/image';
import SearchedCarCard from './SearchedCarCard';
import TopImageSkeleton from '../Common/Skeletons/TopImageSkeleton';
import Link from 'next/link';
import { useSearchContext } from '@/context/SearchProvider';
import environment from '@/utils/configs/environment';

const SearchedCars = ({ showMap, searchedCarList, isLoading }: any) => {
  // console.log(searchedCarList);

  const { searchParams } = useSearchContext();
  // console.log(searchParams);

  return (
    <div>
      <div className={`grid ${showMap ? 'md:grid-cols-2 grid-cols-1' : 'lg:grid-cols-4 md:grid-cols-2 grid-cols-1'} gap-3`}>
        {(isLoading ? Array.from(new Array(4)) : searchedCarList)?.map((searched: any, index: number) =>
          searched ? (
            <Link
              key={searched?._id}
              href={`${environment.DOMAIN}/search/${searched?.listingId}/vehicle-details?pickup=${searchParams?.pickup}&return=${searchParams?.return}`}
              className="text-primary inline-block no-underline font-bold italic"
            >
              <SearchedCarCard searchedCar={searched} index={index}></SearchedCarCard>
            </Link>
          ) : (
            <TopImageSkeleton key={index} height={140}></TopImageSkeleton>
          )
        )}
      </div>

      {/* No Car found */}
      {!isLoading && searchedCarList?.length === 0 && (
        <div className="h-96 bg-secondary rounded-lg flex justify-center items-center relative">
          <p className="absolute top-0 text-lg font-semibold text-primary">No Car Found</p>
          <Image className="mt-6" style={{ objectFit: 'contain' }} src={'/CarListing/no-draft-2.svg'} alt="no draft" fill={true}></Image>
        </div>
      )}
    </div>
  );
};

export default SearchedCars;
