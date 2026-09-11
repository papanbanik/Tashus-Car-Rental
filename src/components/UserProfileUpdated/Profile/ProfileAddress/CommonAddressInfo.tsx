import { TAddressInfo } from '@/types/user-verification/userVerificationTypes';
import { countryFullName, stateFullName } from '@/utils/Functions/randomCommonFn';

const CommonAddressInfo = ({ addressInfo, title }: { addressInfo?: TAddressInfo; title?: string }) => {
  return (
    <div className="flex flex-col">
      {!!title && <span className="text-sm font-bold">{title} Address</span>}
      <div className="grid grid-cols-1 mt-4">
        {/* Full Address */}
        {/* <div className="grid grid-cols-2 text-sm">
          <span>Street Address</span>
          <span>{addressInfo?.streetAddress || 'Not Added'}</span>
        </div> */}

        {/* Unit Number */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Unit Number</span>
          <span className="capitalize">{addressInfo?.unitNumber || 'Not Added'}</span>
        </div>

        {/* Street Number */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Street Number</span>
          <span>{addressInfo?.streetNumber || 'Not Added'}</span>
        </div>

        {/* Street Name */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Street Name</span>
          <span>{addressInfo?.streetName || 'Not Added'}</span>
        </div>

        {/* Suburb */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Suburb</span>
          <span>{addressInfo?.suburb || 'Not Added'}</span>
        </div>

        {/* State */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>State</span>
          <span>{addressInfo?.state ? stateFullName(addressInfo.state, addressInfo.country) : 'Not Added'}</span>
        </div>

        {/* Postal Code */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Postal Code</span>
          <span>{addressInfo?.postcode || 'Not Added'}</span>
        </div>

        {/* Country */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Country</span>
          <span>{addressInfo?.country ? countryFullName(addressInfo.country) : 'Not Added'}</span>
        </div>
      </div>
    </div>
  );
};

export default CommonAddressInfo;
