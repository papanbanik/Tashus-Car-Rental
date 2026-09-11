'use client';

import DisplayRichText from '@/components/Common/DisplayRichText';
import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useAllLegals } from '@/hooks/help-center/useAllLegals';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { Container, Grid, List, ListItem, Paper } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Link from 'next/link';
import React, { useMemo } from 'react';
import '../TermsAndConditions/PrivacyAndTermsCondition.css';

interface PrivacyPolicy {
  pageContent: string;
  updatedTime: string;
  pageLinks: any[];
  pageTitle: string;
}

const PrivacyPage: React.FC = () => {
  const { data, isLoading, error } = useAllLegals();
  const { allLegals } = useHelpTopicArticleInfoContext();

  const latestPrivacyPolicy: PrivacyPolicy[] = useMemo(() => {
    if (!allLegals) return [];

    const policyData: PrivacyPolicy[] = [];
    allLegals.forEach((item: any) => {
      item.pageContents.forEach((item2: any) => {
        if (item2.isActive === true && item.pageIdentifier === '/legals/privacy') {
          policyData.push({
            pageContent: item2.pageContent,
            updatedTime: item2.updatedTime,
            pageLinks: item.pageLinks,
            pageTitle: item.pageTitle,
          });
        }
      });
    });

    return policyData;
  }, [allLegals]);

  const variants = ['h1', 'h2', 'body1', 'body1', 'body1', 'body1', 'caption'] as readonly TypographyProps['variant'][];
  return (
    <Container maxWidth="lg">
      {isLoading ? (
        <>
          {variants.map((variant, index: number) => (
            <Grid item xs={4} key={index}>
              <div className="w-3/4">
                {variants.map((variant, index: number) => (
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
        <>
          {latestPrivacyPolicy &&
            latestPrivacyPolicy?.map((policy: any, index: number) => (
              <Grid className="mt-4 mb-4" container spacing={2} key={index}>
                <Grid item xs={12} md={8}>
                  <Paper style={{ padding: '20px', backgroundColor: 'transparent' }}>
                    <Typography variant="h1" className="mb-2 text-2xl md:text-4xl font-bold">
                      {`${policy?.pageTitle || ''}`}
                    </Typography>
                    <Typography variant="body1" className="mb-8">
                      Updated on {formatFullDateTime(policy?.updatedTime)}
                    </Typography>
                    <span className="text-base">
                      <DisplayRichText content={`${policy?.pageContent || ''}`} />
                    </span>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper style={{ padding: '20px', backgroundColor: 'transparent' }}>
                    <Typography className="font-semibold text-base mt-4 mb-4">Related articles</Typography>

                    {policy?.pageLinks &&
                      policy.pageLinks.map((item: any, index: number) => (
                        <List key={index}>
                          <ListItem>
                            <Link className="no-underline text-primary" href={`${item?.linkUrl || '/'}`}>
                              <Typography>{`${item?.linkTitle || ''}`}</Typography>
                            </Link>
                          </ListItem>
                        </List>
                      ))}
                  </Paper>
                </Grid>
              </Grid>
            ))}
        </>
      )}
    </Container>
  );
};

export default PrivacyPage;
