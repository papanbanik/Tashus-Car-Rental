'use client';

import CommonForm from '@/components/Common/CommonForm';
import ConfirmationCheck from '@/components/Common/ConfirmationCheck';
import AdditionalDriver from '@/components/Search/ReservationCheckout/Verification/AdditionalDriver/AdditionalDriver';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useSaveCarInsurance } from '@/hooks/car-listing/useInsurancePolicy';
import { PrivacyPolicy, VehicleInfoEditProps } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SectionHeader from '../SectionHeader';
import StepContainer from '../StepContainer';
import StepHeader from '../StepHeader';
import PolicyPackages from './PolicyPackages';
import VehiclePolicy from './VehiclePolicy';

const InsurancePolicy = ({ isEdit }: VehicleInfoEditProps) => {
  const { partnerAccess } = useProfileInfoContext();
  const { handleSaveCurrentStep, updateCurrentStep, listingId, carData, getUpdatedSteps } = useCarListingContext();
  const { userCred } = useUserCredContext();
  const { mutateAsync: saveCarInsurance, isLoading, isSuccess, isError, error } = useSaveCarInsurance();
  useEffect(() => {
    updateCurrentStep();
  }, []);
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } = useForm<PrivacyPolicy>({
    shouldFocusError: false,
    mode: 'onChange',
    // defaultValues: defaultValues,
  });
  // console.log(watch('insurance.coveragePercentage'));
  const { openModal, closeModal } = useModalContext();
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
  // console.log(carData);
  //Confirmation Check
  const onCarInsuranceSave: SubmitHandler<PrivacyPolicy> = async (data) => {
    // console.log('InsuranceData', data);
    // console.log(data?.insurance?.coverageType);
    // console.log(carData?.insurancePolicies[carData?.insurancePolicies.length - 1]?.coverageType);
    if (isEdit && data?.insurance?.coverageType !== carData?.insurancePolicies[carData?.insurancePolicies?.length - 1]?.coverageType) {
      openModal({
        content: (
          <ConfirmationCheck
            title="Are you sure to modify coverage package?"
            subTitle="As a reminder, the modification to the package coverage will take effect two days from today."
            agreeButtonText="Yes"
            disagreeButtonText="No"
            agreeButtonAction={async () => {
              try {
                const tempSteps = await getUpdatedSteps(8);
                await saveCarInsurance({
                  listingId: listingId,
                  hostId: userCred?.userId,
                  insurance: {
                    coverageType: data?.insurance?.coverageType,
                    coveragePercentage: data?.insurance?.coveragePercentage,
                    excessFee: data?.insurance?.excessFee,
                    carMarketValue: data?.insurance?.carMarketValue,
                  },
                  listingSteps: tempSteps,
                });
                closeModal();
              } catch (error: any) {
                console.log(error);
                closeModal();
              }
            }}
            disagreeButtonAction={closeModal}
          />
        ),
      });
    } else {
      try {
        const tempSteps = await getUpdatedSteps(8);
        await saveCarInsurance({
          listingId: listingId,
          hostId: userCred?.userId,
          // carMarketValue: data?.carMarketValue,
          insurance: {
            coverageType: data?.insurance?.coverageType,
            coveragePercentage: data?.insurance?.coveragePercentage,
            excessFee: data?.insurance?.excessFee,
            carMarketValue: data?.insurance?.carMarketValue,
          },
          listingSteps: tempSteps,
        });
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (listingId && carData?.insurancePolicies?.length > 0 && carData?.carMarketValue) {
      const { insurancePolicies, carMarketValue } = carData;
      const latestInsurancePolicies = insurancePolicies[insurancePolicies?.length - 1];
      const currentMarketValue = watch('insurance.carMarketValue');
      const currentCoverageType = watch('insurance.coverageType');
      return carMarketValue !== currentMarketValue || latestInsurancePolicies?.coverageType !== currentCoverageType;
    }
    return true;
  };

  return (
    <StepContainer>
      <div>
        <StepHeader title="Partnership Policy"></StepHeader>
        {/* <p className="bg-purple-200 text-primary p-4 rounded-lg">
          Kindly note that, as our valued partner, you are entitled to 75% of the income from each successfully completed reservation, while Tashus
          holds 25%.
        </p> */}
        <CommonForm handleFunction={handleSubmit(onCarInsuranceSave)}>
          <VehiclePolicy {...commonProps} isEdit={isEdit} />
          <PolicyPackages {...commonProps} isEdit={isEdit} />
          <SectionHeader title="Additional Drivers of the Vehicle" subtitle="" />
          <div className="bg-gray-200 p-2 rounded-lg">
            <AdditionalDriver></AdditionalDriver>
          </div>
          <div className="flex justify-center mt-8">
            {/* {!isEdit && ( */}
            <Button
              type="submit"
              disabled={!formState?.isValid || isLoading || !hasDataChanged() || isPartnerRestrict(partnerAccess)}
              variant="contained"
              color="primary"
              // onClick={onCarInsuranceSave}
              // onClick={() => handleSaveCurrentStep(8, parseInt(listingId))}
            >
              {isLoading ? 'Saving' : 'Save'}
            </Button>
            {/* )} */}
          </div>
        </CommonForm>
      </div>
    </StepContainer>
  );
};

export default InsurancePolicy;
