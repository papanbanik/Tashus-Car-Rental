'use client';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import SelectableDropdown from '@/components/Common/HookFormFields/SelectableDropdown';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { genderList } from '@/types/commonTypes';
import { HookFormComponentProps } from '@/types/componentTypes';
import { ILicenseNumVerModal, TOptions } from '@/types/user-verification/userVerificationTypes';
import { currentDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { getFlagUrl } from '@/utils/Functions/randomCommonFn';
import { disableDatesForDOB, maxAge, minAge, validateDateOfBirth } from '@/utils/Functions/verification/verificationFn';
import { TextField } from '@mui/material';
import { Country, ICountry, IState, State } from 'country-state-city';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const LicenseDetails = ({ register, control, watch, formState, setValue, trigger, isDisabledData }: HookFormComponentProps & ILicenseNumVerModal) => {
  const { errors } = formState;
  const [licenseStateList, setLicenseStateList] = useState<TOptions[]>([]);
  const { reservationInfo } = useSearchContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();

  const drivingLicenseData = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo;
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const returnDate = reservationInfo?.returnTime;

  const allCountries: ICountry[] = Country.getAllCountries();
  const countryOptions = allCountries?.map((country) => ({
    id: country.isoCode,
    label: country.name,
    value: country.name,
    icon: getFlagUrl(country.isoCode),
  }));

  // Restricting past days including today for expiry date
  const validateExpiryDate = (selectedDate: any) => {
    if (!selectedDate) {
      return true;
    }
    const disableTill = dayjs(returnDate) || currentDateTime;
    return dayjs(selectedDate).isAfter(disableTill) || 'Invalid Date';
  };

  // set state list based on country
  useEffect(() => {
    if (watch('drivingLicenseInfo.country')) {
      const getCountryId = countryOptions?.find((option) => option.value === watch('drivingLicenseInfo.country'));
      const stateList: IState[] = State.getStatesOfCountry(getCountryId?.id);
      // console.log(stateList);
      const stateOptions = stateList?.map((state) => ({
        id: state.isoCode,
        label: state.name,
        value: state.name,
      }));
      setLicenseStateList(stateOptions);
      if (stateOptions?.length === 0) {
        setValue('drivingLicenseInfo.state', '');
      } else if (!stateOptions.some((option) => option.value === watch('drivingLicenseInfo.state'))) {
        setValue('drivingLicenseInfo.state', ''); // Reset the state if it's not part of the new state's list
      }
    }
  }, [watch('drivingLicenseInfo.country')]);

  const validateState = (value: any) => {
    return !!(licenseStateList?.length > 0 && value) || !!(licenseStateList?.length === 0 && !value) || '';
  };

  useEffect(() => {
    if (watch('drivingLicenseInfo.country')) {
      trigger?.('drivingLicenseInfo.state');
      if (watch('drivingLicenseInfo.license') !== '') {
        trigger?.('drivingLicenseInfo.license');
      }
    }
  }, [licenseStateList, watch('drivingLicenseInfo.country'), watch('drivingLicenseInfo.state'), watch('drivingLicenseInfo.license')]);

  return (
    <div className="flex flex-col gap-4">
      <TextField
        fullWidth
        disabled={isDisabledData}
        size="small"
        value={watch('drivingLicenseInfo.licenseName')}
        label="Full Name as in Driver's License"
        {...register('drivingLicenseInfo.licenseName', {
          pattern: {
            value: /^[A-Za-z. ]{1,30}$/,
            message: 'Invalid License Name',
          },
          maxLength: {
            value: 300,
            message: 'Length limit exceed',
          },
        })}
        error={!!errors?.drivingLicenseInfo?.licenseName}
        helperText={errors?.drivingLicenseInfo?.licenseName?.message}
      />
      <SingleDatePicker
        control={control}
        required={true}
        registerName={'dateOfBirth'}
        placeholder="Date of Birth (DD/MM/YYYY)"
        errors={errors?.drivingLicenseInfo?.dateOfBirth}
        disabled={!!drivingLicenseData || isDisabledData}
        disablePast={false}
        disableFuture={true}
        disableHighlightToday={true}
        shouldDisableDate={disableDatesForDOB}
        register={register}
        validateDate={validateDateOfBirth}
        defaultValue={dayjs().subtract(minAge, 'year').toDate()}
        maxDate={dayjs().subtract(minAge, 'year').toDate()}
        minDate={dayjs().subtract(maxAge, 'year').toDate()}
        errorColor={true}
        showRequired={true}
      />
      <SelectableDropdown
        control={control}
        registerName="gender"
        label="Gender"
        options={genderList}
        disabled={!!profileInfo?.gender || isDisabledData}
        required={true}
        errorColor={true}
        showRequired={true}
      />

      <SearchableDropdown
        disabled={isDisabledData}
        control={control}
        registerName="drivingLicenseInfo.country"
        options={countryOptions}
        label="License Issued Country"
        defaultValue={watch('drivingLicenseInfo.country')}
        required={true}
        showFlag={true}
        showRequired={true}
      />

      <SearchableDropdown
        control={control}
        registerName="drivingLicenseInfo.state"
        options={licenseStateList}
        label="License Issued State / Region"
        defaultValue={watch('drivingLicenseInfo.state')}
        // required={!!(watch('drivingLicenseInfo.country') && licenseStateList?.length > 0)}
        disabled={!watch('drivingLicenseInfo.country') || licenseStateList?.length === 0}
        // validate={validateState}
        emptyColor={true}
      />

      {/* Driver's License Number Requirements:
        - Length of the driver's license must be between 4 and 9 characters.
        - Only alphanumeric characters are allowed, no special characters or spaces.
        - At least 4 characters must be numeric.
        - No more than 2 characters can be alphabetic.
        - The third and fourth characters must be numeric.
        Other Country:  includes uppercase letters (A-Z), lowercase letters (a-z), digits (0-9) */}
      <TextField
        fullWidth
        // disabled={!!drivingLicenseData}
        disabled={isDisabledData}
        size="small"
        value={watch('drivingLicenseInfo.licenseNumber')}
        label="Driver's License Number"
        // sx={{
        //   '& fieldset.MuiOutlinedInput-notchedOutline': {
        //     borderColor: `${watch('drivingLicenseInfo.licenseNumber') ? '' : '#f87272'}`,
        //   },
        // }}
        // InputLabelProps={{
        //   style: { color: errors?.drivingLicenseInfo?.licenseNumber ? '#f87272' : `${watch('drivingLicenseInfo.licenseNumber') ? '' : '#f87272'}` },
        // }}
        inputProps={{
          onInput: (event) => {
            const inputValue = event.currentTarget.value;
            const uppercaseLetters = inputValue.replace(/[a-z]/g, (letter) => letter.toUpperCase());
            event.currentTarget.value = uppercaseLetters;
          },
        }}
        {...register('drivingLicenseInfo.licenseNumber', {
          // required: true,
          pattern: {
            value:
              watch('drivingLicenseInfo.country') === 'Australia'
                ? /^(?=[A-Z0-9]{4,9}$)(?=(?:.*[0-9]){4})(?=(?:[^A-Z]*[A-Z]){0,2}[^A-Z]*$)[A-Z0-9]{2}[0-9]{2}[A-Z0-9]{0,5}$/
                : /^[A-Za-z0-9]{1,30}$/,
            message: 'Invalid License Number',
          },
        })}
        error={!!errors?.drivingLicenseInfo?.licenseNumber}
        helperText={errors?.drivingLicenseInfo?.licenseNumber?.message}
      />
      <SingleDatePicker
        control={control}
        disabled={isDisabledData}
        // required={true}
        registerName={'drivingLicenseInfo.expiryDate'}
        placeholder="Expiry Date (DD/MM/YYYY)"
        errors={errors?.drivingLicenseInfo?.expiryDate}
        disablePast={true}
        register={register}
        validateDate={validateExpiryDate}
        minDate={returnDate ? dayjs(returnDate).add(1, 'day').toDate() : dayjs().add(1, 'day').toDate()}
        // errorColor={true}
      />
    </div>
  );
};

export default LicenseDetails;
