'use client';

import CommonForm from '@/components/Common/CommonForm';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useAddCarDetails } from '@/hooks/car-listing/useAddCarDetails';
import { useCarListingVerification } from '@/hooks/car-listing/useCarListingVerification';
import { useGetFuelList } from '@/hooks/car-listing/useGetFuelList';
import { LicenseValues, TCarInfo, TLicenseVerifiedData, VehicleInfoEditProps } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { getFuelInfo } from '@/utils/Functions/carListingCommonFn';
import { stateList } from '@/utils/Lists/carListInfo';
import { Button, CircularProgress, Container, TextField } from '@mui/material';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import CarListingNotAllowed from '../CarListingNotAllowed';
import SectionHeader from '../SectionHeader';
import StepContainer from '../StepContainer';
import StepHeader from '../StepHeader';
import CarFeatures from './CarFeatures';
import CarInfoForm from './CarInfoForm';

const defaultVerifyValues: LicenseValues = {
  licensePlate: {
    number: '',
    state: '',
  },
};

const defaultValues: TCarInfo = {
  licensePlate: {
    number: '',
    state: '',
  },
  vin: '',
  make: '',
  model: '',
  year: 0,
  expiry: null,
  color: '',
  carType: '',
  seats: 1,
  doors: 2,
  windows: 2,
  fuelType: '',
  transmissionType: '',
  mileage: {
    distance: 0,
    units: 'km',
  },
  trim: '',
  features: [],
  additionalInfos: {
    carDescription: '',
    guidelines: '',
  },
  additionalFeatures: [{ feature: '' }],
  vehicleObligations: {
    neverWrittenOff: false,
    ctpInsurance: false,
  },
  isOwnerAgreed: false,
  carNickName: '',
};

