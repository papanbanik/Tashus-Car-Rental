import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useCancelUpcomingTravel } from '@/hooks/travel/useCancelUpcomingTravel';
import { EReservationStatus } from '@/types/travels/travelEnums';
import { TCancelUpcomingTravelByGuest } from '@/types/travels/typeEditTravels';
import { handleCancelUpcomingTravel } from '@/utils/Functions/travel-edit/cancelTravelFn';
import { Alert, Button } from '@mui/material';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const CancelTravelM = () => {
  const { watch, control } = useForm({
    mode: 'onChange',
  });

  const [cancellationText, setCancellationText] = useState<string>('');
  const [showCreditOption, setShowCreditOption] = useState<boolean>(false);
  const [cancelTravelInfo, setCancelTravelInfo] = useState<TCancelUpcomingTravelByGuest>({} as TCancelUpcomingTravelByGuest);
  const { updatedTravelData } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();
  const { mutateAsync, isLoading } = useCancelUpcomingTravel();

  //Destruct Cancel
  const { reservationStatus, carInfo } = travelDetails ?? {};
  const isReservationPending = reservationStatus === EReservationStatus.Pending;

  useEffect(() => {
    if (updatedTravelData?.totalDurationHours && carInfo?.rates) {
      handleCancelUpcomingTravel(updatedTravelData, travelDetails, setShowCreditOption, setCancellationText, setCancelTravelInfo);
    }
  }, [updatedTravelData, travelDetails]);

  const handleCancel = async () => {
    try {
      const tempCancelInfo = { ...cancelTravelInfo };
      if (watch('credit') || isReservationPending) {
        tempCancelInfo.isRefundable = false;
        if (isReservationPending) {
          tempCancelInfo.guestInconvenienceFeeReason = "The cancellation was made for the guest's pending travel.";
        }
      }
      await mutateAsync({ reservationId: travelDetails?.reservationId, cancelTravel: tempCancelInfo });
      openSnackBar({
        message: 'Travel Cancelled Successfully',
        severity: 'success',
      });
      closeModal();
    } catch (error: any) {
      console.log('cancellation API error', error?.response?.data?.message);
      openSnackBar({
        message: error?.response?.data?.message || 'Error cancelling travel',
        severity: 'error',
      });
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <p className="m-0 text-xl font-bold">Are you sure to cancel the travel?</p>
      {!isReservationPending && (
        <>
          <Alert severity="warning" color="warning" className="bg-orange-100">
            {cancellationText}
            {!cancellationText.includes('refunded') && (
              <span>
                {' Please refer to'}
                <Link target="_blank" href={'https://www.tashus.com/help/article/79'} className="text-primary no-underline">
                  {' Tashus Guest Cancellation Policy '}
                </Link>
                {'for more details.'}
              </span>
            )}
          </Alert>

          {showCreditOption && (
            <p className="flex flex-col justify-center items-center">
              <span>
                <CheckBox control={control} registerName="credit" label="Keep refund as credit" required={false} />
              </span>
            </p>
          )}
        </>
      )}
      <div className="flex items-center justify-center gap-4">
        {isReservationPending && (
          <Button onClick={() => closeModal()} variant="outlined" className="font-bold">
            No
          </Button>
        )}
        <Button
          disabled={!updatedTravelData?.totalDurationHours || !cancelTravelInfo?.userId || !travelDetails?.reservationId || isLoading}
          onClick={handleCancel}
          variant="contained"
          color="error"
          className="font-bold text-white"
        >
          Cancel Travel
        </Button>
      </div>
    </div>
  );
};

export default CancelTravelM;
