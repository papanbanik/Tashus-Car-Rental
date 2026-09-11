'use client';

import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useAllArticles } from '@/hooks/help-center/useAllHelpTopics';
import { Button, Card, CardActions, CardContent, Divider, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SingleTopic = () => {
  // const params = useParams();
  // const singleTopicId = params['topic-id'];
  const { topicId: singleTopicId } = useParams<{ topicId: string }>();
  const { userCred } = useUserCredContext();
  const { data } = useAllArticles();
  const { allHelpTopics, allArticleList, selectedArticle } = useHelpTopicArticleInfoContext();

  const [singleTopicData, setSingleTopicData] = useState([] as any);

  const fetchSingleTopic = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/setting/help/topics/${singleTopicId}`);
      if (res?.data) {
        setSingleTopicData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSingleTopic();
  }, []);

  const uniqueTitles: any = {};
  singleTopicData?.forEach((item: any) => {
    item?.tracks?.map((item2: any) => {
      if (item?.parentId === item2.topicId) {
        const title = item2.title;
        if (!uniqueTitles[title]) {
          uniqueTitles[title] = true;
        }
      }
    });
  });

  const uniqueTitlesArray = Object.keys(uniqueTitles);

  const withoutChildTopicData = allHelpTopics && allHelpTopics?.filter((item: any) => item.topicId === Number(singleTopicId));
  const selectedSingleArticle = allArticleList && allArticleList?.filter((item: any) => item.topicId === Number(singleTopicId));
  const orderedArticleList = [...selectedSingleArticle, ...allArticleList?.filter((item: any) => item.topicId !== Number(singleTopicId))];

  const top10Articles = orderedArticleList && orderedArticleList?.slice(0, 10);

  const titlewithTopicId: any = [];

  singleTopicData?.map((item: any) => {
    titlewithTopicId.push({
      title: item.title,
      topicId: item.topicId,
    });
  });

  const topicWithArticle: any = [];
  allArticleList?.map((item: any) => {
    titlewithTopicId?.filter((item2: any) => {
      if (item.topicId === item2.topicId) {
        topicWithArticle.push({ article: item, topicTitle: item2.title });
      }
    });
  });

  const subTopicWithArticleList: any[] = [];
  const addedSubTitles = new Set<number>();

  allArticleList?.forEach((item: any) => {
    singleTopicData?.forEach((item2: any) => {
      if (item2.topicId === item.topicId) {
        if (!addedSubTitles.has(item2.topicId)) {
          subTopicWithArticleList.push({ ...item, subTitle: item2.title });
          addedSubTitles.add(item2.topicId);
        } else {
          subTopicWithArticleList.push({ ...item });
        }
      }
    });
  });

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Link className="no-underline" href={userCred && userCred?.loggedIn === true ? '/support/support-center/general?from=general' : '/login'}>
        <Button
          className={`w-full mb-5 mt-2 normal-case ${isSmall ? 'block' : 'hidden'} text-xs  bg-primary text-white border   shadow-md p-3 rounded-md `}
        >{`${userCred && userCred?.loggedIn === true ? ' Support' : 'Login or Sign Up'}`}</Button>
      </Link>
      <div className="inline sm:flex flex-wrap items-center text-xs sm:mt-5">
        <Link className="no-underline me-1 hover:underline text-primary" href={`/help`}>
          Home
        </Link>
        {'>'}
        <Link className="no-underline ms-1 me-1 hover:underline text-primary" href={`/help/all-topics`}>
          All topics {'>'}
        </Link>{' '}
        <div>
          {withoutChildTopicData &&
            withoutChildTopicData?.length > 0 &&
            withoutChildTopicData[0]?.tracks?.map((item: any) => (
              <>
                <Link className="no-underline hover:underline text-primary" href={`/help/topic/${item.topicId}`}>
                  <span className=" ">{item.topicId != -1 ? item.title : ''}</span>
                  <span className="me-1">{item.topicId != -1 ? '>' : ''}</span>
                </Link>
                <span>{item.topicId == -1 ? item.title : ''}</span>
              </>
            ))}
        </div>
      </div>
      <Grid container item xs={12} className="flex ">
        <Grid xs={12} md={7}>
          <Typography variant="h5" component="div" className="mb-10 mt-10">
            <span>
              {uniqueTitlesArray?.map((title, index) => (
                <div key={index}>{title}</div>
              ))}
            </span>

            {singleTopicData && singleTopicData?.length > 0 ? (
              <>
                <>
                  {singleTopicData?.map((item: any) => (
                    <>
                      <div key={item.someUniqueKey}>
                        <Typography variant="body2" color="text.secondary" className="text-base">
                          <Link className="no-underline hover:underline text-primary" href={`/help/topic/${item.topicId}`}>
                            {item.parentId === item.tracks[0].topicId ? item.title : ''}
                          </Link>
                        </Typography>
                      </div>
                    </>
                  ))}
                </>
              </>
            ) : (
              <>
                {allHelpTopics?.map((item3: any) => (
                  <div key={item3.someUniqueKey}>
                    <Typography variant="body2" color="text.secondary" className="text-base">
                      {item3.topicId === Number(singleTopicId) ? item3.title : ''}
                    </Typography>
                  </div>
                ))}
              </>
            )}
          </Typography>
          <></>
          {selectedSingleArticle?.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {selectedSingleArticle?.length > 0 &&
                  selectedSingleArticle?.map((item: any, index: number) => (
                    <Grid item key={index} xs={12}>
                      <div className="flex justify-between">
                        <Typography variant="h5" component="div">
                          <Typography variant="body2" color="text.secondary" className="text-base">
                            {item.articleType}
                          </Typography>
                          <Link className="no-underline text-primary" href={`/help/article/${item.articleId}`}>
                            <Typography className="text-lg underline underline-offset-1 mb-1 " variant="h5" component="div">
                              {item.title}
                            </Typography>
                          </Link>
                          <Typography variant="body2" color="text.secondary" className="text-sm">
                            {item.summary?.split(' ').length <= 20 ? item.summary : item.summary?.split(' ').slice(0, 20).join(' ') + '...'}
                          </Typography>
                        </Typography>
                      </div>

                      <Divider className="mt-4" />
                    </Grid>
                  ))}
              </Grid>

              <Grid container spacing={3}>
                {withoutChildTopicData[0]?.parentId != -1 &&
                  topicWithArticle?.length > 0 &&
                  topicWithArticle?.map((item: any, index: number) => (
                    <Grid item key={index} xs={12}>
                      <Typography variant="h6" color="" className="text-base font-semibold">
                        {item.topicTitle ? item.topicTitle : ''}
                      </Typography>
                      <div className="flex justify-between">
                        <Typography variant="h5" component="div">
                          <Typography variant="body2" color="text.secondary" className="text-base">
                            {item.article.articleType}
                          </Typography>
                          <Link className="no-underline text-primary" href={`/help/article/${item.article.articleId}`}>
                            <Typography className="text-lg underline underline-offset-1 mb-1 " variant="h5" component="div">
                              {item.article.title}
                            </Typography>
                          </Link>
                          <Typography variant="body2" color="text.secondary" className="text-sm">
                            {item.article.summary?.split(' ').length <= 20
                              ? item.article.summary
                              : item.article.summary?.split(' ')?.slice(0, 20)?.join(' ') + '...'}
                          </Typography>
                        </Typography>
                      </div>

                      <Divider className="mt-4" />
                    </Grid>
                  ))}
              </Grid>
            </>
          ) : (
            <Grid container spacing={3}>
              {withoutChildTopicData[0]?.parentId != -1 &&
                top10Articles?.length > 0 &&
                top10Articles?.map((item: any, index: number) => (
                  <Grid item key={index} xs={12}>
                    <div className="flex justify-between">
                      <Typography variant="h5" component="div">
                        <Typography variant="body2" color="text.secondary" className="text-base">
                          {item.articleType}
                        </Typography>
                        <Link className="no-underline text-primary" href={`/help/article/${item.articleId}`}>
                          <Typography className="text-lg underline underline-offset-1 mb-1 " variant="h5" component="div">
                            {item.title}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary" className="text-sm">
                          {item.summary?.split(' ')?.length <= 20 ? item.summary : item.summary?.split(' ')?.slice(0, 20)?.join(' ') + '...'}
                        </Typography>
                      </Typography>
                    </div>

                    <Divider className="mt-4" />
                  </Grid>
                ))}
            </Grid>
          )}
        </Grid>
        <Grid item md={1}></Grid>
        <Grid item md={2} className={`mt-10 ms-10  ${isSmall ? 'hidden' : 'block'}  `}>
          <Card className="w-[255px] h-15 ">
            <CardContent className="w-full  text-sm p-2">
              {userCred && userCred?.loggedIn === true
                ? 'Facing issues? Submit a support ticket for help with reservations, your account, and more...'
                : 'Log in to receive help with your reservations, account-related matters, and additional support'}
            </CardContent>
            <CardActions className="w-full flex flex-col ">
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
    </>
  );
};

export default SingleTopic;