const CarInformation = ({ isEdit }: VehicleInfoEditProps) => {
  useGetFuelList();
  const { partnerAccess } = useProfileInfoContext();
  const {
    listingId,
    carData,
    licenseVerifiedData,
    setLicenseVerifiedData,
    setVerifyCar,
    listingErrorMessage,
    setListingErrorMessage,
    setListingSuccessMessage,
    listingSuccessMessage,
    handleSaveCurrentStep,
    listingSteps,
    getUpdatedSteps,
    setIsCarLicenseVerified,
    isCarLicenseVerified,
    setListingSteps,
    vehicleFuelList,
  } = useCarListingContext();
  const { userCred, userProfileInfo } = useUserCredContext();
  const [isAllowListing, setIsAllowListing] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const { isAllowListing: isPartner } = userProfileInfo ?? {};

  useEffect(() => {
    const fetchAllowListing = () => {
      setIsAllowListing(null); // Set to loading state
      const localAllowListing = JSON.parse(localStorage.getItem('tashus') || '{}')?.isAllowListing;
      if (isPartner !== undefined) {
        setIsAllowListing(isPartner);
      } else if (searchParams.get('from') === 'redirection') {
        setIsAllowListing(localAllowListing ?? false);
      }
    };
    fetchAllowListing();
  }, [searchParams, isPartner]);

  // Car verification
  const {
    control: verifyControl,
    register: verifyRegister,
    handleSubmit: verifySubmit,
    watch: verifyWatch,
    formState: verifyFormState,
    setValue: setVerifyValue,
    reset: verifyReset,
    setError,
    clearErrors,
  } = useForm({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultVerifyValues,
  });
  const { errors: verifyErrors, isDirty: verifyIsDirty, isValid: verifyIsValid } = verifyFormState;
  const {
    data,
    refetch: verifyCar,
    isInitialLoading: verifyIsLoading,
    isSuccess: verifyIsSuccess,
    error: verifyError,
    isError: verifyIsError,
  } = useCarListingVerification(verifyWatch('licensePlate'));

  // Car data save
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<TCarInfo>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { mutateAsync: saveCarInfo, isLoading, isSuccess, error, isError } = useAddCarDetails();

  useEffect(() => {
    if (licenseVerifiedData?.make) {
      // console.log(licenseVerifiedData);
      const { vin, make, model, year, color, expiry } = licenseVerifiedData;
      setValue('vin', vin);
      setValue('make', make);
      setValue('model', model);
      setValue('year', parseInt(year), { shouldValidate: true });
      setValue('expiry', expiry, { shouldValidate: true });
      setValue('color', color ? color : '');
      setValue('carType', '');
      setValue('seats', 1);
      setValue('doors', 2);
      setValue('windows', 2);
      setValue('fuelType', '');
      setValue('transmissionType', '');
      setValue('mileage.distance', 0);
      setValue('trim', '');
      setValue('vehicleObligations.neverWrittenOff', false);
      setValue('vehicleObligations.ctpInsurance', false);
      setValue('isOwnerAgreed', false);
    }
  }, [licenseVerifiedData]);

  useEffect(() => {
    setLicenseVerifiedData({} as TLicenseVerifiedData);
    setListingErrorMessage('');
    setListingSuccessMessage('');
    setIsCarLicenseVerified(false);
  }, []);

  useEffect(() => {
    const selectedFuelType = watch('fuelType');
    if (!!selectedFuelType && vehicleFuelList?.fuelData?.length > 0) {
      const { fuelType, unitPrice, unitName } = getFuelInfo(selectedFuelType, vehicleFuelList?.fuelData);
      setValue('fuelInfo.fuelType', fuelType);
      setValue('fuelInfo.unitPrice', unitPrice);
      setValue('fuelInfo.unitName', unitName);
    }
  }, [watch('fuelType'), carData?.car]);

  useEffect(() => {
    const getUpdatedInfo = async () => {
      if (listingId && carData) {
        // console.log(carData);
        const { car, features, additionalInfos, additionalFeatures, vehicleObligations, carNickName } = carData;
        const tempAdditionalFeatures = additionalFeatures?.map((feature: any) => ({ feature }));
        if (car && features && additionalInfos && additionalFeatures && vehicleObligations) {
          const { expiry, fuelType, ...carOthers } = car;
          const match = vehicleFuelList?.fuelData?.find((fuel) => fuel?.fuelType === fuelType);
          Object.keys(defaultValues).forEach((fieldName) => {
            // console.log(fieldName);
            fieldName === 'fuelType'
              ? match
                ? setValue('fuelType', fuelType)
                : setValue('fuelType', '')
              : fieldName === 'features'
              ? setValue('features', features)
              : // : fieldName === 'additionalInfos'
              // ? setValue('additionalInfos', additionalInfos, { shouldValidate: true })
              fieldName === 'additionalFeatures'
              ? setValue('additionalFeatures', tempAdditionalFeatures)
              : fieldName === 'additionalFeatures'
              ? setValue('additionalFeatures', tempAdditionalFeatures)
              : fieldName === 'vehicleObligations'
              ? setValue('vehicleObligations', vehicleObligations)
              : fieldName === 'expiry'
              ? setValue('expiry', expiry ? dayjs(expiry).toDate() : null, { shouldValidate: true })
              : fieldName === 'carNickName'
              ? setValue('carNickName', carNickName)
              : setValue(fieldName as keyof typeof defaultValues, carOthers[fieldName as keyof typeof carOthers]);
            if (fieldName === 'additionalInfos') {
              setValue('additionalInfos.carDescription', additionalInfos?.carDescription, { shouldValidate: true });
              setValue('additionalInfos.guidelines', additionalInfos?.guidelines, { shouldValidate: true });
            }
            trigger('additionalInfos.carDescription');
            trigger('additionalInfos.guidelines');
          });
          setValue('isOwnerAgreed', true, { shouldValidate: true });
          setVerifyValue('licensePlate.number', car?.licensePlate?.number);
          setVerifyValue('licensePlate.state', car?.licensePlate?.state);
          setIsCarLicenseVerified(true);
        }
        // console.log(formState?.touchedFields);
        // console.log(!!formState?.touchedFields);
      } else {
        // for new car listing reset to default values
        reset();
        verifyReset();
        setListingSteps([]);
        // setCarData({});
      }
    };
    getUpdatedInfo();
  }, [listingId, carData, vehicleFuelList]);

  const validateState = (value: any) => {
    const invalid = !!(value !== 'NT' && value !== 'ACT');
    return invalid || 'Tashus service not available in this state';
  };

  const onCarInfoSave: SubmitHandler<TCarInfo> = async (data) => {
    // console.log('car details', data);
    // console.log('listingId', listingId);

    const { features, additionalFeatures: addFeatures, additionalInfos, vehicleObligations, carNickName, isOwnerAgreed, ...car } = data;
    const additionalFeatures = addFeatures.map((item) => item.feature);
    // console.log(carNickName);
    // console.log(features);
    // console.log(additionalFeatures);
    // console.log(additionalInfos);
    // console.log(vehicleObligations);
    // console.log(car);

    try {
      setListingErrorMessage('');
      setListingSuccessMessage('');
      const { userId: hostId } = userCred;
      // console.log('hostId', hostId);
      const tempSteps = await getUpdatedSteps(1);
      // console.log(tempSteps);
      await saveCarInfo({
        hostId,
        listingId,
        car,
        features,
        additionalFeatures,
        additionalInfos,
        vehicleObligations,
        listingSteps: tempSteps,
        carNickName: carNickName?.trim(),
      });
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const onCarInfoVerify: SubmitHandler<any> = async (data) => {
    // console.log('car details', data);
    try {
      setValue('licensePlate.number', data?.licensePlate.number);
      setValue('licensePlate.state', data?.licensePlate.state);
      setLicenseVerifiedData({} as TLicenseVerifiedData);
      setListingErrorMessage('');
      setListingSuccessMessage('');
      setVerifyCar(true);
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  // console.log(!formState?.isValid, isLoading, verifyIsLoading, !isCarLicenseVerified, !!listingErrorMessage);
  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (listingId && carData) {
      const carAdditionalFeatures = carData?.additionalFeatures || [];
      const watchAdditionalFeatures = watch('additionalFeatures') || [];
      const watchFeatureValues = watchAdditionalFeatures?.map((item: any) => item?.feature);
      const expiryDate = carData?.car?.expiry ? new Date(carData?.car?.expiry) : null;
      const checkExpiry = !!expiryDate ? expiryDate?.toISOString() !== watch('expiry')?.toISOString() : true;
      return (
        carData?.additionalInfos?.carDescription !== watch('additionalInfos.carDescription') ||
        carData?.additionalInfos?.guidelines !== watch('additionalInfos.guidelines') ||
        // JSON.stringify(carData?.features) !== JSON.stringify(watch('features')) ||
        carData?.features.join() !== watch('features').join() ||
        carAdditionalFeatures.join() !== watchFeatureValues.join() ||
        carData?.car?.seats !== watch('seats') ||
        carData?.car?.windows !== watch('windows') ||
        carData?.car?.doors !== watch('doors') ||
        carData?.car?.licensePlate?.number !== watch('licensePlate.number') ||
        carData?.car?.licensePlate?.state !== watch('licensePlate.state') ||
        carData?.carNickName !== watch('carNickName') ||
        carData?.car?.vin !== watch('vin') ||
        carData?.car?.make !== watch('make') ||
        carData?.car?.model !== watch('model') ||
        carData?.car?.year !== watch('year') ||
        checkExpiry ||
        // expiryDate.toISOString() !== watch('expiry')?.toISOString() ||
        // carData?.car?.expiry?.toISOString() !== watch('expiry')?.toISOString() ||
        carData?.car?.transmissionType !== watch('transmissionType') ||
        carData?.car?.fuelType !== watch('fuelType') ||
        carData?.car?.carType !== watch('carType') ||
        carData?.car?.mileage?.distance !== watch('mileage.distance') ||
        carData?.car?.trim !== watch('trim') ||
        carData?.car?.color !== watch('color')
      );
    }
    return true;
  };
  return (
    <>
      {isAllowListing === null ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : isAllowListing ? (
        <StepContainer>
          <StepHeader title="Vehicle Information"></StepHeader>
          <SectionHeader title="Vehicle Details"></SectionHeader>

          <CommonForm handleFunction={verifySubmit(onCarInfoVerify)}>
            <div className="grid grid-cols-12 gap-4 p-0 mt-4 w-full">
              <TextField
                className="md:col-span-6 col-span-12"
                value={verifyWatch('licensePlate.number').toLocaleUpperCase()}
                label="License Plate Number"
                size="small"
                fullWidth
                // focused={!verifyWatch('licensePlate.number')}
                sx={{
                  '& fieldset.MuiOutlinedInput-notchedOutline': {
                    borderColor: `${verifyWatch('licensePlate.number') ? '' : '#f87272'}`,
                  },
                }}
                InputLabelProps={{
                  style: { color: `${verifyWatch('licensePlate.number') ? '' : '#f87272'}` },
                }}
                {...verifyRegister('licensePlate.number', {
                  required: true,
                  pattern: {
                    value: /^[A-Za-z0-9\-&+#./_]{1,10}$/, //includes uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), and a specific set of symbols: hyphen (-), ampersand (&), plus sign (+), number sign (#), period (.), forward slash (/), and underscore (_). The backslash () is used to escape the hyphen (-) to avoid creating a character range. String should contain at least 1 character and at most 20 characters.
                    message: 'Invalid License Plate Number',
                  },
                })}
                error={!!verifyErrors?.licensePlate?.number}
                helperText={verifyErrors?.licensePlate?.number?.message}
                disabled={listingSteps[0]?.isCompleted || isEdit || verifyIsLoading}
              />

              {stateList && (
                <Container className={`${isEdit ? 'md:col-span-6' : 'md:col-span-4'} col-span-12 p-0`}>
                  <SearchableDropdown
                    control={verifyControl}
                    // register={verifyRegister}
                    registerName="licensePlate.state"
                    options={stateList}
                    label="License Plate State"
                    defaultValue={verifyWatch('licensePlate.state')}
                    required={true}
                    errors={verifyErrors?.licensePlate?.state}
                    validate={validateState}
                    setError={setError}
                    clearErrors={clearErrors}
                    disabled={!!listingSteps[0]?.isCompleted || isEdit || verifyIsLoading}
                  ></SearchableDropdown>
                </Container>
              )}

              {!isEdit && (
                <Container className="flex justify-end md:col-span-2 col-span-12 p-0">
                  <Button
                    fullWidth
                    disabled={!verifyIsValid || verifyIsLoading}
                    type="submit"
                    variant="contained"
                    color="success"
                    className="mb-4 items-center justify-center normal-case"
                  >
                    {verifyIsLoading ? 'Verifying' : 'Verify'}
                  </Button>
                </Container>
              )}
            </div>
          </CommonForm>

          <CommonForm handleFunction={handleSubmit(onCarInfoSave)}>
            <CarInfoForm
              register={register}
              handleSubmit={handleSubmit}
              control={control}
              formState={formState}
              watch={watch}
              setValue={setValue}
              trigger={trigger}
            ></CarInfoForm>
            <CarFeatures
              register={register}
              handleSubmit={handleSubmit}
              control={control}
              formState={formState}
              watch={watch}
              setValue={setValue}
            ></CarFeatures>

            <SectionHeader title="Owner Agreement"></SectionHeader>
            <div className="col-span-12 p-0 mb-2">
              <CheckBox
                control={control}
                registerName="isOwnerAgreed"
                htmlLabel={
                  <span className={`${isEdit ? 'text-sm' : ''} text-justify `}>
                    {'I hereby acknowledge and confirm my agreement to the terms and conditions outlined in the '}
                    <Link target="_blank" href={'/legals/owner-agreement'} className="text-primary inline-block no-underline font-bold italic">
                      Owner Agreement
                    </Link>
                    {' of Tashus'}
                  </span>
                }
                required={true}
              ></CheckBox>
            </div>

            <Container className="flex justify-center col-span-12 p-0">
              {isEdit ? (
                <>
                  <Button
                    // disabled={!formState?.isValid || isLoading || !formState.isDirty}
                    disabled={!formState?.isValid || isLoading || !hasDataChanged() || isPartnerRestrict(partnerAccess)}
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="mb-4"
                  >
                    {isLoading ? 'Saving' : 'Save'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    disabled={
                      !formState?.isValid ||
                      isLoading ||
                      verifyIsLoading ||
                      !isCarLicenseVerified ||
                      // !formState.isDirty ||
                      !hasDataChanged() ||
                      isPartnerRestrict(partnerAccess)
                    }
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="mb-4"
                  >
                    {isLoading ? 'Saving' : 'Save'}
                  </Button>
                </>
              )}
            </Container>
          </CommonForm>
        </StepContainer>
      ) : (
        <CarListingNotAllowed />
      )}
    </>
  );
};

export default CarInformation;
