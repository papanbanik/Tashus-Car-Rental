'use client';
import { TSecondaryIDInfo } from '@/context/UserCredProvider';
import { Chip } from '@mui/material';
import dayjs from 'dayjs';

export interface IGuestSecondaryIDInfo {
  secondaryIdInfo: TSecondaryIDInfo;
  source: 'reservation' | 'profile';
}

const GuestSecondaryIDInfo = ({ secondaryIdInfo, source }: IGuestSecondaryIDInfo) => {
  const isIDExpired = dayjs(secondaryIdInfo?.expiryDate).isBefore(dayjs(), 'date') || dayjs(secondaryIdInfo?.expiryDate).isSame(dayjs(), 'date');
  //Id Type
  const getFormattedIdType = (idType: string) => {
    switch (idType) {
      case 'NationalId':
        return 'National ID';
      case 'StudentId':
        return 'Student ID';
      case 'PassportId':
        return 'Passport ID';
      case 'Other':
        return 'Other';
      default:
        return idType;
    }
  };
  return (
    <div className="lg:w-1/2 md:w-2/3 w-full grid grid-cols-3">
      {secondaryIdInfo?.idType && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">ID Type</p>
          {/* <p className="col-span-2 m-0">{secondaryIdInfo?.idType}</p> */}
          <p className="col-span-2 m-0">{getFormattedIdType(secondaryIdInfo?.idType)}</p>
        </>
      )}
      {secondaryIdInfo?.idType === 'Other' && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Other ID Type</p>
          <p className="col-span-2 m-0">{secondaryIdInfo?.otherTypeName}</p>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Issuing Authority</p>
          <p className="col-span-2 m-0">{secondaryIdInfo?.issuingAuthority}</p>
        </>
      )}
      {secondaryIdInfo?.idType === 'StudentId' && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Institution Name</p>
          <p className="col-span-2 m-0">{secondaryIdInfo?.institutionName}</p>
        </>
      )}
      {secondaryIdInfo?.idNumber && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Number</p>
          <p className="col-span-2 m-0">{secondaryIdInfo?.idNumber}</p>
        </>
      )}

      {secondaryIdInfo?.country && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Country</p>
          <p className="col-span-2 m-0">{secondaryIdInfo?.country}</p>
        </>
      )}
      {secondaryIdInfo?.state && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">State</p>
          <p className="col-span-2 m-0">{secondaryIdInfo?.state}</p>
        </>
      )}
      {secondaryIdInfo?.expiryDate && (
        <>
          <p className="col-span-1 m-0 text-gray-500 font-semibold">Expiry Date</p>
          <div className="col-span-2 flex gap-4">
            <span className={`m-0 ${isIDExpired ? 'text-error' : ''}`}>{new Date(secondaryIdInfo?.expiryDate)?.toLocaleDateString('en-US')}</span>
            {isIDExpired && (
              <div className="flex justify-start items-start">
                <Chip color="error" size="small" variant="outlined" label="Expired"></Chip>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GuestSecondaryIDInfo;
