'use client';
import CommonTooltip from '@/components/Common/CommonTooltip';
import { ResourceCardProps } from '@/types/user-profile/customPriceTypes';
import { Avatar, Checkbox } from '@mui/material';
import Checked from '../../../../../../public/icons/checked.svg';
import Unchecked from '../../../../../../public/icons/unchecked.svg';

const ResourceCard = ({ car, coverPhoto, carNickName, listingId, setIsChecked, isChecked }: ResourceCardProps) => {
  return (
    <div className="flex justify-between bg-white h-full w-full">
      <div className="grid grid-cols-[auto,1fr] place-content-between p-4 w-2/3">
        <div>
          <Avatar alt={'vehicle-photo'} src={coverPhoto} className="w-12 h-10" variant="rounded" />
        </div>
        <div className="flex flex-col pl-2 flex-grow overflow-hidden">
          {/* <span className="text-xs">{`${car?.make} ${car?.model}`}</span>
          <span className="text-xs text-gray-600">{`${carNickName} (${listingId})`}</span> */}
          <CommonTooltip title={`${car?.make} ${car?.model}`} arrow={true}>
            <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">{`${car?.make} ${car?.model}`}</span>
          </CommonTooltip>
          <CommonTooltip title={`${carNickName} (${listingId})`} arrow={true}>
            <span className="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{`${carNickName} (${listingId})`}</span>
          </CommonTooltip>
        </div>
      </div>
      <div>
        <Checkbox
          onChange={() => setIsChecked(!isChecked)}
          checked={isChecked}
          icon={<Unchecked className="text-md" />}
          checkedIcon={<Checked className="text-md" />}
        />
      </div>
    </div>
  );
};

export default ResourceCard;
