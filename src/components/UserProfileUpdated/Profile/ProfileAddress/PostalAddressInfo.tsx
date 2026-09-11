import { useProfileInfoContext } from '@/context/ProfileInfoProvider';

const PostalAddressInfo = () => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  return (
    <div className="flex flex-col my-2">
      <span className="text-sm font-bold">Postal Address</span>
      <span className="text-sm">
        {!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddress
          ? `${userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddress}`
          : ''}
      </span>
    </div>
  );
};

export default PostalAddressInfo;
