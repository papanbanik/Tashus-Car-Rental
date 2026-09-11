import CommonTooltip from '@/components/Common/CommonTooltip';
import { Divider, IconButton } from '@mui/material';
import { IconType } from 'react-icons';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface InfoItem {
  label: string;
  value?: number;
  icon?: IconType;
  isDistance?: boolean;
  tooltipText?: string;
}

const DeliveryInfo = ({ data }: { data: InfoItem[] }) => {
  const filteredData = data?.filter((item) => Boolean(item?.value));
  return (
    <div className="my-2">
      {filteredData?.map((item: InfoItem, index: number) => (
        <div key={index}>
          <Divider />
          <span className="flex justify-between items-center my-2">
            <span className="grid grid-cols-[auto,1fr] gap-1 items-center font-bold text-sm text-gray-700">
              {item?.icon && <item.icon />}
              <div className="flex gap-1 items-center">
                {item?.label}
                {!!item?.tooltipText && (
                  <CommonTooltip title={item?.tooltipText} arrow>
                    <IconButton size="small">
                      <IoInformationCircleOutline className="text-gray-400" />
                    </IconButton>
                  </CommonTooltip>
                )}
              </div>
            </span>
            <span className="font-bold text-sm">{item?.isDistance ? `${item?.value}KM` : `$${item?.value}`}</span>
          </span>
        </div>
      ))}
      <Divider />
    </div>
  );
};

export default DeliveryInfo;
