import ProfileRedirect from '@/components/Common/Verification/ProfileRedirect';
import ProfileStatus from '@/components/Common/Verification/ProfileStatus';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { Divider } from '@mui/material';
import CommonImageCard from '../../../Common/CommonImageCard';
import SectionBorder from '../../SectionBorder';
import CommonAddressInfo from './CommonAddressInfo';
import PostalAddressInfo from './PostalAddressInfo';

const ProfileAddress = () => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const addressMessage =
    userProfileVerificationInfo?.guestVerification?.residentialAddress?.status !== 'resubmitted' &&
    userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isAddressIncorrect
      ? `Please update your address info to meet the platform guidelines.`
      : '';
  const proofOfAddressCard = !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url && (
    <CommonImageCard
      imageSrc={userProfileVerificationInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url}
      width={271}
      height={158}
      divClassNames={`w-[271px] relative rounded-lg flex group mt-4`}
      title="Proof of Address"
      titleClassNames="text-sm font-bold"
      showChip={!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url}
      badgeStatus={userProfileVerificationInfo?.guestVerification?.residentialAddress?.status}
    />
  );
  return (
    <div className="my-6">
      {/* <div className="flex justify-between items-center">
        <span className="text-md font-semibold my-2">Address</span>
        <Link href={'/dashboard/edit/address'} className="text-md font-semibold text-success">
          Edit
        </Link>
      </div> */}
      <ProfileRedirect title="Address" editStep="address" />
      {/* <div className="flex flex-col md:flex-row gap-2 my-2">
        <div className="md:w-3/5">
          <ProfileAddressInfo />
        </div>
        <div className="md:w-2/5">
          <SectionBorder>
            <CommonImageCard
              imageSrc={userProfileVerificationInfo?.guestVerification?.residentialAddress?.proofOfAddress?.imageInfo?.secure_url}
              width={200}
              height={120}
              divClassNames={`w-[200px] relative rounded-lg flex group mt-4`}
              title="Proof of Address"
              titleClassNames="text-sm font-bold"
              showChip={!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.proofOfAddress?.imageInfo?.secure_url}
              badgeStatus={userProfileVerificationInfo?.guestVerification?.residentialAddress?.status}
            />
          </SectionBorder>
        </div>
      </div> */}
      <SectionBorder>
        <div className={`flex flex-col md:flex-row gap-2 my-2`}>
          <div
            className={`${
              !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.country ? 'md:w-1/2' : 'md:w-full'
            }`}
          >
            <ProfileStatus
              title="Residential Address"
              status={
                !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.status
                  ? userProfileVerificationInfo?.guestVerification?.residentialAddress?.status
                  : 'incomplete'
              }
              message={addressMessage}
            />
            <CommonAddressInfo addressInfo={userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo} />
            {!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.country && proofOfAddressCard}
            {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddress ? (
              <PostalAddressInfo />
            ) : !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddressInfo?.country ? (
              <CommonAddressInfo addressInfo={userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddressInfo} title="Postal" />
            ) : (
              ''
            )}
          </div>
          {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.country && (
            <div className="md:w-1/2 flex">
              <div className="hidden md:block p-2">
                <Divider orientation="vertical" className="py-4" />
              </div>
              <div className="flex flex-col">
                <CommonAddressInfo
                  addressInfo={userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo}
                  title="Australian"
                />
                {proofOfAddressCard}
              </div>
            </div>
          )}
        </div>
      </SectionBorder>
    </div>
  );
};

export default ProfileAddress;
