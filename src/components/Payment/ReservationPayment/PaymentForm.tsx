'use client';
import { usePaymentDetailsContext } from '@/context/PaymentDetailsProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { createReservationPaymentIntent } from '@/hooks/payment/reservation-payment/useReservationPaymentIntent';
import { useReservationFind } from '@/hooks/support-center/support-ticket/support-reservation/useReservationFind';
import { IPayment, IPaymentBody } from '@/types/payment/reservationPayment';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdBolt } from 'react-icons/md';
import AdditionalFeeFormSkeleton from '../PayAdditionalFee/AdditionalFeeFormSkeleton';
import AdditionalFeeSkeleton from '../PayAdditionalFee/AdditionalFeeSkeleton';
import PaymentInfoCard from './PaymentCard/PaymentInfoCard';
import StripeLogo from '/public/stripe-logo.png';
import { separateAndCapitalize } from '@/utils/Functions/randomCommonFn';

const PaymentForm = () => {
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
  const reservationId = parseInt(reservationIdParam) || parseInt(reservationPaymentDetails?.reservationId?.toString());

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
      if (
        userCred?.loggedIn &&
        userCred?.email &&
        (reservationPaymentDetails?.paymentAmount ?? 0) > 0 &&
        reservationPaymentDetails?.paymentStatus !== 'paid'
      ) {
        const payment = {
          reservationId: reservationPaymentDetails?.reservationId,
          guestId: reservationPaymentDetails?.guestId,
          amount: reservationPaymentDetails?.paymentAmount ?? 0,
          payment_method: 'stripe',
          currency: 'AUD',
          carListingId: reservationPaymentDetails?.carListingId,
          recentRevisedReservationId: reservationPaymentDetails?.revisedReservationId,
          excessFee: reservationPaymentDetails?.depositAmount ?? 0,
        };
        setPaymentData(payment);
        const withHoldPayment = reservationPaymentDetails?.isRevised ? false : reservationPaymentDetails?.depositAmount > 0;
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
  }, [reservationPaymentDetails?.reservationId, reservationPaymentDetails?.paymentAmount, userCred]);

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
    const withHoldPayment = reservationPaymentDetails?.isRevised ? false : reservationPaymentDetails?.depositAmount > 0;

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
    isPaymentProcessing ||
    (reservationPaymentDetails?.paymentAmount ?? 0) <= 0 ||
    cardHolderName === '' ||
    cardHolderAddress === '' ||
    !stripe ||
    !clientSecret ||
    !!trxId;
  return (
    <div className="flex flex-col justify-center items-center lg:min-h-screen">
      {isReservationDetailsLoading ? (
        <AdditionalFeeSkeleton />
      ) : (
        <>
          <PaymentInfoCard
            reservationId={reservationId}
            withHoldPayment={reservationPaymentDetails?.isRevised ? false : reservationPaymentDetails?.depositAmount > 0}
            startDate={reservationPaymentDetails?.pickupDate}
            endDate={reservationPaymentDetails?.returnDate}
            depositAmount={reservationPaymentDetails?.depositAmount}
            paymentAmount={reservationPaymentDetails?.paymentAmount ?? 0}
          />
          <div className="w-full md:w-2/3 lg:w-3/5 lg:max-w-[1024px] bg-white shadow-lg shadow-secondary rounded-lg my-8">
            {/* Status(Pending, Paid) Section */}
            <div className="w-full flex justify-center items-center py-3 bg-green-200 rounded-t-lg">
              {trxId ? (
                <span className=" text-sm md:text-xl">Status: Paid</span>
              ) : (
                <span className="text-sm md:text-xl capitalize">Status: {separateAndCapitalize(reservationPaymentDetails?.paymentStatus)}</span>
              )}
            </div>
            <section>
              {reservationPaymentDetails?.isPaymentTimeExpired || reservationPaymentDetails?.paymentStatus === 'paid' ? (
                <>
                  <div className="flex justify-center items-center">
                    <Alert severity="info" className="w-full m-6 bg-cyan-100">
                      {reservationPaymentDetails?.isPaymentTimeExpired && reservationPaymentDetails?.paymentStatus === 'pending'
                        ? 'The payment time has been expired'
                        : reservationPaymentDetails?.paymentStatus === 'paid'
                        ? `This Reservation is Already Paid.  ${isApp ? 'Please close the tab and return to App for more details' : ''}`
                        : ''}
                    </Alert>
                  </div>
                  <div className="flex justify-center items-center">
                    {reservationPaymentDetails?.paymentStatus === 'paid' && !isApp && (
                      <Link
                        href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${reservationPaymentDetails?.guestId}/travels/details/${reservationPaymentDetails?.reservationId}`}
                      >
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
                      <div className="flex flex-col gap-4 my-2 p-4">
                        <TextField
                          name="name"
                          required
                          id="name"
                          label="Card holder name"
                          onChange={(e) => {
                            setCardHolderName(e.target.value);
                          }}
                          disabled={!!trxId}
                        />
                        <TextField
                          name="address"
                          required
                          id="address"
                          label="Billing address"
                          onChange={(e) => {
                            setCardHolderAddress(e.target.value);
                          }}
                          disabled={!!trxId}
                        />
                        <CardElement
                          className="px-3 lg:px-5 py-[0.93rem] rounded-md bg-white h-14 border-solid border-[1px] border-gray-300"
                          onChange={() => setCardError('')}
                          options={{
                            hidePostalCode: true,
                            style: {
                              base: {
                                fontSize: '18px',
                                backgroundColor: 'white',

                                color: 'black',
                                '::placeholder': {
                                  color: 'grey',
                                },
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
                      <div className="text-center flex flex-col">
                        <span className="text-primary">Payment Successful!</span>
                        <span className="text-black flex flex-col gap-2">
                          <span className="font-semibold">Your Transaction Id: {trxId}</span>
                          {isApp ? (
                            <span>Please close the tab and return to App for more details</span>
                          ) : (
                            <Link
                              href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${reservationPaymentDetails?.guestId}/travels/details/${reservationPaymentDetails?.reservationId}`}
                            >
                              <Button className="normal-case my-4" variant="contained">
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
                      className="w-60"
                      variant="contained"
                      startIcon={isPaymentProcessing ? '' : <MdBolt />}
                    >
                      {isPaymentProcessing ? <CircularProgress color="inherit" size={22} /> : 'Pay Now'}
                    </Button>
                  </div>
                  {/* Stripe Logo */}
                  <div className="flex justify-center items-center my-2">
                    <Image className="w-1/2 h-1/2" src={StripeLogo} alt="stripe logo" />
                  </div>
                </>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentForm;
