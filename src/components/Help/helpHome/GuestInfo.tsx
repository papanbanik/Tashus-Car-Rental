'use client';

import { Typography, Grid, Divider } from '@mui/material';
import React, { useState } from 'react';
import Link from 'next/link';

const GuestInfo = ({ guestArticleData }: { guestArticleData: any }) => {
  const firstTwelveGuestArticles = guestArticleData && guestArticleData?.slice(0, 12);
  return (
    <>
      <div className="mt-16">
        <Typography variant="h5" component="h5" className="mb-8">
          Top articles
        </Typography>
        <Grid container spacing={3} className="block sm:flex">
          {firstTwelveGuestArticles &&
            firstTwelveGuestArticles?.map((item: any, index: number) => (
              <>
                <Grid item key={index} xs={12} md={4}>
                  <div>
                    <div className="flex justify-between">
                      <Typography variant="h5" component="div">
                        <Link className="no-underline text-primary" href={`/help/article/${item.articleId}`}>
                          <Typography className="text-base md:text-xl underline underline-offset-1 mb-1 " variant="h5" component="div">
                            {item.title}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary" className="text-sm md:text-base">
                          {item.summary.split(' ').length <= 20 ? item.summary : item.summary.split(' ').slice(0, 20).join(' ') + '...'}
                        </Typography>
                      </Typography>
                    </div>
                  </div>
                  {/* <Divider className="mt-4" /> */}
                </Grid>
              </>
            ))}
        </Grid>
      </div>
    </>
  );
};

export default GuestInfo;
