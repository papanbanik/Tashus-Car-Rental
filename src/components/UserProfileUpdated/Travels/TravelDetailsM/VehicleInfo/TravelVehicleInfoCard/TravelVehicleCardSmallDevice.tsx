'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { ReservationPaymentStatusEnum } from '@/types/commonTypes';
import { PaymentMethod } from '@/types/user-profile/transactionsTypes';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { reservationPaymentMethod, reservationPendingStatus } from '@/utils/Lists/travelInfoList';
import { Button } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AiOutlineQrcode } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { FaCalendarAlt, FaCarSide, FaCopy, FaStar } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import JourneyDark from '../../../../../../../public/icons/VehicleIcons/JourneyDark.svg';
import { handleRedirectToVehicleDetails } from '../../ActionFn';
import TravelDueAmountCommon from '../../TravelDueAmountCommon';
import { getReservationStatusClassName } from '../../VehicleDetailsFn';
import OppositeUserInfoM from '../OppositeUserInfoM';
import TravelAdditionalFeeCreditPay from './TravelAdditionalFeeCreditPay';

interface TravelVehicleCardSmallDeviceProps {
  timeRemaining?: string;
  isTravelEnded?: boolean;
  isTravelCancelled?: boolean;
  isLatePickupTravel?: boolean;
  isTravelStarted?: boolean;
  handleEndTravel?: () => void;
  rentDueAmount: number; // Add this property
  additionalFeeDue: number;
  disablePayButton?: boolean;
  dueHelpingText?: string;
  paymentStatus: ReservationPaymentStatusEnum;
  handleElementPayButton?: () => void;
  handleCancelTravel?: () => void;
  handleStartTravel?: () => void;
  isPending?: boolean;
  travelId?: string;
  handleCopy?: () => void;
  isCopy?: boolean;
  vehicleFee?: number;
  coverageFee?: number;
  isVehiclePayable?: boolean;
  isCoveragePayable?: boolean;
  hideAdditionalDriver?: boolean;
  handleDisplayDriver?: () => void;
  isStartInvalid?: boolean;
  isEndDayPassed?: boolean;
  daysDiffEndToCurrent?: number;
}

