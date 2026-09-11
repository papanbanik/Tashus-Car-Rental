'use client';

import CommonForm from '@/components/Common/CommonForm';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSaveCarRates } from '@/hooks/car-listing/useCarRates';
import { CarRatesValues } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import StepContainer from '../StepContainer';
import StepHeader from '../StepHeader';
import AdvanceBooking from './AdvanceBooking';
import GeneralRates from './GeneralRates';
import LongBooking from './LongBooking';
import PeakIncrease from './PeakIncrease';

const defaultValues: CarRatesValues = {
  hourlyRates: {
    currency: 'aud',
    amount: 1,
  },
  dailyRates: {
    currency: 'aud',
    amount: 1,
  },
  peakIncrease: ['sat', 'sun'],
  peakIncreaseType: 'percentage',
  peakIncreaseAmount: '',
  peakIncreasePercentage: '',
  longBookingDiscounts: [
    {
      value: '',
      unit: 'days',
      percentage: '',
    },
  ],
  advanceBookingDiscounts: [
    {
      value: '',
      unit: 'days', // 'days' or 'weeks'
      percentage: '',
    },
  ],
  hasPeakIncrease: true,
  hasLongDiscounts: true,
  hasAdvanceDiscounts: true,
};

const CarPricing = () => {
  const { partnerAccess } = useProfileInfoContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, setError, clearErrors, trigger } = useForm<CarRatesValues>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { updateCurrentStep, listingId, getUpdatedSteps, carData } = useCarListingContext();
  const { mutateAsync: saveCarRates, isLoading } = useSaveCarRates();
  const { isDirty, isValid } = formState;
  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    setError,
    clearErrors,
    trigger,
  };

  useEffect(() => {
    updateCurrentStep();
  }, []);

  const handleDiscounts = async (discountList: any, registerName: string) => {
    discountList.map((booking: any, index: number) => {
      // @ts-ignore
      setValue(`${registerName}.${index}.unit`, booking?.unit);
      // @ts-ignore
      setValue(`${registerName}.${index}.value`, booking?.value);
      // @ts-ignore
      setValue(`${registerName}.${index}.percentage`, booking?.percentage);
    });
  };

  const handlePeakIncrease = async (peakIncrease: any) => {
    if (peakIncrease?.length > 0) {
      const tempPeakIncrease = peakIncrease.map((peak: any) => peak.dayOfWeek);
      setValue('peakIncrease', tempPeakIncrease);
      setValue('peakIncreaseType', peakIncrease[0].increaseType);
      peakIncrease[0].increaseType === 'amount'
        ? setValue('peakIncreaseAmount', peakIncrease[0].amount)
        : setValue('peakIncreasePercentage', peakIncrease[0].percentage);
      setValue('hasPeakIncrease', true);
    } else {
      setValue('peakIncrease', []);
      setValue('peakIncreaseType', '');
      setValue('peakIncreaseAmount', '');
      setValue('peakIncreasePercentage', '');
      setValue('hasPeakIncrease', false);
    }
  };

  useEffect(() => {
    const getUpdatedInfo = async () => {
      if (!listingId || !carData) {
        reset();
        return;
      }

      const { rates } = carData;
      if (!rates) {
        reset();
        return;
      }

      const {
        hourlyRates,
        dailyRates,
        peakIncrease,
        longBookingDiscounts,
        advanceBookingDiscounts,
        longBookingDiscountActive,
        advanceBookingDiscountActive,
      } = rates;
      hourlyRates && setValue('hourlyRates', hourlyRates);
      dailyRates && setValue('dailyRates', dailyRates);
      handlePeakIncrease(peakIncrease);
      // if (peakIncrease?.length > 0) {
      //   await handlePeakIncrease(peakIncrease);

      // }

      const hasLongDiscounts = longBookingDiscountActive ?? watch('hasLongDiscounts');
      const hasAdvanceDiscounts = advanceBookingDiscountActive ?? watch('hasAdvanceDiscounts');

      if (longBookingDiscounts?.length > 0) {
        setValue('longBookingDiscounts', longBookingDiscounts);
        handleDiscounts(longBookingDiscounts, 'longBookingDiscounts');
        setValue('hasLongDiscounts', hasLongDiscounts);
      } else {
        setValue('longBookingDiscounts.0.unit', 'days');
        setValue('hasLongDiscounts', hasLongDiscounts);
      }

      if (advanceBookingDiscounts?.length > 0) {
        setValue('advanceBookingDiscounts', advanceBookingDiscounts);
        await handleDiscounts(advanceBookingDiscounts, 'advanceBookingDiscounts');
        setValue('hasAdvanceDiscounts', hasAdvanceDiscounts);
      } else {
        setValue('advanceBookingDiscounts.0.unit', 'days');
        setValue('hasAdvanceDiscounts', hasAdvanceDiscounts);
      }
    };
    getUpdatedInfo();
  }, [listingId, carData]);

  // Converts numeric strings to number
  const convertNumericStringsToNumbers = async (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        convertNumericStringsToNumbers(obj[key]);
      } else if (!isNaN(obj[key])) {
        obj[key] = parseFloat(obj[key]);
      }
    }
  };

  const onCarRatesSave = async (data: any) => {
    // console.log('onCarRatesSave', data);
    try {
      const peakIncreaseList = data?.hasPeakIncrease
        ? data?.peakIncrease?.map((day: any) => {
            if (day) {
              const increaseType = data?.peakIncreaseType;
              const parsedAmount = increaseType === 'amount' ? parseFloat(data?.peakIncreaseAmount) : '';
              const parsedPercentage = increaseType === 'percentage' ? parseFloat(data?.peakIncreasePercentage) : '';

              const result: any = {
                dayOfWeek: day,
                increaseType: increaseType,
              };

              !parsedAmount ? (result.percentage = parsedPercentage) : (result.amount = parsedAmount);
              return result;
            }
          })
        : [];
      const {
        peakIncreaseType,
        peakIncreaseAmount,
        peakIncreasePercentage,
        longBookingDiscounts,
        advanceBookingDiscounts,
        peakIncrease,
        hasPeakIncrease,
        hasAdvanceDiscounts,
        hasLongDiscounts,
        ...filteredRates
      } = data;
      const rates = { ...filteredRates };
      const filteredLongDiscounts = longBookingDiscounts.filter((booking: any) => booking?.unit && booking?.percentage && booking?.value);
      const filteredAdvDiscounts = advanceBookingDiscounts.filter((booking: any) => booking?.unit && booking?.percentage && booking?.value);
      if (filteredLongDiscounts?.length > 0) {
        rates.longBookingDiscounts = filteredLongDiscounts;
      }

      if (filteredAdvDiscounts?.length > 0) {
        rates.advanceBookingDiscounts = advanceBookingDiscounts;
      }

      if (peakIncreaseList?.length > 0) {
        rates.peakIncrease = peakIncreaseList;
      }
      await convertNumericStringsToNumbers(rates);
      rates.longBookingDiscountActive = Boolean(hasLongDiscounts);
      rates.advanceBookingDiscountActive = Boolean(hasAdvanceDiscounts);

      const tempSteps = await getUpdatedSteps(4);
      await saveCarRates({ listingId, rates, listingSteps: tempSteps });
    } catch (error) {
      console.log('onCarRatesSaveError', error);
    }
  };

  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (listingId && carData?.rates) {
      const longBookingDiscounts = JSON.stringify(carData?.rates?.longBookingDiscounts);
      const currentLongBookingDiscounts = JSON.stringify(watch('longBookingDiscounts'));
      const advanceBookingDiscounts = JSON.stringify(carData?.rates?.advanceBookingDiscounts);
      const currentAdvanceBookingDiscounts = JSON.stringify(watch('advanceBookingDiscounts'));
      const currentPeakIncrease = watch('peakIncrease').map((dayOfWeek) => ({
        dayOfWeek,
        increaseType: watch('peakIncreaseType'),
        amount: watch('peakIncreaseAmount'),
      }));
      const peakIncrease = JSON.stringify(carData?.rates?.peakIncrease);
      const currentPeakIncreaseConvert = JSON.stringify(currentPeakIncrease);
      const currentLogBookingDiscountBtn = watch('hasLongDiscounts');
      const longBookingDiscountBtn = carData?.rates?.longBookingDiscountActive;
      const currentAdvanceBookingDiscountBtn = watch('hasAdvanceDiscounts');
      const advanceBookingDiscountBtn = carData?.rates?.advanceBookingDiscountActive;
      const hasPreviousPeakIncrease = (peakIncrease ?? []).length > 0;
      const hasNewPeakIncrease = watch('hasPeakIncrease');
      return (
        carData?.rates?.dailyRates?.amount !== +watch('dailyRates.amount') ||
        carData?.rates?.hourlyRates?.amount !== +watch('hourlyRates.amount') ||
        longBookingDiscounts !== currentLongBookingDiscounts ||
        advanceBookingDiscounts !== currentAdvanceBookingDiscounts ||
        hasPreviousPeakIncrease !== hasNewPeakIncrease ||
        peakIncrease !== currentPeakIncreaseConvert ||
        longBookingDiscountBtn !== currentLogBookingDiscountBtn ||
        advanceBookingDiscountBtn !== currentAdvanceBookingDiscountBtn
      );
    }
    return true;
  };

  return (
    <StepContainer>
      <CommonForm handleFunction={handleSubmit(onCarRatesSave)}>
        <StepHeader
          title="Rates"
          subtitle="Set your hourly and daily rates here. You can also add all kinds of discounts you would like to offer to attract more bookings. Please long press on help icons in touched devices"
        ></StepHeader>
        <GeneralRates {...commonProps}></GeneralRates>
        <PeakIncrease {...commonProps}></PeakIncrease>
        <StepHeader title="Discounts"></StepHeader>
        <LongBooking {...commonProps}></LongBooking>
        <AdvanceBooking {...commonProps}></AdvanceBooking>

        <div className="flex justify-center mt-8">
          <Button
            // disabled={!formState?.isValid || isLoading || !formState.isDirty || isPartnerRestrict(partnerAccess)}
            disabled={!isValid || isLoading || !hasDataChanged() || isPartnerRestrict(partnerAccess) || !isDirty}
            type="submit"
            variant="contained"
            color="primary"
          >
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>
    </StepContainer>
  );
};

export default CarPricing;
