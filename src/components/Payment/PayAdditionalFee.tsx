import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useGetAdditionalFeeDetails } from '@/hooks/payment/additional-fee-payment/useGetAdditionalFeeDetails';
import { createPaymentIntent } from '@/hooks/payment/additional-fee-payment/useServerPaymentIntent';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { PaymentDataInfo } from '@/types/payment/additionalFeeReservation';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdBolt } from 'react-icons/md';
import AdditionalFeeFormSkeleton from './PayAdditionalFee/AdditionalFeeFormSkeleton';
import AdditionalFeeSkeleton from './PayAdditionalFee/AdditionalFeeSkeleton';
import ReservationInfoCard from './PayAdditionalFee/ReservationInfoCard';
import StripeLogo from '/public/stripe-logo.png';
const PayAdditionalFee = () => {
  const { isLoading } = useGetAdditionalFeeDetails();
  const { additionalFeeReservationDetails } = useTravelContext();
  // const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const [isApp, setIsApp] = useState<boolean>(false);
  const [paymentProcessError, setPaymentProcessError] = useState<string>('');
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [cardHolderAddress, setCardHolderAddress] = useState<string>('');
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [additionalFeeMetaData, setAdditionalFeeMetaData] = useState<PaymentDataInfo>({} as PaymentDataInfo);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const { openSnackBar } = useSnackBarContext();
  const isIPadPro = useIPadProQuery();
  //mobile redirection
  useEffect(() => {
    if (searchParams.get('from') === 'redirection') {
      setIsApp(true);
    }
  }, [searchParams]);

  //calling api for payment intent
  useEffect(() => {
    const { accessToken } = JSON.parse(localStorage.getItem('tashus') || '{}');
    // console.log('Access Token', accessToken);
    const handleCreatePaymentIntent = async () => {
      const additionalFeePaymentData = {
        guestId: additionalFeeReservationDetails?.guestId,
        email: additionalFeeReservationDetails?.email,
        dueAmount: additionalFeeReservationDetails?.additionalFeeDueAmount,
        currency: 'AUD',
        reservationId: additionalFeeReservationDetails?.reservationId,
        description: 'Additional fees payment',
        payment_category: 'additional_fees',
        request_origin: isApp ? 'mobile' : 'web',
      };
      setAdditionalFeeMetaData(additionalFeePaymentData);
      try {
        // await createPaymentIntent({ additionalFeePaymentData });
        const result = await createPaymentIntent(additionalFeePaymentData, accessToken);
        if (result?.decryptedClientSecret) {
          // console.log('Decrypted Client Secret:', result?.decryptedClientSecret);
          setClientSecret(result.decryptedClientSecret);
        }
      } catch (error) {
        console.log('Payment Intent Error', error);
      }
    };
    if (!!additionalFeeReservationDetails && additionalFeeReservationDetails?.additionalFeeDueAmount > 0 && !!accessToken) {
      handleCreatePaymentIntent();
    }
  }, [additionalFeeReservationDetails]);

  const handleAdditionalFeePayment = async (event: any) => {
    setPaymentProcessing(true);
    if (cardHolderName === '' || cardHolderAddress === '') {
      setPaymentProcessError('Please fill out all information');
      setPaymentProcessing(false);
      return;
    }
    event.preventDefault();
    if (!stripe || !elements) {
      setPaymentProcessing(false);
      return;
    }
    const card = elements.getElement(CardElement);
    if (card === null) {
      setPaymentProcessing(false);
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
      console.error(error.message);
      setPaymentProcessError(error.message ?? '');
      setPaymentProcessing(false);
    } else {
      setPaymentProcessError('');
    }

    //----------------------------
    // confirming payment
    //----------------------------
    const { paymentIntent, error: paymentConfirmError } = await stripe.confirmCardPayment(clientSecret, {
      setup_future_usage: 'off_session',
      payment_method: {
        card: card,
        billing_details: {
          name: cardHolderName,
          email: additionalFeeReservationDetails?.email,
          address: {
            line1: cardHolderAddress,
          },
        },
        metadata: {
          ...additionalFeeMetaData,
        },
      },
    });

    if (paymentConfirmError) {
      console.log('Payment Confirm Error', paymentConfirmError);
      setPaymentProcessError(paymentConfirmError?.message ?? '');
      setPaymentProcessing(false);
      return;
    }
    if (paymentIntent.status === 'succeeded') {
      setIsPaymentSuccess(true);
      if (!isApp) {
        openSnackBar({
          message: `Payment Saved Successfully with transaction: ${paymentIntent?.id}`,
          severity: 'success',
          hideDuration: 3000,
        });
        setTimeout(() => {
          router.back();
        }, 3000);
      }
      // setTrxId(paymentIntent?.id);
    }
    setPaymentProcessing(false);
  };

  const isPaymentDisabled =
    paymentProcessing ||
    additionalFeeReservationDetails?.additionalFeeDueAmount <= 0 ||
    cardHolderName === '' ||
    cardHolderAddress === '' ||
    !stripe ||
    !clientSecret ||
    isPaymentSuccess;
  return (
    <div className={`flex flex-col gap-4 items-center justify-center my-6 xl:my-10 lg:min-h-[60vh]`}>
      {isLoading || Number.isNaN(additionalFeeReservationDetails?.additionalFeeDueAmount) ? (
        <AdditionalFeeSkeleton />
      ) : (
        <>
          <ReservationInfoCard />
          <div className="w-full md:w-[841px] bg-white rounded-lg p-2 md:p-4 shadow-md shadow-secondary">
            {additionalFeeReservationDetails?.additionalFeeDueAmount === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <Alert severity="info" className="w-full m-6 bg-cyan-100">
                  {`The Additional Fees are already Paid. ${isApp ? 'Please close the tab and return to App for more details' : ''}`}
                </Alert>
                {!isApp && (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${additionalFeeReservationDetails?.guestId}/travels/details/${additionalFeeReservationDetails?.reservationId}`}
                  >
                    <Button className="normal-case mb-6" variant="contained">
                      View Travels Details
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                {stripe && elements && clientSecret ? (
                  <>
                    <TextField
                      name="name"
                      size="small"
                      className="w-full rounded-md my-2"
                      required
                      id="name"
                      label="Card holder name"
                      onChange={(e) => {
                        setCardHolderName(e.target.value);
                      }}
                    />
                    <TextField
                      name="address"
                      size="small"
                      className="w-full rounded-md my-2"
                      required
                      id="address"
                      label="Billing address"
                      onChange={(e) => {
                        setCardHolderAddress(e.target.value);
                      }}
                    />
                    <CardElement
                      className="my-2 p-3 rounded-md border border-solid border-accent"
                      options={{
                        hidePostalCode: true,
                        disableLink: true,
                      }}
                    />
                    {!!paymentProcessError && <p className="text-justify text-error">{paymentProcessError}</p>}
                    {isApp && isPaymentSuccess && <Alert severity="info">Please close the tab and return to App for more details</Alert>}
                  </>
                ) : (
                  <AdditionalFeeFormSkeleton />
                )}
                <div className="flex justify-center items-center">
                  <Button
                    disabled={isPaymentDisabled}
                    onClick={handleAdditionalFeePayment}
                    className="normal-case px-20 my-2"
                    variant="contained"
                    startIcon={paymentProcessing ? '' : <MdBolt />}
                  >
                    {paymentProcessing ? <CircularProgress color="inherit" size={22} /> : 'Pay Now'}
                  </Button>
                </div>
                <div className="flex justify-center items-center">
                  <Image className="w-1/2 h-1/2" src={StripeLogo} alt="stripe logo" />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PayAdditionalFee;
