'use client';

import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useAllArticles, useAllTopics } from '@/hooks/help-center/useAllHelpTopics';
import { Box, Button, Card, CardActions, CardContent, Grid, Tab, Tabs, TextField, useMediaQuery, useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import { GoSearch } from 'react-icons/go';
import { GrArticle } from 'react-icons/gr';
import GuestInfo from './GuestInfo';
import HostInfo from './HostInfo';

const HelpPage: React.FC = () => {
  const router = useRouter();
  const { isLoading } = useAllTopics();
  useAllArticles();
  const { userCred, userProfileInfo } = useUserCredContext();

  const { selectedHomeTab, setSelectedHomeTab, allArticleList, setAllArticleList, filteredArticles, setFilterArticles } =
    useHelpTopicArticleInfoContext();
  const [selectedTab, setSelectedTab] = useState<string>(selectedHomeTab ? selectedHomeTab : 'guest');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [searchResultsVisible, setSearchResultsVisible] = useState(false);

  const handleSearchFocus = () => {
    setSearchResultsVisible(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setSearchResultsVisible(false);
    }, 200);
  };

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
    setSearchResultsVisible(true);
    const filteredItems = allArticleList?.filter((item: any) => item?.title?.toLowerCase()?.includes(searchTerm.toLowerCase()));
    setFilterArticles(filteredItems);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue);
    setSelectedHomeTab(newValue);
    router.push(`/help?audience=${newValue}`, undefined);
  };

  const guestArticleData: any = [];
  const hostArticleData: any = [];

  (allArticleList || []).forEach((item: any) => {
    if (Array.isArray(item.roles)) {
      if (item.roles.includes('guest')) {
        guestArticleData.push(item);
      }
      if (item.roles.includes('partner')) {
        hostArticleData.push(item);
      }
    }
  });

  const variants = ['h2', 'body1', 'body1', 'body1', 'body1', 'caption'] as readonly TypographyProps['variant'][];
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <div className="md:px-44 px-8 mb-24 relative  ">
        <div className={`w-full md:flex flex-col item-center flex justify-center`}>
          <Typography variant="h1" className="text-xl mb-4 font-semibold md:text-[32px] text-center">
            Hi, how can we support you?
          </Typography>

          <div className="flex justify-center ">
            <TextField
              sx={{ border: 'none', '& fieldset': { border: 'none' } }}
              className={`w-3/4 sm:2/3 md:w-2/5 h-10 md:h-16 ml-8 text-center rounded-s-full rounded-e-full text-primary shadow-md flex ${
                isSmall ? 'h-20' : 'justify-between'
              } items-center p-4 rounded-md `}
              style={{ backgroundColor: '#ffffff', border: '0' }}
              variant="standard"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder={isSmall ? 'Search Help' : 'Explore how-tos and more'}
              InputProps={{
                disableUnderline: true,
                startAdornment: isSmall && <GoSearch className="w-12 h-12 p-2.5 " />,
                endAdornment: !isSmall && <GoSearch className="w-10 h-10 p-2 rounded-full text-white text-2xl ml-auto bg-primary" />,
              }}
            />
          </div>
          {searchResultsVisible && searchTerm ? (
            <div className="flex justify-center relative z-50 mt-3 md:ms-5">
              <Card sx={{ position: 'relative', zIndex: 10 }} className="min-w-[400px] max-w-[360px] h-52 p-0">
                <span className="flex justify-between  px-4 pt-2">
                  <span className="ms-1">{searchTerm && filteredArticles?.length > 0 ? `${filteredArticles?.length} Articles Found` : ''}</span>
                  <Link className="no-underline text-primary" href={`/help/search`}>
                    <span className="mr-1 ">{searchTerm && filteredArticles?.length > 3 ? 'See All' : ''}</span>
                  </Link>
                </span>

                <ul className={`md:h-18 px-2`} style={{ listStyleType: 'none' }}>
                  {filteredArticles.length > 0 ? (
                    filteredArticles.slice(0, 3).map((item: any, index: number) => (
                      <Link key={index} className="no-underline text-primary" href={`/help/article/${item.articleId}`}>
                        <li className="w-full mt-1">
                          <CardContent className="p-2 text-sm flex items-center">
                            <span className="w-6 h-6 bg-gray-200 p-1 me-2">
                              <GrArticle />
                            </span>
                            {item.title}
                          </CardContent>
                        </li>
                      </Link>
                    ))
                  ) : (
                    <Typography variant="h5" component="div" className="text-center  mt-3 md:ms-5">
                      No Article Found!
                    </Typography>
                  )}
                </ul>
              </Card>
            </div>
          ) : (
            ''
          )}
          {userProfileInfo?.isAllowListing && userCred?.loggedIn && (
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider', zIndex: 1 }}
              className={`flex justify-center items-center ${searchTerm && searchResultsVisible ? 'mt-[-170px]' : 'mt-10'}`}
            >
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Guest" value="guest" />
                <Tab label="Partner" value="host" />
              </Tabs>
            </Box>
          )}
          <div className="mt-10">
            <Card className={`w-full h-40  ${isSmall ? 'block justify-center ' : 'flex justify-between'}  items-center `}>
              <CardContent className={`w-full md:w-3/5  ${isSmall ? 'p-2' : ''} `}>
                <Typography gutterBottom variant="h5" component="div" className="text-xl sm:text-2xl bold">
                  We&apos;re here to support you.
                </Typography>
                <Typography variant="body2" color="text.secondary" className="text-sm sm:text-base">
                  {userCred && userCred?.loggedIn === true
                    ? 'Facing issues? Submit a support ticket for help with reservations, your account, and more...'
                    : 'Log in to receive help with your reservations, account-related matters, and additional support'}
                </Typography>
              </CardContent>
              <Link
                className="no-underline w-full md:w-4/12"
                href={userCred && userCred?.loggedIn === true ? '/support/support-center/general?from=general' : '/login'}
              >
                <CardActions className="">
                  <Button
                    className={`w-full h-11 normal-case text-base ${
                      isSmall ? 'h-7 p-2' : 'p-4'
                    }  bg-primary text-white border  border-gray-300 shadow-md p-4 rounded-md`}
                  >
                    {`${userCred && userCred?.loggedIn === true ? ' Support' : 'Login or Sign up'}`}
                  </Button>
                </CardActions>
              </Link>
            </Card>
          </div>
          <div className="mt-10">
            <Typography variant="h5" component="div" className="block sm:flex md:justify-between items-center">
              <Typography variant="h5" component="div" className="text-xl me-2 sm:text-2xl">
                Guides for getting started
              </Typography>
              <Link className="no-underline" href="/help/all-topics">
                <Typography variant="body2" color="text.secondary" className="text-base  flex items-center md:justify-center">
                  Browse all topics{' '}
                  <span className="text-primary">
                    <AiOutlineRight className="mt-2" />
                  </span>
                </Typography>
              </Link>
            </Typography>
          </div>
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
          ) : guestArticleData?.length > 0 || hostArticleData?.length > 0 ? (
            <>
              {userProfileInfo?.isAllowListing ? (
                <>
                  {selectedTab === 'guest' ? <GuestInfo guestArticleData={guestArticleData} /> : null}
                  {selectedTab === 'host' ? <HostInfo hostArticleData={hostArticleData} /> : null}
                </>
              ) : (
                <GuestInfo guestArticleData={guestArticleData} />
              )}
            </>
          ) : (
            <Typography gutterBottom variant="h5" component="div" className=" flex justify-center items-center text-xl mt-10">
              No article to show
            </Typography>
          )}
        </div>
      </div>
    </>
  );
};

export default HelpPage;
