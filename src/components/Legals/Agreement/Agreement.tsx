'use client';
import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useAgreementDetails } from '@/hooks/agreement/useAgreementDetails';
import { useAllLegals } from '@/hooks/help-center/useAllLegals';
import { useReservationList } from '@/hooks/reservation/useReservationList';
import { useTravelList } from '@/hooks/travel/useTravelList';
import { Alert, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import AgreementCard from './AgreementCard';

interface PrivacyPolicy {
  pageContent: string;
}

const Agreement = () => {
  useTravelList();
  useReservationList();
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { isLoading } = useAllLegals();
  const { reservationList } = useTravelContext();
  const { travelList } = useProfileInfoContext();
  const ref = useRef<HTMLDivElement | any>();
  const searchParams = useSearchParams();
  useAgreementDetails();
  const { customMessage } = useSearchContext();
  const { agreementDetails } = useHelpTopicArticleInfoContext();
  const variants = ['h2', 'body1', 'body1', 'body1', 'body1', 'caption'] as readonly TypographyProps['variant'][];
  const isGuest = travelList?.some((item: any) => item?.reservationId === parseInt(searchParams?.get('reservation-id') || ''));
  const isHost = reservationList?.some((item: any) => item?.reservationId === parseInt(searchParams?.get('reservation-id') || ''));

  // console.log(isGuest);
  // console.log(isHost);
  return (
    <div className="w-full md:w-11/12 mx-auto grid grid-cols-6">
      <div className="col-span-1 hidden md:block" />
      <div className="bg-white w-full mb-10 px-5 md:px-10 py-3 md:py-6 col-span-6 md:col-span-4">
        {!isLoading && !isGuest && !isHost ? (
          <>
            <Alert severity="error" className="lg:mb-4">
              {customMessage}
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
              <h2 className="mb-10 text-center">
                {!isGuest ? 'Owner Agreement' : 'Rental Agreement for guests'}
                <span className="text-success">_</span>
              </h2>
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
                      <AgreementCard reservationDetails={agreementDetails} isRental={isGuest} />
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Agreement;
