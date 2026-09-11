import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import BoltIcon from '@mui/icons-material/Bolt';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import axios from 'axios';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StripeLogo from '/public/stripe-logo.png';

const Payment = () => {
  const { reservationId: reservationIdParam } = useParams<{ reservationId: string }>();
  const searchParams = useSearchParams();
  const [reservationId, setReservationId] = useState<number>();
  const [reservationDetails, setReservationDetails] = useState<object | any>();
  const [paymentBtnDisabled, setPaymentBtnDisabled] = useState(true);
  const [encrypted, setEncrypted] = useState(false);
  const [revisedPrice, setRevisedPrice] = useState<object | any>();
  const [recentRevisedReservationId, setRecentRevisedReservationId] = useState<number>();
  const [previousPaymentStatus, setPreviousPaymentStatus] = useState('paid');
  const [reservationExpired, setReservationExpired] = useState<boolean>(false);

  useEffect(() => {
    const encodedAccessToken = searchParams.get('tatn') as string;
    const email = searchParams.get('em') as string;
    if (encodedAccessToken && email) {
      // console.log("encoded token ", encodedAccessToken);

      // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDhmZDdlNzQyOTdlYzE2YzUwNGUyZDQiLCJpYXQiOjE2OTgwNTUyMjYsImV4cCI6MTY5ODY2MDAyNn0.ESts5jwHzD7SnvqrMyppbd96RRj8ZSZ_fldJSswnFy8";
      // let result1 = '';
      // for (let i = 0; i < accessToken.length; i++) {
      //   const char = accessToken.charCodeAt(i);
      //   const keyChar = key.charCodeAt(i % key.length);
      //   const encryptedChar = char ^ keyChar;
      //   result1 += String.fromCharCode(encryptedChar);
      // }
      // result1 = encodeURIComponent(result1);
      // console.log(result1);

      // decode
      let result = '';
      const key = process.env.NEXT_PUBLIC_AT_SECRET as string;
      // const encryptedText = decodeURIComponent(encodedAccessToken);
      const encryptedText = encodedAccessToken;
      console.log(encryptedText);
      for (let i = 0; i < encryptedText.length; i++) {
        const encryptedChar = encryptedText.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const char = encryptedChar ^ keyChar;
        result += String.fromCharCode(char);
      }

      const tokenToJson = JSON.stringify({ accessToken: result, email: email });
      // console.log("res ", result);
      localStorage.setItem('tashus', tokenToJson);
      setEncrypted(!encrypted);
      // console.log(accessToken === result);
    }
  }, [searchParams]);

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
    if (revisedPrice?.paymentStatus === 'pending') {
      //removed checking previousPaymentStatus !== 'pending' to resolve button enabling issue when previous revision has payment pending status
      setPaymentBtnDisabled(false);
    } else {
      setPaymentBtnDisabled(true);
    }
  }, [reservationDetails, revisedPrice, previousPaymentStatus]);

  const handleCheckout = async () => {
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);
    if (!userCred) {
      return;
    }
    try {
      const payment = {
        reservationId: reservationDetails?.reservationId,
        guestId: reservationDetails?.guestId,
        amount: revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice,
        payment_method: 'stripe',
        currency: reservationDetails?.basePrice?.currency,
        carListingId: reservationDetails?.carListingId,
        recentRevisedReservationId,
      };
      // console.log(JSON.stringify(payment));
      // console.log('type', typeof (recentRevisedReservationId));
      // return;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/stripe-checkout`,
        { payment, email: userCred.email },
        {
          headers: {
            Authorization: `Bearer ${userCred.accessToken}`,
          },
        }
      );

      if (res) {
        const stripeCheckoutUrl = res?.data;

        window.open(stripeCheckoutUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          const revisedReservationsList = res?.data?.revisedReservations;
          revisedReservationsList.sort((a: any, b: any) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateB.getTime() - dateA.getTime(); // Compare in descending order.
          });
          setRevisedPrice(revisedReservationsList[0]);
          setRecentRevisedReservationId(revisedReservationsList[0]?._id);
          if (revisedReservationsList?.length > 1) {
            setPreviousPaymentStatus(revisedReservationsList[1].paymentStatus);
          }
          // console.log(revisedReservationsList);
        } else {
          // console.log(res?.data);
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

  return (
    <Container className="w-full md:w-1/2 lg:w-1/3 mx-auto shadow-xl p-0 my-0 lg:my-10">
      <div className="w-full py-3 bg-green-200">
        <h3 className="text-2xl text-center">Reservation ID: {reservationId}</h3>
        {/* <p className='text-xl text-center m-0'>{reservationDetails?.carInfo?.car?.make} {reservationDetails?.carInfo?.car?.model}</p> */}
        <p className="text-xl text-center">Status: {revisedPrice?.paymentStatus || reservationDetails?.reservationStatus}</p>
      </div>
      <section>
        <div className="w-full flex justify-center items-center mx-auto text-primary py-6">
          <ul>
            <li>
              From <span className="font-bold">{formatFullDateTimeUtc(revisedPrice?.newStartDate || revisedPrice?.startDate)}</span>
            </li>
            <li>
              To <span className="font-bold">{formatFullDateTimeUtc(revisedPrice?.newEndDate || revisedPrice?.endDate)}</span>
            </li>
          </ul>
        </div>
        <div className="text-center">
          <h3 className="text-3xl p-0 m-0">
            Total:{' '}
            <span className="font-bold text-green-700">
              {' '}
              ${revisedPrice?.afterDiscountAmount || revisedPrice?.basePrice?.payableAmount || revisedPrice?.basePrice?.totalPrice}
            </span>
          </h3>
        </div>
        <div className="py-6 flex flex-col justify-center items-center">
          {reservationExpired && <p className="text-error">This reservation has expired</p>}
          <Button disabled={paymentBtnDisabled || reservationExpired} onClick={handleCheckout} className="w-60" variant="contained">
            <BoltIcon /> Pay Now
          </Button>
        </div>
        <div className="w-full flex justify-center items-center">
          <Image className="w-11/12 h-32 lg:h-auto" src={StripeLogo} alt="stripe logo"></Image>
        </div>
      </section>
    </Container>
  );
};

export default Payment;
