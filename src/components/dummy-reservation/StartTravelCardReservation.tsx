'use client';
import React from 'react';
import Image from 'next/image';
import { FaClock, FaClipboardList, FaCopy } from 'react-icons/fa'; // Import necessary icons

function StartTravelCard() {
  const reservationID = '792727427';

  const handleCopy = () => {
    navigator.clipboard.writeText(reservationID);
    alert('Reservation ID copied to clipboard!');
  };

  return (
    <div className="ml-4 w-full">
      <div className="w-full rounded-[16px] flex h-28 bg-primary">
        <div className="w-[40%] rounded-[16px] overflow-hidden">
          <Image src="/CardsImages/StartTravel.png" alt="Image" className="w-full h-full object-cover" layout="responsive" width={300} height={200} />
        </div>
        <div className="w-[45%] flex flex-col items-start p-0 ">
          <div className="flex flex-col justify-center my-auto w-full">
            <p className="m-0 p-0 text-[24px] text-white ">You can start your travel now</p>
            <button className="items-start py-2 bg-[#5C8D07] text-white rounded-full border-none max-w-[170px] mt-1">Start Travel</button>
          </div>
        </div>
        <div className="w-[15%] p-4 flex flex-col items-center space-y-2 justify-center">
          <button className="w-full py-2 border border-white text-white rounded-full bg-transparent">Edit</button>
          <button className="w-full py-2 border-white bg-transparent text-white  rounded-full border">Support</button>
        </div>
      </div>
    </div>
  );
}

export default StartTravelCard;
