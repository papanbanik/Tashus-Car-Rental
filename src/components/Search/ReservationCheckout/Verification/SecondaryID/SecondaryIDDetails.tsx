'use client';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import SelectableDropdown from '@/components/Common/HookFormFields/SelectableDropdown';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { useUserCredContext } from '@/context/UserCredProvider';
import { secondaryIDList } from '@/types/checkout/secondaryIDCheck';
import { TDate } from '@/types/commonTypes';
import { HookFormComponentProps } from '@/types/componentTypes';
import { currentDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { TextField } from '@mui/material';
import { Country, ICountry, IState, State } from 'country-state-city';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
type TOptions = {
  id: string;
  label: string;
  value?: string;
};
export interface ISecondaryPhotoIDModal {
  returnDate?: TDate;
  isDisabledData?: boolean;
}
const SecondaryIDDetails = ({
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
  returnDate,
  isDisabledData,
}: HookFormComponentProps & ISecondaryPhotoIDModal) => {
  const { errors } = formState;
  const [idStateList, setLicenseStateList] = useState<TOptions[]>([]);
  const { userProfileInfo } = useUserCredContext();
  const allCountries: ICountry[] = Country.getAllCountries();
  const countryOptions = allCountries?.map((country) => ({
    id: country.isoCode,
    label: country.name,
    value: country.name,
  }));
  // console.log(userProfileInfo?.guestVerification?.secondaryIdInfo);
  const showExpiryDate = () => {
    const idType = userProfileInfo?.guestVerification?.secondaryIdInfo?.idType;
    const expiryDate = userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate;
    // console.log(expiryDate);
    // console.log(!!expiryDate);
    if (watch('secondaryIdInfo.idType') === idType) {
      if (idType === 'NationalId' || idType === 'Other') {
        return !!expiryDate;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  // console.log(showExpiryDate());
  // set state list based on country
  useEffect(() => {
    if (watch('secondaryIdInfo.country')) {
      const getCountryId = countryOptions?.find((option) => option.value === watch('secondaryIdInfo.country'));
      // console.log(getCountryId);
      const stateList: IState[] = State.getStatesOfCountry(getCountryId?.id);
      // console.log(stateList);
      const stateOptions = stateList?.map((state) => ({
        id: state.isoCode,
        label: state.name,
        value: state.name,
      }));
      setLicenseStateList(stateOptions);
    }
  }, [watch('secondaryIdInfo.country')]);

  // Restricting past days including today for expiry date
  // const validateExpiryDate = (selectedDate: any) => {
  //   const disableTill = dayjs(returnDate) || currentDateTime;
  //   return dayjs(selectedDate).isAfter(disableTill) || 'Invalid Date';
  // };

  const validateExpiryDate = (selectedDate: any) => {
    if (watch('secondaryIdInfo.idType') === 'NationalId' || watch('secondaryIdInfo.idType') === 'Other') {
      return true;
    }

    const disableTill = dayjs(returnDate) || currentDateTime;
    return dayjs(selectedDate).isAfter(disableTill) || '';
  };

  return (
    <div>
      <div className="mb-4">
        <SelectableDropdown
          control={control}
          registerName="secondaryIdInfo.idType"
          label="Secondary ID Type"
          options={secondaryIDList}
          required={true}
          disabled={isDisabledData}
        />
        {watch('secondaryIdInfo.idType') === 'Other' && (
          <>
            <TextField
              fullWidth
              disabled={isDisabledData}
              className="mt-4"
              size="small"
              label="ID Type"
              InputLabelProps={{
                style: { color: errors?.secondaryIdInfo?.otherTypeName ? '#f87272' : '' },
              }}
              {...register('secondaryIdInfo.otherTypeName', {
                required: true,
                pattern: {
                  // value: /^[A-Za-z]{1,20}$/,
                  // value: /^(?:(?=[A-Za-z ]{1,20}$)[A-Za-z]+( [A-Za-z]+)?)$/,
                  value: /^[A-Za-z.]+(?: [A-Za-z.]+)*$/,
                  message: 'Invalid ID Type',
                },
              })}
              error={!!errors?.secondaryIdInfo?.otherTypeName}
              helperText={errors?.secondaryIdInfo?.otherTypeName?.message}
            />
            {/* AddedIssuingAuthority Field */}
            <TextField
              fullWidth
              className="mt-4"
              size="small"
              label="Issuing Authority"
              InputLabelProps={{
                style: { color: errors?.secondaryIdInfo?.issuingAuthority ? '#f87272' : '' },
              }}
              {...register('secondaryIdInfo.issuingAuthority', {
                required: true,
                pattern: {
                  value: /^[A-Za-z. ]{1,50}$/,
                  message: 'Invalid Issuing Authority',
                },
              })}
              error={!!errors?.secondaryIdInfo?.issuingAuthority}
              helperText={errors?.secondaryIdInfo?.issuingAuthority?.message}
            />
          </>
        )}
        {watch('secondaryIdInfo.idType') === 'StudentId' && (
          <>
            <TextField
              disabled={isDisabledData}
              fullWidth
              className="mt-4"
              size="small"
              label="Institution Name"
              InputLabelProps={{
                style: { color: errors?.secondaryIdInfo?.institutionName ? '#f87272' : '' },
              }}
              {...register('secondaryIdInfo.institutionName', {
                required: true,
                pattern: {
                  // value: /^[A-Za-z]{1,20}$/,
                  // value: /^(?:(?=[A-Za-z ]{1,20}$)[A-Za-z]+( [A-Za-z]+)?)$/,
                  value: /^[A-Za-z. ]{1,50}$/,
                  message: 'Invalid Institution Name',
                },
              })}
              error={!!errors?.secondaryIdInfo?.institutionName}
              helperText={errors?.secondaryIdInfo?.institutionName?.message}
            />
          </>
        )}
      </div>
      <TextField
        fullWidth
        disabled={isDisabledData}
        className="mb-4"
        size="small"
        value={watch('secondaryIdInfo.idNumber')}
        label="ID Number"
        InputLabelProps={{
          style: { color: errors?.secondaryIdInfo?.idNumber ? '#f87272' : '' },
        }}
        {...register('secondaryIdInfo.idNumber', {
          required: true,
          pattern: {
            value: /^[A-Za-z0-9]{1,30}$/,
            message: 'Invalid ID Number',
          },
        })}
        error={!!errors?.secondaryIdInfo?.idNumber}
        helperText={errors?.secondaryIdInfo?.idNumber?.message}
      />
      {/* <div className="mb-4"> */}
      <div className={`${watch('secondaryIdInfo.idType') === 'StudentId' ? 'mb-0' : 'mb-4'}`}>
        {watch('secondaryIdInfo.idType') !== 'StudentId' && (
          <SearchableDropdown
            disabled={isDisabledData}
            control={control}
            registerName="secondaryIdInfo.country"
            options={countryOptions}
            label="ID Issued Country"
            defaultValue={watch('secondaryIdInfo.country')}
            emptyColor={true}
            // required={true}
            required={watch('secondaryIdInfo.idType') !== 'StudentId'}
          ></SearchableDropdown>
        )}
      </div>
      {/* State hidden */}
      {/* <div className="mb-4">
        <SearchableDropdown
          control={control}
          registerName="secondaryIdInfo.state"
          options={idStateList}
          label="ID Issued State / Region"
          defaultValue={watch('secondaryIdInfo.state')}
          required={watch('secondaryIdInfo.idType') === 'PassportId' && watch('secondaryIdInfo.country') && idStateList?.length > 0}
          // required={!!(watch('secondaryIdInfo.country') && idStateList?.length > 0)}
          disabled={!watch('secondaryIdInfo.country') || idStateList?.length === 0}
        ></SearchableDropdown>
      </div> */}
      {/* {watch('secondaryIdInfo.idType') !== 'NationalId' && ( */}
      {showExpiryDate() && (
        <SingleDatePicker
          control={control}
          disabled={isDisabledData}
          // required={false}
          required={watch('secondaryIdInfo.idType') !== 'NationalId' && watch('secondaryIdInfo.idType') !== 'Other'}
          // required={!['National ID', 'Other'].includes(watch('secondaryIdInfo.idType'))}
          registerName={'secondaryIdInfo.expiryDate'}
          // placeholder="Expiry Date (MM/DD/YYYY)"
          placeholder={
            watch('secondaryIdInfo.idType') === 'NationalId' || watch('secondaryIdInfo.idType') === 'Other'
              ? 'Expiry Date (DD/MM/YYYY) [Optional]'
              : 'Expiry Date (DD/MM/YYYY)'
          }
          errors={errors?.secondaryIdInfo?.expiryDate}
          disablePast={true}
          register={register}
          validateDate={validateExpiryDate}
          minDate={returnDate ? dayjs(returnDate).add(1, 'day').toDate() : dayjs().add(1, 'day').toDate()}
        />
      )}
      {/* )} */}
    </div>
  );
};

export default SecondaryIDDetails;
