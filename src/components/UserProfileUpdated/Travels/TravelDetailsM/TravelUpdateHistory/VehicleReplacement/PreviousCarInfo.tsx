import { TLocation } from '@/types/travels/typeTravels';
import { ECommonText } from '@/utils/Functions/randomCommonFn';
import { Divider } from '@mui/material';
import Link from 'next/link';

const PreviousCarInfo = ({ previousCarListingId, previousPickupLocation }: { previousCarListingId?: number; previousPickupLocation?: TLocation }) => {
  return (
    <div>
      <Divider className="border border-black my-1" />
      <span className="flex justify-between items-center px-2 bg-primary text-white">
        <span className="text-lg font-bold">Previous Vehicle Details</span>
      </span>
      <Divider className="border border-black my-1" />
      <div className="flex flex-col p-2">
        <span>
          <b>Previous Car Listing ID:</b>{' '}
          <Link target="_blank" href={`/search/${previousCarListingId}/vehicle-details`} className=" text-primary">
            {previousCarListingId}
          </Link>
        </span>
        <Divider className="my-1" />
        <span>
          <b>Previous Pickup Location:</b>
          <br /> <b>Short Address:</b> {previousPickupLocation?.shortAddress ?? ECommonText.UndefinedText}
          {/* <br /> <b>Street Address:</b> {previousPickupLocation?.streetAddress ?? ECommonText.UndefinedText} */}
        </span>
      </div>
    </div>
  );
};

export default PreviousCarInfo;
