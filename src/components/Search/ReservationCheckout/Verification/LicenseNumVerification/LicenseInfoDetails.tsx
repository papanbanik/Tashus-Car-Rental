'use client';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import SelectableDropdown from '@/components/Common/HookFormFields/SelectableDropdown';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { useUserCredContext } from '@/context/UserCredProvider';
import { genderList } from '@/types/commonTypes';
import { HookFormComponentProps } from '@/types/componentTypes';
import { TOptions } from '@/types/user-verification/userVerificationTypes';
import { currentDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { TextField } from '@mui/material';
import { Country, ICountry, IState, State } from 'country-state-city';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ILicenseNumVerModal } from './LicenseModal';

const LicenseInfoDetails = ({
  register,
  control,
  watch,
  formState,
  setValue,
  reset,
  getValues,
  trigger,
  setError,
  clearErrors,
  drivingLicenseData,
  dateOfBirth,
  returnDate,
  isDisabledData,
}: HookFormComponentProps & ILicenseNumVerModal) => {
  // console.log(drivingLicenseData);
  const { errors } = formState;
  const [licenseStateList, setLicenseStateList] = useState<TOptions[]>([]);
  const { userProfileInfo } = useUserCredContext();
  const allCountries: ICountry[] = Country.getAllCountries();
  const countryOptions = allCountries?.map((country) => ({
    id: country.isoCode,
    label: country.name,
    value: country.name,
  }));

  const minAge = 21;
  const maxAge = 75;
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
      }
    }
  }, [watch('drivingLicenseInfo.country')]);
  // Restricting past days including today for expiry date
  const validateExpiryDate = (selectedDate: any) => {
    const disableTill = dayjs(returnDate) || currentDateTime;
    return dayjs(selectedDate).isAfter(disableTill) || 'Invalid Date';
  };

  // Restricting dates not in range 21-75
  const validateDateOfBirth = (selectedDate: any) => {
    return (dayjs(selectedDate).isBefore(currentDateTime) && !disableDatesForDOB(selectedDate)) || 'Age needs to be between 21 to 75 years';
  };

  const disableDatesForDOB = (date: any) => {
    const diffYears = currentDateTime.diff(dayjs(date), 'year');
    const invalid = diffYears < minAge || diffYears > maxAge;
    return dayjs(date).isSame(currentDateTime, 'day') || invalid;
  };

  const validateState = (value: any) => {
    return !!(licenseStateList?.length > 0 && value) || !!(licenseStateList?.length === 0 && !value) || '';
  };

  useEffect(() => {
    if (watch('drivingLicenseInfo.country')) {
      trigger?.('drivingLicenseInfo.state');
    }
  }, [licenseStateList, watch('drivingLicenseInfo.country'), watch('drivingLicenseInfo.state')]);

  return (
    <div>
      <TextField
        fullWidth
        // disabled={!!drivingLicenseData}
        disabled={isDisabledData}
        className="mb-4"
        size="small"
        value={watch('drivingLicenseInfo.licenseName')}
        label="Full Name as in Driver's License"
        sx={{
          '& fieldset.MuiOutlinedInput-notchedOutline': {
            borderColor: `${watch('drivingLicenseInfo.licenseName') ? '' : '#f87272'}`,
          },
        }}
        InputLabelProps={{
          style: { color: errors?.drivingLicenseInfo?.licenseName ? '#f87272' : `${watch('drivingLicenseInfo.licenseName') ? '' : '#f87272'}` },
        }}
        // InputLabelProps={{
        //   style: { color: errors?.drivingLicenseInfo?.licenseName ? '#f87272' : '' },
        // }}
        {...register('drivingLicenseInfo.licenseName', {
          required: true,
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
        registerName={'drivingLicenseInfo.dateOfBirth'}
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
      />
      <div className="mt-4">
        <SelectableDropdown
          control={control}
          registerName="drivingLicenseInfo.gender"
          label="Gender"
          options={genderList}
          disabled={!!userProfileInfo?.gender || isDisabledData}
          required={true}
          errorColor={true}
        />
      </div>
      <div className="my-4">
        <SearchableDropdown
          // disabled={!!drivingLicenseData}
          disabled={isDisabledData}
          control={control}
          registerName="drivingLicenseInfo.country"
          options={countryOptions}
          label="License Issued Country"
          defaultValue={watch('drivingLicenseInfo.country')}
          required={true}
          // emptyColor={true}
        ></SearchableDropdown>
      </div>

      <div className="mt-4">
        <SearchableDropdown
          control={control}
          registerName="drivingLicenseInfo.state"
          options={licenseStateList}
          label="License Issued State / Region"
          defaultValue={watch('drivingLicenseInfo.state')}
          required={!!(watch('drivingLicenseInfo.country') && licenseStateList?.length > 0)}
          disabled={!watch('drivingLicenseInfo.country') || licenseStateList?.length === 0}
          validate={validateState}
        ></SearchableDropdown>
      </div>
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
        className="my-4"
        size="small"
        value={watch('drivingLicenseInfo.licenseNumber')}
        label="Driver's License Number"
        // sx={{
        //   '& fieldset.MuiOutlinedInput-notchedOutline': {
        //     borderColor: `${watch('drivingLicenseInfo.licenseNumber') ? '' : '#800080'}`,
        //   },
        // }}
        // InputLabelProps={{
        //   style: { color: errors?.drivingLicenseInfo?.licenseNumber ? '#f87272' : '' },
        // }}
        sx={{
          '& fieldset.MuiOutlinedInput-notchedOutline': {
            borderColor: `${watch('drivingLicenseInfo.licenseNumber') ? '' : '#f87272'}`,
          },
        }}
        InputLabelProps={{
          style: { color: errors?.drivingLicenseInfo?.licenseNumber ? '#f87272' : `${watch('drivingLicenseInfo.licenseNumber') ? '' : '#f87272'}` },
        }}
        inputProps={{
          onInput: (event) => {
            const inputValue = event.currentTarget.value;
            const uppercaseLetters = inputValue.replace(/[a-z]/g, (letter) => letter.toUpperCase());
            event.currentTarget.value = uppercaseLetters;
          },
        }}
        {...register('drivingLicenseInfo.licenseNumber', {
          required: true,
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
        required={true}
        registerName={'drivingLicenseInfo.expiryDate'}
        placeholder="Expiry Date (DD/MM/YYYY)"
        errors={errors?.drivingLicenseInfo?.expiryDate}
        disablePast={true}
        register={register}
        validateDate={validateExpiryDate}
        minDate={returnDate ? dayjs(returnDate).add(1, 'day').toDate() : dayjs().add(1, 'day').toDate()}
        errorColor={true}
      />
    </div>
  );
};

export default LicenseInfoDetails;
