'use client';
import { usePaymentDetailsContext } from '@/context/PaymentDetailsProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { createReservationPaymentIntent } from '@/hooks/payment/reservation-payment/useReservationPaymentIntent';
import { useReservationFind } from '@/hooks/support-center/support-ticket/support-reservation/useReservationFind';
import { IPayment, IPaymentBody } from '@/types/payment/reservationPayment';
import { EReservationStatus } from '@/types/travels/travelEnums';
import { ECommonText, separateAndCapitalize } from '@/utils/Functions/randomCommonFn';
import { reservationCancelledStatus } from '@/utils/Lists/travelInfoList';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoPerson } from 'react-icons/io5';
import AdditionalFeeFormSkeleton from '../PayAdditionalFee/AdditionalFeeFormSkeleton';
import AdditionalFeeSkeleton from '../PayAdditionalFee/AdditionalFeeSkeleton';
import BasicInfoCard from './PaymentCard/BasicInfoCard';
import CountdownCard from './PaymentCard/CountdownCard';
import PaymentAmountCard from './PaymentCard/PaymentAmountCard';
import StripeLogo from '/public/stripe-logo.png';

const PaymentFormM = () => {
  //calling api
  const { isLoading: isReservationDetailsLoading } = useReservationFind();
  // usePaymentConfirmation();

  //get state
  const { reservationPaymentDetails } = usePaymentDetailsContext();
  const { userCred } = useUserCredContext();

  //client secrets state
  const [clientSecret, setClientSecret] = useState<string>('');
  const [holdPaymentClientSecret, setHoldPaymentClientSecret] = useState<string>('');
  //mobileApp check
  const [isApp, setIsApp] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<IPayment>({} as IPayment);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);
  //set transactionId
  const [trxId, setTrxId] = useState<string>('');
  //form state
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [cardHolderAddress, setCardHolderAddress] = useState<string>('');
  //error state
  const [cardError, setCardError] = useState<string>('');

  //call stripe elements
  const stripe = useStripe();
  const elements = useElements();

  // get the reservationId
  const { reservationId: reservationIdParam } = useParams<{ reservationId: string }>();
  //Destruct reservationPaymentDetails
  const {
    reservationId: reservationID,
    reservationStatus,
    paymentAmount = 0,
    paymentStatus,
    guestId,
    carListingId,
    revisedReservationId,
    depositAmount = 0,
    isPaymentTimeExpired,
    isHoldSuccess = false,
    isRevised,
    returnDate,
    reservedAt,
    pickupDate,
    holdDueAmount = 0,
  } = reservationPaymentDetails ?? {};
  const reservationId = parseInt(reservationIdParam) || reservationID;

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

  const isTravelCancelled = Object.values(EReservationStatus).includes(reservationStatus as EReservationStatus)
    ? reservationCancelledStatus?.includes(reservationStatus as EReservationStatus)
    : false;
  const isHoldFalse = isRevised || isHoldSuccess;
  const withHoldPayment = isHoldFalse ? (holdDueAmount > 0 ? true : false) : depositAmount > 0;
  const excessFee = holdDueAmount > 0 ? holdDueAmount : depositAmount;
  //Use Effect to get the client secret
  useEffect(() => {
    const { accessToken } = JSON.parse(localStorage.getItem('tashus') || '{}');
    const fetchReservationPaymentIntent = async () => {
      if (userCred?.loggedIn && userCred?.email && paymentAmount > 0 && paymentStatus !== 'paid' && !isTravelCancelled) {
        const payment = {
          reservationId: reservationId,
          guestId: guestId,
          amount: paymentAmount ?? 0,
          payment_method: 'stripe',
          currency: 'AUD',
          carListingId: carListingId,
          recentRevisedReservationId: revisedReservationId,
          excessFee: excessFee,
        };
        setPaymentData(payment);
        const paymentBody: IPaymentBody = { paymentData: payment, price: payment?.amount, holdPrice: payment?.excessFee, email: userCred?.email };
        try {
          const result = await createReservationPaymentIntent(withHoldPayment, paymentBody, accessToken);
          if (result?.status === 200) {
            setClientSecret(result?.data?.clientSecret);
            setHoldPaymentClientSecret(result?.data?.holdPaymentClientSecret);
          } else if (result?.status === 400) {
            return setCardError(result?.message);
          }
        } catch (error) {
          console.log('Payment Intent Error', error);
        }
      }
    };
    fetchReservationPaymentIntent();
  }, [reservationId, paymentAmount, userCred]);

  const handleSubmitWithHoldPayment = async (event: any) => {
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
    } else {
      setCardError('');
    }

    //----------------------------
    // confirming hold payment at first
    //----------------------------
    if (withHoldPayment) {
      if ((paymentData?.amount ?? 0) >= paymentData?.excessFee) {
        await confirmInitialThenHoldPayment(card, userCred, stripe);
      } else {
        await confirmHoldPayment(card, userCred, stripe);
      }
    } else {
      await confirmInitialPayment(card, userCred, stripe);
    }

    setIsPaymentProcessing(false);
  };

  const confirmInitialPayment = async (card: any, userCred: any, stripe: any) => {
    const { paymentIntent, error: paymentConfirmError } = await stripe.confirmCardPayment(clientSecret, {
      setup_future_usage: 'off_session',
      payment_method: {
        card: card,
        billing_details: {
          name: cardHolderName,
          email: userCred?.email,
          address: {
            line1: cardHolderAddress,
          },
        },
      },
    });

    if (paymentConfirmError) {
      setCardError(paymentConfirmError.message);
      setIsPaymentProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      setTrxId(paymentIntent?.id);
    }

    return;
  };

  const confirmOnlyHoldPayment = async (card: any, userCred: any, stripe: any) => {
    const { paymentIntent: holdPaymentIntent, error: holdPaymentConfirmError } = await stripe.confirmCardPayment(holdPaymentClientSecret, {
      setup_future_usage: 'off_session',
      payment_method: {
        card: card,
        billing_details: {
          name: cardHolderName,
          email: userCred?.email,
          address: {
            line1: cardHolderAddress,
          },
        },
        // metadata: JSON.stringify({ paymentData: payment }) as any
      },
    });

    if (holdPaymentConfirmError) {
      setCardError(holdPaymentConfirmError.message);
      setIsPaymentProcessing(false);
      return;
    }

    if (holdPaymentIntent.status === 'requires_capture') {
      // setTrxId(paymentIntent?.id);
      // await confirmInitialPayment(card, userCred, stripe);
    }

    return;
  };

  const confirmHoldPayment = async (card: any, userCred: any, stripe: any) => {
    const { paymentIntent: holdPaymentIntent, error: holdPaymentConfirmError } = await stripe.confirmCardPayment(holdPaymentClientSecret, {
      setup_future_usage: 'off_session',
      payment_method: {
        card: card,
        billing_details: {
          name: cardHolderName,
          email: userCred?.email,
          address: {
            line1: cardHolderAddress,
          },
        },
        // metadata: JSON.stringify({ paymentData: payment }) as any
      },
    });

    if (holdPaymentConfirmError) {
      setCardError(holdPaymentConfirmError.message);
      setIsPaymentProcessing(false);
      return;
    }

    if (holdPaymentIntent.status === 'requires_capture') {
      // setTrxId(paymentIntent?.id);
      await confirmInitialPayment(card, userCred, stripe);
    }

    return;
  };

  const confirmInitialThenHoldPayment = async (card: any, userCred: any, stripe: any) => {
    const { paymentIntent, error: paymentConfirmError } = await stripe.confirmCardPayment(clientSecret, {
      setup_future_usage: 'off_session',
      payment_method: {
        card: card,
        billing_details: {
          name: cardHolderName,
          email: userCred?.email,
          address: {
            line1: cardHolderAddress,
          },
        },
        // metadata: JSON.stringify({ paymentData: payment }) as any
      },
    });

    if (paymentConfirmError) {
      setCardError(paymentConfirmError.message);
      setIsPaymentProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      setTrxId(paymentIntent?.id);
      await confirmOnlyHoldPayment(card, userCred, stripe);
    }

    return;
  };

  const isPaymentDisabled =
    isPaymentProcessing || (paymentAmount ?? 0) <= 0 || cardHolderName === '' || cardHolderAddress === '' || !stripe || !clientSecret || !!trxId;
  return (
    <div className="relative flex flex-col justify-center items-center lg:min-h-screen bg-cover bg-center p-2 md:p-0 md:-mt-28 -lg:mt-16 overflow-auto">
      {/* Background image layer */}
      <div className="absolute inset-0 bg-payment-background bg-cover bg-center opacity-60 -z-10 " />

      {/* Content layer */}
      {isReservationDetailsLoading ? (
        <AdditionalFeeSkeleton />
      ) : (
        <div className="relative flex flex-col justify-center items-center md:scale-90 lg:scale-75 2xl:scale-90 lg:mt-20 md:mt-10 sm:mt-6">
          {/* Countdown card */}
          <CountdownCard
            reservedAt={reservedAt}
            paymentStatus={trxId ? 'Paid' : `${separateAndCapitalize(paymentStatus)}`}
            isPaymentTimeExpired={isPaymentTimeExpired ?? false}
          />

          {/* Additional details */}
          <div className="w-full md:w-[500px] relative z-10 opacity-100 p-4 bg-white border border-solid border-primary shadow-md shadow-fuchsia-400 rounded-lg mt-4">
            <BasicInfoCard
              reservationId={reservationId}
              startDate={pickupDate}
              endDate={returnDate}
              paymentStatus={trxId ? 'Paid' : `${separateAndCapitalize(paymentStatus)}`}
              userId={userCred?.userId ?? ''}
              isPaymentTimeExpired={isPaymentTimeExpired ?? false}
            />
            <PaymentAmountCard withHoldPayment={withHoldPayment} depositAmount={excessFee} paymentAmount={paymentAmount ?? 0} />
            <section>
              {isPaymentTimeExpired || paymentStatus === 'paid' || isTravelCancelled ? (
                <>
                  <div className="flex justify-center items-center">
                    <Alert severity="info" className="w-full  bg-cyan-100">
                      {isTravelCancelled
                        ? 'The travel has been cancelled.'
                        : isPaymentTimeExpired && paymentStatus === 'pending'
                        ? 'The payment time has been expired.'
                        : paymentStatus === 'paid'
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
                  {stripe && elements && clientSecret ? (
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
                          disabled={!!trxId}
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
                          disabled={!!trxId}
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
                    {cardError && <p className="text-error">{cardError}</p>}

                    {/* After Successful Payment */}
                    {trxId && (
                      <div className="text-center flex flex-col gap-1">
                        <span className="text-primary">Payment Successful!</span>
                        <span className="text-black flex flex-col gap-2">
                          <span className="font-semibold">Your Transaction Id: {trxId}</span>
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
                      onClick={handleSubmitWithHoldPayment}
                      className="w-full mt-4 normal-case text-md md:text-lg"
                      color="success"
                      variant="contained"
                      // startIcon={isPaymentProcessing ? '' : <MdBolt />}
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

export default PaymentFormM;
