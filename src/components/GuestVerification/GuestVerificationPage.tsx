'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import SectionHeader from '../CarListing/SectionHeader';
import CommonAccStatusAlert from '../Common/CommonAccStatusAlert';
import VerificationSlider from './VerificationSlider';
import VerificationSteps from './VerificationSteps';

const GuestVerificationPage = () => {
  const { guestVerificationFlags, verificationStatusFlags } = useSearchContext();
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const { userProfileInfo } = useUserCredContext();
  const { handleAddNewListing } = useCarListingContext();
  const isIPadPro = useIPadProQuery();
  const router = useRouter();
  return (
    <div className={`flex justify-center items-center md:m-12 ${isIPadPro ? 'mt-6' : ''}`}>
      <div className={`w-full lg:w-1/2`}>
        <div className={`bg-white rounded-xl shadow-lg p-4 md:p-6 m-2 xl:m-8`}>
          <SectionHeader
            title="Get Ready to Drive"
            subtitle="Add Details now so you can rent car anywhere at anytime. Once you've completed the verification process, it can take up to 24 hours for the admin to process. "
          />
          {isPartnerRestrict(partnerAccess) && isGuestRestrict(guestAccess) ? (
            <CommonAccStatusAlert isPartner={true} isGuest={true} isRestrict={true} />
          ) : (
            <>
              {isPartnerRestrict(partnerAccess) && <CommonAccStatusAlert isPartner={true} isRestrict={true} />}
              {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
            </>
          )}
          {isPartnerSuspended(partnerAccess) && isGuestSuspended(guestAccess) ? (
            <CommonAccStatusAlert isPartner={true} isGuest={true} isSuspend={true} />
          ) : (
            <>
              {isPartnerSuspended(partnerAccess) && <CommonAccStatusAlert isPartner={true} isSuspend={true} />}
              {isGuestSuspended(guestAccess) && <CommonAccStatusAlert isGuest={true} isSuspend={true} />}
            </>
          )}
          <div className="flex items-center justify-center">
            <Box className="w-full">
              <VerificationSteps />
            </Box>
          </div>
          <div className={`flex items-center justify-center mt-4 gap-4`}>
            <Button
              variant="contained"
              color="primary"
              className="normal-case text-md"
              onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/search?country=au&region=AU-NSW`)}
              disabled={Object.values(guestVerificationFlags).some((value) => value === false)}
            >
              Search Vehicles
            </Button>
            {userProfileInfo?.isAllowListing && (
              <Button
                variant="contained"
                color="primary"
                className="normal-case text-md"
                onClick={handleAddNewListing}
                disabled={Object.values(verificationStatusFlags).some((value) => value === false)}
              >
                List a Vehicle
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:hidden lg:block lg:w-1/2 m-4">
        <VerificationSlider />
      </div>
    </div>
  );
};

export default GuestVerificationPage;
