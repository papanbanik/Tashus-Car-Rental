'use client';
import { AgreementInfoProps } from '@/types/legals/agreementTypes';

const VehicleDetails = ({ reservationDetails, count }: AgreementInfoProps) => {
  return (
    <div className="mb-6">
      <div className="font-bold text-xl mb-4">
        <div className="font-bold mr-1 inline-block text-center ">{count}.</div> Vehicle Details :{' '}
      </div>
      <div className="pl-4">
        <div className="font-semibold mb-1">
          {' '}
          Make/Model/Year :{' '}
          <span className="font-normal">
            {reservationDetails?.vehicle?.make} / {reservationDetails?.vehicle?.model} / {reservationDetails?.vehicle?.year}
          </span>
        </div>
        <div className="font-semibold mb-1">
          {' '}
          Registration Plate Number : <span className="font-normal">{reservationDetails?.vehicle?.registrationPlateNumber}</span>
        </div>
        <div className="font-semibold mb-1">
          {' '}
          Color : <span className="font-normal capitalize">{reservationDetails?.vehicle?.color}</span>
        </div>
        {reservationDetails?.vehicle?.fuelGaugeInfo && (
          <div className="font-semibold mb-1">
            Vehicle Range: <span className="font-normal capitalize">{reservationDetails?.vehicle?.fuelGaugeInfo?.vehicleKilometersRange} KM</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
