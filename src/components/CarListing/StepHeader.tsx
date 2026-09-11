import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import React from 'react';
import CommonAccStatusAlert from '../Common/CommonAccStatusAlert';

const StepHeader = ({
  title,
  subtitle,
  children,
  titleTextSize,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  titleTextSize?: string;
}) => {
  const pathName = usePathname();
  const { partnerAccess } = useProfileInfoContext();
  return (
    <>
      {(pathName.includes('car-listing') || pathName.includes('vehicles')) && isPartnerRestrict(partnerAccess) && (
        <CommonAccStatusAlert isPartner={true} isRestrict={true} />
      )}
      <div className="lg:mb-12 mb-4">
        <div className="flex items-center">
          <Typography variant="h1" className={`font-semibold ${titleTextSize ?? 'md:text-4xl text-xl'}`}>
            {title}
            {/* <span className="text-success text-bold">_</span> */}
          </Typography>
          {children}
        </div>
        {subtitle && <Typography className="md:text-sm text-sm font-thin text-gray-400 italic text-left">{subtitle}</Typography>}
      </div>
    </>
  );
};

export default StepHeader;
