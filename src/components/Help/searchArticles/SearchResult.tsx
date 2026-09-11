'use client';

import { Divider, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

import Link from 'next/link';

import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';

const SearchArticleResult = () => {
  const { filteredArticles } = useHelpTopicArticleInfoContext();

  return (
    <>
      <div className="inline whitespace-nowrap sm:flex flex-wrap items-center text-xs mb-10">
        <Link className="no-underline me-1 hover:underline text-primary" href={`/help`}>
          Home
        </Link>
        {' > '}

        {filteredArticles.length > 0 ? `Search Articles ` : ''}
      </div>
      <Grid item xs={12} className="mb-5">
        <Typography variant="h5" component="div">
          Search Results
        </Typography>
        <Typography variant="body2" color="text.secondary" className="text-base">
          {filteredArticles && filteredArticles?.length} matches
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        {filteredArticles?.length > 0 &&
          filteredArticles?.map((item: any, index: number) => (
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
                    {item.summary.split(' ').length <= 20 ? item.summary : item.summary.split(' ').slice(0, 20).join(' ') + '...'}
                  </Typography>
                </Typography>
              </div>

              <Divider className="mt-4" />
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default SearchArticleResult;
