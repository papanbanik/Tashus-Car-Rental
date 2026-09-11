'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetVerificationInfo } from '@/hooks/profile/verification-steps/useGetVerificationInfo';
import { getVerificationStatusInfo, getVerificationStepsHighlight } from '@/utils/Functions/verification/verificationStepsFn';
import { getTextColorClass } from '@/utils/Functions/verification/verificationStyleFn';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BsPatchExclamationFill } from 'react-icons/bs';
import { FaIdCard, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import VerifiedImageFemale from './new-min.png';
import Expired from './new10.png';
import VerifiedImageMale from './VerificationPopupMale.png';

const VerificationModal = () => {
  const router = useRouter();
  useGetVerificationInfo();
  const pathName = usePathname();
  const { userCred } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { profileInfo, guestVerification: guestVerificationInfo } = userProfileVerificationInfo || {};
  const [status, setStatus] = useState<string>('incomplete');
  const [dynamicText, setDynamicText] = useState<string | JSX.Element>('');
  const [dynamicSearchParams, setDynamicSearchParams] = useState<string>('profile');
  const [verificationHightLights, setVerificationHightLights] = useState<Record<string, string[]>>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!profileInfo || !guestVerificationInfo || !userCred?.userId) return;
    const { verificationStatus, dynamicText, dynamicSearchParams } = getVerificationStatusInfo(profileInfo, guestVerificationInfo, pathName);
    setDynamicText(dynamicText);
    setStatus(verificationStatus);
    setDynamicSearchParams(dynamicSearchParams);

    const verificationHightLights = getVerificationStepsHighlight(profileInfo, guestVerificationInfo);
    setVerificationHightLights(verificationHightLights);

    if (
      pathName === '/' ||
      (pathName.includes('/support-center') && status !== 'Invalid') ||
      pathName.includes('/search') ||
      pathName.includes('/legals') ||
      pathName.includes('/eco-friendly-car-rental') ||
      pathName.includes('/help') ||
      pathName.includes('/promotion') ||
      pathName.includes('/fees')
    ) {
      if (verificationStatus === 'approved' || verificationStatus === 'pending') {
        setIsOpen(false);
        return;
      }
    } else {
      setIsOpen(false);
      return;
    }

    const initialTimer = setTimeout(() => {
      setIsOpen(true);
      intervalRef.current = setInterval(() => {
        setIsOpen(true);
      }, 60 * 1000);
    }, 20 * 1000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // // --- Initial 20-second delay to show popup ---
    // const initialTimer = setTimeout(() => {
    //   setIsOpen(true);
    // }, 20 * 1000); // 20 seconds

    // // --- Accumulated timer logic using sessionStorage ---
    // const TIME_THRESHOLD = 60 * 1000; // 1 minute
    // const CHECK_INTERVAL = 1000; // every second
    // let startTime = Date.now();
    // let accumulatedTime = parseInt(sessionStorage.getItem('popupTimer') || '0', 10);

    // const interval = setInterval(() => {
    //   const now = Date.now();
    //   const elapsed = now - startTime;
    //   startTime = now;
    //   accumulatedTime += elapsed;
    //   sessionStorage.setItem('popupTimer', accumulatedTime.toString());

    //   if (accumulatedTime >= TIME_THRESHOLD) {
    //     setIsOpen(true);
    //     clearInterval(interval);
    //   }
    // }, CHECK_INTERVAL);

    // // Cleanup the timers when the component unmounts
    // return () => {
    //   clearTimeout(initialTimer);
    //   clearInterval(interval);
    // };
  }, [profileInfo, guestVerificationInfo, pathName, status]);

  const baseUrl =
    status !== 'Incomplete' && status !== 'Invalid'
      ? `/dashboard/${userCred?.userId}/profile-info?source=verificationPopUp`
      : status === 'Invalid'
      ? '/support/support-center/general?from=general'
      : `/au/verify-account/${userCred?.userId}?step=${dynamicSearchParams}&source=verificationPopUp`;

  const handleClose = () => {
    setIsOpen(false);
  };

  const categoryIcons: Record<string, JSX.Element> = {
    Profile: <FaUser className="text-primary text-sm" />,
    License: <FaIdCard className="text-primary text-sm" />,
    Address: <FaMapMarkerAlt className="text-primary text-sm" />,
  };

  // console.log('profileInfo', profileInfo);

  return (
    <>
      {isOpen && userCred?.loggedIn && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
          <div
            className={`relative bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-5 w-full max-w-sm lg:max-w-4xl lg:min-h-[500px] mx-4 transform transition-all duration-300 scale-100 opacity-100 flex flex-col lg:flex-row ${
              status !== 'Incomplete' ? 'lg:max-w-md' : ''
            }`}
          >
            {/* Close Button */}
            <div
              onClick={handleClose}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? handleClose() : null)}
              className="absolute z-50 top-3 right-3 w-9 h-9 flex items-center justify-center cursor-pointer select-none bg-white rounded-full shadow-md hover:shadow-lg text-gray-500 hover:text-white hover:bg-primary transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <IoClose className="text-xl" />
            </div>
            <div className="h-4 lg:h-0" />

            {/* Left Column (Content) for Large Screens, Full Content for Small Screens */}
            <div className="flex-1 lg:pr-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <BsPatchExclamationFill className="text-primary" size={20} />
                  Verification Status
                </h2>
                <span className={`md:p-4 px-2 capitalize text-${getTextColorClass(status)}`}>{status}</span>
              </div>

              {/* Message */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{dynamicText}</p>

              {/* Image for Small Screens (Above Verification Steps) */}
              <div className={`mb-4 ${status === 'Incomplete' ? 'lg:hidden' : ''}`}>
                <div className="w-full h-48 sm:h-64 relative rounded-lg overflow-hidden">
                  {profileInfo?.gender === 'female' && status === 'Incomplete' ? (
                    <Image src={VerifiedImageFemale} alt="Female Verification Illustration" fill className="object-contain " />
                  ) : profileInfo?.gender === 'male' && status === 'Incomplete' ? (
                    <Image src={VerifiedImageMale} alt="Male Verification Illustration" fill className="object-contain " />
                  ) : status === 'Inconsistent' ||
                    status === 'Expired' ||
                    status === 'Invalid' ||
                    status === 'manualDeclined' ||
                    status === 'declined' ? (
                    <Image src={Expired} alt="Inconsistent Status Illustration" fill className="object-contain" />
                  ) : (
                    <Image src={VerifiedImageMale} alt="Default Illustration" fill className="object-contain" />
                  )}
                </div>
              </div>

              {/* Verification Steps */}
              {status === 'Incomplete' && (
                <div className="mb-4">
                  <div className="space-y-2 max-h-60 lg:max-h-80 overflow-y-auto">
                    {Object.entries(verificationHightLights).map(([category, steps]) =>
                      steps.length > 0 ? (
                        <div key={category} className="bg-gradient-to-br from-white to-primary/5 p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-0">
                            {categoryIcons[category] || <FaUser className="text-primary text-sm" />}
                            <h3 className="font-medium text-gray-800 text-sm text-left">{category}</h3>
                          </div>
                          <div>
                            {steps.map((step, index) => (
                              <div key={index} className="flex items-center gap-2 text-left">
                                <span className="w-1 h-1 bg-primary rounded-full"></span>
                                <span className="text-gray-600 text-xs">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {status !== 'pending' && (
                <button
                  onClick={() => {
                    router.push(baseUrl);
                    handleClose();
                  }}
                  className="w-full bg-primary text-white py-2 px-6 rounded-lg font-semibold text-sm tracking-wide shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <div className="flex items-center justify-center gap-2">
                    {status !== 'Incomplete' && status !== 'Invalid' ? 'Edit' : status === 'Invalid' ? 'Support' : 'Complete'}
                    <HiArrowRight className="text-base" />
                  </div>
                </button>
              )}
            </div>

            {/* Right Column: Image (Large Screens Only) */}
            {status === 'Incomplete' && (
              <div className="hidden lg:block flex-1 lg:pl-4">
                <div className="w-full h-full relative rounded-lg overflow-hidden">
                  {profileInfo?.gender === 'female' ? (
                    <Image src={VerifiedImageFemale} alt="Female Verification Illustration" fill className="object-contain" />
                  ) : profileInfo?.gender === 'male' ? (
                    <Image src={VerifiedImageMale} alt="Male Verification Illustration" fill className="object-contain" />
                  ) : (
                    <Image src={VerifiedImageMale} alt="Default Illustration" fill className="object-contain" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationModal;
