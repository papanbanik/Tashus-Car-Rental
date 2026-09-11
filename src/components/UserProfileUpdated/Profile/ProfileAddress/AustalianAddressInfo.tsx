import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { countryFullName, stateFullName } from '@/utils/Functions/randomCommonFn';

const AustralianAddressInfo = () => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  return (
    <>
      <span className="text-sm font-bold">Australian Address</span>
      <div className="grid grid-cols-1 mt-4">
        {/* Full Address */}
        <div className="grid grid-cols-2 text-sm">
          <span>Street Address</span>
          <span>
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.streetAddress
              ? `${userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.streetAddress}`
              : 'Not Added'}
          </span>
        </div>
        {/* Unit Number */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Unit Number</span>
          <span className=" capitalize">
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.unitNumber
              ? userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.unitNumber
              : 'Not Added'}
          </span>
        </div>
        {/* Street Number */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Street Number</span>
          <span>{userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.streetNumber}</span>
        </div>
        {/* Street Name */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Street Name</span>
          <span>{userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.streetName}</span>
        </div>
        {/* Suburb */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Suburb</span>
          <span>{userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.suburb}</span>
        </div>
        {/* State */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>{'State'}</span>
          <span>
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.state
              ? stateFullName(userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.state)
              : 'Not Added'}
          </span>
        </div>
        {/* Postal Code */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>{'Postal Code'}</span>
          <span>{userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.postcode}</span>
        </div>
        {/* Country */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>{'Country'}</span>
          <span>
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.country
              ? countryFullName(userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.country)
              : 'Not Added'}
          </span>
        </div>
      </div>
    </>
  );
};

export default AustralianAddressInfo;
