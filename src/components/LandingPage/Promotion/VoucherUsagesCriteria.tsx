import { useGetAllPromotionPageSection } from '@/hooks/promotion-page/useGetAllPromotionPageSection';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { FaCalendarAlt, FaMapMarker, FaCar, FaClipboardCheck, FaLock, FaTimesCircle, FaUserLock } from 'react-icons/fa';
import { styleTitle } from './CommonTitleStyle';

const iconData = [
  { icon: FaCalendarAlt },
  { icon: FaMapMarker },
  { icon: FaCar },
  { icon: FaClipboardCheck },
  { icon: FaLock },
  { icon: FaUserLock },
  { icon: FaTimesCircle },
  { icon: FaClipboardCheck },
  { icon: FaClipboardCheck },
  { icon: FaClipboardCheck },
  { icon: FaClipboardCheck },
];

export default function VoucherUsagesCriteria() {
  const { data } = useGetAllPromotionPageSection();

  return (
    <div>
      {data?.data[0]?.map((item: any, index: number) =>
        item?.promotionPageContent?.sectionType === 'voucherUsage' ? (
          <React.Fragment key={index}>
            <Box className="mt-20 mb-10">
              <Typography variant="h2" className="font-semibold text-black text-center mb-4 text-[24px] lg:text-[32px]">
                {styleTitle(item?.promotionPageContent?.title ?? '')}
              </Typography>
            </Box>

            {item?.promotionPageContent?.data?.length > 0
              ? item?.promotionPageContent?.data?.map((item2: any, index2: number) => (
                  <div key={index2} className="flex flex-col space-x-0 lg:space-x-4">
                    <div className="flex text-primary items-center space-x-4 ml-0 lg:ml-4 mt-2 mb-2">
                      <div className="text-primary flex-shrink-0 text-2xl">
                        {iconData[index2] && <React.Fragment>{React.createElement(iconData[index2].icon, { size: 22 })}</React.Fragment>}
                      </div>

                      <div className="text-black flex-col">
                        <Typography variant="h6" className="font-bold">
                          {item2?.title ?? ''}
                        </Typography>
                        <Typography variant="body2" className="mt-1">
                          {item2?.description ?? ''}
                        </Typography>
                      </div>
                    </div>
                    <hr className="my-2" />
                  </div>
                ))
              : null}
          </React.Fragment>
        ) : null
      )}
    </div>
  );
}
