import { useSearchContext } from '@/context/SearchProvider';
import { TGuestInsurance } from '@/types/checkout/guestVerificationTypes';
import { IGuestInsuranceList, guestInsuranceList } from '@/utils/Lists/insuranceInfo';
import ToggleButton from '@mui/material/ToggleButton/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup/ToggleButtonGroup';
import React, { useEffect } from 'react';
import { IconType } from 'react-icons';
import { PiDotOutlineFill } from 'react-icons/pi';
import CheckedIcon from '../../../../../public/icons/checked.svg';
import UncheckedIcon from '../../../../../public/icons/unchecked.svg';
import { getReservationRentFee } from '@/utils/Functions/payment/reservationPayment';
import { calculateAndSetCoverageAmount } from '@/utils/Functions/travel-edit/travelEditFn';
import { ReservationGuestInsurance } from '@/types/travels/typeTravels';

const GuestInsurance = () => {
  const { setGuestCoveragePackage, guestCoveragePackage, reservationInfo, guestCoverageType, setGuestCoverageType, appliedVoucherInfo } =
    useSearchContext();
  const { isVoucherValid = false } = appliedVoucherInfo ?? {};

  useEffect(() => {
    if (guestInsuranceList[0]?.id) {
      setGuestCoverageType(guestInsuranceList[0]?.id);
    }
  }, []);

  useEffect(() => {
    const totalPrice = getReservationRentFee(isVoucherValid, reservationInfo?.durationPrice ?? 0, reservationInfo?.totalPrice ?? 0);
    const currentPackage = guestInsuranceList?.find((insurance: IGuestInsuranceList) => insurance?.id === guestCoverageType);
    if (currentPackage?.id && totalPrice > 0) {
      // const coverageAmount = guestCoverageType !== 'no-coverage' ? totalPrice * (parseInt(currentPackage?.coveragePercentage) / 100) : 0;
      // const calculatedCoverageAmount = calculateCoverageAmount(guestCoverageType, parseFloat(coverageAmount?.toFixed(2)));
      const guestInsurancePackage: ReservationGuestInsurance = {
        guestCoverageType: currentPackage?.id,
        coveragePercentage: parseInt(currentPackage?.coveragePercentage) || 0,
        excessFee: parseInt(currentPackage?.excessFee) || 0,
      };
      const calculatedCoverageAmount = calculateAndSetCoverageAmount(totalPrice, guestInsurancePackage) ?? 0;
      const tempGuestCoverage: TGuestInsurance = {
        // coverageAmount: parseFloat(coverageAmount?.toFixed(2)),
        coverageAmount: calculatedCoverageAmount,
        coveragePercentage: parseInt(currentPackage?.coveragePercentage) || 0,
        guestCoverageType: currentPackage?.id,
        excessFee: parseInt(currentPackage?.excessFee) || 0,
      };
      setGuestCoveragePackage(tempGuestCoverage);
    }
  }, [guestCoverageType, reservationInfo, appliedVoucherInfo]);

  useEffect(() => {
    if (!guestCoverageType) {
      setGuestCoverageType(guestInsuranceList[0]?.id);
    }
  }, [guestCoverageType]);

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
    setGuestCoverageType(nextView);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl mt-0 mb-4">Guest Vehicle Coverage Packages</h2>
      <p className="text-xs sm:text-sm md:text-base lg:text-md m-0 flex items-start gap-2 pb-4 text-justify" style={{ color: '#262f17' }}>
        <span>
          Enjoy added peace of mind with optional coverage that further reduces your insurance excess. This coverage lowers the amount you’re liable
          for in the event of any incidents causing damage to the vehicle or third-party property, as outlined in the rental agreement. Kindly note
          that if you have already applied a voucher, you will need to reapply it if you change the coverage package.
        </span>
      </p>
      <ToggleButtonGroup fullWidth orientation="vertical" value={guestCoverageType} exclusive onChange={handleChange}>
        {guestInsuranceList?.map((insurance: IGuestInsuranceList) => {
          const { id, name, icon, coveragePercentage, excessFee, minimum } = insurance;
          const IconComponent = icon as IconType;
          return (
            <ToggleButton
              style={{ border: guestCoverageType === id ? '1px solid gray' : '' }}
              className={`mb-4 rounded-lg grid grid-cols-12 normal-case bg-white ${guestCoverageType === id ? 'border-2 border-primary' : ''} `}
              fullWidth
              key={id}
              value={id}
              aria-label={id}
            >
              {coveragePercentage ? (
                <>
                  <div className="col-span-3 flex justify-center items-center">
                    <IconComponent className="text-6xl" />
                  </div>
                  <div className="col-span-8 flex flex-col justify-start items-start">
                    <p className="text-lg font-semibold m-0">{name}</p>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg m-0">
                      <span>
                        <PiDotOutlineFill />
                      </span>
                      Percentage of Total Rentals: <span className="font-semibold">{coveragePercentage}%</span>
                    </p>
                    {!!minimum && (
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg m-0">
                        <span>
                          <PiDotOutlineFill />
                        </span>
                        Minimum Amount: <span className="font-semibold">${minimum}</span>
                      </p>
                    )}
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg m-0">
                      <span>
                        <PiDotOutlineFill />
                      </span>
                      Insurance Excess Fee: <span className="font-semibold">${excessFee}</span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="col-span-11 text-center">
                  <p className="text-lg font-semibold m-0">No Coverage</p>
                </div>
              )}
              <div className="col-span-1">
                {guestCoverageType === id ? <CheckedIcon className="text-2xl" /> : <UncheckedIcon className="text-2xl" />}
              </div>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </div>
  );
};

export default GuestInsurance;
