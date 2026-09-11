'use client';
import DisplayRichText from '@/components/Common/DisplayRichText';
import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useOwnerAgreement } from '@/hooks/agreement/useOwnerAgreement';
import { Alert, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import AgreementCard from './AgreementCard';
import DisplayAgreementRichText from '@/components/Common/AgreementRichText/DisplayAgreementRichText ';

const ReservationOwnerAgreement = () => {
  const ref = useRef<HTMLDivElement | any>();
  const searchParams = useSearchParams();
  const { isLoading } = useOwnerAgreement();
  const { customMessage } = useSearchContext();
  const { ownerAgreement } = useHelpTopicArticleInfoContext();

  const {
    userCred: { userId },
  } = useUserCredContext();
  //   console.log(ownerAgreement);
  const variants = ['h2', 'body1', 'body1', 'body1', 'body1', 'caption'] as readonly TypographyProps['variant'][];
  //   const isHost = reservationList?.some((item: any) => item?.reservationId === parseInt(searchParams?.get('reservation-id') || ''));
  const isHost = ownerAgreement?.hostId === userId;
  //   console.log(isHost);
  return (
    <div className="w-full md:w-11/12 mx-auto grid grid-cols-6">
      <div className="col-span-1 hidden md:block" />
      <div className="bg-white w-full mb-10 px-5 md:px-10 py-3 md:py-6 col-span-6 md:col-span-4">
        {!isLoading && !isHost ? (
          <>
            <Alert severity="error" className="lg:mb-4">
              {customMessage ?? `No Agreement Found`}
            </Alert>
          </>
        ) : (
          <>
            <div>
              <ReactToPrint
                bodyClass="print-agreement"
                content={() => ref.current}
                trigger={() => (
                  <Button className="h-10 mt-4" variant="contained">
                    Print
                  </Button>
                )}
              />
            </div>
            <div ref={ref}>
              {/* Title part */}
              <h2 className="mb-10 text-center">{'Owner Agreement'}</h2>
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
                  {/* Dynamic Agreement part */}
                  {!searchParams?.get('reservation-id') ? undefined : (
                    <>
                      <AgreementCard reservationDetails={ownerAgreement} isRental={!isHost} />
                    </>
                  )}
                  {/*Static Agreement part */}
                  <div className="text-base mt-20">
                    <DisplayAgreementRichText content={ownerAgreement?.agreement} />{' '}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationOwnerAgreement;
