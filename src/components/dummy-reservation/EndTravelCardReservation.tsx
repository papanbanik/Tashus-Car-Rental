'use client';
import React from 'react';
import Image from 'next/image';
import { FaClock, FaClipboardList, FaCopy } from 'react-icons/fa'; // Import necessary icons

function EndTravelCardReservation() {
  const reservationID = '792727427';

  const handleCopy = () => {
    navigator.clipboard.writeText(reservationID);
    alert('Reservation ID copied to clipboard!');
  };

  return (
    <div className="w-full my-10">
      <div className="w-full rounded-[16px] flex h-28 bg-primary border-4 border-[#800080] hover:shadow-glow hover:border-[#800080] transition-all ease-in-out duration-500">
        <div className="w-[40%] rounded-[16px] overflow-hidden">
          <Image src="/CardsImages/EndTravel2.png" alt="Image" className="w-full h-full object-cover" layout="responsive" width={300} height={200} />
        </div>
        <div className="w-[45%] flex flex-col items-start p-0 ">
          <div className="flex flex-col justify-center my-auto w-full">
            <p className="m-0 p-0 text-[14px] text-white">You have an ongoing Trip</p>
            <p className="m-0 p-0 text-[24px] text-white">Started 2D : 08H : 42Min</p>
            <button className="items-start py-2 bg-[#FF0F0F] text-white rounded-full border-none max-w-[170px] mt-0">End Travel</button>
          </div>
        </div>
        <div className="w-[15%] p-4 flex flex-col items-center space-y-2 justify-center">
          <button className="w-full py-2 border border-white text-white rounded-full bg-transparent">Edit</button>
          <button className="w-full py-2 border-white bg-transparent text-white rounded-full border">Support</button>
        </div>
      </div>
    </div>
  );
}

export default EndTravelCardReservation;
