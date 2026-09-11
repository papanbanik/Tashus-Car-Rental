import CommonForm from '@/components/Common/CommonForm';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { TDrivingLicenseInfo, useUserCredContext } from '@/context/UserCredProvider';
import { useDriverLicenseSave } from '@/hooks/guest-verification/useDriverLicenseSave';
import { TDate } from '@/types/commonTypes';
import { currentDateTime, isDrivingAgeValid } from '@/utils/Functions/dateTimeCommonFn';
import { Button, TextField, Typography } from '@mui/material';
import { Country, ICountry, IState, State } from 'country-state-city';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type TOptions = {
  id: string;
  label: string;
  value?: string;
};

export type LicenseNumVerType = {
  drivingLicenseInfo: TDrivingLicenseInfo;
};

export interface ILicenseNumVerModal {
  drivingLicenseData?: TDrivingLicenseInfo;
  dateOfBirth?: TDate;
  returnDate?: TDate;
}

const defaultValues: LicenseNumVerType = {
  drivingLicenseInfo: {
    gender: '',
    licenseName: '',
    licenseNumber: '',
    country: '',
    state: '',
    expiryDate: null,
    dateOfBirth: null,
  },
};

const LicenseNumVerModal = ({ drivingLicenseData, dateOfBirth, returnDate }: ILicenseNumVerModal) => {
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<LicenseNumVerType>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { errors, isValid } = formState;
  const [licenseStateList, setLicenseStateList] = useState<TOptions[]>([]);
  const { mutateAsync, isLoading, isSuccess } = useDriverLicenseSave();
  const { userCred, userProfileInfo } = useUserCredContext();

  const allCountries: ICountry[] = Country.getAllCountries();
  const countryOptions = allCountries?.map((country) => ({
    id: country.isoCode,
    label: country.name,
    value: country.name,
  }));

  const minAge = 21;
  const maxAge = 75;
  const isAgeValid = userProfileInfo?.dateOfBirth ? isDrivingAgeValid(userProfileInfo?.dateOfBirth) : true;
  // set saved data when updating info
  useEffect(() => {
    if (drivingLicenseData) {
      const { country, state, licenseName, licenseNumber, expiryDate } = drivingLicenseData;
      setValue('drivingLicenseInfo.licenseName', licenseName, { shouldValidate: true });
      setValue('drivingLicenseInfo.licenseNumber', licenseNumber, { shouldValidate: true });
      setValue('drivingLicenseInfo.dateOfBirth', dayjs(dateOfBirth).toDate(), { shouldValidate: true });
      setValue('drivingLicenseInfo.country', country, { shouldValidate: true });
      setValue('drivingLicenseInfo.state', state);
      setValue('drivingLicenseInfo.expiryDate', dayjs(expiryDate).toDate(), { shouldValidate: true });
    }
  }, [drivingLicenseData]);

  // set state list based on country
  useEffect(() => {
    if (watch('drivingLicenseInfo.country')) {
      const getCountryId = countryOptions?.find((option) => option.value === watch('drivingLicenseInfo.country'));
      // console.log(getCountryId);
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

  // added to resolve save button disable issue due to state
  useEffect(() => {
    if (watch('drivingLicenseInfo.country')) {
      trigger('drivingLicenseInfo.state');
    }
  }, [licenseStateList, watch('drivingLicenseInfo.country'), watch('drivingLicenseInfo.state')]);

  const onLicenseInfoSave: SubmitHandler<LicenseNumVerType> = async (data) => {
    try {
      // console.log(data);
      userCred?.userId && (await mutateAsync({ userId: userCred?.userId, drivingLicenseInfo: data?.drivingLicenseInfo }));
    } catch (error) {
      console.log('onLicenseInfoSave error', error);
    }
  };

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

  return (
    <div>
      <CommonForm handleFunction={handleSubmit(onLicenseInfoSave)}>
        <TextField
          fullWidth
          // disabled={!!drivingLicenseData}
          className="mb-4"
          size="small"
          value={watch('drivingLicenseInfo.licenseName')}
          label="Full Name as in Driver's License"
          sx={{
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: `${watch('drivingLicenseInfo.licenseName') ? '' : '#800080'}`,
            },
          }}
          InputLabelProps={{
            style: { color: errors?.drivingLicenseInfo?.licenseName ? '#f87272' : `${watch('drivingLicenseInfo.licenseName') ? '' : '#800080'}` },
          }}
          {...register('drivingLicenseInfo.licenseName', {
            required: true,
            // pattern: {
            //   value: /^[A-Za-z0-9\-&+#./_]{1,50}$/, //includes uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), and a specific set of symbols: hyphen (-), ampersand (&), plus sign (+), number sign (#), period (.), forward slash (/), and underscore (_). The backslash () is used to escape the hyphen (-) to avoid creating a character range. String should contain at least 1 character and at most 50 characters.
            //   message: 'Invalid License Name',
            // },
            pattern: {
              value: /^[A-Za-z. ]{1,30}$/, //includes uppercase letters (A-Z), lowercase letters (a-z), period (.), space,String should contain at least 1 character and at most 50 characters.
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
          disabled={!!drivingLicenseData}
          disablePast={false}
          disableFuture={true}
          disableHighlightToday={true}
          shouldDisableDate={disableDatesForDOB}
          register={register}
          validateDate={validateDateOfBirth}
          defaultValue={dayjs().subtract(minAge, 'year').toDate()}
          maxDate={dayjs().subtract(minAge, 'year').toDate()}
          minDate={dayjs().subtract(maxAge, 'year').toDate()}
        />

        <TextField
          fullWidth
          // disabled={!!drivingLicenseData}
          className="mt-4"
          size="small"
          value={watch('drivingLicenseInfo.licenseNumber')}
          label="Driver's License Number"
          sx={{
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: `${watch('drivingLicenseInfo.licenseNumber') ? '' : '#800080'}`,
            },
          }}
          InputLabelProps={{
            style: { color: errors?.drivingLicenseInfo?.licenseNumber ? '#f87272' : `${watch('drivingLicenseInfo.licenseNumber') ? '' : '#800080'}` },
          }}
          {...register('drivingLicenseInfo.licenseNumber', {
            required: true,
            pattern: {
              value: /^[A-Za-z0-9]{1,30}$/, //includes uppercase letters (A-Z), lowercase letters (a-z), digits (0-9)
              // value: /^[A-Za-z0-9\-&+#./_]{1,30}$/, //includes uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), and a specific set of symbols: hyphen (-), ampersand (&), plus sign (+), number sign (#), period (.), forward slash (/), and underscore (_). The backslash () is used to escape the hyphen (-) to avoid creating a character range. String should contain at least 1 character and at most 30 characters.
              message: 'Invalid License Number',
            },
          })}
          error={!!errors?.drivingLicenseInfo?.licenseNumber}
          helperText={errors?.drivingLicenseInfo?.licenseNumber?.message}
        />

        <div className="my-4">
          <SearchableDropdown
            // disabled={!!drivingLicenseData}
            control={control}
            registerName="drivingLicenseInfo.country"
            options={countryOptions}
            label="License Issued Country"
            defaultValue={watch('drivingLicenseInfo.country')}
            required={true}
            emptyColor={true}
          ></SearchableDropdown>
        </div>

        <div className="mb-4">
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

        <SingleDatePicker
          control={control}
          required={true}
          registerName={'drivingLicenseInfo.expiryDate'}
          placeholder="Expiry Date (DD/MM/YYYY)"
          errors={errors?.drivingLicenseInfo?.expiryDate}
          disablePast={true}
          register={register}
          validateDate={validateExpiryDate}
          minDate={returnDate ? dayjs(returnDate).add(1, 'day').toDate() : dayjs().add(1, 'day').toDate()}
        />
        {userProfileInfo?.guestVerification?.drivingLicenseInfo && (
          <>
            <Typography className="my-4 text-justify text-sm text-accent">
              <b>{`N.B:`}</b> {`The modification for the Driver's License will be effective after validate the information from support agent`}
            </Typography>
          </>
        )}
        {!isAgeValid && (
          <Typography className="md:text-sm text-sm font-thin text-gray-400 italic text-left mb-6">
            {`To modify your DOB, please contact our `}
            <Link
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_DOMAIN}/support/support-center/general`}
              className="text-primary inline-block no-underline font-bold italic"
            >
              support team
            </Link>
          </Typography>
        )}
        <div className="flex justify-center col-span-12 p-0">
          <Button disabled={!isValid || isLoading} type="submit" variant="contained" color="primary" className="mt-4">
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>
    </div>
  );
};

export default LicenseNumVerModal;
