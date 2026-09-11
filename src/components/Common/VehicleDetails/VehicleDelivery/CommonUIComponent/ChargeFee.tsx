import CommonTooltip from '@/components/Common/CommonTooltip';
import { Divider, IconButton } from '@mui/material';
import { AiFillDollarCircle } from 'react-icons/ai';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface ChargeFeeProps {
  label: string;
  value: string | number;
  tooltipText?: string;
}

const ChargeFee = ({ label, value, tooltipText }: ChargeFeeProps) => {
  return (
    <div className="my-2">
      <Divider />
      <span className="flex justify-between items-center my-2">
        <span className="flex gap-1 items-center font-bold text-sm">
          <AiFillDollarCircle className="text-gray-500" />
          {label}
          {!!tooltipText && (
            <CommonTooltip title={tooltipText} arrow={true}>
              <IconButton size="small">
                <IoInformationCircleOutline className="text-gray-400" />
              </IconButton>
            </CommonTooltip>
          )}
        </span>
        <span className="font-bold text-sm">${value}</span>
      </span>
      <Divider />
    </div>
  );
};

export default ChargeFee;
