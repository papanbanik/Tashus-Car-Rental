import CommonTooltip from '@/components/Common/CommonTooltip';
import { Divider, IconButton, Typography } from '@mui/material';
import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
interface CoverageItemProps {
  title: string;
  subtitle: string;
  description: string;
  note: string | React.JSX.Element;
}

const CoverageBenefitItem: React.FC<CoverageItemProps> = ({ title, subtitle, description, note }) => {
  return (
    <>
      <Divider className="bg-primary mb-3" />
      <div className="grid grid-cols-[auto,1fr] items-start pb-4">
        <div className="w-20">
          <Typography className="flex flex-col justify-center items-center text-primary font-bold text-sm sm:text-base md:text-md">
            {title.split(' ').map((line, index) => (
              <span key={index}>{line}</span>
            ))}
            <span>
              <CommonTooltip title={description} arrow={true}>
                <IconButton className="bg-transparent">
                  <IoInformationCircleOutline className="text-gray-400" size={20} />
                </IconButton>
              </CommonTooltip>
            </span>
          </Typography>
        </div>
        <div className="ml-4">
          <Typography className="font-bold text-base sm:text-lg md:text-md">{subtitle}</Typography>
          <span className="text-sm sm:text-base md:text-base">{note}</span>
        </div>
      </div>
    </>
  );
};

const CoverageBenefitList: React.FC<{ fuelCost: number }> = ({ fuelCost }) => {
  return (
    <div>
      <CoverageBenefitItem
        title="Flexible Refuel"
        subtitle="No stress on fuelling during return"
        description="You can return the vehicle with any fuel level, eliminating the stress of refueling before drop-off. Tashus will charge you fuel gap using fair calculation method. While the cost of fuel during your travel remains your responsibility, if the fuel level upon return is lower than at pickup, Tashus will calculate the difference in kilometers of fuel range and charge you based on the market price of fuel for the shortfall."
        note={
          fuelCost && Number(fuelCost) > 0 ? (
            <>
              <span className="font-bold">{Math.abs(Math.trunc(Number(fuelCost) * 100))}¢</span>/km for each kilometer
            </>
          ) : (
            'Fuel cost is not added. Contact the owner for details'
          )
        }
      />
      <CoverageBenefitItem
        title="Vehicle Insurance"
        subtitle="Vehicle is Fully covered"
        description="The vehicle is fully covered against any incidents during your travel time. You will only pay up to a maximum amount equivalent to excess fees of your chosen coverage."
        note="You are fully covered against any incident to vehicle. Only Excess fees applies"
      />
      <CoverageBenefitItem
        title="3rd Parties Liabilities"
        subtitle="Liabilities to 3rd parties included"
        description="The vehicle and your reservation comes with 3rd parties liabilities up to a maximum legal liability of $35,000,000. Terms and conditions applies as per rental agreement."
        note="You are covered against liabilities to 3rd parties from any incidents during your travel"
      />
      <CoverageBenefitItem
        title="LDW"
        subtitle="Loss Damage Waiver"
        description="This is Tashus standard level of cover. In case of loss or damage to the vehicle or damage to a third party, Loss Damage Waiver (LDW) reduces your maximum liability from the full cost of vehicle to your selected excess amount (maximum of $2,000). You can reduce the excess by purchasing coverage options."
        note="Fully covered vehicle and damage to third party"
      />
    </div>
  );
};

export default CoverageBenefitList;
