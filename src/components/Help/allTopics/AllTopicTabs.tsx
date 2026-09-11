'use client';

import { Tab, Tabs, Box, Grid } from '@mui/material';
import Typography, { TypographyProps } from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AllTopicsGuest from './AllTopicsGuest';
import AllTopicsHost from './AllTopicsHost';
import { useAllTopics, useAllParentTopics } from '@/hooks/help-center/useAllHelpTopics';
import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import axios from 'axios';
import Link from 'next/link';
import Skeleton from '@mui/material/Skeleton';
import { useUserCredContext } from '@/context/UserCredProvider';

const AllTopics = () => {
  const router = useRouter();
  const { selectedTab, setSelectedTab, allHelpTopics } = useHelpTopicArticleInfoContext();
  const {} = useAllTopics();
  const { data, isLoading, error } = useAllParentTopics();
  const { userCred, userProfileInfo } = useUserCredContext();

  const guestData: any = [];
  const hostData: any = [];

  (allHelpTopics || []).forEach((item: any) => {
    if (Array.isArray(item.roles)) {
      if (item.roles.includes('guest')) {
        guestData.push(item);
      }
      if (item.roles.includes('partner')) {
        hostData.push(item);
      }
    }
  });

  const [initialSelectTab, setInitialSelectTab] = useState<string>(selectedTab ? selectedTab : 'guest');
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setInitialSelectTab(newValue);
    setSelectedTab(newValue);
    router.push(`/help/all-topics?audience=${newValue}`, undefined);
  };

  const guestParentData: any = [];
  const hostParentData: any = [];

  (data?.data || []).forEach((item: any) => {
    if (Array.isArray(item.roles)) {
      if (item.roles.includes('guest')) {
        guestParentData.push(item);
      }
      if (item.roles.includes('partner')) {
        hostParentData.push(item);
      }
    }
  });

  const variants = ['h2', 'body1', 'body1', 'body1', 'body1', 'caption'] as readonly TypographyProps['variant'][];

  return (
    <>
      <div className="md:px-44 px-8 mb-24 relative  ">
        <div className={`w-full md:flex flex-col  `}>
          <div className="sm:mt-5">
            <Link className="no-underline me-1 hover:underline" href={`/help`}>
              Home
            </Link>
            {'>'} All topics
          </div>
          <Typography variant="h5" component="div" className="mb-10 mt-10 flex justify-center items-center flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold ">All Topics</h1>
            <Typography variant="body2" color="text.secondary" className="text-base">
              Browse our full library of help topics.
            </Typography>
          </Typography>
          {userProfileInfo?.isAllowListing && userCred?.loggedIn && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={selectedTab ? selectedTab : initialSelectTab} onChange={handleTabChange}>
                <Tab label="Guest" value="guest" />
                <Tab label="Partner" value="partner" />
              </Tabs>
            </Box>
          )}
          {isLoading ? (
            <Grid container spacing={3}>
              {variants.map((variant, index: number) => (
                <Grid item xs={4} key={index}>
                  {variants.map((variant, index: number) => (
                    <div key={index}>
                      <Typography key={variant} variant={variant}>
                        <Skeleton />
                      </Typography>
                    </div>
                  ))}
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              {initialSelectTab === 'guest' ? <AllTopicsGuest guestData={guestData} guestParentData={guestParentData} /> : null}
              {initialSelectTab === 'partner' ? <AllTopicsHost hostData={hostData} hostParentData={hostParentData} /> : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllTopics;
