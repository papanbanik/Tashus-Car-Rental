'use client';
import { CircularProgress, Divider } from '@mui/material';
import Image from 'next/image';
import PlatformCover from '../../../public/ReservationCoverView/publicProfile.png';
import BasicPublicProfileInfo from './components/BasicPublicProfileInfo';
import CommonPublicReview from './components/CommonPublicReviews';
import PublicProfileVehicleCard from './components/PublicProfileVehicleCard';
import { usePublicProfile } from './hooks/usePublicProfile';
import { generateOptimizedUserPublicProfile } from './utils/functions/publicProfileFn';
const neonDividerStyle = {
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 0 5px rgba(128, 0, 128, 0.5), 0 0 10px rgba(128, 0, 128, 0.4), 0 0 15px rgba(128, 0, 128, 0.3), 0 0 20px rgba(128, 0, 128, 0.2)',
};
export const boxBorder = {
  border: '1px solid rgba(128, 0, 128, 0.3)', // Semi-transparent purple border
  boxShadow: '0 0 5px rgba(128, 0, 128, 0.5), 0 0 10px rgba(128, 0, 128, 0.4), 0 0 15px rgba(128, 0, 128, 0.3), 0 0 20px rgba(128, 0, 128, 0.2)', // Purplish neon glow
};
const PublicProfile = () => {
  const { data, isLoading } = usePublicProfile();
  const { basicProfileInfo, userVehicleList = [], hostReviews = [], guestReviews = [] } = generateOptimizedUserPublicProfile(data?.data?.data[0]);
  const { firstName, lastName } = basicProfileInfo ?? {};
  const userName = `${firstName} ${lastName}`;

  return (
    <div className="max-w-6xl mx-auto rounded-lg shadow-md bg-gradient-to-r from-blush to-soft">
      {/* Background component */}
      <div className="relative max-w-6xl mx-auto bg-neutral rounded-t-lg shadow-md overflow-hidden">
        {/* Header section with background image */}
        <div className="relative w-full h-64">
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <Image src={PlatformCover} alt="Cover Photo" style={{ objectFit: 'cover' }} fill placeholder="blur" />
            <div className="bg-black absolute top-0 opacity-60 w-full h-full" />
          </div>
        </div>
      </div>
      {isLoading ? (
        <span className="w-full flex justify-center items-center my-4 min-h-[200px]">
          <CircularProgress size={32} />
        </span>
      ) : (
        <>
          <div className="relative">
            <BasicPublicProfileInfo basicProfileInfo={basicProfileInfo} />
          </div>
          {userVehicleList?.length > 0 && (
            <>
              <Divider className="my-2" />
              <div className="p-2 md:p-4 lg:p-6">
                <PublicProfileVehicleCard vehicleList={userVehicleList} ownerName={userName} />
              </div>
            </>
          )}
          {guestReviews?.length > 0 && (
            <>
              <Divider className="my-2" />
              <div className="p-2 md:p-4 lg:p-6">
                <CommonPublicReview
                  title="Guest"
                  reviews={guestReviews}
                  helpingText="Guests share their experiences and thoughts about the Tashus platform. Your feedback helps us improve and provide better services for everyone."
                />
              </div>
            </>
          )}
          <Divider className="my-2" />
          <div className="p-2 md:p-4 lg:p-6">
            <CommonPublicReview
              title="Host"
              reviews={hostReviews}
              helpingText="Tashus shares feedback and experiences about guests to ensure a safe, reliable, and welcoming community for all users."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PublicProfile;
