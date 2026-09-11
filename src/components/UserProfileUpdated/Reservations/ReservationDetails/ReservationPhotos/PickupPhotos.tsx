'use client';
import { Button } from '@mui/material';
import { FaUpload } from 'react-icons/fa';

const PickupPhotos = () => {
  return (
    <div>
      <div>
        <span className="font-bold">Updated by Partner</span>
        <div className="flex items-center justify-center">
          <Button sx={{ border: 2, borderColor: 'grey.500' }} className="flex flex-col normal-case p-4">
            <FaUpload size={50} />
            <span>Upload a new Image</span>
          </Button>
        </div>
        <div className="grid lg:grid-cols-6 grid-cols-3 grid-rows-2 gap-4 my-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 lg:w-[197px] lg:h-[132px] w-[112px] h-[73px] flex justify-center items-center text-black font-bold"
            >
              {/* Item {index + 1} */}
            </div>
          ))}
        </div>
      </div>
      <div className="my-8">
        <span className="font-bold">Updated by Guest</span>
      </div>
      <div className="grid lg:grid-cols-6 grid-cols-3 grid-rows-2 gap-4 my-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-300 lg:w-[197px]  lg:h-[132px] w-[112px] h-[73px] flex justify-center items-center text-black font-bold"
          >
            {/* Item {index + 1} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickupPhotos;
