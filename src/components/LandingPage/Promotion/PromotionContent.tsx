'use client';
import { Box, Typography } from '@mui/material';
import React from 'react';
import VoucherCard from './VoucherCard';
import { useGetAllPromotionPageSection } from '@/hooks/promotion-page/useGetAllPromotionPageSection';
import { styleTitle } from './CommonTitleStyle';
import { TypographyProps } from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export default function PromotionContent() {
  const { data, isLoading } = useGetAllPromotionPageSection();

  const variants = ['h1', 'body1', 'caption'] as readonly TypographyProps['variant'][];

  return (
    <>
      {isLoading ? (
        <div>
          {variants.map((variant) => (
            <Typography component="div" key={variant} variant={variant}>
              <Skeleton />
            </Typography>
          ))}
        </div>
      ) : (
        <div>
          {data?.data[0]?.map((item: any, index: number) =>
            item?.promotionPageContent?.sectionType === 'voucherCard' ? (
              <React.Fragment key={index}>
                <Box>
                  <Typography variant="h2" className="font-semibold text-primary text-center mb-4 text-[32px] lg:text-[48px]">
                    <span>{styleTitle(item?.promotionPageContent?.title ?? '')}</span>
                  </Typography>
                </Box>
                <Box className="mb-8 lg:mb-20">
                  <Typography variant="h4" className="text-black text-center text-sm">
                    {item?.promotionPageContent?.subtitle ?? ''}
                  </Typography>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>{/* Commented-out content */}</React.Fragment>
            )
          )}
        </div>
      )}
      <VoucherCard />
    </>
  );
}
