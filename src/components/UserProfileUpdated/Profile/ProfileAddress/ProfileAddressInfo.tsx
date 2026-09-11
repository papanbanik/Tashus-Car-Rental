import ProfileStatus from '@/components/Common/Verification/ProfileStatus';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { countryFullName, stateFullName } from '@/utils/Functions/randomCommonFn';
import SectionBorder from '../../SectionBorder';
import AustralianAddressInfo from './AustalianAddressInfo';
import PostalAddressInfo from './PostalAddressInfo';

const ProfileAddressInfo = () => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const addressMessage =
    userProfileVerificationInfo?.guestVerification?.residentialAddress?.status !== 'resubmitted' &&
    userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isAddressIncorrect
      ? `Please update your address info to meet the platform guidelines.`
      : '';
  return (
    <SectionBorder>
      {/* <div className="flex justify-between items-center">
        <span className="text-sm font-bold">Residential Address</span>
        <Chip
          label={`${userProfileInfo?.guestVerification?.residentialAddress?.status}`}
          size="small"
          className="capitalize"
          variant="outlined"
          color={getTextColorClass(userProfileInfo?.guestVerification?.residentialAddress?.status ?? '') as colorType}
        />
      </div> */}
      <ProfileStatus
        title="Residential Address"
        status={
          !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.status
            ? userProfileVerificationInfo?.guestVerification?.residentialAddress?.status
            : 'incomplete'
        }
        message={addressMessage}
      />
      <div className="grid grid-cols-1 mt-4">
        {/* Full Address */}
        <div className="grid grid-cols-2 text-sm">
          <span>Street Address</span>
          <span>
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.streetAddress
              ? `${userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.streetAddress}`
              : 'Not Added'}

            {/* {`${
              !!userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.unitNumber
                ? `Unit ${userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.unitNumber},`
                : ''
            } ${userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.streetNumber} ${
              userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.streetName
            } ${userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.suburb}, ${stateFullName(
              userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.state
            )}, ${userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.postcode} ${countryFullName(
              userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.country
            )}`} */}
          </span>
        </div>
        {/* Unit Number */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Unit Number</span>
          <span className=" capitalize">
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.unitNumber
              ? userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.unitNumber
              : 'Not Added'}
          </span>
        </div>
        {/* Street Number */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Street Number</span>
          <span>{userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.streetNumber}</span>
        </div>
        {/* Street Name */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Street Name</span>
          <span>{userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.streetName}</span>
        </div>
        {/* Suburb */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>Suburb</span>
          <span>{userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.suburb}</span>
        </div>
        {/* State */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>{'State'}</span>
          <span>
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.state
              ? stateFullName(userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.state)
              : 'Not Added'}
          </span>
        </div>
        {/* Postal Code */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>{'Postal Code'}</span>
          <span>{userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.postcode}</span>
        </div>
        {/* Country */}
        <div className="grid grid-cols-2 text-sm gap-2 my-1">
          <span>{'Country'}</span>
          <span>
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.country
              ? countryFullName(userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.country)
              : 'Not Added'}
          </span>
        </div>
      </div>
      {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddress && <PostalAddressInfo />}
      {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo && <AustralianAddressInfo />}
    </SectionBorder>
  );
};

export default ProfileAddressInfo;
