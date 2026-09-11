'use client';
import useMediumForTravelDetails from '@/hooks/responsive/useMediumForTravelDetails';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Button, CircularProgress } from '@mui/material';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdBolt } from 'react-icons/md';
import StripeLogo from '/public/stripe-logo.png';

const PaymentForm = () => {
  const [cardError, setCardError] = useState<any>();
  const [clientSecret, setClientSecret] = useState('');
  const [holdPaymentClientSecret, setHoldPaymentClientSecret] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  // new codes

  const { reservationId: reservationIdParam } = useParams<{ reservationId: string }>();
  const searchParams = useSearchParams();
  const [hide, setHide] = useState<string>('');
  const [withHoldPayment, setWithHoldPayment] = useState<boolean>(false);
  const [reservationId, setReservationId] = useState<number>();
  const [reservationDetails, setReservationDetails] = useState<object | any>();
  const [paymentBtnDisabled, setPaymentBtnDisabled] = useState(true);
  const [encrypted, setEncrypted] = useState(false);
  const [revisedPrice, setRevisedPrice] = useState<object | any>();
  const [recentRevisedReservationId, setRecentRevisedReservationId] = useState<number>();
  const [previousPaymentStatus, setPreviousPaymentStatus] = useState('paid');
  const [reservationExpired, setReservationExpired] = useState<boolean>(false);
  const [trxId, setTrxId] = useState<any>();
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [cardHolderAddress, setCardHolderAddress] = useState<string>('');
  const [requiredError, setRequiredError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // redirection updates
  useEffect(() => {
    if (searchParams.get('from') === 'redirection') {
      setHide('hidden');
    } else {
      setHide('');
    }
  }, [searchParams]);

  // new codes ends

  useEffect(() => {
    // Access information about the previous route (if available)

    // Create PaymentIntent as soon as the page loads
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);
    if (!reservationDetails || !revisedPrice) {
      return;
    }
    const payment = {
      reservationId: reservationDetails?.reservationId,
      guestId: reservationDetails?.guestId,
      amount: revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice,
      payment_method: 'stripe',
      currency: reservationDetails?.basePrice?.currency,
      carListingId: reservationDetails?.carListingId,
      recentRevisedReservationId,
      excessFee: reservationDetails?.depositAmount ?? 0,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${withHoldPayment ? 'stripe-hold-with-payment' : 'stripe-element'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${userCred.accessToken}`,
      },
      body: JSON.stringify({ paymentData: payment, price: payment?.amount, holdPrice: payment?.excessFee, email: userCred?.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === 200) {
          setClientSecret(data?.data?.clientSecret);
          setHoldPaymentClientSecret(data?.data?.holdPaymentClientSecret);
        }
        if (data?.status === 400) {
          return setRequiredError(data?.message);
        }
      })
      .catch((e) => console.error(e));
  }, [reservationDetails, revisedPrice]);

  const handleSubmit = async (event: any) => {
    setIsLoading(true);
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);
    if (cardHolderName === '' || cardHolderAddress === '') {
      setRequiredError('Please fill out all information');
      setIsLoading(false);
      return;
    } else {
      setRequiredError('');
    }

    event.preventDefault();
    const payment = {
      reservationId: reservationDetails?.reservationId,
      guestId: reservationDetails?.guestId,
      amount: revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice,
      payment_method: 'stripe',
      currency: reservationDetails?.basePrice?.currency,
      carListingId: reservationDetails?.carListingId,
      recentRevisedReservationId,
    };
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      setIsLoading(false);
      return;
    }

    //----------------------------
    // creating payment method
    //----------------------------
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.error(error.message);
      setCardError(error.message);
      setIsLoading(false);
    } else {
      setCardError('');
    }

    setSuccess('');
    setProcessing(true);

    //----------------------------
    // confirming payment
    //----------------------------
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
      setProcessing(false);
      setIsLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      setTrxId(paymentIntent?.id);
    }

    setProcessing(false);
    setIsLoading(false);
  };

  const handleSubmitWithHoldPayment = async (event: any) => {
    setIsLoading(true);
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);
    if (cardHolderName === '' || cardHolderAddress === '') {
      setRequiredError('Please fill out all information');
      setIsLoading(false);
      return;
    } else {
      setRequiredError('');
    }

    event.preventDefault();
    const payment = {
      reservationId: reservationDetails?.reservationId,
      guestId: reservationDetails?.guestId,
      amount: revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice,
      payment_method: 'stripe',
      currency: reservationDetails?.basePrice?.currency,
      carListingId: reservationDetails?.carListingId,
      recentRevisedReservationId,
      excessFee: reservationDetails?.depositAmount ?? 0,
    };
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      setIsLoading(false);
      return;
    }

    //----------------------------
    // creating payment method
    //----------------------------
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.error(error.message);
      setCardError(error.message);
      setIsLoading(false);
    } else {
      setCardError('');
    }

    setSuccess('');
    setProcessing(true);

    //----------------------------
    // confirming hold payment at first
    //----------------------------
    if (withHoldPayment) {
      if (payment?.amount >= payment?.excessFee) {
        await confirmInitialThenHoldPayment(card, userCred, stripe);
      } else {
        await confirmHoldPayment(card, userCred, stripe);
      }
      // await confirmHoldPayment(card, userCred, stripe);
    } else {
      await confirmInitialPayment(card, userCred, stripe);
    }

    setProcessing(false);
    setIsLoading(false);
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
        // metadata: JSON.stringify({ paymentData: payment }) as any
      },
    });

    if (paymentConfirmError) {
      setCardError(paymentConfirmError.message);
      setProcessing(false);
      setIsLoading(false);
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
      setProcessing(false);
      setIsLoading(false);
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
      setProcessing(false);
      setIsLoading(false);
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
      setProcessing(false);
      setIsLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      setTrxId(paymentIntent?.id);
      await confirmOnlyHoldPayment(card, userCred, stripe);
    }

    return;
  };

  // new codes

  useEffect(() => {
    const reservationId = parseInt(reservationIdParam);
    // console.log(reservationId);
    if (reservationId) {
      setReservationId(reservationId);
    }
  }, [reservationIdParam]);

  useEffect(() => {
    fetchReservationDetails();
  }, [reservationId, encrypted]);

  useEffect(() => {
    if (revisedPrice?.paymentStatus === 'pending' && previousPaymentStatus !== 'pending') {
      setPaymentBtnDisabled(false);
    } else {
      setPaymentBtnDisabled(true);
    }
  }, [reservationDetails, revisedPrice, previousPaymentStatus]);

  const fetchReservationDetails = async () => {
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);
    if (!reservationId) {
      return;
    }
    try {
      const res: any = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reservation/find/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${userCred.accessToken}`,
        },
      });

      // console.log(res);
      if (res) {
        // console.log(res?.data?.revisedReservations);
        if (res?.data?.revisedReservations.length > 0) {
          setWithHoldPayment(false);
          const revisedReservationsList = res?.data?.revisedReservations;
          revisedReservationsList.sort((a: any, b: any) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateB.getTime() - dateA.getTime(); // Compare in descending order.
          });
          setRevisedPrice(revisedReservationsList[0]);
          setRecentRevisedReservationId(revisedReservationsList[0]?._id);
          if (revisedReservationsList?.length > 1) {
            if (isTimeDifferenceGreaterThan30Minutes(revisedReservationsList[1].createdAt)) {
              setPaymentBtnDisabled(false);
            } else {
              setPreviousPaymentStatus(revisedReservationsList[1].paymentStatus);
            }
          }
          // console.log(revisedReservationsList);
        } else {
          // console.log(res?.data);
          if (res?.data?.depositAmount && res?.data?.depositAmount > 0) {
            setWithHoldPayment(true);
          } else {
            setWithHoldPayment(false);
          }
          if (res?.data?.additionalPaymentInfo?.cardAmountUsed > 0 || res?.data?.additionalPaymentInfo?.voucherAmountUsed) {
            setRevisedPrice({ ...res?.data, afterDiscountAmount: res?.data?.additionalPaymentInfo?.cardAmountUsed });
          } else {
            setRevisedPrice(res?.data);
          }
        }
        setReservationDetails(res?.data);
        setPaymentBtnDisabled(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dateConverter = (dateString: string) => {
    // const isoDateString: string = "2023-10-13T03:00:53.561Z";
    const dateObject: Date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Use 12-hour format with AM/PM
    };

    const formattedDate: string = dateObject.toLocaleDateString('en-US', options);
    // console.log('time', formattedDate);
    return formattedDate;
  };

  // reservation expired checker
  const isTimeDifferenceGreaterThan30Minutes = (givenISODate: string): boolean => {
    const givenDate = new Date(givenISODate);
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate.getTime() - givenDate.getTime();

    // Convert the time difference to minutes
    const timeDifferenceInMinutes = timeDifference / (1000 * 60);

    // Check if the time difference is greater than 30 minutes
    return timeDifferenceInMinutes > 30;
  };

  useEffect(() => {
    const currentTime = new Date().toISOString();
    if (revisedPrice && revisedPrice?.createdAt && isTimeDifferenceGreaterThan30Minutes(revisedPrice?.createdAt)) {
      setReservationExpired(true);
    }
  }, [revisedPrice]);

  useEffect(() => { }, [paymentBtnDisabled, reservationExpired, stripe, clientSecret]);

  // new codes
  const isMedium = useMediumForTravelDetails();

  return (
    <div>
      <div
        className={`md:w-2/3 lg:w-3/5 mx-auto grid-cols-2 lg:grid-cols-3 lg:grid  bg-white shadow-lg shadow-secondary rounded-lg md:p-4 px-2 w-full justify-between items-center md:my-6 mb-3 hidden`}
      >
        <div className="relative col-span-2 lg:col-span-1 lg:mr-4 mt-4 lg:mt-0 mx-2 lg:mx-0">
          {/* <span className="flex justify-start w-2/3 my-2 bg-primary text-white p-2 rounded-r-3xl">XYZ's Reservation</span> */}
          <div
            className="z-10 relative bg-primary text-white text-sm p-2 w-full flex flex-col"
            style={{
              // clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)',
              clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
              zIndex: 100,
            }}
          >
            <span className="m-0">Reservation Id : {reservationId} </span>

            {/* {updatedTravelData?.isUserGuest ? 'Your Reservation' : `${updatedTravelData?.oppositeUserInfo?.lastName}'s Reservation`} */}
          </div>
        </div>

        <div className="col-span-1 flex justify-center items-center my-2 lg:my-0">
          <div className="flex justify-center">
            <Image src="/icons/FromTo/EnabledFromTo.svg" alt="FromTo" width={100} height={80} className="object-cover rounded-lg w-auto h-auto m-1" />
            {/* <Image src="/icons/FromTo/EnabledFromTo.svg" alt="FromTo" width={300} height={200} className="object-cover rounded-lg w-auto h-auto m-1" /> */}
          </div>

          <div className="flex font-bold lg:gap-4 md:gap-2 gap-1">
            <div className={``}>
              <p className="m-0 lg:text-sm text-xs">From</p>
              <p className="m-0 lg:text-sm text-xs">To</p>
            </div>
            <div className="md:font-semibold">
              <p className="m-0 lg:text-sm text-xs">{formatFullDateTimeUtc(revisedPrice?.newStartDate || revisedPrice?.startDate)}</p>
              <p className="m-0 lg:text-sm text-xs">{formatFullDateTimeUtc(revisedPrice?.newEndDate || revisedPrice?.endDate)}</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col justify-center items-end  my-2 lg:my-0">
          {withHoldPayment ? (
            <>
              <h3 className="p-0 m-0">
                Payable:{' '}
                <span className="font-bold text-green-700">
                  {' '}
                  {/* ${(revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice) - reservationDetails?.depositAmount} */}
                  ${revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice}
                </span>
              </h3>
              <h3 className="p-0 m-0">
                On Hold: <span className="font-bold text-green-700"> ${reservationDetails?.depositAmount}</span>
              </h3>
            </>
          ) : (
            <h3 className="text-xl lg:text-2xl p-0 m-0">
              Total:{' '}
              <span className="font-bold text-green-700">
                {' '}
                ${revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice}
              </span>
            </h3>
          )}
          {/* <Link
                        href={`/support/support-center/${reservationId}?role=${params['travel-id'] ? 'guest' : 'host'}&from=${params['travel-id'] ? 'travel' : 'reservation'
                            }`}
                    // target="_blank"
                    >
                        <Button className="search text-white normal-case font-bold text-md" variant="contained" startIcon={<BiSupport />}>
                            Support
                        </Button>
                    </Link> */}
        </div>
      </div>
      <div
        className={`w-full md:w-2/3 lg:w-3/5 mx-auto grid-cols-3 grid  bg-white shadow-lg shadow-secondary rounded-lg justify-between items-center md:my-6 mb-3 lg:hidden overflow-hidden`}
      >
        <div className="relative col-span-2">
          {/* <span className="flex justify-start w-2/3 my-2 bg-primary text-white p-2 rounded-r-3xl">XYZ's Reservation</span> */}
          <div
            className="z-10 relative bg-primary text-white text-sm p-2 w-full flex flex-col"
            style={{
              // clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)',
              clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
              zIndex: 100,
            }}
          >
            <span className="ml-4">Reservation Id : {reservationId} </span>
            <hr className="w-11/12" />
            <div className="ml-4">
              {/* <div className="flex justify-center">
                                <Image src="/icons/FromTo/EnabledFromTo.svg" alt="FromTo" width={100} height={80} className="object-cover rounded-lg w-auto h-auto m-1" />
                            </div> */}

              <div className="flex font-bold lg:gap-4 md:gap-2 gap-1" style={{ fontSize: '10px' }}>
                <div className={``}>
                  <p className="m-0 ">From </p>
                  <p className="m-0 ">To </p>
                </div>
                <div className="font-normal">
                  <p className="m-0">| {formatFullDateTimeUtc(revisedPrice?.newStartDate || revisedPrice?.startDate)}</p>
                  <p className="m-0">| {formatFullDateTimeUtc(revisedPrice?.newEndDate || revisedPrice?.endDate)}</p>
                </div>
              </div>
            </div>

            {/* {updatedTravelData?.isUserGuest ? 'Your Reservation' : `${updatedTravelData?.oppositeUserInfo?.lastName}'s Reservation`} */}
          </div>
        </div>

        <div className="col-span-1 flex flex-col justify-center items-end my-2 lg:my-0">
          {withHoldPayment ? (
            <>
              <h3 className="text-xs md:text-base p-0 m-0 mr-2">
                Payable:{' '}
                <span className="font-bold text-green-700">
                  {' '}
                  {/* ${(revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice) - reservationDetails?.depositAmount} */}
                  ${revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice}
                </span>
              </h3>
              <h3 className="text-xs md:text-base p-0 m-0 mr-2">
                On Hold: <span className="font-bold text-green-700"> ${reservationDetails?.depositAmount}</span>
              </h3>
            </>
          ) : (
            <h3 className="text-sm md:text-base p-0 m-0">
              Total:{' '}
              <span className="font-bold text-green-700">
                {' '}
                ${revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice}
              </span>
            </h3>
          )}

          {/* <Link
                        href={`/support/support-center/${reservationId}?role=${params['travel-id'] ? 'guest' : 'host'}&from=${params['travel-id'] ? 'travel' : 'reservation'
                            }`}
                    // target="_blank"
                    >
                        <Button className="search text-white normal-case font-bold text-md" variant="contained" startIcon={<BiSupport />}>
                            Support
                        </Button>
                    </Link> */}
        </div>
      </div>
      {/* // aftr new codrs */}
      <Container className="w-full md:w-2/3 lg:w-3/5 mx-auto shadow-xl p-0 my-0 lg:my-10">
        <div className="w-full py-3 bg-green-200">
          {/* <h3 className="text-2xl text-center">Reservation ID: {reservationId}</h3> */}
          {/* <p className='text-xl text-center m-0'>{reservationDetails?.carInfo?.car?.make} {reservationDetails?.carInfo?.car?.model}</p> */}
          {trxId ? (
            <p className="text-xl text-center m-0">Status: Paid</p>
          ) : (
            <p className="text-xl text-center m-0">
              Status: {(revisedPrice?.paymentStatus || reservationDetails?.reservationStatus) === 'pending' ? 'Pending' : ''}
            </p>
          )}
        </div>
        <section>
          {stripe && elements && clientSecret &&
            <>
              <div className="w-10/12 mx-auto flex flex-col justify-center items-center text-primary pt-6">
                <TextField
                  name="name"
                  className="w-full bg-white"
                  required
                  id="name"
                  label="Card holder name"
                  onChange={(e) => {
                    setRequiredError('');
                    setCardHolderName(e.target.value);
                  }}
                  disabled={trxId}
                // defaultValue="Hello World"
                />
                <TextField
                  name="address"
                  className="w-full bg-white mt-5"
                  required
                  id="address"
                  label="Billing address"
                  onChange={(e) => {
                    setRequiredError('');
                    setCardHolderAddress(e.target.value);
                  }}
                  disabled={trxId}
                // defaultValue="Hello World"
                />
              </div>
              {/* <div className="text-center">
                        <h3 className="text-3xl p-0 m-0">
                            Total: <span className="font-bold text-green-700"> ${revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice}</span>
                        </h3>
                    </div> */}
              <div className="w-10/12 mt-5 mx-auto">
                <form onSubmit={handleSubmitWithHoldPayment}>
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
                  {/* <div className='flex justify-end'>
                                <button className='btn btn-primary py-1 hover:bg-black px-10' type="submit" disabled={!stripe || !clientSecret} >
                                    Pay
                                </button>
                            </div> */}
                </form>
                <p className="mt-4 text-neutral font-bold">{cardError ? cardError : undefined}</p>
                {trxId && (
                  <div className="text-center">
                    <p className="text-primary">Payment Successful!</p>
                    <p className="text-black ">
                      <span className="font-semibold">Your Transaction Id:</span> {trxId}
                      {hide === 'hidden' && <span>Please close the tab and return to App for more details</span>}
                    </p>
                  </div>
                )}
              </div>
            </>
          }
          <div className="py-2 flex flex-col justify-center items-center gap-0">
            {reservationExpired && <p className="text-error">This reservation has expired</p>}
            {requiredError && <p className="text-error">{requiredError}</p>}
            {cardError && <p className="text-error">{cardError}</p>}

            {trxId && reservationDetails && hide !== 'hidden' && (
              <Link
                className="mb-4"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${reservationDetails?.guestId}/travels/details/${reservationDetails?.reservationId}`}
              >
                <Button className="w-60" variant="contained">
                  View Travels Details
                </Button>
              </Link>
            )}
            <Button
              disabled={paymentBtnDisabled || !stripe || !clientSecret || trxId || isLoading || reservationExpired}
              onClick={handleSubmitWithHoldPayment}
              className="w-60"
              variant="contained"
              startIcon={isLoading ? '' : <MdBolt />}
            >
              {isLoading ? <CircularProgress color="inherit" size={22} /> : 'Pay Now'}
            </Button>
          </div>
          <div className="w-10/12 mx-auto flex justify-center items-center">
            <Image className="w-10/12 h-32 lg:h-auto" src={StripeLogo} alt="stripe logo"></Image>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default PaymentForm;
