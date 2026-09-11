'use client';

import DisplayRichText from '@/components/Common/DisplayRichText';
import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Button, Card, CardActions, CardContent, Grid, useMediaQuery, useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SingleArticle = () => {
  // const params = useParams();
  const { userCred } = useUserCredContext();
  // const singleArticleId = params['article-id'];
  const { articleId: singleArticleId } = useParams<{ articleId: string }>();
  const [singleArticleData, setSingleArticleData] = useState([] as any);
  const { setSelectedArticle } = useHelpTopicArticleInfoContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchSingleArticle = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/setting/help/articles/${singleArticleId}`);
      if (res?.data) {
        setSingleArticleData(res.data);
        setSelectedArticle(res.data);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);

      setIsLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchSingleArticle();
  }, []);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const variants = ['h2', 'body1', 'body1', 'body1', 'body1', 'caption'] as readonly TypographyProps['variant'][];

  return (
    <>
      <Link className="no-underline" href={userCred && userCred?.loggedIn === true ? '/support/support-center/general?from=general' : '/login'}>
        <Button
          className={`w-full mb-5 mt-2 normal-case ${isSmall ? 'block' : 'hidden'} text-xs  bg-primary text-white border   shadow-md p-3 rounded-md `}
        >{`${userCred && userCred?.loggedIn === true ? ' Support' : 'Login or Sign Up'}`}</Button>
      </Link>

      <div className="  sm:flex flex-wrap items-center text-xs sm:mt-5">
        <Link className="no-underline me-1 hover:underline text-primary" href={`/help`}>
          Home
        </Link>
        {' > '}

        <Link className="no-underline ml-1 hover:underline text-primary" href={`/help/all-topics`}>
          {!isLoading ? `All topics >` : ''}
        </Link>
        <div className="text-xs block">
          {singleArticleData?.tracks?.map((item: any, index: number) => (
            <Link key={index} className="no-underline hover:underline text-primary" href={`/help/topic/${item.topicId}`}>
              <span className="sm:ml-1 me-1 ">{item.title}</span>
              <span className="me-1">{'>'}</span>
            </Link>
          ))}
        </div>
        <div className="text-xs flex">{singleArticleData.title ? singleArticleData.title : ''}</div>
      </div>
      {isLoading ? (
        // <Grid container spacing={3}>
        <>
          {variants?.map((variant, index: number) => (
            <Grid item xs={4} key={index}>
              <div className="w-3/4">
                {variants?.map((variant, index: number) => (
                  <div key={index}>
                    <Typography key={variant} variant={variant}>
                      <Skeleton />
                    </Typography>
                  </div>
                ))}
              </div>
            </Grid>
          ))}
        </>
      ) : (
        // </Grid>
        <>
          <Grid container item xs={12} className="flex ">
            <Grid item xs={12} md={7}>
              <div>
                <Typography variant="h5" component="div" className="mb-10 mt-10">
                  <>
                    <Typography variant="body2" color="text.secondary" className="text-base">
                      {singleArticleData.articleType}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div" className=" text-xl sm:text-3xl font-bold mb-6">
                      {singleArticleData.title}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div" color="text.secondary" className="text-sm sm:text-lg mb-6 ">
                      {singleArticleData.summary}
                    </Typography>
                    <span className="text-base">
                      <DisplayRichText content={singleArticleData.content} />
                    </span>
                  </>
                </Typography>

                {/* <div className="mt-10">
          <Typography variant="h5" component="div" className="flex justify-between items-center">
            <Typography variant="h5" component="div">
              Guides for getting started
            </Typography>
            <Link className="no-underline" href="/help/all-topics">
              <Typography variant="body2" color="text.secondary" className="text-base">
                Browse all topics <span className="text-primary">{'>'}</span>
              </Typography>
            </Link>
          </Typography>
        </div> */}
              </div>
            </Grid>
            <Grid item md={1}></Grid>
            <Grid item md={2} className={`mt-10 ms-10  ${isSmall ? 'hidden' : 'block'}  `}>
              <Card className="w-[275px] h-13 p-2.5">
                <CardContent className="w-full  text-sm p-2">
                  {userCred && userCred?.loggedIn === true
                    ? 'Facing issues? Submit a support ticket for help with reservations, your account, and more...'
                    : 'Log in to receive help with your reservations, account-related matters, and additional support'}
                </CardContent>
                <CardActions className="w-full flex flex-col px-2">
                  <Link
                    className="no-underline w-full"
                    href={userCred && userCred?.loggedIn === true ? '/support/support-center/general?from=general' : '/login'}
                  >
                    <Button className="w-full h-6 text-sm normal-case justify-center bg-primary text-white border  border-gray-300 shadow-md   ">{`${
                      userCred && userCred?.loggedIn === true ? ' Support' : 'Login or Sign Up'
                    }`}</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          {error && <span>{error}</span>}
        </>
      )}
    </>
  );
};

export default SingleArticle;
