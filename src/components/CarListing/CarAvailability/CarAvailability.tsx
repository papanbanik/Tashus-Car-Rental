'use client';

import CommonForm from '@/components/Common/CommonForm';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSaveCarAvailability } from '@/hooks/car-listing/useCarAvailability';
import { CarAvailabilityValues } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { getFormattedSelectedTime, getFormattedSelectedTimeForDb } from '@/utils/Functions/availabilityCommonFn';
import { getFormattedSelectedTimeUtc } from '@/utils/Functions/utcCommonFn';
import { carWeekAvailability } from '@/utils/Lists/carListInfo';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import StepContainer from '../StepContainer';
import StepHeader from '../StepHeader';
import AdvanceNotice from './AdvanceNotice';
import MaximumDuration from './MaximumDuration';
import MinimumDuration from './MinimumDuration';
import PickupReturn from './PickupReturn';

export const defaultCustomHour = {
  // startTime: new Date(new Date().setHours(7, 0, 0, 0)),
  // endTime: new Date(new Date().setHours(23, 0, 0, 0)),
  startTime: dayjs.utc().set('hour', 7).set('minute', 0).toDate(),
  endTime: dayjs.utc().set('hour', 23).set('minute', 0).toDate(),
  // startTime: new Date('2023-08-12T09:00:00Z'),
  // endTime: new Date('2023-08-12T17:00:00Z'),
  status: 'free',
};

const defaultValues: CarAvailabilityValues = {
  pickupReturnHour: {
    alwaysAvailable: false,
    customAvailability: carWeekAvailability.map((day) => ({
      checked: day.value === 'sat' || day.value === 'sun' ? true : false,
      dayOfWeek: day.value,
      allDay: false,
      availability: '',
      customHours: [defaultCustomHour],
    })),
  },
  noticeInAdvance: {
    alwaysAvailableImmediately: false,
    hoursRequired: 0, // [1-24]hrs
  },
  minTripDuration: {
    noMinimum: false,
    unit: 'hours', //['hours', 'days', 'weeks']
    shortestDuration: 0, // 3 hours, 6 hours, 9 hours, 12 hours, 1 day, 2 days, 3 days, 5 days, 1 week
  },
  maxTripDuration: {
    noMaximum: false,
    unit: 'days', //['days', 'weeks']
    longestDuration: 0, // 3 days, 5 days, 1 week, 10 days, 2 weeks, 3 weeks, 4 weeks, 5 weeks, 6 weeks.
  },
};

