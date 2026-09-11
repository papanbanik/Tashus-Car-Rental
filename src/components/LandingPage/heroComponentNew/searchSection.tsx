import React from 'react';
import Image from 'next/image';
function SearchSection() {
  return (
    <div className="absolute left-1/2 lg:top-[89%] top-[70%] transform -translate-x-1/2 lg:w-[1200px] w-[340px] md:w-[550px] lg:mx-0 lg:h-[100px] bg-white z-30 rounded-lg flex flex-col lg:flex-row gap-2 p-4">
      <div
        className="w-full lg:flex-[0_0_35%] border text-black h-full flex items-center justify-center rounded-md"
        style={{ border: '1px solid #D9D9D9' }}
      >
        <div className="flex flex-col text-left w-full lg:px-4 px-2">
          <p className="text-[12px] lg:text-[14px] font-light m-0">Search Address</p>
          <p className="lg:text-[18px] text-[15px] font-semibold m-0">Sydney Australia</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full lg:flex-[0_0_56%] text-black h-full items-center">
        <div
          className="w-full lg:flex-[0_0_45%] border text-black h-full flex items-center justify-center rounded-md mb-2 lg:mb-0"
          style={{ border: '1px solid #D9D9D9' }}
        >
          <div className="flex flex-row w-full">
            <div className="flex flex-col text-left w-full px-2 " style={{ borderRight: '2px solid #D9D9D9' }}>
              <p className="text-[12px] lg:text-[14px] font-light m-0">Travel Start Date</p>
              <p className="lg:text-[18px] text-[15px] font-semibold m-0">11 Jun 24</p>
            </div>
            <div className="flex flex-col text-left w-full px-2">
              <p className="text-[12px] lg:text-[14px] font-light m-0">Travel Start Time</p>
              <p className="lg:text-[18px] text-[15px] font-semibold m-0">10:30 AM</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center h-full px-2">
          <Image src="/icons/Vector.png" alt="Icon" width={26} height={20} />
        </div>
        <div
          className="w-full lg:flex-[0_0_45%] border text-black h-full flex items-center justify-center rounded-md  lg:mb-0"
          style={{ border: '1px solid #D9D9D9' }}
        >
          <div className="flex flex-row w-full">
            <div className="flex flex-col text-left w-full px-2 " style={{ borderRight: '2px solid #D9D9D9' }}>
              <p className="text-[12px] lg:text-[14px] font-light m-0">Travel End Date</p>
              <p className="lg:text-[18px] text-[15px] font-semibold m-0">11 Jun 24</p>
            </div>
            <div className="flex flex-col text-left w-full px-2">
              <p className="text-[12px] lg:text-[14px] font-light m-0">Travel End Time</p>
              <p className="lg:text-[18px] text-[15px] font-semibold m-0">10:30 AM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full flex items-center justify-center w-full lg:w-auto ">
        <button
          className="flex flex-row lg:flex-col text-white h-full w-full lg:w-auto border-none rounded-md lg:py-4 py-2 mt-2 lg:mt-0 items-center justify-center cursor-pointer"
          style={{
            backgroundColor: '#800080',
          }}
        >
          <div className="flex flex-row lg:flex-col items-center lg:justify-center min-w-[70px] max-h-[40px]">
            <Image src="/icons/Search.png" alt="Search Icon" width={24} height={24} className="lg:mt-2 mt-0" />
            <p className="mt-2 lg:mt-1">Search</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SearchSection;
