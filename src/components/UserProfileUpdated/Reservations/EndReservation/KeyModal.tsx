'use client';

import CommonForm from '@/components/Common/CommonForm';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useModalContext } from '@/context/ModalProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useEndReservation } from '@/hooks/reservation/useEndReservation';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

export type TReservationEnd = {
  isKeyReceivedByPartner: boolean;
};

const KeyModal = () => {
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } = useForm<TReservationEnd>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { isValid } = formState;
  const { mutateAsync: saveEndReservation, isLoading, isSuccess, isError, error } = useEndReservation();
  const { closeModal } = useModalContext();
  const { userCred } = useUserCredContext();
  const { redirectToReview } = useReviewRatingContext();
  // const params = useParams();
  // // console.log(params);
  // const hostId = params['host-profile-id'];
  // const reservationId = params['reservation-id'];
  const { userId: hostId, reservationId } = useParams<{ userId: string; reservationId: string }>();

  const handleEndReservation: SubmitHandler<TReservationEnd> = async (data) => {
    try {
      // console.log(data);
      const { isKeyReceivedByPartner } = data;
      await saveEndReservation({ reservationId: parseInt(reservationId), isKeyReceivedByPartner });
      redirectToReview(reservationId, hostId);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={'/UserProfile/Travels/Key.svg'} alt="Key" height={150} width={150} />

      <p className="helping_text text-center">
        {"Kindly confirm that you have received the vehicle's keys upon the completion of the travel. Your acknowledgment is greatly appreciated."}
      </p>

      <CommonForm handleFunction={handleSubmit(handleEndReservation)}>
        <div className="font-bold text-lg my-4">
          <CheckBox control={control} registerName="isKeyReceivedByPartner" label="I have received the key" required={true} />
          <Button disabled={!isValid || isLoading} type="submit" variant="contained" color="primary" fullWidth className="my-4 normal-case font-bold">
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>
    </div>
  );
};

export default KeyModal;
