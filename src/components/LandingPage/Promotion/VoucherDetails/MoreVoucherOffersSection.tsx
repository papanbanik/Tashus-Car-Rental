'use client';
import React from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import promotionPageDefaultImage from '../../../../../public/Images/LandingpagePopupImage/promotion.webp';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';
import { TVoucher } from '@/types/voucher-promotion/promotionTypes';
import { useParams } from 'next/navigation';

interface MoreVoucherOffersSection {
  filteredMoreVoucherList: TVoucher[];
}

const MoreVoucherOffersSection = ({ filteredMoreVoucherList }: MoreVoucherOffersSection) => {
  const { voucherSlug } = useParams<{ voucherSlug: string }>();
  const filteredList = filteredMoreVoucherList?.filter((offer) => offer.voucherSlug !== voucherSlug);

  return (
    <div>
      {filteredList?.length > 0 && (
        <>
          <div>
            <Typography className={`font-semibold md:text-4xl text-lg  }`}>Offers you may like</Typography>
          </div>

          <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={4}>
              {filteredList?.slice(0, 3).map((offer, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card elevation={0} sx={{ boxShadow: 0, minHeight: 230 }}>
                    {/* Card Image */}
                    <Image
                      src={offer?.voucherImages?.length > 0 ? offer?.voucherImages[0]?.secure_url : promotionPageDefaultImage}
                      alt={offer.voucherTitle}
                      height="92"
                      width="200"
                      className="w-full height-[auto] object-fill object-right md:object-center"
                    />
                    <CardContent>
                      {/* Card Title */}
                      <Typography variant="body1" fontWeight="bold" gutterBottom>
                        {offer.voucherTitle ?? ''}
                      </Typography>

                      {/* Explore Link */}
                      {offer.voucherSlug && (
                        <Link href={offer.voucherSlug} color="primary" className="no-underline flex items-center  md:justify-start ">
                          Explore <IoIosArrowForward />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default MoreVoucherOffersSection;
