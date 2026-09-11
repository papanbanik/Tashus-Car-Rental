'use client';
import SectionHeader from '@/components/CarListing/SectionHeader';
import StepContainer from '@/components/CarListing/StepContainer';
// import HostReviewView from './HostReviewView';
import CommonForm from '@/components/Common/CommonForm';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useHostReview } from '@/hooks/review-ratings/host-review/useHostReview';
import { useHostReviewEdit } from '@/hooks/review-ratings/host-review/useHostReviewEdit';
import { HostReviewTypes } from '@/types/review-ratings/reviewRatingTypes';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import {
  calculateRemainingTime,
  isReviewEditExpired,
  isReviewExpired,
  reviewEditExpiredAlert,
  reviewExpiredAlert,
} from '@/utils/Functions/reviewRatingCommonFn';
import { Alert, AlertColor, Button, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import HostReviewView from '../GuestReview/HostReviewView';
import CarReviewView from './CarReviewView';
import GuestReviewView from './GuestReviewView';
import HostReply from './HostReply';
import ReviewGuest from './ReviewGuest';
const defaultValues: HostReviewTypes = {
  guestRating: {
    averageRating: 5,
  },
};
const HostReview = () => {
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // const [isReviewShow, setReviewShow] = useState<boolean>(false);

  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertColor, setAlertColor] = useState<AlertColor>('warning');
  const { hostReview, guestReview, hostResponse } = useReviewRatingContext();
  const { travelDetails } = useProfileInfoContext();
  console.log(travelDetails);
  // console.log(travelDetails?.tripInformation?.endTime);
  // console.log(hostReview);
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } = useForm<HostReviewTypes>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
    setError,
    clearErrors,
  };
  // const guestRating = watch('guestRating.averageRating');
  // console.log(guestRating);
  // const params = useParams();
  // const userId = params['user-id'];
  // const reservationId = params['reservation-id'];
  const { userId, reservationId } = useParams<{ userId: string; reservationId: string }>();
  const { mutateAsync: addHostReview, isLoading } = useHostReview();
  const { mutateAsync: editHostReview, isLoading: isEditLoading } = useHostReviewEdit();

  //For Edit
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (watch('guestRating.averageRating') === undefined) {
      setValue('guestRating.averageRating', 5, { shouldValidate: true });
    }
  }, [watch('guestRating.averageRating')]);

  useEffect(() => {
    const getUpdatedHostReview = async () => {
      if (userId && reservationId) {
        const { guestRating, guestComment } = hostReview;
        setValue('guestRating.averageRating', guestRating?.averageRating);
        setValue('userReviewComment', guestComment?.comment);
        setValue('carReviewComment', hostResponse?.comment);
      } else {
        reset();
      }
      if (hostReview?.guestRating?.createdAt) {
        const createdDate = dayjs(hostReview?.guestRating?.createdAt);
        const result = calculateRemainingTime(createdDate.toDate());
        if (result !== null) {
          const { daysMessage, expirationDate } = result;
          console.log(result);
          setAlertMessage(
            `You can modify your review from ${createdDate.format('DD MMM, YYYY')} to ${expirationDate.format(
              'DD MMM, YYYY'
            )}. You have approximately ${daysMessage} left to edit.`
          );
          setAlertColor('info');
        } else {
          setAlertMessage(reviewEditExpiredAlert);
          setAlertColor('error');
        }
      } else if (!!travelDetails?.tripInformation?.endTime) {
        if (isReviewExpired(travelDetails?.tripInformation?.endTime)) {
          setAlertMessage(reviewExpiredAlert);
          setAlertColor('error');
        } else {
          setAlertMessage('You have up to 15 days after the reservation ends to leave a review for your guest.');
          setAlertColor('warning');
        }
      }
    };
    getUpdatedHostReview();
  }, [reservationId, hostReview]);

  // console.log(watch('guestRating.averageRating'));
  const onHostReview: SubmitHandler<HostReviewTypes> = async (data) => {
    // console.log('onHostReview', data);
    try {
      if (!hostReview?.hostReviewStatus) {
        if (isReviewExpired(travelDetails?.tripInformation?.endTime)) {
          setAlertMessage(reviewExpiredAlert);
          setAlertColor('error');
        } else {
          await addHostReview({
            userId: userId,
            guestRating: {
              averageRating: data?.guestRating?.averageRating,
            },
            carReviewComment: data?.carReviewComment, //for reply
            userReviewComment: data?.userReviewComment,
            reservationId: reservationId,
          });
        }
      } else {
        if (isReviewEditExpired(hostReview?.guestRating?.createdAt)) {
          setAlertMessage(reviewEditExpiredAlert);
          setAlertColor('error');
        } else {
          await editHostReview({
            userId: userId,
            guestRating: {
              averageRating: data?.guestRating?.averageRating,
            },
            carReviewComment: data?.carReviewComment, //for reply
            userReviewComment: data?.userReviewComment,
            reservationId: reservationId,
          });
        }
      }
      // setReviewShow(true);
      setIsEditing(false);
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userId}/reservations/past/${reservationId}`);
    } catch (error) {
      console.log(error);
    }
  };
  //For Context Issue
  useEffect(() => {
    if (userId && reservationId) {
      if (!hostReview?.hostReviewStatus) {
        setIsEditing(true);
      }
    } else {
      reset();
    }
  }, [userId, reservationId, hostReview]);
  //For Button Issue
  const handleBackButtonClick = () => {
    router.back();
    router.back();
  };
  const isButtonDisabled = () => {
    if (!hostReview?.hostReviewStatus) {
      return isReviewExpired(travelDetails?.tripInformation?.endTime);
    } else {
      return isReviewEditExpired(hostReview?.guestRating?.createdAt);
    }
  };

  //Edit State
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const editState = queryParams.get('editState') === 'true';
    setIsEditing(editState);
  }, []);

  return (
    <div>
      <StepContainer>
        <div className="flex flex-row items-center">
          <Button onClick={handleBackButtonClick}>
            <IoMdArrowRoundBack size={isSmallScreen ? 30 : 40} className="text-primary" />
          </Button>
          <SectionHeader title="Review" noMargin={true} />
          {hostReview?.hostReviewStatus && <FiEdit onClick={handleEditClick} size={25} className="ml-4 text-primary cursor-pointer" />}
        </div>
        {alertMessage && (
          <Alert className="my-4" severity={alertColor}>
            {alertMessage}
          </Alert>
        )}
        {isEditing || !hostReview?.hostReviewStatus ? (
          <>
            <CommonForm handleFunction={handleSubmit(onHostReview)}>
              <ReviewGuest {...commonProps} />
              {hostReview?.guestReviewStatus && guestReview?.carComment?.comment !== '' && (
                <>
                  <div className="my-6">
                    <span className="font-bold my-4 text-lg md:text-2xl"> Vehicle Review from Guest</span>
                    <CarReviewView />
                  </div>
                </>
              )}
              <HostReply {...commonProps} />
              <div className="flex justify-center my-8">
                <Button
                  disabled={!formState?.isValid || isLoading || isEditLoading || isButtonDisabled()}
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="justify-end"
                >
                  {isLoading || isEditLoading ? 'Submitting' : 'Submit'}
                  {/* Submit */}
                </Button>
              </div>
            </CommonForm>
            {hostReview?.hostReviewStatus && (
              <>
                {hostReview?.guestReviewStatus ? (
                  <GuestReviewView />
                ) : (
                  <Alert className="mt-4" severity="info">
                    {'No Review From Guest yet'}
                  </Alert>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <HostReviewView />
          </>
        )}
      </StepContainer>
    </div>
  );
};

export default HostReview;