const CarAvailability = () => {
  const { partnerAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } =
    useForm<CarAvailabilityValues>({
      shouldFocusError: false,
      mode: 'onChange',
      defaultValues: defaultValues,
    });
  const { isDirty, isValid, errors } = formState;
  console.log(errors);
  const { handleSaveCurrentStep, updateCurrentStep, listingId, carData, getUpdatedSteps } = useCarListingContext();

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

  const { mutateAsync: saveCarAvailability, isLoading, isSuccess, isError, error } = useSaveCarAvailability();

  useEffect(() => {
    updateCurrentStep();
  }, []);

  const onAvailabilitySave: SubmitHandler<CarAvailabilityValues> = async (data) => {
    console.log('onAvailabilitySave', data);
    console.log(errors);
    try {
      const {
        pickupReturnHour: { alwaysAvailable, customAvailability },
        noticeInAdvance: { alwaysAvailableImmediately, hoursRequired },
        minTripDuration: { noMinimum, unit: minUnit, shortestDuration },
        maxTripDuration: { noMaximum, unit: maxUnit, longestDuration },
      } = data;
      const availability = {
        pickupReturnHour: {
          alwaysAvailable: alwaysAvailable,
          ...(!alwaysAvailable && {
            customAvailability: customAvailability.map((day) => ({
              dayOfWeek: day.dayOfWeek,
              availability: !day?.checked ? 'never' : day?.allDay ? 'always' : 'custom',
              customHours:
                !day?.checked || day?.allDay
                  ? []
                  : day?.customHours?.map((customHour) => {
                      return {
                        ...customHour,
                        startTime: getFormattedSelectedTimeForDb(customHour?.startTime),
                        endTime: getFormattedSelectedTimeForDb(customHour?.endTime),
                      };
                    }),
            })),
          }),
        },
        noticeInAdvance: {
          alwaysAvailableImmediately: alwaysAvailableImmediately,
          ...(!alwaysAvailableImmediately && { hoursRequired }),
        },
        minTripDuration: {
          noMinimum: noMinimum,
          ...(!noMinimum && { unit: minUnit, shortestDuration }),
        },
        maxTripDuration: {
          noMaximum: noMaximum,
          ...(!noMaximum && { unit: maxUnit, longestDuration }),
        },
      };
      // console.log('to be saved', availability);
      const tempSteps = await getUpdatedSteps(3);
      await saveCarAvailability({ listingId: listingId, availability, listingSteps: tempSteps });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePickupReturnHour = async (pickupReturnHour: any) => {
    if (pickupReturnHour?.alwaysAvailable) {
      setValue('pickupReturnHour.alwaysAvailable', true);
      setValue(
        'pickupReturnHour.customAvailability',
        carWeekAvailability.map((day) => ({
          checked: day.value === 'sat' || day.value === 'sun' ? true : false,
          dayOfWeek: day.value,
          allDay: false,
          availability: '',
          customHours: [defaultCustomHour],
        }))
      );
    } else {
      console.log(pickupReturnHour?.customAvailability);
      const tempCustomAvailability = pickupReturnHour?.customAvailability.map((day: any) => ({
        checked: day?.availability !== 'never',
        dayOfWeek: day.dayOfWeek,
        allDay: day?.availability === 'always',
        availability: '',
        customHours:
          day?.availability === 'custom'
            ? day?.customHours?.map((d: any) => ({
                startTime: getFormattedSelectedTimeUtc(new Date()?.toISOString(), d?.startTime),
                endTime: getFormattedSelectedTimeUtc(new Date()?.toISOString(), d?.endTime),
                // startTime: getFormattedSelectedTime(new Date(d?.startTime)),
                // endTime: getFormattedSelectedTime(new Date(d?.endTime)),
                status: d?.status,
              }))
            : [defaultCustomHour],
      }));
      setValue('pickupReturnHour.alwaysAvailable', false);
      setValue('pickupReturnHour.customAvailability', tempCustomAvailability);

      tempCustomAvailability.map((day: any, index: number) => {
        setValue(`pickupReturnHour.customAvailability.${index}.customHours`, day?.customHours);
      });
    }
  };

  const handleAdvanceNotice = async (noticeInAdvance: any) => {
    setValue('noticeInAdvance.alwaysAvailableImmediately', noticeInAdvance?.alwaysAvailableImmediately);
    setValue('noticeInAdvance.hoursRequired', noticeInAdvance?.alwaysAvailableImmediately ? 0 : noticeInAdvance?.hoursRequired);
  };

  const handleMinimumDuration = async (minTripDuration: any) => {
    setValue('minTripDuration.noMinimum', minTripDuration?.noMinimum);
    setValue('minTripDuration.shortestDuration', minTripDuration?.noMinimum ? 0 : minTripDuration?.shortestDuration);
    setValue('minTripDuration.unit', minTripDuration?.noMinimum ? 'hours' : minTripDuration?.unit);
  };

  const handleMaximumDuration = async (maxTripDuration: any) => {
    setValue('maxTripDuration.noMaximum', maxTripDuration?.noMaximum);
    setValue('maxTripDuration.longestDuration', maxTripDuration?.noMaximum ? 0 : maxTripDuration?.longestDuration);
    setValue('maxTripDuration.unit', maxTripDuration?.noMaximum ? 'days' : maxTripDuration?.unit);
  };

  useEffect(() => {
    const getUpdatedInfo = async () => {
      if (!listingId || !carData) {
        reset();
        return;
      }
      // console.log(carData);

      const { availability } = carData;
      if (!availability || !availability.noticeInAdvance) {
        reset();
        return;
      }
      // console.log('availability', availability);

      const { pickupReturnHour, noticeInAdvance, minTripDuration, maxTripDuration } = availability;
      pickupReturnHour?.customAvailability?.map((cs: any) => {
        cs?.customHours?.map((ca: any) => {
          const x = getFormattedSelectedTime(new Date(ca?.startTime));
        });
      });
      pickupReturnHour && (await handlePickupReturnHour(pickupReturnHour));
      noticeInAdvance && (await handleAdvanceNotice(noticeInAdvance));
      minTripDuration && (await handleMinimumDuration(minTripDuration));
      maxTripDuration && (await handleMaximumDuration(maxTripDuration));
    };
    getUpdatedInfo();
  }, [listingId, carData]);

  return (
    <StepContainer>
      <StepHeader title="Availability"></StepHeader>
      <CommonForm handleFunction={handleSubmit(onAvailabilitySave)}>
        <PickupReturn {...commonProps}></PickupReturn>
        <AdvanceNotice {...commonProps}></AdvanceNotice>
        <MinimumDuration {...commonProps}></MinimumDuration>
        <MaximumDuration {...commonProps}></MaximumDuration>
        <div className="flex justify-center mt-8">
          <Button
            disabled={!isValid || isLoading || !isDirty || isPartnerRestrict(partnerAccess)}
            // disabled={!formState?.isValid || !verifyIsValid || isLoading || isSuccess || !!listingErrorMessage}
            type="submit"
            variant="contained"
            color="primary"
            className="justify-end"
          >
            {isLoading ? 'Saving' : 'Save'}
            {/* {isLoading ? 'Saving' : isSuccess ? 'Saved' : 'Save'} */}
          </Button>
        </div>
      </CommonForm>
    </StepContainer>
  );
};

export default CarAvailability;
