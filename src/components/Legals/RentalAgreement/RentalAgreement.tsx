'use client';
import DisplayAgreementRichText from '@/components/Common/AgreementRichText/DisplayAgreementRichText ';
import DisplayRichText from '@/components/Common/DisplayRichText';
import { useHelpTopicArticleInfoContext } from '@/context/HelpTopicsArticlesProvider';
import { useAllLegals } from '@/hooks/help-center/useAllLegals';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';

interface PrivacyPolicy {
  pageContent: string;
}

const RentalAgreement = () => {
  const ref = useRef<HTMLDivElement | any>();
  let count = 0;
  const searchParams = useSearchParams();
  const [reservationDetails, setReservationDetails] = useState<any>();
  const [additionalDrivers, setAdditionalDrivers] = useState<any>();
  const [insurance, setInsurance] = useState<any>();

  const { data, isLoading, error } = useAllLegals();
  const { allLegals } = useHelpTopicArticleInfoContext();

  const updatedAgreement: PrivacyPolicy[] = useMemo(() => {
    if (!allLegals) return [];

    const policyData: PrivacyPolicy[] = [];
    allLegals.forEach((item: any) => {
      item.pageContents.forEach((item2: any) => {
        if (item2.isActive === true && item.pageIdentifier === '/legals/rental-agreement') {
          policyData.push({
            pageContent: item2.pageContent,
          });
        }
      });
    });

    return policyData;
  }, [allLegals]);

  const variants = ['h2', 'body1', 'body1', 'body1', 'body1', 'caption'] as readonly TypographyProps['variant'][];

  const reservationData = useQuery({
    queryKey: [searchParams],
    queryFn: async () => {
      const userCred = JSON.parse(localStorage.getItem('tashus') as string);
      if (!searchParams?.get('reservation-id')) {
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reservation/rental-agreement/${searchParams?.get('reservation-id')}/${userCred?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userCred.accessToken}`,
          },
        }
      );
      return response;
    },
  });

  useEffect(() => {
    if (reservationData?.status === 'success') {
      setReservationDetails(reservationData?.data?.data?.data);
      console.log('resData', reservationData?.data?.data?.data);
      if (reservationData?.data?.data?.data?.additionalDrivers?.length > 0) {
        setAdditionalDrivers(reservationData?.data?.data?.data?.additionalDrivers);
      }
      if (reservationData?.data?.data?.data?.insurance) {
        setInsurance({
          ...reservationData?.data?.data?.data?.insurance,
          coverageAmount: reservationData?.data?.data?.data?.basePrice?.coverageAmount,
        });
      }
      // console.log('full data', reservationData?.data);
    }
  }, [reservationData?.status]);

  function capitalizeFirstLetter(input: string): string {
    if (input.length === 0) {
      return input; // Return the string as is if it's empty
    }

    const firstLetter = input[0].toUpperCase();
    const restOfString = input.slice(1);

    return firstLetter + restOfString;
  }

  return (
    <div className="w-full md:w-11/12 mx-auto grid grid-cols-6">
      <div className="w-full flex md:hidden justify-end col-span-6 mr-4 mb-4">
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
      <div className="col-span-1 hidden md:block"></div>
      <div className="bg-white w-full mb-10 px-5 md:px-10 py-3 md:py-6 col-span-6 md:col-span-4">
        <div ref={ref}>
          <h2 className="mb-10 text-center">
            Rental Agreement for guests<span className="text-success">_</span>
          </h2>

          {isLoading ? (
            // <Grid container spacing={3}>
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
              {!searchParams?.get('reservation-id') ? undefined : (
                <>
                  <div className="mb-6">
                    <div className="font-bold text-xl">
                      <div className="font-bold mr-1 inline-block text-center ">{(count = count + 1)}.</div>{' '}
                      {`Partner's
                  Details`}{' '}
                      :{' '}
                    </div>
                    <div className="pl-4">
                      <div>
                        <p className="text-justify">
                          <span className="font-semibold">{`“Partner”`}</span> is defined as the entity who shares vehicles in Tashus Car rental
                          platform. Partner can be an individual, business or Tashus itself.
                        </p>
                      </div>
                      <div className="flex gap-10">
                        <div className="font-semibold mb-1">
                          {' '}
                          Partner Full Name : <span className="font-normal">{reservationDetails?.partner?.partnerName}</span>
                        </div>
                        <div className="font-semibold mb-1">
                          {' '}
                          Partner Contact Number : <span className="font-normal">{reservationDetails?.partner?.partnerContactNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="font-bold text-xl">
                      <div className="font-bold mr-1 inline-block text-center ">{(count = count + 1)}.</div>{' '}
                      {`Guest's
                  Details`}{' '}
                      :{' '}
                    </div>
                    <div className="pl-4">
                      <div>
                        <p className="text-justify">
                          <span className="font-semibold">“Guest”</span> is defined as the person who borrows a vehicle in Tashus Car Rental Platform.
                          {`Guest must have valid driver’s license and authorized to drive in Australia.`}
                          Guest must be verified and approved to drive by Tashus.
                        </p>
                      </div>
                      <div className="flex gap-10">
                        <div className="font-semibold mb-1">
                          {' '}
                          Guest Full Name : <span className="font-normal">{reservationDetails?.guest?.guestName}</span>{' '}
                        </div>
                        <div className="font-semibold mb-1">
                          {' '}
                          Guest Contact Number : <span className="font-normal">{reservationDetails?.guest?.guestContactNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="font-bold text-xl">
                      <div className="font-bold mr-1 inline-block text-center ">{(count = count + 1)}.</div> Additional Drivers :{' '}
                    </div>
                    <div className="pl-4">
                      <div>
                        <p className="text-justify">{`Additional driver's are the person who meet the following criteria.`}</p>
                        <ol type="i">
                          <li>{`Have valid driver’s license.`}</li>
                          <li>Authorized to drive in Australia.</li>
                          <li>Registered member of Tashus</li>
                          <li>Verified by Tashus</li>
                          <li>Approved to drive by Tashus.</li>
                        </ol>
                        <p className="text-justify">
                          Additional driver is nominated by Guest before or during the start of reservation. Guest will not be There will be no
                          exception.
                        </p>
                      </div>
                      <div>
                        {additionalDrivers?.length > 0 ? (
                          <>
                            {additionalDrivers?.map((driver: any, idx: any) => {
                              const diverHtml = (
                                <div className="mb-2">
                                  <p className="mb-2 mt-0 mx-0 text-base font-semibold">Additional Driver {idx + 1} Informations:</p>

                                  <p className="m-0 text-sm">
                                    <span className="font-semibold">Full Name:</span> {driver?.fullName}
                                  </p>
                                  <p className="m-0 text-sm">
                                    <span className="font-semibold">Email:</span> {driver?.email}
                                  </p>
                                  <p className="m-0 text-sm">
                                    <span className="font-semibold">Phone:</span> {driver?.phone?.number}
                                  </p>
                                </div>
                              );
                              return diverHtml;
                            })}
                          </>
                        ) : (
                          <p className="font-semibold">No Additional Divers added</p>
                        )}
                      </div>
                      {/* <div className="font-semibold mb-1">
                        {' '}
                        Additional Driver Full Name :{' '}
                        <span className="font-normal">{reservationDetails?.drivers?.hasAdditionalDriver ? '' : 'N/A'}</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="font-bold text-xl mb-4">
                      <div className="font-bold mr-1 inline-block text-center ">{(count = count + 1)}.</div> Vehicle Details :{' '}
                    </div>
                    <div className="pl-4">
                      <div className="font-semibold mb-1">
                        {' '}
                        Make/Model/Year :{' '}
                        <span className="font-normal">
                          {reservationDetails?.vehicle?.make} / {reservationDetails?.vehicle?.model} / {reservationDetails?.vehicle?.year}
                        </span>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Registration Plate Number : <span className="font-normal">{reservationDetails?.vehicle?.registrationPlateNumber}</span>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Color : <span className="font-normal">{reservationDetails?.vehicle?.color}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="font-bold text-xl">
                      <div className="font-bold mr-1 inline-block text-center ">{(count = count + 1)}.</div> Reservation Details :{' '}
                    </div>
                    <div className="pl-4">
                      <div>
                        <p className="text-justify">{`“Reservation” is defined as the period of day and time from following start and end time when the guest has booked the vehicle.`}</p>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Reservation Start Date and Time :{' '}
                        <span className="font-normal">{formatFullDateTime(reservationDetails?.reservation?.startTime)}</span>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Reservation End Date and Time :{' '}
                        <span className="font-normal">{formatFullDateTime(reservationDetails?.reservation?.endTime)}</span>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Rental Period :{' '}
                        <span className="font-normal">
                          {reservationDetails?.reservation?.rentalPeriod ? `${reservationDetails?.reservation?.rentalPeriod} hours` : ''}
                        </span>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Rental Charges :{' '}
                        <span className="font-normal">
                          {reservationDetails?.reservation?.totalPrice ? `$${reservationDetails?.reservation?.totalPrice}` : ''}
                        </span>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Total Allowed Kilometers without additional charges :{' '}
                        <span className="font-normal">
                          {reservationDetails?.reservation?.maxDistance !== -1 && reservationDetails?.reservation?.maxDistance > 0
                            ? `${reservationDetails?.reservation?.maxDistance} Kilometers`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Additional kilometers Fees:{' '}
                        <span className="font-normal">
                          {reservationDetails?.reservation?.additionalFee === -1
                            ? 'N/A'
                            : `₵${reservationDetails?.reservation?.additionalFee} /kilometer`}{' '}
                        </span>
                      </div>
                      <div className="font-semibold mb-1">
                        Security Deposit (if applicable):{' '}
                        <span className="font-normal">
                          {reservationDetails?.reservation?.securityDeposit === -1 ? 'N/A' : `$${reservationDetails?.reservation?.securityDeposit}`}
                        </span>
                      </div>
                      <div>
                        {' '}
                        <p className="text-justify">During this period of reservation, the guest has the right to use the vehicle.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="font-bold text-xl mb-4">
                      <div className="font-bold mr-1 inline-block text-center ">{(count = count + 1)}.</div> Vehicle Pickup and Return :{' '}
                    </div>
                    <div className="pl-4">
                      <div className="font-semibold mb-1">
                        {' '}
                        Location for Vehicle Pickup :{' '}
                        <span className="font-normal"> {reservationDetails?.reservation?.pickupAddress?.streetAddress}</span>
                      </div>
                      <div className="font-semibold mb-1">
                        {' '}
                        Location for Vehicle Return :{' '}
                        <span className="font-normal"> {reservationDetails?.reservation?.returnAddress?.streetAddress}</span>
                      </div>
                    </div>
                  </div>
                  {insurance?.guestCoverageType ? (
                    <div className="mb-6">
                      <div className="font-bold text-xl mb-4">
                        <div className="font-bold mr-1 inline-block text-center ">{(count = count + 1)}.</div> Insurance Coverage :{' '}
                      </div>
                      <div className="pl-4">
                        {/* <div className="font-semibold mb-1"> Coverage Limits :</div>
                    <div className="font-semibold mb-1"> Exclusions : </div>
                  <div className="font-semibold mb-1"> Limitations : </div> */}
                        <div className="mb-1">
                          {' '}
                          <span className="font-semibold">
                            Coverage Type : {insurance?.guestCoverageType ? capitalizeFirstLetter(insurance?.guestCoverageType) : ''}
                          </span>
                        </div>
                        <div className="mb-1">
                          <span className="font-semibold">Coverage Percentage : </span>{' '}
                          {insurance?.coveragePercentage ? `${insurance?.coveragePercentage}%` : ''}
                        </div>
                        <div className="mb-1">
                          <span className="font-semibold">Coverage Fees : </span> ${insurance?.coverageAmount}
                        </div>
                        <div className="mb-1">
                          <span className="font-semibold">Excess Fees : </span> ${insurance?.excessFee}
                        </div>
                      </div>
                    </div>
                  ) : undefined}
                </>
              )}
              {!searchParams?.get('reservation-id') ? (
                <div className="text-base mt-20">
                  {' '}
                  <DisplayAgreementRichText content={`${updatedAgreement[0]?.pageContent || ''}`} />{' '}
                </div>
              ) : (
                <div className="text-base mt-20">
                  {' '}
                  <DisplayAgreementRichText content={`${reservationDetails?.agreement || ''}`} />{' '}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full hidden md:flex justify-center col-span-1">
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
    </div>
  );
};

export default RentalAgreement;
