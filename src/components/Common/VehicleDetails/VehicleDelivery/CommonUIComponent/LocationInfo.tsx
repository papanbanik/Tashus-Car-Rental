import { Divider } from '@mui/material';
import { LuArrowDown, LuArrowDownUp } from 'react-icons/lu';
import LineWithDots from './LineWithDots';

interface LocationInfoProps {
  initialLabel: string;
  initialValue: string;
  finalLabel: string;
  finalValue: string;
  lineColor?: string;
  lineHeight?: string;
  isRoundTrip?: boolean;
}

const LocationInfo = ({
  initialLabel,
  initialValue,
  finalLabel,
  finalValue,
  lineColor = 'primary',
  lineHeight = '50px',
  isRoundTrip,
}: LocationInfoProps) => {
  return (
    <div className="relative flex gap-4 my-2">
      {/* Line with dots */}
      <div className="flex flex-col items-center my-4">
        <LineWithDots lineHeight={lineHeight} color={lineColor} />
      </div>
      {/* Pickup and Delivery Information */}
      <div className="flex flex-col gap-1">
        {/* Pickup */}
        <b className="text-sm">{initialLabel}</b>
        <span className="text-gray-500 text-xs">{initialValue}</span>
        {/* <Divider /> */}
        <Divider className="flex items-center">
          <div className="flex items-center justify-center bg-primary rounded-full h-5 w-5">
            {isRoundTrip ? <LuArrowDownUp className="text-white" /> : <LuArrowDown className="text-white" />}
          </div>
        </Divider>
        {/* Delivery */}
        <b className="text-sm">{finalLabel}</b>
        <span className="text-gray-500 text-xs">{finalValue}</span>
      </div>
    </div>
  );
};

export default LocationInfo;
