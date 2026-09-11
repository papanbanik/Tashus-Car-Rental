import { useTravelContext } from '@/context/TravelProvider';
import React from 'react';
import Image from 'next/image';
import { TDrivingLicenseInfoWithDateExpiry, TDrivingLicenseWithFace } from '@/types/reservations/typeReservationsActions';
import { TDrivingLicenseInfo } from '@/context/UserCredProvider';
import { Button, Chip, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import LicenseNumVerModal from '@/components/Search/ReservationCheckout/Verification/LicenseNumVerModal';
import { useModalContext } from '@/context/ModalProvider';
import LicenseSelfieVerModal from '@/components/Search/ReservationCheckout/Verification/LicenseSelfieVerModal';

export interface IGuestDrivingLicenseInfo {
  dateOfBirth?: Date;
  drivingLicenseInfo?: TDrivingLicenseInfo;
  drivingLicenseWithFace?: TDrivingLicenseWithFace;
  source: 'reservation' | 'profile';
}

const GuestDrivingLicenseInfo = ({ drivingLicenseInfo, drivingLicenseWithFace, source, dateOfBirth }: IGuestDrivingLicenseInfo) => {
  const isLicenseExpired =
    dayjs(drivingLicenseInfo?.expiryDate).isBefore(dayjs(), 'date') || dayjs(drivingLicenseInfo?.expiryDate).isSame(dayjs(), 'date');

  return (
    <div className="lg:w-1/2 md:w-2/3 w-full grid grid-cols-3">
      {drivingLicenseInfo?.licenseName && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Name</p>
          <p className="col-span-2 m-0">{drivingLicenseInfo?.licenseName}</p>
        </>
      )}

      {drivingLicenseInfo?.licenseNumber && dateOfBirth && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Birth Date</p>
          <p className="col-span-2 m-0">{new Date(dateOfBirth)?.toLocaleDateString('en-US')}</p>
        </>
      )}

      {drivingLicenseInfo?.licenseNumber && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Number</p>
          <p className="col-span-2 m-0">{drivingLicenseInfo?.licenseNumber}</p>
        </>
      )}

      {drivingLicenseInfo?.country && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Country</p>
          <p className="col-span-2 m-0">{drivingLicenseInfo?.country}</p>
        </>
      )}

      {drivingLicenseInfo?.state && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">State</p>
          <p className="col-span-2 m-0">{drivingLicenseInfo?.state}</p>
        </>
      )}

      {drivingLicenseInfo?.expiryDate && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Expiry Date</p>
          <div className="col-span-2 flex gap-4">
            <span className={`m-0 ${isLicenseExpired ? 'text-error' : ''}`}>
              {new Date(drivingLicenseInfo?.expiryDate)?.toLocaleDateString('en-US')}
            </span>
            {isLicenseExpired && (
              <div className="flex justify-start items-start">
                <Chip color="error" size="small" variant="outlined" label="Expired"></Chip>
                {/* {source === 'profile' && (
                      <Button size="small" className="normal-case underline text-md font-semibold p-0" onClick={handleVerifyLicenseNum}>
                        Update
                      </Button>
                    )} */}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GuestDrivingLicenseInfo;
