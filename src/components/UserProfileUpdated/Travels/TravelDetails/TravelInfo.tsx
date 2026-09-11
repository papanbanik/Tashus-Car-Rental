'use client';

import CommonRating from '@/components/Common/CommonRating';
import CommonTooltip from '@/components/Common/CommonTooltip';
import AdditionalDriverModal from '@/components/Search/ReservationCheckout/Verification/AdditionalDriver/AdditionalDriverModal';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import useMediumForTravelDetails from '@/hooks/responsive/useMediumForTravelDetails';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { EPriceAdjustment, ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { PaymentMethod } from '@/types/user-profile/transactionsTypes';
import { calculateWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { toFormattedNumber } from '@/utils/Functions/randomCommonFn';
import { reservationPaymentMethod, reservationPendingStatus } from '@/utils/Lists/travelInfoList';
import { Button, IconButton, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { TiStar } from 'react-icons/ti';
import JourneyDark from '../../../../../public/icons/VehicleIcons/JourneyDark.svg';
import ReservationActions from '../../Reservations/ReservationDetails/ReservationActions';
import OppositeUserInfo from './OppositeUserInfo';
import TravelActions from './TravelActions';
import TravelSectionHeader from './TravelSectionHeader';

const TravelInfo = () => {
  const router = useRouter();
  // const params = useParams();
  const { travelId } = useParams<{ travelId: string }>();
  const pathName = usePathname();
  const isMedium = useMediumForTravelDetails();

  const { travelDetails } = useProfileInfoContext();
  const { data } = useTravelDetails();
  const { updatedTravelData, reservationInvoiceInfo } = useTravelContext();
  const { openModal } = useModalContext();
  //Destructed
  const { vehicleDeliveryFee, vehicleReturnFee, basePrice } = updatedTravelData ?? {};
  const { totalPrice, priceAdjustment } = basePrice ?? {};
  const totalDeliveryCost = (vehicleDeliveryFee ?? 0) + (vehicleReturnFee ?? 0);
  const paidTotal = totalPrice + totalDeliveryCost;
  const paidAmount = calculateWithPrecision(priceAdjustment?.adjustmentType === EPriceAdjustment.Decrease ? 'subtract' : 'add', [
    paidTotal,
    priceAdjustment?.amount ?? 0,
  ]);

  const daysDiffEndToCurrent = dayjs().diff(dayjs(travelDetails?.tripInformation?.endTime), 'day');

  const { paymentStatus } = updatedTravelData;
  const { rentDueAmount } = reservationInvoiceInfo;

  // const handlePayButton = () => {
  //   router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/search/${travelDetails?.carListingId}/payment/${params['travel-id']}`);
  // };

  const handleElementPayButton = () => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/search/${travelDetails?.carListingId}/payment/${travelId}`);
  };

  const disablePayButton = paymentStatus === ReservationPaymentStatusEnum.Pending && dayjs().diff(dayjs(updatedTravelData?.createdAt), 'minute') > 30;

  const handleDisplayDriver = () => {
    openModal({
      title: 'Additional Driver',
      modalWidth: 'md',
      content: <AdditionalDriverModal />,
    });
  };

  const hideAdditionalDriver =
    travelDetails?.additionalDrivers?.length === 0 &&
    (travelDetails?.isTripStarted || (!travelDetails?.isTripStarted && dayjs().isAfter(dayjs(updatedTravelData?.returnDate), 'minute')));

  const dueHelpingText =
    paymentStatus === ReservationPaymentStatusEnum.PendingCharge
      ? 'Your reservation or travel updates will be confirmed once payment is completed. Please make your payment at your earliest convenience.'
      : ReservationPaymentStatusEnum.Pending
      ? 'Kindly note that your reservation or travel updates will only be confirmed upon payment completion within the next 30 minutes'
      : '';
  const holdHelpingText =
    'Your reservation or travel updates will be confirmed once the hold is approved. Please confirm at your earliest convenience.';

  return (
    <div className={`grid w-full ${isMedium ? 'grid-cols-1' : 'grid-cols-5 gap-8'}`}>
      {/* Car cover Image */}
      <div
        className={`flex justify-center items-center bg-white rounded-lg relative w-full ${
          isMedium ? 'col-span-1 h-[200px]' : 'col-span-2 h-[300px]'
        } `}
      >
        <Image
          src={travelDetails?.coverPhoto?.secureUrl || ''}
          alt="CarImage"
          style={{ objectFit: 'cover' }}
          fill={true}
          // width={600}
          // height={320}
          className="rounded-lg"
        />
        {travelDetails?.carInfo?.carNickName && (
          <span className="bg-primary text-white text-semibold absolute bottom-0 w-full text-center rounded-b-lg">
            {travelDetails?.carInfo?.carNickName}
          </span>
        )}
      </div>

      {/* Travel info */}
      <div className={`${isMedium ? 'col-span-1 mt-2' : 'col-span-3 h-[300px]'} flex flex-col justify-between`}>
        <div>
          <div className="flex justify-between items-center">
            <TravelSectionHeader title={travelDetails?.carInfo?.car?.model}></TravelSectionHeader>

            {/* {paymentStatus !== 'pending' && (
            <p className="m-0 font-bold md:text-2xl text-lg p-0">${updatedTravelData?.basePrice?.totalPrice?.toFixed(2)}</p>
          )} */}
            {reservationPendingStatus?.includes(paymentStatus) &&
            updatedTravelData?.isUserGuest &&
            reservationPaymentMethod?.includes(updatedTravelData?.paymentMethod as PaymentMethod) ? (
              <div className="flex gap-1 justify-end items-center">
                <p className="m-0 font-bold md:text-lg text-md p-0 text-error">Due Hold: ${travelDetails?.reservationInfo?.depositAmount}</p>
                <CommonTooltip title={holdHelpingText} placement="top">
                  <IconButton size="small">
                    <AiOutlineInfoCircle />
                  </IconButton>
                </CommonTooltip>
                <Button
                  disabled={disablePayButton}
                  variant="contained"
                  size="small"
                  color="success"
                  className="normal-case"
                  onClick={() => router.push(`/payment/holdAmount/${travelId}?from=travel-details`)}
                >
                  Confirm
                </Button>
              </div>
            ) : reservationPendingStatus?.includes(paymentStatus) && updatedTravelData?.isUserGuest ? (
              <div className="flex gap-1 justify-end items-center">
                <p className="m-0 font-bold md:text-lg text-md p-0 text-error">Due: ${rentDueAmount?.toFixed(2)}</p>
                <Tooltip enterTouchDelay={0} title={dueHelpingText} placement="top">
                  <IconButton size="small">
                    <AiOutlineInfoCircle />
                  </IconButton>
                </Tooltip>
                <Button disabled={disablePayButton} variant="contained" size="small" color="success" onClick={handleElementPayButton}>
                  Pay
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                <p className="m-0 font-bold md:text-xl text-lg p-0">
                  {updatedTravelData?.isUserGuest ? 'Paid:' : ''} $
                  {updatedTravelData?.isUserGuest ? toFormattedNumber(paidAmount) : toFormattedNumber(updatedTravelData?.hostRentalFees)}
                </p>
                {updatedTravelData?.isUserGuest && !!updatedTravelData?.depositAmount && (
                  <p className="m-0 font-bold md:text-xl text-lg p-0">
                    {updatedTravelData?.depositAmount > 0 ? `On Hold: $${updatedTravelData?.depositAmount?.toFixed(2)}` : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex md:justify-start justify-between items-center gap-24">
            <span className="flex items-center justify-start">
              {/* <Rating
                name="half-rating"
                readOnly
                value={
                  travelDetails?.carInfo?.ratingsReceivedFrom === 0
                    ? 0
                    : parseFloat((travelDetails?.carInfo?.totalRatings / travelDetails?.carInfo?.ratingsReceivedFrom).toFixed(2))
                }
                precision={0.5}
                className="p-0"
                size="small"
                emptyIcon={<AiFillStar />}
              /> */}
              <CommonRating
                initialRating={
                  travelDetails?.carInfo?.ratingsReceivedFrom === 0
                    ? 0
                    : parseFloat((travelDetails?.carInfo?.totalRatings / travelDetails?.carInfo?.ratingsReceivedFrom)?.toFixed(2))
                }
                emptyIcon={<TiStar />}
                readOnly
                size="small"
                showRatingNumber={true}
                noMaxRating={true}
                typographyProps={{ className: 'text-sm md:text-md' }}
              />
            </span>
            <span className="flex gap-1 items-center justify-end">
              <JourneyDark className="text-xl" />
              {travelDetails?.carInfo?.totalTrips} {`Travel${travelDetails?.carInfo?.totalTrips > 1 ? 's' : ''} `}
            </span>
          </div>
          {pathName.includes('travels') && !hideAdditionalDriver && (
            <Button variant="text" color="primary" className="normal-case font-bold hover:text-success" onClick={handleDisplayDriver}>
              View Additional Driver
            </Button>
          )}
        </div>

        {travelDetails?.partnerInfo && daysDiffEndToCurrent <= 15 && (
          <OppositeUserInfo userInfo={updatedTravelData?.oppositeUserInfo}></OppositeUserInfo>
        )}

        {/* Start/ End/ Update/ Cancel Buttons */}
        {updatedTravelData?.isUserGuest ? <TravelActions></TravelActions> : <ReservationActions></ReservationActions>}
      </div>
    </div>
  );
};

export default TravelInfo;
