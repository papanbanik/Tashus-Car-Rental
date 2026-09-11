'use client';

import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const AllTopicsGuest = ({ guestData, guestParentData }: { guestData: any; guestParentData: any }) => {
  return (
    <>
      <div className="mt-16">
        <Grid container spacing={2} className="block sm:flex">
          {guestParentData &&
            guestParentData.map((item: any, index: number) => (
              <Grid item key={index} xs={12} md={4}>
                <div className=" pl-0 sm:pl-5">
                  <div className="font-bold text-xl mb-2">{item.title ? item.title : ''}</div>
                  <div className="flex flex-col">
                    {guestData?.map((item2: any, index: number) =>
                      item.topicId === item2.parentId ? (
                        <div key={index} className="mb-1">
                          <Link className="no-underline text-primary" href={`/help/topic/${item2.topicId}`}>
                            <span className="underline underline-offset-1 text-base">{item2.title}</span>
                          </Link>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>
      </div>
    </>
  );
};

export default AllTopicsGuest;
