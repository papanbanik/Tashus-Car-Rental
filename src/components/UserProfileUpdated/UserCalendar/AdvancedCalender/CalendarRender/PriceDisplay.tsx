import { PriceDisplayProps } from '@/types/user-profile/customPriceTypes';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';

const PriceDisplay = ({ rates }: PriceDisplayProps) => {
  // console.log(rates);
  // if (rates?.rateChange === 'DD') {
  //   console.log(rates);
  // }
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <div>
          {rates?.rateChange === 'I' ? (
            <FaArrowUp className="text-success" />
          ) : rates?.rateChange === 'D' ? (
            <FaArrowDown className="text-error" />
          ) : (
            ''
          )}
        </div> */}
      <span className="m-0 inline-flex flex-col items-center">
        <span className="h-4">
          {rates?.rateDailyChange === 'DI' ? (
            <FaArrowUp className="text-success" />
          ) : rates?.rateDailyChange === 'DD' ? (
            <FaArrowDown className="text-error" />
          ) : (
            ''
          )}
          ${(rates?.dailyPrice).toFixed(2)}/day
        </span>
        <span className="h-4">
          {rates?.rateHourlyChange === 'HI' ? (
            <FaArrowUp className="text-success" />
          ) : rates?.rateHourlyChange === 'HD' ? (
            <FaArrowDown className="text-error" />
          ) : (
            ''
          )}
          ${(rates?.hourlyPrice).toFixed(2)}/hr
        </span>
      </span>
      {/* <span className="m-0 bg-red-500">
        {rates?.rateHourlyChange === 'HI' ? (
          <FaArrowUp className="text-success" />
        ) : rates?.rateHourlyChange === 'HD' ? (
          <FaArrowDown className="text-error" />
        ) : (
          ''
        )}
        ${(rates?.hourlyPrice).toFixed(2)}/hr
      </span> */}
    </div>
  );
};

export default PriceDisplay;
