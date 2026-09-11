'use client';
import { Grid, Skeleton } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import promotionPageDefaultImage from '../../../../public/Images/LandingpagePopupImage/promotion.webp';
import { useGetAllPromotionPageSection } from '@/hooks/promotion-page/useGetAllPromotionPageSection';

export default function PromotionBannerImage() {
  const { data, isLoading } = useGetAllPromotionPageSection();

  return (
    <>
      {isLoading ? (
        <Grid item xs={12}>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Grid>
      ) : (
        <div>
          {data?.data[0]?.map((item: any, index: number) =>
            item?.promotionPageContent?.sectionType === 'banner' ? (
              <React.Fragment key={index}>
                <Image
                  src={item?.promotionPageContent?.image?.secureUrl ?? promotionPageDefaultImage}
                  alt="Unlock Exclusive Discounts with Tashus Vouchers"
                  width={1920}
                  height={500}
                  className="w-full h-[200px] md:h-full 2xl:h-full object-cover object-right md:object-center"
                />
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>{/* Commented-out content */}</React.Fragment>
            )
          )}
        </div>
      )}
    </>
  );
}
