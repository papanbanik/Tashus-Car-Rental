import CommonTooltip from '@/components/Common/CommonTooltip';
import { TCoverageBenefit } from '@/utils/Lists/coverageBenifitList';
import { Divider, IconButton, Typography } from '@mui/material';
import { IoInformationCircleOutline } from 'react-icons/io5';

const CoverageBenefitItem = ({ title, subtitle, description, note }: TCoverageBenefit) => {
  return (
    <>
      <Divider className="bg-primary mb-3" />
      <div className="grid grid-cols-[auto,1fr] items-start pb-4">
        <div className="w-20">
          <Typography className="flex flex-col justify-center items-center text-primary font-bold text-sm sm:text-base md:text-md">
            {title.split(' ').map((line: string, index: number) => (
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

export default CoverageBenefitItem;
