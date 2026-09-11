'use client';
import { usePaymentDetailsContext } from '@/context/PaymentDetailsProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { createHoldIntent } from '@/hooks/payment/reservation-payment/useHoldIntentCreate';
import { useReservationFind } from '@/hooks/support-center/support-ticket/support-reservation/useReservationFind';
import { IPaymentBody } from '@/types/payment/reservationPayment';
import { ECommonText, separateAndCapitalize } from '@/utils/Functions/randomCommonFn';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoPerson } from 'react-icons/io5';
import AdditionalFeeFormSkeleton from '../PayAdditionalFee/AdditionalFeeFormSkeleton';
import AdditionalFeeSkeleton from '../PayAdditionalFee/AdditionalFeeSkeleton';
import BasicInfoCard from '../ReservationPayment/PaymentCard/BasicInfoCard';
import CountdownCard from '../ReservationPayment/PaymentCard/CountdownCard';
import PaymentAmountCard from '../ReservationPayment/PaymentCard/PaymentAmountCard';
import StripeLogo from '/public/stripe-logo.png';

const ClaimHold = () => {
  const router = useRouter();
  //calling api
  const { isLoading: isReservationDetailsLoading } = useReservationFind();
  //get state
  const { reservationPaymentDetails } = usePaymentDetailsContext();
  const { userCred } = useUserCredContext();
  //client secrets state
  const [holdPaymentClientSecret, setHoldPaymentClientSecret] = useState<string>('');
  //mobileApp check
  const [isApp, setIsApp] = useState<boolean>(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);
  //set captureHold
  const [holdCaptured, setHoldCaptured] = useState<boolean>(false);
  //form state
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [cardHolderAddress, setCardHolderAddress] = useState<string>('');
  //error state
  const [cardError, setCardError] = useState<string>('');

  //call stripe elements
  const stripe = useStripe();
  const elements = useElements();

  //destruct
  const { loggedIn, email, userId } = userCred;
  const {
    reservationId: paymentReservationId,
    guestId,
    revisedReservationId,
    paymentStatus,
    isRevised,
    isPaymentTimeExpired,
    paymentAmount,
    carListingId,
    depositAmount = 0,
    pickupDate,
    returnDate,
    reservedAt,
    isHoldSuccess,
    holdDueAmount = 0,
  } = reservationPaymentDetails;

  const excessFee = holdDueAmount > 0 ? holdDueAmount : depositAmount;

  // get the reservationId
  const { reservationId: reservationIdParam } = useParams<{ reservationId: string }>();
  const reservationId = parseInt(reservationIdParam) || parseInt(paymentReservationId?.toString());

  //get search params
  const searchParams = useSearchParams();

  // redirection updates
  useEffect(() => {
    if (searchParams.get('from') === 'redirection') {
      setIsApp(true);
    } else {
      setIsApp(false);
    }
  }, [searchParams]);

  //Use Effect to get the client secret
  useEffect(() => {
    const { accessToken } = JSON.parse(localStorage.getItem('tashus') || '{}');
    const fetchReservationPaymentIntent = async () => {
      if (loggedIn && email && (paymentStatus !== 'paid' || isHoldSuccess === false) && accessToken) {
        const payment = {
          reservationId: reservationId,
          guestId: guestId,
          amount: 0,
          payment_method: 'stripe',
          currency: 'AUD',
          carListingId: carListingId,
          recentRevisedReservationId: revisedReservationId,
          excessFee: excessFee,
        };
        const paymentBody: IPaymentBody = { paymentData: payment, price: payment?.amount, holdPrice: payment?.excessFee, email: email };
        try {
          const result = await createHoldIntent(paymentBody, accessToken);
          if (result?.status === 200) {
            setHoldPaymentClientSecret(result?.data?.holdPaymentClientSecret);
            setCardError('');
          } else {
            setCardError(result?.message);
          }
        } catch (error) {
          console.log('Payment Intent Error', error);
        }
      }
    };
    fetchReservationPaymentIntent();
  }, [reservationId, paymentAmount, userCred]);

  const handleCaptureHoldPayment = async (event: any) => {
    setIsPaymentProcessing(true);

    if (cardHolderName === '' || cardHolderAddress === '') {
      setCardError('Please fill out all information');
      setIsPaymentProcessing(false);
      return;
    } else {
      setCardError('');
    }

    event.preventDefault();

    if (!stripe || !elements) {
      setIsPaymentProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      setIsPaymentProcessing(false);
      return;
    }

    //----------------------------
    // creating payment method
    //----------------------------
    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setCardError(error.message ?? '');
      setIsPaymentProcessing(false);
      // console.log('Payment Process Error', error);
    } else {
      setCardError('');
    }

    //----------------------------
    // confirming hold payment
    //----------------------------
    await confirmOnlyHoldPayment(card, stripe);
    setIsPaymentProcessing(false);
  };

  const confirmOnlyHoldPayment = async (card: any, stripe: any) => {
    // console.log('Card Details', card);
    // console.log('Stripe Details', stripe);
    const { paymentIntent: holdPaymentIntent, error: holdPaymentConfirmError } = await stripe.confirmCardPayment(holdPaymentClientSecret, {
      setup_future_usage: 'off_session',
      payment_method: {
        card: card,
        billing_details: {
          name: cardHolderName,
          email: email,
          address: {
            line1: cardHolderAddress,
          },
        },
      },
    });
    //  const paymentIntentDetails = await stripe.paymentIntents.retrieve(holdPaymentIntent);
    // console.log('payment Intent Details', paymentIntentDetails);
    if (holdPaymentConfirmError) {
      // console.log('Hold Confirm Error', holdPaymentConfirmError);
      setIsPaymentProcessing(false);
      setCardError(holdPaymentConfirmError?.message);
      return;
    }

    if (holdPaymentIntent.status === 'requires_capture') {
      setHoldCaptured(true);
      if (!isApp) {
        setTimeout(() => {
          router.push(`/dashboard/${guestId}/travels/details/${reservationId}`);
        }, 3000);
      }
    }

    return;
  };

  const isPaymentDisabled =
    isPaymentProcessing || cardHolderName === '' || cardHolderAddress === '' || !stripe || !holdPaymentClientSecret || holdCaptured;
  const checkIsHold = typeof isHoldSuccess === 'boolean' ? isHoldSuccess : true;
  return (
    <div className="relative flex flex-col justify-center items-center lg:min-h-screen bg-cover bg-center p-2 md:p-0 md:-mt-28 -lg:mt-16 overflow-auto">
      <div className="absolute inset-0 bg-payment-background bg-cover bg-center opacity-60 -z-10 " />
      {/* <div className="flex flex-col justify-center items-center lg:min-h-screen bg-cover bg-center p-2 md:p-0 md:-mt-28 -lg:mt-16 -z-10"> */}
      {/* <div className="absolute inset-0 bg-payment-background bg-cover bg-center opacity-60 z-0" /> */}
      {isReservationDetailsLoading ? (
        <AdditionalFeeSkeleton />
      ) : (
        <div className="relative flex flex-col justify-center items-center md:scale-90 lg:scale-75 2xl:scale-90 lg:mt-20 md:mt-10 sm:mt-6">
          {/* <div className="md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 flex flex-col justify-center items-center md:scale-90 lg:scale-75 2xl:scale-90"> */}
          <CountdownCard
            reservedAt={reservedAt}
            paymentStatus={holdCaptured ? 'Paid' : `${separateAndCapitalize(paymentStatus)}`}
            isPaymentTimeExpired={isPaymentTimeExpired ?? false}
            isHoldSuccess={isHoldSuccess}
          />
          <div className="w-full md:w-[500px] relative z-10 opacity-100 p-4 bg-white border border-solid border-primary shadow-md shadow-fuchsia-400 rounded-lg mt-4">
            <BasicInfoCard
              reservationId={reservationId}
              startDate={pickupDate}
              endDate={returnDate}
              paymentStatus={holdCaptured ? 'Paid' : `${separateAndCapitalize(paymentStatus)}`}
              userId={userId ?? ''}
              isPaymentTimeExpired={isPaymentTimeExpired ?? false}
            />
            <PaymentAmountCard
              withHoldPayment={isRevised ? false : excessFee > 0}
              depositAmount={excessFee}
              paymentAmount={paymentStatus === 'paid' && isHoldSuccess === false ? 0 : paymentAmount ?? 0}
            />
            <section>
              {isHoldSuccess === true && (isPaymentTimeExpired || paymentStatus === 'paid') ? (
                <>
                  <div className="flex justify-center items-center">
                    <Alert severity="info" className="w-full  bg-cyan-100">
                      {isPaymentTimeExpired && paymentStatus === 'pending'
                        ? 'The payment time has been expired.'
                        : paymentStatus === 'paid' && checkIsHold
                        ? `This reservation is already paid.  ${isApp ? 'Please close the tab and return to App for more details' : ''}`
                        : ''}
                    </Alert>
                  </div>
                  <div className="flex justify-center items-center mt-4">
                    {paymentStatus === 'paid' && !isApp && (
                      <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${guestId}/travels/details/${reservationId}`}>
                        <Button className="normal-case mb-6" variant="contained">
                          View Travels Details
                        </Button>
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {stripe && elements && holdPaymentClientSecret ? (
                    <>
                      <div className="flex flex-col gap-4">
                        <TextField
                          name="name"
                          id="name"
                          label={
                            <div className="flex items-center gap-2">
                              <IoPerson />
                              Card holder name {ECommonText.RequiredSign}
                            </div>
                          }
                          onChange={(e) => {
                            setCardHolderName(e.target.value);
                          }}
                          disabled={holdCaptured}
                          size="small"
                          className="capitalize font-semibold"
                        />
                        <TextField
                          name="address"
                          id="address"
                          label={
                            <div className="flex items-center gap-2">
                              <FaMapLocationDot />
                              Billing address {ECommonText.RequiredSign}
                            </div>
                          }
                          onChange={(e) => {
                            setCardHolderAddress(e.target.value);
                          }}
                          disabled={holdCaptured}
                          size="small"
                          className="capitalize"
                        />
                        <CardElement
                          className="p-2 rounded-md bg-white border-solid border border-gray-300 capitalize"
                          onChange={() => setCardError('')}
                          options={{
                            hidePostalCode: true,
                            style: {
                              base: {
                                fontSize: '16px',
                                backgroundColor: 'white',
                                color: 'black',
                                '::placeholder': {
                                  color: 'grey',
                                },
                                textTransform: 'capitalize',
                              },
                              invalid: {
                                color: '#ff737a',
                              },
                            },
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="p-4">
                      <AdditionalFeeFormSkeleton />
                    </div>
                  )}
                  {/* Pay Now & View Button, Error Messages */}
                  <div className="flex flex-col justify-center items-center">
                    {/* Error messages */}
                    {cardError && !!holdPaymentClientSecret && <p className="text-error">{cardError}</p>}

                    {/* After Successful Payment */}
                    {holdCaptured && (
                      <div className="text-center flex flex-col gap-1">
                        <span className="text-primary">Successfully Hold!</span>
                        <span className="text-black flex flex-col gap-2">
                          {isApp ? (
                            <span>Please close the tab and return to App for more details</span>
                          ) : (
                            <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${guestId}/travels/details/${reservationId}`}>
                              <Button className="normal-case" variant="contained">
                                View Travels Details
                              </Button>
                            </Link>
                          )}
                        </span>
                      </div>
                    )}
                    {/* Pay Now Button */}
                    <Button
                      disabled={isPaymentDisabled}
                      onClick={handleCaptureHoldPayment}
                      className="w-full mt-4 normal-case text-md md:text-lg"
                      color="success"
                      variant="contained"
                    >
                      {isPaymentProcessing ? <CircularProgress color="inherit" size={22} /> : 'Pay Now'}
                    </Button>
                  </div>
                  {/* Stripe Logo */}
                  <div className="flex justify-center items-center mt-4">
                    <Image className="w-2/3 h-2/3" src={StripeLogo} alt="stripe logo" />
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimHold;
