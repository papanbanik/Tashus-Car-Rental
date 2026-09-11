'use client';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import SelectableDropdown from '@/components/Common/HookFormFields/SelectableDropdown';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { secondaryIDList } from '@/types/checkout/secondaryIDCheck';
import { HookFormComponentProps } from '@/types/componentTypes';
import { ISecondaryPhotoIDModal } from '@/types/user-verification/verificationListingSteps';
import { currentDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { getFlagUrl } from '@/utils/Functions/randomCommonFn';
import { TextField } from '@mui/material';
import { Country, ICountry } from 'country-state-city';
import dayjs from 'dayjs';

const SecondaryIDDetails = ({ register, control, watch, formState, returnDate, isDisabledData }: HookFormComponentProps & ISecondaryPhotoIDModal) => {
  const { errors } = formState;
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const allCountries: ICountry[] = Country.getAllCountries();
  const countryOptions = allCountries?.map((country) => ({
    id: country.isoCode,
    label: country.name,
    value: country.name,
    icon: getFlagUrl(country?.isoCode),
  }));
  const licenseCountry = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country;
  const isCountryAustralia = licenseCountry === 'Australia';
  const isIdTypePassport = watch('secondaryIdInfo.idType') === 'PassportId';
  const showExpiryDate = () => {
    const idType = userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.idType;
    const expiryDate = userProfileVerificationInfo?.guestVerification?.secondaryIdInfo?.expiryDate;
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
          label={!isCountryAustralia ? 'Passport ID' : 'Secondary ID'}
          options={secondaryIDList}
          required={true}
          disabled={isDisabledData || !isCountryAustralia}
          showRequired={true}
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
                  value: /^[A-Za-z.]+(?: [A-Za-z.]+)*$/,
                  message: 'Invalid ID Type',
                },
              })}
              error={!!errors?.secondaryIdInfo?.otherTypeName}
              helperText={errors?.secondaryIdInfo?.otherTypeName?.message}
              required
            />
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
              required
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
              required
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
        label={`${isIdTypePassport ? 'Passport' : 'ID'} Number`}
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
        required
      />
      <div className={`${watch('secondaryIdInfo.idType') === 'StudentId' ? 'mb-0' : 'mb-4'}`}>
        {watch('secondaryIdInfo.idType') !== 'StudentId' && (
          <SearchableDropdown
            disabled={isDisabledData}
            control={control}
            registerName="secondaryIdInfo.country"
            options={countryOptions}
            label={`${isIdTypePassport ? '' : 'ID'} Issued Country`}
            defaultValue={watch('secondaryIdInfo.country')}
            emptyColor={true}
            required={watch('secondaryIdInfo.idType') !== 'StudentId'}
            showFlag={true}
            showRequired={watch('secondaryIdInfo.idType') !== 'StudentId'}
          ></SearchableDropdown>
        )}
      </div>
      {showExpiryDate() && (
        <SingleDatePicker
          control={control}
          disabled={isDisabledData}
          required={watch('secondaryIdInfo.idType') !== 'NationalId' && watch('secondaryIdInfo.idType') !== 'Other'}
          showRequired={watch('secondaryIdInfo.idType') !== 'NationalId' && watch('secondaryIdInfo.idType') !== 'Other'}
          registerName={'secondaryIdInfo.expiryDate'}
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
    </div>
  );
};

export default SecondaryIDDetails;
