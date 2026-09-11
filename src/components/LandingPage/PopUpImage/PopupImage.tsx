'use client';

import { useGetLandingPageActivePopup } from '@/hooks/landing-page-popup/useGetLandingPageActivePopup';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IoChevronForward, IoCloseCircle } from 'react-icons/io5';

const PopupImage = () => {
  const { data, isLoading } = useGetLandingPageActivePopup();

  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  
  const popupConfig = useMemo(() => {
    const latestActivePopup = data?.data?.data?.[0];

    return {
      delayBeforeShow: (latestActivePopup?.delayBeforeShow ?? 4) * 1000,
      autoHideAfter: (latestActivePopup?.autoHideAfter ?? 10) * 1000,
      maxDisplaysPerSession: latestActivePopup?.maxDisplaysPerSession ?? 3,
      expiryDate: latestActivePopup?.expiryDate ? new Date(latestActivePopup.expiryDate) : null,
      imageUrl: latestActivePopup?.popupImage?.secureUrl ?? '',
    };
  }, [data]);

  const { delayBeforeShow, autoHideAfter, maxDisplaysPerSession, expiryDate, imageUrl } = popupConfig;

  // Popup is expired if an expiryDate is set and it's in the past.
  const isExpired = expiryDate ? expiryDate.getTime() < Date.now() : false;

  const clearAutoHideTimer = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  };

  const incrementDisplayCount = () => {
    const currentCount = sessionStorage.getItem('popupDisplayCount');
    const newCount = (currentCount ? parseInt(currentCount, 10) : 0) + 1;
    sessionStorage.setItem('popupDisplayCount', newCount.toString());
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setIsPopupOpen(false);
    clearAutoHideTimer();
  };

  const handlePopupDisplay = () => {
    if (isExpired || !imageUrl) return;

    const storedCount = sessionStorage.getItem('popupDisplayCount');
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0;

    if (currentCount < maxDisplaysPerSession) {
      setShowPopup(true);
      setIsPopupOpen(true);
      incrementDisplayCount();

      autoHideTimerRef.current = setTimeout(() => {
        handleClosePopup();
      }, autoHideAfter);
    }
  };

  useEffect(() => {
    if (isLoading || !imageUrl || isExpired) return;

    const storedCount = sessionStorage.getItem('popupDisplayCount');
    const initialCount = storedCount ? parseInt(storedCount, 10) : 0;

    if (initialCount >= maxDisplaysPerSession) return;

    const showTimer = setTimeout(() => {
      handlePopupDisplay();
    }, delayBeforeShow);

    return () => {
      clearTimeout(showTimer);
      clearAutoHideTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, imageUrl, isExpired, delayBeforeShow, maxDisplaysPerSession]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClosePopup();
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  useEffect(() => {
    return () => clearAutoHideTimer();
  }, []);

  if (!showPopup || !imageUrl || isExpired) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative rounded shadow-lg mx-6 md:mx-0 bg-white overflow-hidden">
        <button className="absolute top-5 right-5 text-4xl  bg-none border-none text-primary" onClick={handleClosePopup}>
          <IoCloseCircle className=" text-primary hover:text-red-600 cursor-pointer" />
        </button>
        <Image src={imageUrl} alt="Popup" width={500} height={500} className="w-full h-auto md:w-auto md:h-auto object-cover" />

        {imageUrl && (<div className="p-1.5">
          <Link
            href="/promotion"
            className="w-full inline-flex items-center justify-center gap-2.5 bg-primary text-white text-xs font-semibold uppercase tracking-wider rounded-lg py-3.5 px-4 hover:opacity-90 transition-all duration-200 no-underline group"
          >
            Visit All Promotions
            <IoChevronForward className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>)}
      </div>
    </div>
  );
};

export default PopupImage;
