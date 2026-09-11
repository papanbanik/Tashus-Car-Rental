'use client';

import { AgreementInfoProps } from '@/types/legals/agreementTypes';

const PartnerDetails = ({ reservationDetails, count }: AgreementInfoProps) => {
  return (
    <div className="mb-6">
      <div className="font-bold text-xl">
        <div className="font-bold mr-1 inline-block text-center ">{count}.</div> {`Partner's Details`} :{' '}
      </div>
      <div className="pl-4">
        <div>
          <span className="text-justify">
            <span className="font-semibold">{`“Partner”`}</span> is defined as the entity who shares vehicles in Tashus Car Rental platform. Partner
            can be an individual, business or Tashus itself.
          </span>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">
            {' '}
            Partner Full Name : <span className="font-normal">{reservationDetails?.partner?.partnerName}</span>
          </div>
          <div className="font-semibold">
            {' '}
            Partner Contact Number :{' '}
            <span className="font-normal">
              {reservationDetails?.partner?.partnerContactNumber === '' ? `N/A` : reservationDetails?.partner?.partnerContactNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetails;
