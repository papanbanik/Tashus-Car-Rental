import React from 'react';
import { Skeleton } from '@mui/material';

export default function ReservationDetailsSkeletonM() {
  return (
    <div className="p-4 pt-0">
      {/* Top Section */}
      <div className="relative bg-white rounded-md p-4 mb-6">
        <Skeleton variant="rectangular" width="100%" height={100} className="rounded-md" />
      </div>

      {/* Reservation Details Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className=" p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton variant="circular" width={50} height={50} />
            <div>
              <Skeleton variant="text" width={150} height={20} className="mb-2" />
              <Skeleton variant="text" width={120} height={16} />
            </div>
          </div>
          <Skeleton variant="rectangular" width={80} height={36} className="rounded-md" />
        </div>
        <div className="w-[94%]  ml-10 mr-10 h-px bg-gray-300 "></div>
        <div className=" p-4 mb-6 mt-5">
          <div className="flex justify-between">
            <div>
              <Skeleton variant="text" width={250} height={20} className="mb-2" />
              <Skeleton variant="text" width={250} height={20} />
            </div>
            <div>
              <Skeleton variant="text" width={250} height={20} className="mb-2" />
              <Skeleton variant="text" width={250} height={20} />
            </div>
          </div>
        </div>
        <div className="w-[94%]  ml-10 mr-10 h-px bg-gray-300 "></div>
        <div className="b p-4 mb-6 mt-5">
          <div className="flex justify-between">
            <div>
              <Skeleton variant="text" width={250} height={40} className="mb-2" />
            </div>
            <div>
              <Skeleton variant="text" width={250} height={40} className="mb-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Travel Details Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 mt-5">
        <div className="flex justify-between">
          <div>
            <Skeleton variant="text" width={250} height={20} className="mb-2" />
            <Skeleton variant="text" width={250} height={20} />
          </div>
          <div>
            <Skeleton variant="text" width={250} height={20} className="mb-2" />
            <Skeleton variant="text" width={250} height={20} />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" width={50} height={50} />
          <div>
            <Skeleton variant="text" width={150} height={20} className="mb-2" />
            <Skeleton variant="text" width={120} height={16} />
          </div>
        </div>
        <Skeleton variant="rectangular" width={80} height={36} className="rounded-md" />
      </div>
    </div>
  );
}
