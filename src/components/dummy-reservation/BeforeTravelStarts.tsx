'use client';
import React from 'react';
import Image from 'next/image';
import { FaClock, FaClipboardList, FaCopy } from 'react-icons/fa'; // Import necessary icons

function BeforeTravelStartsCard() {
  const reservationID = '792727427';

  const handleCopy = () => {
    navigator.clipboard.writeText(reservationID);
    alert('Reservation ID copied to clipboard!');
  };

  return (
    <div className="ml-4 w-full">
      <div className="w-full rounded-[16px] flex h-28 bg-primary shadow-lg">
        <div className="w-[30%] rounded-[16px] overflow-hidden">
          <Image
            src="/CardsImages/Tashusreservationcards.png"
            alt="Image"
            className="w-full h-full object-cover"
            layout="responsive"
            width={300}
            height={200}
          />
        </div>
        <div className="w-[55%] flex flex-col justify-center">
          <div className="flex flex-row w-full">
            <div className="w-[50%] flex flex-col justify-center">
              <div className="flex flex-row items-start text-white">
                <div className="w-1 bg-white rounded-full h-full mr-3"></div>
                <div className="flex flex-col">
                  <div className="flex flex-row m-0">
                    <p className="mr-3 m-0 ">The trip will Start in</p>
                  </div>
                  <div className="flex flex-row m-0 font-bold">
                    <p className="m-0">2 Days | 08 hours | 23 min</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[50%] flex flex-col justify-center">
              <div className="flex flex-col items-start text-white">
                <div className="flex flex-row m-0">
                  <p className="mr-3 m-0">From</p>
                  <p className="m-0">01 May 2024 | 8:15 PM</p>
                </div>
                <div className="flex flex-row m-0">
                  <p className="mr-3 m-0">To</p>
                  <p className="m-0">01 May 2024 | 8:15 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white rounded-full my-2 mr-4"></div>
          <div className="w-full text-white">
            <div className="flex justify-between">
              <div className="flex items-center w-[50%]">
                <FaClock className="mr-2 text-white" />
                <span>
                  Duration: <b>5 days 3 hours</b>
                </span>
              </div>
              <div className="flex items-center w-[50%]">
                <FaClipboardList className="mr-2 text-white" />
                <span className="flex items-center">
                  Reservation ID: <b>{reservationID}</b>
                  <FaCopy className="ml-2 cursor-pointer text-white" onClick={handleCopy} title="Copy Reservation ID" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[15%] p-4 flex flex-col items-center space-y-2 justify-center">
          <button className="w-full py-2 border border-white text-white rounded-full bg-transparent">Edit</button>
          <button className="w-full py-2 bg-white text-primary rounded-full border-none">Support</button>
        </div>
      </div>
    </div>
  );
}

export default BeforeTravelStartsCard;
