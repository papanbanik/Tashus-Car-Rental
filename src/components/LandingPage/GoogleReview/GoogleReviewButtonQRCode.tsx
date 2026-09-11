'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowCircleRight } from 'react-icons/fa';

const GoogleReviewButtonQRCode = () => {
  return (
    <div className=" mt-6 flex flex-col sm:flex-row items-center justify-center bg-white rounded-2xl px-1 py-4 shadow-md w-full max-w-xl mx-auto">
      {/* Button */}
      <div className="flex flex-col items-center gap-1 flex-1">
        <Link
          href="https://g.page/r/CVhacyJSpto2EAE/review"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2  text-white border-2 hover:bg-[#5C8D07] border-primary font-bold px-5 py-2.5 rounded-full text-sm transition-colors duration-300 bg-primary cursor-pointer whitespace-nowrap no-underline"
        >
          Leave Your Experience <FaArrowCircleRight size={16} />
        </Link>
        {/* <span className="text-xs text-gray-400 text-center">Click to open Google Reviews</span> */}
      </div>

      {/* OR Divider — horizontal on mobile, vertical on desktop */}
      <div className="flex sm:flex-col items-center gap-1 px-4 sm:px-7 py-4 sm:py-0 w-full sm:w-auto">
        <div className="flex-1 sm:flex-none h-px sm:h-10 sm:w-px w-auto bg-gray-100" />
        <span className="text-xs font-bold text-gray-400 tracking-wider">OR</span>
        <div className="flex-1 sm:flex-none h-px sm:h-10 sm:w-px w-auto bg-gray-100" />
      </div>

      {/* QR Side */}
      <div className="flex flex-col items-center gap-1 flex-1">
        <Image src="/GoogleReviewQRCode/qr-code.png" alt="QR Code" width={100} height={100} className="rounded-lg shadow-sm" />
        {/* <span className="text-xs text-gray-400 font-medium text-center">📱 Scan to review</span> */}
      </div>
    </div>
  );
};

export default GoogleReviewButtonQRCode;