export default function TravelVehicleCardSmallDevice({
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
  handleCopy,
  isCopy,
  vehicleFee,
  coverageFee,
  isVehiclePayable,
  isCoveragePayable,
  hideAdditionalDriver,
  handleDisplayDriver,
  isStartInvalid,
  isEndDayPassed,
  handleStartTravel,
  daysDiffEndToCurrent,
}: TravelVehicleCardSmallDeviceProps) {
  const router = useRouter();
  const pathName = usePathname();
  const { updatedTravelData } = useTravelContext();
  const { travelType, basePrice, holdPaymentTransaction } = updatedTravelData;
  const { travelDetails, guestAccess } = useProfileInfoContext();
  const { currentCreditBalance = 0 } = travelDetails ?? {};
  const { openModal } = useModalContext();
  const { reservationInfo } = travelDetails ?? {};
  const { depositAmount = 0, isHoldSuccess } = reservationInfo ?? {};
  const { splitHoldPaymentHistory = [] } = holdPaymentTransaction ?? {};
  const holdDueAmount = splitHoldPaymentHistory?.length > 0 ? splitHoldPaymentHistory[splitHoldPaymentHistory.length - 1].dueAmount ?? 0 : 0;

  const excessFee = holdDueAmount > 0 ? holdDueAmount : depositAmount;
  const handlePayAsCredit = () => {
    openModal({
      title: 'Pay Additional Fee as Credit',
      content: <TravelAdditionalFeeCreditPay currentCreditBalance={currentCreditBalance} additionalFeeDue={additionalFeeDue} />,
    });
  };
  return (
    <>
      <div className=" w-full bg-white shadow-md shadow-secondary rounded-lg  ml-0 sm:ml-4  mt-5 relative">
        {/* Price */}

        <span className="absolute right-0 top-12 transform -translate-y-1/2">
          {/* {reservationPendingStatus?.includes(paymentStatus) && updatedTravelData?.isUserGuest && ( */}
          <div className="flex flex-col gap-1 justify-end items-end">
            <div className="flex flex-col">
              <span className="bg-success md:text-sm text-white p-0 font-semibold text-sm px-4 py-2 rounded-l-full capitalize">
                ${basePrice?.totalPrice?.toFixed(2)}
              </span>
            </div>
          </div>
          {/* )} */}
        </span>
        <span className="flex flex-col justify-start absolute left-0 top-12 transform -translate-y-1/2">
          <span
            className={`m-0  md:text-sm p-0 font-semibold text-sm px-4 py-2 rounded-r-full capitalize ${getReservationStatusClassName(
              travelDetails?.reservationStatus || ''
            )}`}
          >
            {travelDetails?.reservationStatus === 'cancelledByGuest' ||
            travelDetails?.reservationStatus === 'cancelledByHost' ||
            travelDetails?.reservationStatus === 'cancelled'
              ? 'Cancelled'
              : travelDetails?.reservationStatus}
          </span>
        </span>

        <div className="flex flex-col justify-center items-center">
          <div
            className="w-1/4 flex items-center justify-center max-h-full ml-3 relative my-3"
            onClick={() => {
              if (handleRedirectToVehicleDetails) {
                handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
              }
            }}
          >
            {travelDetails?.coverPhoto?.secureUrl && (
              <div className="relative w-20 h-20 sm:w-32 sm:h-32">
                <Image src={`${travelDetails?.coverPhoto?.secureUrl}`} alt="CarImage" className="object-cover rounded-full" fill={true} />
              </div>
            )}
          </div>
          <div className=" flex flex-col items-center justify-center max-h-full ml-3 mb-2">
            <div className="grid grid-cols-[auto,1fr] font-bold md:text-xl text-sm lg:mb-1">
              {/* <span className="md:whitespace-nowrap text-start">{vehicleDetails?.car?.model}</span> */}
              <span
                className="md:whitespace-nowrap text-start no-underline hover:underline cursor-pointer"
                onClick={() => {
                  if (handleRedirectToVehicleDetails) {
                    handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                  }
                }}
              >
                {travelDetails?.carInfo?.car?.model ?? ''}
              </span>
            </div>
            <span className="md:whitespace-nowrap text-start text-xs  text-primary">
              {travelDetails?.carInfo?.carNickName ? <span>{travelDetails?.carInfo?.carNickName}</span> : ''}
            </span>
            <div className="flex items-center my-1">
              <div className="flex items-center mr-2 p-0 m-0">
                <span className="flex gap-1 items-center justify-end">
                  <JourneyDark className="text-xl" />
                  {travelDetails?.carInfo?.totalTrips} {`Trip${travelDetails?.carInfo?.totalTrips > 1 ? 's' : ''} `}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <div className="flex items-center mr-2 p-0 m-0">
                <FaStar className="text-yellow-500 mr-1 text-lg" />
                <span className="text-gray-800 text-sm font-medium mr-1">
                  {travelDetails?.carInfo?.ratingsReceivedFrom === 0
                    ? 0
                    : parseFloat((travelDetails?.carInfo?.totalRatings / travelDetails?.carInfo?.ratingsReceivedFrom)?.toFixed(2))}{' '}
                  / 5.0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>
        <div className="flex justify-start items-center ">
          <div className="flex justify-start items-center md:gap-2 p-5">
            <div className="flex justify-center">
              <Image
                src="/icons/FromTo/EnabledFromTo.svg"
                alt="FromTo"
                width={90}
                height={70}
                className="object-cover rounded-lg w-auto md:h-8 h-8 m-1 mr-2 lg:mr-0"
              />
            </div>

            <div className="flex lg:gap-4 md:gap-2 gap-1">
              <div className={``}>
                <p className={'m-0 lg:text-sm text-sm'}>{isTravelEnded ? 'Started At' : 'Starts From'}</p>
                <p className={'m-0 lg:text-sm text-sm'}> {isTravelEnded ? 'Ended At' : 'End At'}</p>
              </div>
              <div className="font-bold">
                <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTimeUtc(updatedTravelData?.pickupDate)}</p>
                <p className={'m-0 lg:text-sm text-sm'}>{formatFullDateTimeUtc(updatedTravelData?.returnDate)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>
        <div className="flex justify-start items-center md:gap-2 px-5 py-2">
          <div className="">
            <span className="flex gap-1 items-center justify-end">
              <FaCalendarAlt className="text-primary" />
              <p className={'m-0 lg:text-sm text-sm'}>
                Duration: <span className="font-bold">{updatedTravelData?.totalDurationText}</span>
              </p>
            </span>
          </div>
        </div>

        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>

        <div className="font-semibold text-sm  flex items-center justify-between px-5 py-2">
          <div className="flex items-center">
            <AiOutlineQrcode className="text-primary mr-1" />
            Reservation ID: <span className="text-primary">{travelId}</span>
          </div>

          <div>
            {isCopy ? (
              <span className="text-primary text-xs ms-1">Copied</span>
            ) : (
              <FaCopy className="ml-2 cursor-pointer text-primary" onClick={handleCopy} title="Copy Reservation ID" />
            )}
          </div>
        </div>
        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>
        <div className="flex justify-start items-center md:gap-2 px-5 py-2">
          {(additionalFeeDue > 0 || isVehiclePayable) && (
            <div className="flex justify-start items-center  ">
              {pathName.includes('travels') && !hideAdditionalDriver && (
                <Button variant="text" color="primary" className="text-sm normal-case font-bold hover:text-success" onClick={handleDisplayDriver}>
                  View Additional Driver
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>

        {/* {(isTravelEnded || isTravelCancelled) && additionalFeeDue < 1 && !isVehiclePayable && rentDueAmount < 1 && !isCoveragePayable ? (
          ''
        ) : (
          <>
            {additionalFeeDue > 0 && (
              <div className="flex justify-between items-center md:gap-2 px-5 py-2">
                <div className="font-semibold text-sm  py-2 flex items-center ">
                  Additional Due:{' '}
                  <span className={`ps-2 ${additionalFeeDue > 0 ? 'text-error' : ''}`}>
                    {additionalFeeDue > 0 ? additionalFeeDue?.toFixed(2) : '$0.00'}
                  </span>
                </div>
                <div>
                  {additionalFeeDue > 0 && updatedTravelData?.isUserGuest ? (
                    <Button
                      className="me-1 mt-1 rounded-full normal-case px-12"
                      disabled={disablePayButton}
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/payment/additionalFee/${travelId}`)}
                    >
                      Pay Now
                    </Button>
                  ) : (
                    <Button className="me-1 mt-1 rounded-full normal-case px-12" disabled variant="contained" size="small" color="success">
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>
            {rentDueAmount > 0 && (
              <div className="flex justify-between items-center md:gap-2 px-5 py-2">
                <div className="font-semibold text-sm  py-2 flex items-center ">
                  Rent Fee Due:{' '}
                  <span className={`ps-2 ${rentDueAmount > 0 ? 'text-error' : ''}`}>${rentDueAmount > 0 ? rentDueAmount.toFixed(2) : '0.00'}</span>
                </div>
                <div>
                  <Tooltip enterTouchDelay={0} title={dueHelpingText} placement="top">
                    <IconButton size="small">
                      <AiOutlineInfoCircle />
                    </IconButton>
                  </Tooltip>
                  <Button
                    className="me-1 mt-1 rounded-full normal-case px-12"
                    disabled={!reservationPendingStatus?.includes(paymentStatus) || !updatedTravelData?.isUserGuest || disablePayButton}
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={handleElementPayButton}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            )}
            {isVehiclePayable && (
              <div className="flex justify-between items-center md:gap-2 px-5 py-2">
                <div className="font-semibold text-sm  py-2 flex items-center ">
                  Replacement Fee Due: <span className={`ps-2 ${isVehiclePayable ? 'text-error' : ''}`}>${vehicleFee}</span>
                </div>
                <div>
                  <Button
                    className="me-1 mt-1 rounded-full normal-case px-12"
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/payment/modifyReservation/${travelId}?category=changed_vehicle`)}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            )}

            {isCoveragePayable && (
              <div className="flex justify-between items-center md:gap-2 px-5 py-2">
                <div className="font-semibold text-sm  py-2 flex items-center ">
                  Coverage Fee Due: <span className={`ps-2 ${isCoveragePayable ? 'text-error' : ''}`}>${coverageFee}</span>
                </div>
                <div>
                  <Button
                    className="me-1 mt-1 rounded-full normal-case px-12"
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/payment/modifyReservation/${travelId}?category=upgraded_coverage`)}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            )}
          </>
        )} */}

        {(isTravelEnded || isTravelCancelled) && additionalFeeDue < 1 && !isVehiclePayable && rentDueAmount < 1 && !isCoveragePayable ? (
          ''
        ) : (
          <>
            <>
              {additionalFeeDue > 0 || isVehiclePayable ? (
                <div className="font-semibold w-full text-sm px-5 py-2 flex items-center ">
                  {additionalFeeDue > 0 && (
                    <TravelDueAmountCommon
                      label="Additional Fee Due"
                      amount={additionalFeeDue}
                      isPayable={additionalFeeDue > 0}
                      buttonText="Pay Now"
                      redirectUrl={`${process.env.NEXT_PUBLIC_DOMAIN}/payment/additionalFee/${travelId}`}
                      isSmall={true}
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
                      isSmall={true}
                    />
                  )}
                </div>
              ) : (
                <div className=" md:gap-2 px-5 py-2">
                  {pathName.includes('travels') && !hideAdditionalDriver && (
                    <Button variant="text" color="primary" className="text-sm normal-case font-bold hover:text-success" onClick={handleDisplayDriver}>
                      View Additional Driver
                    </Button>
                  )}
                </div>
              )}

              {rentDueAmount > 0 ||
              isCoveragePayable ||
              reservationPendingStatus?.includes(paymentStatus) ||
              reservationPaymentMethod?.includes(updatedTravelData?.paymentMethod as PaymentMethod) ||
              (excessFee > 0 && isHoldSuccess === false) ? (
                <div className="font-semibold w-full text-sm px-5 py-2 flex items-center ">
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
                      disableButton={!reservationPendingStatus.includes(paymentStatus) || !updatedTravelData.isUserGuest || disablePayButton}
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
                      isSmall={true}
                    />
                  )}
                </div>
              ) : (
                ''
              )}
            </>

            <div className="w-[90%]  ml-10 mr-10 h-px bg-gray-300 "></div>
          </>
        )}

        <div className="w-[94%]  ml-5 mr-10 h-px bg-gray-200 "></div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-5  px-5 py-2">
          {/* <div className="font-semibold text-sm  py-2 w-full sm:w-1/2">
            {isTravelStarted ? (
              <div className="font-semibold text-sm w-full sm:w-1/2">
                <Button
                  className="normal-case rounded-full py-2   px-6 text-sm font-semibold"
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
            ) : isLatePickupTravel ? (
              <div className="font-semibold text-sm w-full sm:w-1/2">
                <Button
                  className="normal-case rounded-full py-2  px-6 text-sm font-semibold"
                  disabled={disablePayButton || isLatePickupTravel}
                  variant="outlined"
                  size="small"
                  color="error"
                  fullWidth
                  onClick={handleStartTravel}
                  startIcon={<MdCancel />}
                >
                  Start Travel
                </Button>
              </div>
            ) : (
              <div className="font-semibold text-sm w-full sm:w-1/2">
                <Button
                  className="normal-case rounded-full py-2  px-6  text-sm font-semibold"
                  disabled={disablePayButton || isTravelEnded || isTravelCancelled || isLatePickupTravel}
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
          </div> */}

          {!isTravelEnded && !isTravelCancelled && !isTravelStarted ? (
            <div className="font-semibold text-sm w-full sm:w-1/2">
              <Button
                className="normal-case rounded-full py-2 w-full  px-6 text-sm font-semibold"
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
            </div>
          ) : isTravelStarted && !isTravelEnded ? (
            <div className="font-semibold text-sm w-full sm:w-1/2">
              <Button
                className="normal-case rounded-full py-2  w-full px-6 text-sm font-semibold"
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
            <div className="font-semibold text-sm w-full sm:w-1/2">
              <Button
                className="normal-case rounded-full py-2 mt-1 sm:mt-0 w-full px-6 text-sm font-semibold"
                disabled={travelType !== 'upcoming' || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
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
            <div className="font-semibold text-sm w-full mt-1 sm:mt-0 sm:w-1/2">
              <Button
                color="primary"
                variant="contained"
                className="normal-case rounded-full py-2  w-full px-6 text-sm font-semibold"
                disabled={isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
                onClick={() => {
                  if (handleRedirectToVehicleDetails) {
                    handleRedirectToVehicleDetails(travelDetails?.carListingId ?? 0);
                  }
                }}
              >
                Reserve Again
              </Button>
            </div>
          ) : (
            <div className="font-semibold text-sm w-full mt-1 sm:mt-0 sm:w-1/2">
              <Button
                className="normal-case rounded-full py-2 w-full px-6 text-sm font-semibold"
                variant="outlined"
                size="small"
                color="primary"
                fullWidth
                onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/edit-travel`)}
                disabled={isPending || isEndDayPassed || isTravelCancelled || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
                startIcon={<CiEdit />}
              >
                Update Travel
              </Button>
            </div>
          )}
        </div>
      </div>
      {travelDetails?.partnerInfo && typeof daysDiffEndToCurrent === 'number' && daysDiffEndToCurrent <= 15 && (
        <OppositeUserInfoM userInfo={updatedTravelData?.oppositeUserInfo} />
      )}
    </>
  );
}
