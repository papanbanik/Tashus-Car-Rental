import ProfileRedirect from '@/components/Common/Verification/ProfileRedirect';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { Divider } from '@mui/material';
import SectionBorder from '../../SectionBorder';
import ProfileLicenseInfo from './ProfileLicenseInfo';
import ProfileLicensePhotos from './ProfileLicensePhotos';
import ProfileLicenseSelfie from './ProfileLicenseSelfie';
import ProfileSecondaryID from './ProfileSecondaryID';

const ProfileLicense = () => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  return (
    <div className="my-6">
      <ProfileRedirect title="License" editStep="license" />
      <SectionBorder>
        <div>
          <ProfileLicenseSelfie />
        </div>
        <div className={`flex flex-col md:flex-row gap-2`}>
          <div className="md:w-3/5">
            <ProfileLicenseInfo />
          </div>
          <div className="md:w-2/5 flex">
            <div className="hidden md:block pr-1">
              <Divider orientation="vertical" className="py-4" />
            </div>
            <ProfileLicensePhotos />
          </div>
        </div>
        {!!userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType && <ProfileSecondaryID />}
      </SectionBorder>
    </div>
  );
};

export default ProfileLicense;
