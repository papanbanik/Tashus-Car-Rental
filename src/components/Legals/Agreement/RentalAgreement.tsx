'use client';
import DisplayRichText from '@/components/Common/DisplayRichText';
import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useRentalAgreement } from '@/hooks/agreement/useRentalAgreement';
import { Alert, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import AgreementCard from './AgreementCard';
import DisplayAgreementRichText from '@/components/Common/AgreementRichText/DisplayAgreementRichText ';

interface PrivacyPolicy {
  pageContent: string;
}

const ReservationRentalAgreement = () => {
  const ref = useRef<HTMLDivElement | any>();
  const searchParams = useSearchParams();
  const { isLoading } = useRentalAgreement();
  const { customMessage } = useSearchContext();
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { rentalAgreement } = useHelpTopicArticleInfoContext();
  const variants = ['h2', 'body1', 'body1', 'body1', 'body1', 'caption'] as readonly TypographyProps['variant'][];
  //   const isGuest = travelList?.some((item: any) => item?.reservationId === parseInt(searchParams?.get('reservation-id') || ''));
  const isGuest = rentalAgreement?.guestId === userId;
  return (
    <div className="w-full md:w-11/12 mx-auto grid grid-cols-6">
      <div className="col-span-1 hidden md:block" />
      <div className="bg-white w-full mb-10 px-5 md:px-10 py-3 md:py-6 col-span-6 md:col-span-4">
        {!isLoading && !isGuest ? (
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
                  {/* Title part */}
                  <h2 className="mb-10 text-center">{`Rental Agreement between ${rentalAgreement?.guest?.guestName} and Tashus Pty Ltd`}</h2>
                  {/* Dynamic Agreement part */}
                  {!searchParams?.get('reservation-id') ? undefined : (
                    <>
                      <AgreementCard reservationDetails={rentalAgreement} isRental={isGuest} />
                    </>
                  )}
                  {/*Static Agreement part */}
                  <div className="text-base mt-20">
                    <DisplayAgreementRichText content={rentalAgreement?.agreement} />{' '}
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

export default ReservationRentalAgreement;
