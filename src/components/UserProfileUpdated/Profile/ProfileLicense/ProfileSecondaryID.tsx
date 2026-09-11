import { Divider } from '@mui/material';
import SecondaryIDInfo from './ProfileSecondaryID/SecondaryIDInfo';
import SecondaryIDPhoto from './ProfileSecondaryID/SecondaryIDPhoto';

const ProfileSecondaryID = () => {
  return (
    <div className="my-6">
      <div className={`flex flex-col md:flex-row gap-2`}>
        <div className="md:w-3/5">
          <SecondaryIDInfo />
        </div>
        <div className="md:w-2/5 flex">
          <div className="hidden md:block pr-1">
            <Divider orientation="vertical" className="py-4" />
          </div>
          <SecondaryIDPhoto />
        </div>
      </div>
    </div>
  );
};

export default ProfileSecondaryID;
