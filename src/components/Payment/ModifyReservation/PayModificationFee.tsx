import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { createPaymentIntent } from '@/hooks/payment/additional-fee-payment/useServerPaymentIntent';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { PaymentDataInfo } from '@/types/payment/additionalFeeReservation';
import { PaymentCategory } from '@/types/user-profile/transactionsTypes';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdBolt } from 'react-icons/md';
import AdditionalFeeFormSkeleton from '../PayAdditionalFee/AdditionalFeeFormSkeleton';
import AdditionalFeeSkeleton from '../PayAdditionalFee/AdditionalFeeSkeleton';
import ReservationInfoCard from '../PayAdditionalFee/ReservationInfoCard';
import StripeLogo from '/public/stripe-logo.png';
const PayModificationFee = () => {
  const { isLoading } = useTravelDetails();
  const { userCred } = useUserCredContext();
  const { updatedTravelData } = useTravelContext();
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
  const [paymentCategory, setPaymentCategory] = useState<string>('');
  //mobile redirection
  useEffect(() => {
    if (searchParams.get('from') === 'redirection') {
      setIsApp(true);
    }
    //Category
    const category = searchParams.get('category');
    // console.log('Category', category);
    if (category === PaymentCategory.ChangedVehicle || category === PaymentCategory.UpgradedCoverage) {
      setPaymentCategory(category);
    } else {
      setPaymentCategory('');
    }
  }, [searchParams]);

  const isVehiclePayable =
    updatedTravelData?.revisedVehiclePaymentStatus === ReservationPaymentStatusEnum.Pending &&
    (updatedTravelData?.revisedVehiclePayableAmount ?? 0) > 0;
  const isCoveragePayable =
    updatedTravelData?.revisedCoveragePaymentStatus === ReservationPaymentStatusEnum.Pending &&
    (updatedTravelData?.revisedCoveragePayableAmount ?? 0) > 0;

  const isVehiclePaid = updatedTravelData?.revisedVehiclePaymentStatus === ReservationPaymentStatusEnum.Paid;
  const isCoveragePaid = updatedTravelData?.revisedCoveragePaymentStatus === ReservationPaymentStatusEnum.Paid;

  const isPaid =
    paymentCategory === PaymentCategory.ChangedVehicle
      ? isVehiclePaid
      : paymentCategory === PaymentCategory.UpgradedCoverage
      ? isCoveragePaid
      : false;
  const paidText =
    paymentCategory === PaymentCategory.ChangedVehicle
      ? 'Vehicle replacement'
      : paymentCategory === PaymentCategory.UpgradedCoverage
      ? 'Upgraded coverage'
      : '';

  const dueAmount =
    paymentCategory === PaymentCategory.ChangedVehicle
      ? updatedTravelData?.revisedVehiclePayableAmount ?? 0
      : paymentCategory === PaymentCategory.UpgradedCoverage
      ? updatedTravelData?.revisedCoveragePayableAmount ?? 0
      : 0;
  const description =
    paymentCategory === PaymentCategory.ChangedVehicle
      ? 'Replacement Vehicle fee payment'
      : paymentCategory === PaymentCategory.UpgradedCoverage
      ? 'Upgraded Coverage fee payment'
      : '';
  //calling api for payment intent
  useEffect(() => {
    const { accessToken } = JSON.parse(localStorage.getItem('tashus') || '{}');
    // console.log('Access Token', accessToken);
    const handleCreatePaymentIntent = async () => {
      const modificationPaymentData = {
        guestId: userCred?.userId ?? '',
        email: userCred?.email ?? '',
        dueAmount: parseFloat((dueAmount ?? 0)?.toFixed(2)),
        currency: 'AUD',
        reservationId: Number(updatedTravelData?.reservationId) ?? 0,
        description: description,
        payment_category: paymentCategory,
        request_origin: isApp ? 'mobile' : 'web',
      };
      setAdditionalFeeMetaData(modificationPaymentData);
      try {
        const result = await createPaymentIntent(modificationPaymentData, accessToken);
        setClientSecret(result?.decryptedClientSecret ?? '');
      } catch (error) {
        console.log('Payment Intent Error', error);
      }
    };
    if ((isVehiclePayable || isCoveragePayable) && dueAmount > 0 && !!paymentCategory && !!accessToken) {
      handleCreatePaymentIntent();
    }
  }, [updatedTravelData]);

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
          email: userCred?.email,
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

  // console.log('Stripe', stripe);
  // console.log('Elements', elements);
  // console.log('Client Secret', clientSecret);

  const isPaymentDisabled = paymentProcessing || cardHolderName === '' || cardHolderAddress === '' || !stripe || !clientSecret || isPaymentSuccess;

  return (
    <div className={`flex flex-col gap-4 items-center justify-center my-6 xl:my-10 lg:min-h-[60vh]`}>
      {isLoading || Number.isNaN(dueAmount) ? (
        <AdditionalFeeSkeleton />
      ) : (
        <>
          <ReservationInfoCard isModification={true} dueAmount={dueAmount} />
          <div className="w-full md:w-[841px] bg-white rounded-lg p-2 md:p-4 shadow-md shadow-secondary">
            {isPaid ? (
              <div className="flex flex-col items-center justify-center">
                <Alert severity="info" className="w-full m-6 bg-cyan-100">
                  {`${paidText} fee is already Paid. ${isApp ? 'Please close the tab and return to App for more details' : ''}`}
                </Alert>
                {!isApp && (
                  <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/travels/details/${updatedTravelData?.reservationId}`}>
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

export default PayModificationFee;
