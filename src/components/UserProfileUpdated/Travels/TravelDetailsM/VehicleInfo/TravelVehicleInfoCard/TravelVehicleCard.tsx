'use client';

import CommonRating from '@/components/Common/CommonRating';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { PaymentMethod } from '@/types/user-profile/transactionsTypes';
import environment from '@/utils/configs/environment';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { reservationPaymentMethod, reservationPendingStatus } from '@/utils/Lists/travelInfoList';
import { Button, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { FaCarSide } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { TiStar } from 'react-icons/ti';
import JourneyDark from '../../../../../../../public/icons/VehicleIcons/JourneyDark.svg';
import { handleRedirectToVehicleDetails } from '../../ActionFn';
import TravelDueAmountCommon from '../../TravelDueAmountCommon';
import { getReservationStatusClassName } from '../../VehicleDetailsFn';
import OppositeUserInfoM from '../OppositeUserInfoM';
import TravelAdditionalFeeCreditPay from './TravelAdditionalFeeCreditPay';

interface TravelVehicleCardProps {
  timeRemaining?: string;
  isTravelEnded?: boolean;
  isTravelCancelled?: boolean;
  isLatePickupTravel?: boolean;
  isTravelStarted?: boolean;
  handleEndTravel?: () => void;
  rentDueAmount: number;
  additionalFeeDue: number;
  disablePayButton?: boolean;
  dueHelpingText?: string;
  paymentStatus: ReservationPaymentStatusEnum;
  handleElementPayButton?: () => void;
  handleCancelTravel?: () => void;
  handleStartTravel?: () => void;
  handleCopy?: () => void;
  isPending?: boolean;
  travelId?: string;
  vehicleFee?: number;
  coverageFee?: number;
  isVehiclePayable?: boolean;
  isCoveragePayable?: boolean;
  hideAdditionalDriver?: boolean;
  handleDisplayDriver?: () => void;
  invoiceTotalPaid?: number;
  isStartInvalid?: boolean;
  isEndDayPassed?: boolean;
  daysDiffEndToCurrent?: number;
}

export default function TravelVehicleCard({
  isTravelEnded,
  isTravelCancelled,
  isLatePickupTravel,
  isTravelStarted,
  handleEndTravel,
  handleCancelTravel,
  rentDueAmount,
  additionalFeeDue,
  disablePayButton,
  handleElementPayButton,
  dueHelpingText,
  paymentStatus,
  isPending,
  travelId,
  vehicleFee,
  coverageFee,
  isVehiclePayable = false,
  isCoveragePayable = false,
  hideAdditionalDriver,
  handleDisplayDriver,
  invoiceTotalPaid,
  isStartInvalid,
  isEndDayPassed,
  handleStartTravel,
  daysDiffEndToCurrent,
}: TravelVehicleCardProps) {
  const router = useRouter();
  const pathName = usePathname();
  const { travelDetails, guestAccess } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const { travelType, basePrice, holdPaymentTransaction } = updatedTravelData;
  const { reservationInfo } = travelDetails ?? {};
  const { depositAmount = 0, isHoldSuccess } = reservationInfo ?? {};
  const [open, setOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');
  const { currentCreditBalance = 0 } = travelDetails || {};
  const { openModal } = useModalContext();
  const handleClose = () => setOpen(false);
  const { splitHoldPaymentHistory = [] } = holdPaymentTransaction ?? {};
  const holdDueAmount = splitHoldPaymentHistory?.length > 0 ? splitHoldPaymentHistory[splitHoldPaymentHistory.length - 1].dueAmount ?? 0 : 0;

  const excessFee = holdDueAmount > 0 ? holdDueAmount : depositAmount;

  const handlePayAsCredit = () => {
    openModal({
      title: 'Pay Additional Fee as Credit',
      content: <TravelAdditionalFeeCreditPay currentCreditBalance={currentCreditBalance} additionalFeeDue={additionalFeeDue} />,
    });
  };
  const isGuestNotAllowed = isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess);
  const updateButtonTooltip = isGuestNotAllowed
    ? 'This guest is restricted or suspended and cannot travel.'
    : isTravelCancelled
    ? 'This travel has been cancelled and cannot be updated.'
    : isEndDayPassed
    ? 'The end date has already passed, so this travel cannot be updated.'
    : isPending
    ? 'Only paid travels can be updated.'
    : 'You can update this travel.';
  return (
    <>
      <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg ml-4  mt-5 relative">
        <div className="flex  justify-between max-h-full px-5 mt-3 pb-4 pt-3">
          <div className="w-full flex  justify-start px-5 ">
            <div>
              {travelDetails?.coverPhoto?.secureUrl && (
                <div className="relative w-16 h-16">
                  <Image
                    onClick={() => {
                      setModalImageSrc(travelDetails?.coverPhoto?.secureUrl);
                      setOpen(true);
                    }}
                    src={`${travelDetails?.coverPhoto?.secureUrl}`}
                    alt="CarImage"
                    className="object-cover rounded-full cursor-pointer"
                    fill={true}
                  />
                </div>
              )}
            </div>

            <div className=" flex flex-col  justify-start max-h-full ml-3 ">
              <div className="text-left">
                <span
                  className="md:whitespace-nowrap text-start text-2xl font-bold no-underline hover:underline cursor-pointer"
                  onClick={() => {
                    if (handleRedirectToVehicleDetails) {
                      handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                    }
                  }}
                >
                  {travelDetails?.carInfo?.car?.model ?? ''}
                </span>

                <span className="md:whitespace-nowrap text-start text-xs flex text-primary">
                  {travelDetails?.carInfo?.carNickName ? <span>{travelDetails?.carInfo?.carNickName}</span> : ''}
                </span>
              </div>

              <div className="flex items-center my-1">
                <div className=" flex justify-center ">
                  <div className="">
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
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                <div className="flex items-center mr-2 p-0 m-0">
                  <span className="flex gap-1 items-center justify-end">
                    <JourneyDark className="text-xl" />
                    {travelDetails?.carInfo?.totalTrips} {`Travel${travelDetails?.carInfo?.totalTrips > 1 ? 's' : ''} `}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5">
            <div className="absolute right-0 top-8 pe-2 transform -translate-y-1/2 text-sm">
              Total Price:
              <span className="text-primary text-base font-bold">${basePrice?.totalPrice?.toFixed(2)}</span>
            </div>

            <div className="absolute right-0 top-16 transform -translate-y-1/2">
              <span
                className={`font-semibold text-sm pl-4 pe-16 py-2 rounded-l-full capitalize ${getReservationStatusClassName(
                  travelDetails?.reservationStatus || ''
                )}`}
              >
                {travelDetails?.reservationStatus === 'cancelledByGuest' ||
                travelDetails?.reservationStatus === 'cancelledByHost' ||
                travelDetails?.reservationStatus === 'cancelled'
                  ? 'Cancelled'
                  : travelDetails?.reservationStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="w-[90%]  ml-10 mr-10 h-px bg-gray-300 "></div>

        <div className="flex justify-between items-center px-5 ">
          <div className="flex justify-start items-center md:gap-2 p-5  w-[48%]">
            <div className="flex justify-center">
              <Image
                src="/icons/FromTo/EnabledFromTo.svg"
                alt="FromTo"
                width={90}
                height={70}
                className="object-cover rounded-lg w-auto md:h-8 h-8 m-1 mr-2 lg:mr-0"
              />
            </div>

            <div className="flex  lg:gap-4 md:gap-2 gap-1">
              <div className={`md:block`}>
                <p className={'m-0 lg:text-sm text-sm'}> {isTravelEnded ? 'Started At' : 'Starts From'} </p>
                <p className={'m-0 lg:text-sm text-sm'}> {isTravelEnded ? 'Ended At' : 'End At'}</p>
              </div>
              <div className="font-bold">
                <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTimeUtc(updatedTravelData?.pickupDate)}</p>
                <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTimeUtc(updatedTravelData?.returnDate)}</p>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-400 mx-2"></div>

          <div className="flex justify-end items-center md:gap-2 p-4  w-[48%]">
            <div className="flex  lg:gap-4 md:gap-2 gap-1">
              <div className={`md:block`}>
                <p className={'m-0 text-sm'}> Reserved:</p>
                {updatedTravelData?.reservedAt !== updatedTravelData?.createdAt && <p className={'m-0 text-sm'}> Updated:</p>}
              </div>
              <div className="font-bold">
                <p className={'m-0 lg:text-sm text-sm'}> {formatFullDateTime(updatedTravelData?.reservedAt)}</p>

                {updatedTravelData?.reservedAt !== updatedTravelData?.createdAt && (
                  <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTime(updatedTravelData?.createdAt)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[90%]  ml-10 mr-10 h-px bg-gray-300 "></div>

        {(isTravelEnded || isTravelCancelled) && additionalFeeDue < 1 && !isVehiclePayable && rentDueAmount < 1 && !isCoveragePayable ? (
          ''
        ) : (
          <>
            <div className="flex justify-between items-center px-5 ">
              {additionalFeeDue > 0 || isVehiclePayable ? (
                <div className="flex flex-col justify-between md:gap-2 p-5 w-[48%]">
                  {additionalFeeDue > 0 && (
                    <TravelDueAmountCommon
                      label="Additional Fee Due"
                      amount={additionalFeeDue}
                      isPayable={additionalFeeDue > 0}
                      buttonText="Pay Now"
                      redirectUrl={`${process.env.NEXT_PUBLIC_DOMAIN}/payment/additionalFee/${travelId}`}
                      enablePopover={currentCreditBalance > 0}
                      menuOptions={[
                        {
                          label: 'Pay by Card',
                          onClick: () => router.push(`/payment/additionalFee/${travelId}`),
                        },
                        {
                          label: 'Pay by Credit',
                          onClick: handlePayAsCredit,
                        },
                      ]}
                    />
                  )}
                  {isVehiclePayable && (
                    <TravelDueAmountCommon
                      label="Replacement Fee Due"
                      amount={vehicleFee ?? 0}
                      isPayable={isVehiclePayable}
                      buttonText="Pay Now"
                      redirectUrl={`${process.env.NEXT_PUBLIC_DOMAIN}/payment/modifyReservation/${travelId}?category=changed_vehicle`}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col justify-start items-start md:gap-2 p-2   w-[48%]">
                  {pathName.includes('travels') && !hideAdditionalDriver && (
                    <Button variant="text" color="primary" className="text-sm normal-case font-bold hover:text-success" onClick={handleDisplayDriver}>
                      View Additional Driver
                    </Button>
                  )}
                </div>
              )}
              <div className="h-6 w-px bg-gray-400 mx-2"></div>

              {rentDueAmount > 0 ||
              isCoveragePayable ||
              reservationPendingStatus?.includes(paymentStatus) ||
              reservationPaymentMethod?.includes(updatedTravelData?.paymentMethod as PaymentMethod) ||
              (excessFee > 0 && isHoldSuccess === false) ? (
                <div className="flex flex-col justify-between md:gap-2 p-5 w-[48%]">
                  {reservationPendingStatus?.includes(paymentStatus) &&
                  reservationPaymentMethod?.includes(updatedTravelData?.paymentMethod as PaymentMethod) ? (
                    <TravelDueAmountCommon
                      label="Due Hold"
                      amount={excessFee}
                      isPayable={excessFee > 0}
                      buttonText="Confirm"
                      tooltipText={dueHelpingText}
                      redirectUrl={`${process.env.NEXT_PUBLIC_DOMAIN}/payment/holdAmount/${travelId}?from=travel-details`}
                      disableButton={!reservationPendingStatus.includes(paymentStatus) || !updatedTravelData.isUserGuest || disablePayButton}
                    />
                  ) : rentDueAmount > 0 ? (
                    <TravelDueAmountCommon
                      label="Rent Fee Due"
                      amount={rentDueAmount}
                      isPayable={rentDueAmount > 0}
                      buttonText="Pay Now"
                      redirectUrl="#"
                      tooltipText={dueHelpingText}
                      onButtonClick={handleElementPayButton}
                      disableButton={
                        !reservationPendingStatus.includes(paymentStatus) || !updatedTravelData.isUserGuest || disablePayButton || isTravelCancelled
                      }
                    />
                  ) : excessFee > 0 && isHoldSuccess === false ? (
                    <TravelDueAmountCommon
                      label="Due Hold"
                      amount={excessFee}
                      isPayable={excessFee > 0}
                      buttonText="Confirm"
                      tooltipText={
                        'Your reservation is on hold. To confirm your travel, please complete the required hold payment as soon as possible.'
                      }
                      redirectUrl={`${process.env.NEXT_PUBLIC_DOMAIN}/payment/holdAmount/${travelId}?from=travel-details`}
                      disableButton={!updatedTravelData.isUserGuest || disablePayButton}
                    />
                  ) : (
                    ''
                  )}

                  {isCoveragePayable && (
                    <TravelDueAmountCommon
                      label="Coverage Fee Due"
                      amount={coverageFee ?? 0}
                      isPayable={isCoveragePayable}
                      buttonText="Pay Now"
                      redirectUrl={`${process.env.NEXT_PUBLIC_DOMAIN}/payment/modifyReservation/${travelId}?category=upgraded_coverage`}
                      tooltipText={dueHelpingText}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-row items-center justify-end md:gap-2 p-2 pe-5  w-[48%]">
                  <p className="m-0  text-sm p-0">
                    {updatedTravelData?.isUserGuest ? 'Paid:' : ''}
                    <span className=" font-bold">${invoiceTotalPaid?.toFixed(2) ?? ''}</span>
                  </p>
                  {updatedTravelData?.isUserGuest && !!updatedTravelData?.depositAmount && (
                    <p className="m-0 text-sm p-0">
                      {updatedTravelData?.depositAmount > 0 && (
                        <>
                          On Hold: <span className="font-bold">${updatedTravelData.depositAmount.toFixed(2)}</span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="w-[90%]  ml-10 mr-10 h-px bg-gray-300 "></div>
          </>
        )}

        <div className="flex justify-between items-center px-5 pb-2">
          <div className="flex justify-start items-center md:gap-2 p-2 ">
            {(additionalFeeDue > 0 || isVehiclePayable) && (
              <div className="flex justify-start items-center  ">
                {pathName.includes('travels') && !hideAdditionalDriver && (
                  <Button variant="text" color="primary" className="text-sm normal-case font-bold hover:text-success" onClick={handleDisplayDriver}>
                    View Additional Driver
                  </Button>
                )}
              </div>
            )}
            {/* <div className="flex justify-start items-center  ">
              <Button
                variant="text"
                color="primary"
                className="text-sm normal-case font-bold hover:text-success underline  pe-0"
                onClick={() => {
                  if (handleRedirectToVehicleDetails) {
                    handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                  }
                }}
              >
                View Vehicle Details
              </Button>
              <span className="  mt-1.5 text-primary">
                <FaArrowRightLong />
              </span>
            </div> */}
          </div>
          <div className="flex justify-between items-center  p-4">
            {!isTravelEnded && !isTravelCancelled && !isTravelStarted ? (
              <div className="font-semibold text-sm flex items-center">
                <Button
                  className="normal-case rounded-full py-2 px-6 text-sm font-semibold"
                  disabled={
                    updatedTravelData?.paymentStatus === 'pending' ||
                    isStartInvalid ||
                    isEndDayPassed ||
                    isGuestRestrict(guestAccess) ||
                    isGuestSuspended(guestAccess)
                  }
                  variant="contained"
                  size="small"
                  color="success"
                  fullWidth
                  onClick={handleStartTravel}
                  startIcon={<FaCarSide />}
                >
                  Start Travel
                </Button>
                {!travelDetails?.isTripStarted && (
                  <Tooltip
                    enterTouchDelay={0}
                    title={`${isEndDayPassed ? 'Travel can not be started if End time is passed' : 'Enables 15 mins before pickup time'} `}
                    placement="top"
                  >
                    <IconButton size="small">
                      <AiOutlineInfoCircle />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            ) : isTravelStarted && !isTravelEnded ? (
              <div className="font-semibold text-sm ">
                <Button
                  className="normal-case rounded-full py-2 px-6 text-sm font-semibold"
                  disabled={disablePayButton || isTravelEnded || isTravelCancelled || isLatePickupTravel}
                  variant="outlined"
                  size="small"
                  color="error"
                  fullWidth
                  onClick={handleEndTravel}
                  startIcon={<MdCancel />}
                >
                  End Travel
                </Button>
              </div>
            ) : (
              ''
            )}

            {!isTravelEnded && !isTravelCancelled && travelType !== 'current' && (
              <div className="font-semibold text-sm ">
                <Button
                  className="normal-case rounded-full py-2 px-6 text-sm font-semibold"
                  disabled={travelType !== 'upcoming' || isGuestNotAllowed}
                  variant="outlined"
                  size="small"
                  color="error"
                  fullWidth
                  onClick={handleCancelTravel}
                  startIcon={<MdCancel />}
                >
                  Cancel Travel
                </Button>
              </div>
            )}

            {isTravelEnded ? (
              <Button
                color="primary"
                variant="contained"
                disabled={isGuestNotAllowed}
                onClick={() => {
                  if (handleRedirectToVehicleDetails) {
                    handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                  }
                }}
                className="w-full border-none outline-none normal-case py-1 px-12  text-white rounded-full "
              >
                Reserve Again
              </Button>
            ) : (
              <div className="flex font-semibold text-sm ms-3">
                <Button
                  className=" normal-case rounded-full py-2 px-6 text-sm font-semibold"
                  variant="contained"
                  size="small"
                  color="primary"
                  fullWidth
                  onClick={() => router.push(`${environment?.DOMAIN}/${pathName}/edit-travel`)}
                  disabled={isPending || isEndDayPassed || isTravelCancelled}
                  startIcon={<CiEdit />}
                >
                  Update Travel
                </Button>

                <Tooltip enterTouchDelay={0} title={updateButtonTooltip} placement="top">
                  <IconButton size="small">
                    <AiOutlineInfoCircle />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
      {travelDetails?.partnerInfo && typeof daysDiffEndToCurrent === 'number' && daysDiffEndToCurrent <= 15 && (
        <OppositeUserInfoM userInfo={updatedTravelData?.oppositeUserInfo} />
      )}

      <UpdatedCommonImgZoomInOutModal handleClose={handleClose} open={open} modalImageSrc={modalImageSrc} />
    </>
  );
}
