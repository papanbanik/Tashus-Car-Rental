import React from 'react';
import { Typography, Grid } from '@mui/material';
import { getGuestMinimumCoverage, guestInsuranceList } from '@/utils/Lists/insuranceInfo';
import { getGuestCoverageDisplayName } from '@/utils/Functions/travelCommonFn';

const GuestCoverage = ({ selectedPackage }: any) => {
  const insurance = guestInsuranceList.find((pkg) => pkg.id === selectedPackage?.guestCoverageType);

  return (
    <>
      {insurance && (
        <>
          <Typography variant="h5" className="text-xl font-semibold">
            Previously Selected Coverage Package
          </Typography>

          <Grid container spacing={1} className="mb-2 mt-1 py-1">
            {selectedPackage ? (
              <div className="mb-4 rounded-lg grid grid-cols-12 bg-white shadow-lg border-2 border-blue-600 p-5 mt-5">
                <div className="col-span-2 flex justify-center items-center">
                  {insurance.icon && React.createElement(insurance.icon, { className: 'text-6xl' })}
                </div>
                <div className="col-span-8 flex flex-col justify-start items-start">
                  <span className="text-lg font-semibold">{getGuestCoverageDisplayName(selectedPackage?.guestCoverageType)}</span>
                  <span>
                    Insurance Excess Fee: <span className="font-bold">${selectedPackage?.excessFee ?? 0}</span>
                  </span>
                  {(selectedPackage?.guestCoverageType === 'ultimate' ||
                    selectedPackage?.guestCoverageType === 'standard' ||
                    selectedPackage?.guestCoverageType === 'premium') && (
                    <span>
                      Minimum Amount: <span className="font-bold">{getGuestMinimumCoverage(selectedPackage?.guestCoverageType)}</span>
                    </span>
                  )}
                  <span>
                    Percentage of Total Rentals: <span className="font-bold">{selectedPackage?.coveragePercentage ?? 0}%</span>
                  </span>
                </div>
              </div>
            ) : (
              <Typography variant="h4" className="text-red-600 text-center mt-8 flex justify-center items-center h-20 w-full">
                No Coverage Package Found!
              </Typography>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default GuestCoverage;
