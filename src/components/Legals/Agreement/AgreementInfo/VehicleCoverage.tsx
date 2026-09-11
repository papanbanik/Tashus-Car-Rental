'use client';
import { AgreementInfoProps } from '@/types/legals/agreementTypes';
import { getGuestCoverageDisplayName, getPartnerCoverageDisplayName } from '@/utils/Functions/travelCommonFn';

const VehicleCoverage = ({ reservationDetails, count, isRental }: AgreementInfoProps) => {
  return (
    <div>
      {' '}
      {reservationDetails?.insurance ? (
        <div className="mb-6">
          <div className="font-bold text-xl mb-4">
            <div className="font-bold mr-1 inline-block text-center ">{count}.</div> Vehicle Insurance Coverage :{' '}
          </div>
          <div className="pl-4">
            <div className="mb-1">
              <span className="font-semibold capitalize">
                Coverage Type :{' '}
                {isRental
                  ? getGuestCoverageDisplayName(reservationDetails?.insurance?.guestCoverageType)
                  : getPartnerCoverageDisplayName(reservationDetails?.vehicleInsurance?.coverageType)}
              </span>
            </div>
            <div className="mb-1">
              <span className="font-semibold">Coverage Percentage : </span>{' '}
              {isRental ? `${reservationDetails?.insurance?.coveragePercentage}%` : `${reservationDetails?.vehicleInsurance?.coveragePercentage}%`}
            </div>
            {isRental && (
              <div className="mb-1">
                <span className="font-semibold">Coverage Fees : </span> ${reservationDetails?.basePrice?.coverageAmount}
              </div>
            )}
            <div className="mb-1">
              <span className="font-semibold">Excess Fees : </span>{' '}
              {isRental ? `$${reservationDetails?.insurance?.excessFee}` : `$${reservationDetails?.vehicleInsurance?.excessFee}`}
            </div>
          </div>
        </div>
      ) : undefined}
    </div>
  );
};

export default VehicleCoverage;
