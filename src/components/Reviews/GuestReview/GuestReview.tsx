'use client';
import SectionHeader from '@/components/CarListing/SectionHeader';
import StepContainer from '@/components/CarListing/StepContainer';
import CommonForm from '@/components/Common/CommonForm';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useGuestReview } from '@/hooks/review-ratings/guest-review/useGuestReview';
import { useGuestReviewEdit } from '@/hooks/review-ratings/guest-review/useGuestReviewEdit';
import { GuestReviewTypes } from '@/types/review-ratings/reviewRatingTypes';
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
import GuestReviewView from '../HostReview/GuestReviewView';
import HostReviewView from './HostReviewView';
import ReviewCar from './ReviewCar';
import ReviewHost from './ReviewHost';

const defaultValues: GuestReviewTypes = {
  carRating: {
    averageRating: 5,
  },
  hostRating: {
    averageRating: 5,
  },
};
const GuestReview = () => {
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const { guestReview } = useReviewRatingContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { travelDetails } = useProfileInfoContext();
  // console.log(travelDetails);
  // console.log(travelDetails?.tripInformation?.endTime);
  // const [isReviewShow, setReviewShow] = useState<boolean>(false);
  // console.log(guestReview);
  // const { data } = useReviewDetails();
  // console.log(data);
  // console.log(defaultValues);
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } = useForm<GuestReviewTypes>(
    {
      shouldFocusError: false,
      mode: 'onChange',
      defaultValues: defaultValues,
    }
  );

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

  // const params = useParams();
  // const userId = params['user-id'];
  // const reservationId = params['reservation-id'];
  const { userId, reservationId } = useParams<{ userId: string; reservationId: string }>();
  const [alertColor, setAlertColor] = useState<AlertColor>('warning');
  // useEffect(() => {
  //   if (!watch('hostRating.averageRating') || !watch('carRating.averageRating')) trigger('hostRating.averageRating');
  //   trigger('carRating.averageRating');
  // }, [watch('hostRating.averageRating'), watch('carRating.averageRating')]);
  // console.log(watch('hostRating.averageRating'));
  // console.log(watch('carRating.averageRating'));
  const { mutateAsync: addGuestReview, isLoading } = useGuestReview();
  const { mutateAsync: editGuestReview, isLoading: isEditLoading } = useGuestReviewEdit();

  //For Edit
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (watch('hostRating.averageRating') === undefined) {
      setValue('hostRating.averageRating', 5, { shouldValidate: true });
    }
    if (watch('carRating.averageRating') === undefined) {
      setValue('carRating.averageRating', 5, { shouldValidate: true });
    }
  }, [watch('hostRating.averageRating'), watch('carRating.averageRating')]);

  useEffect(() => {
    const getUpdatedGuestReview = async () => {
      if (userId && reservationId && guestReview) {
        const { hostRating, hostComment, carRating, carComment } = guestReview;
        setValue('hostRating.averageRating', hostRating?.averageRating);
        setValue('userReviewComment', hostComment?.comment);
        setValue('carRating.averageRating', carRating?.averageRating);
        setValue('carReviewComment', carComment?.comment);
      }
      //  else {
      //   reset();
      // }
      if (guestReview?.hostRating?.createdAt) {
        const createdDate = dayjs(guestReview?.hostRating?.createdAt);
        const result = calculateRemainingTime(createdDate.toDate());

        if (result !== null) {
          const { daysMessage, expirationDate } = result;
          // console.log(result);
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
    getUpdatedGuestReview();
  }, [reservationId, guestReview]);

  const onGuestReview: SubmitHandler<GuestReviewTypes> = async (data) => {
    // console.log('onGuestReview', data);
    try {
      if (!guestReview?.guestReviewStatus) {
        if (isReviewExpired(travelDetails?.tripInformation?.endTime)) {
          setAlertMessage(reviewExpiredAlert);
          setAlertColor('error');
        } else {
          await addGuestReview({
            userId: userId,
            carRating: {
              averageRating: data?.carRating?.averageRating,
            },
            hostRating: {
              averageRating: data?.hostRating?.averageRating,
            },
            carReviewComment: data?.carReviewComment,
            userReviewComment: data?.userReviewComment,
            reservationId: reservationId,
          });
        }
      } else {
        if (isReviewEditExpired(guestReview?.hostRating?.createdAt)) {
          setAlertMessage(reviewEditExpiredAlert);
          setAlertColor('error');
        } else {
          await editGuestReview({
            userId: userId,
            carRating: {
              averageRating: data?.carRating?.averageRating,
            },
            hostRating: {
              averageRating: data?.hostRating?.averageRating,
            },
            carReviewComment: data?.carReviewComment,
            userReviewComment: data?.userReviewComment,
            reservationId: reservationId,
          });
        }
      }
      setIsEditing(false);

      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userId}/travels/details/${reservationId}`);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId && reservationId && guestReview) {
      if (!guestReview?.guestReviewStatus) {
        setIsEditing(true);
      }
    }
    // else {
    //   reset();
    // }
  }, [userId, reservationId, guestReview]);

  //For Button issue
  const handleBackButtonClick = () => {
    router.back();
    router.back();
  };

  const isButtonDisabled = () => {
    if (!guestReview?.guestReviewStatus) {
      return isReviewExpired(travelDetails?.tripInformation?.endTime);
    } else {
      return isReviewEditExpired(guestReview?.hostRating?.createdAt);
    }
  };
  // console.log('hostRating.averageRating:', watch('hostRating.averageRating'));
  // console.log('carRating.averageRating:', watch('carRating.averageRating'));
  return (
    <div>
      <StepContainer>
        <div className="flex flex-row items-center">
          <Button onClick={handleBackButtonClick}>
            <IoMdArrowRoundBack size={isSmallScreen ? 30 : 40} className="text-primary" />
          </Button>
          <SectionHeader title="Review" noMargin={true} />
          {guestReview?.guestReviewStatus && <FiEdit onClick={handleEditClick} size={25} className="ml-4 text-primary cursor-pointer" />}
        </div>
        {alertMessage && (
          <Alert className="my-4" severity={alertColor}>
            {alertMessage}
          </Alert>
        )}
        {isEditing || !guestReview?.guestReviewStatus ? (
          <>
            <CommonForm handleFunction={handleSubmit(onGuestReview)}>
              <ReviewHost {...commonProps} />
              <div className="my-8">
                <ReviewCar {...commonProps} />
              </div>
              <div className="flex justify-center my-8">
                <Button
                  disabled={!formState?.isValid || isLoading || isEditLoading || isButtonDisabled()}
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="justify-end"
                >
                  {isLoading || isEditLoading ? 'Submitting' : 'Submit'}
                </Button>
              </div>
            </CommonForm>
            {guestReview?.guestReviewStatus && (
              <>
                {guestReview?.hostReviewStatus ? (
                  <HostReviewView />
                ) : (
                  <Alert className="mt-4" severity="info">
                    {'No Review from Partner yet'}
                  </Alert>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <GuestReviewView />
          </>
        )}
      </StepContainer>
    </div>
  );
};

export default GuestReview;
