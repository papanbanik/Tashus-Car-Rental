'use client';
import { fetchAllCountryGeocoding, fetchForwardGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import SectionHeader from '@/components/CarListing/SectionHeader';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { IMapFormattedResult } from '@/types/mapLocations';
import { IMapSearchResidential, TOptions } from '@/types/user-verification/userVerificationTypes';
import { ResidentialAddressDetailsProps } from '@/types/user-verification/verificationListingSteps';
import { getCountryCodeByName, getFlagUrl } from '@/utils/Functions/randomCommonFn';
import { getFullAddress, setFormValues, useWatchedAddressFields } from '@/utils/Functions/verification/verificationFn';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { Country, ICountry, IState, State } from 'country-state-city';
import { ChangeEvent, useEffect, useState } from 'react';

const ResidentialAddressDetailsM = ({ register, control, watch, formState, setValue }: ResidentialAddressDetailsProps) => {
  const { userProfileVerificationInfo } = useProfileInfoContext();

  const { errors } = formState;
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IMapSearchResidential[]>([]);
  const [selectedResult, setSelectedResult] = useState<IMapSearchResidential>();
  const [residentialStateList, setResidentialStateList] = useState<TOptions[]>([]);

  const licenseCountry = userProfileVerificationInfo?.guestVerification?.drivingLicenseInfo?.country ?? '';
  const isCountryAustralia = licenseCountry === 'Australia';

  const handleSearchTextChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    const residentialCountryCode =
      watch('residentialAddressInfo.country') ||
      userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.country ||
      '';
    const licenseCountryCode = !!licenseCountry ? getCountryCodeByName(licenseCountry) : '';
    const countryCode = residentialCountryCode || licenseCountryCode;
    const residentialAus = userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.country === 'AU';
    const isAustraliaSearch = !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo
      ? residentialAus
      : isCountryAustralia;
    if (value.trim() !== '' && value?.length >= 3) {
      try {
        // const locationList = await (isCountryAustralia ? fetchForwardGeocoding(value) : fetchAllCountryGeocoding(value, countryCode?.toLowerCase()));
        const locationList = await (isAustraliaSearch ? fetchForwardGeocoding(value) : fetchAllCountryGeocoding(value));
        const response: IMapFormattedResult[] = transformGeocodingResult(locationList);
        setSearchResults(response);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAutocompleteChange = (event: React.ChangeEvent<{}>, value: IMapSearchResidential | null) => {
    if (value) {
      setSelectedResult(value);
      // console.log(value);
    }
  };
  useEffect(() => {
    if (selectedResult) {
      setFormValues(selectedResult, 'residentialAddressInfo', setValue);
    }
  }, [selectedResult]);

  const allCountries: ICountry[] = Country.getAllCountries();
  const countryOptions = allCountries?.map((country) => ({
    id: country.isoCode,
    label: `${country.name}`,
    value: country.isoCode,
    icon: getFlagUrl(country.isoCode),
  }));

  useEffect(() => {
    if (watch('residentialAddressInfo.country')) {
      const getCountryId = countryOptions?.find((option) => option.value === watch('residentialAddressInfo.country'));
      const stateList: IState[] = State.getStatesOfCountry(getCountryId?.id);
      // console.log(stateList);
      const stateOptions = stateList?.map((state) => ({
        id: state.isoCode,
        label: state.name,
        value: state.isoCode,
      }));
      setResidentialStateList(stateOptions);
      // console.log(stateOptions);
      if (stateOptions?.length === 0) {
        setValue('residentialAddressInfo.state', '');
      }
    }
  }, [watch('residentialAddressInfo.country')]);

  const validateState = (value: any) => {
    return !!(residentialStateList?.length > 0 && value) || !!(residentialStateList?.length === 0 && !value) || '';
  };
  const { streetName, countryName, stateName, streetNumber, unitNumber, suburb, postcode } = useWatchedAddressFields('residentialAddressInfo', watch);
  //Reset if Country Change
  useEffect(() => {
    if (!!userProfileVerificationInfo?.guestVerification?.residentialAddress) {
      const { residentialAddressInfo } = userProfileVerificationInfo?.guestVerification?.residentialAddress;
      const isCountryChanged = countryName !== residentialAddressInfo?.country;
      const isStreetChanged = streetName !== residentialAddressInfo?.streetName;
      const isStateChanged = stateName !== residentialAddressInfo?.state;
      const isUnitChanged = unitNumber !== residentialAddressInfo?.unitNumber;
      const isStreetNumChanged = streetNumber !== residentialAddressInfo?.streetNumber;
      if ((isCountryChanged || isStateChanged) && (!isUnitChanged || !isStreetNumChanged || !isStreetChanged) && !selectedResult) {
        const fieldsToReset = ['suburb', 'postcode', 'unitNumber', 'streetNumber', 'streetName', 'streetAddress'];
        fieldsToReset.forEach((field) => {
          setValue(`residentialAddressInfo.${field}`, '');
        });
      } else if (!!selectedResult && !isUnitChanged && !isStreetNumChanged) {
        const fieldsToReset = ['unitNumber', 'streetNumber'];
        fieldsToReset.forEach((field) => {
          setValue(`residentialAddressInfo.${field}`, '');
        });
      } else if (!!selectedResult && selectedResult?.country?.short_code?.toUpperCase() !== countryName) {
        const fieldsToReset = ['suburb', 'postcode', 'unitNumber', 'streetNumber', 'streetName', 'streetAddress'];
        fieldsToReset.forEach((field) => {
          setValue(`residentialAddressInfo.${field}`, '');
        });
        setSelectedResult({} as IMapSearchResidential);
        setSearchText('');
      }
    }
  }, [countryName, streetName, stateName, userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo]);
  //Street Address Dynamically Add
  useEffect(() => {
    if (!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo || !!selectedResult) {
      return;
    }
    const addressValue = getFullAddress(unitNumber, streetNumber, streetName, suburb, stateName, postcode, countryName);
    setValue('residentialAddressInfo.streetAddress', addressValue, { shouldValidate: true });
  }, [
    unitNumber,
    streetNumber,
    countryName,
    streetName,
    suburb,
    postcode,
    stateName,
    userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo,
    selectedResult,
  ]);

  return (
    <div>
      <div className="my-4">
        <SectionHeader title="Residential Address" textSize="text-md" noMargin={true} isMandatory={true} />
      </div>
      <FormControl variant="standard" fullWidth>
        <Autocomplete
          options={searchResults}
          getOptionLabel={(option: any) => option?.complete_address}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Search your Residential Address"
              variant="outlined"
              value={searchText}
              onChange={handleSearchTextChange}
              key={params.id}
            />
          )}
          onChange={handleAutocompleteChange}
          onInputChange={() => {}}
          value={selectedResult}
        />
      </FormControl>
      <div className="my-4">
        <SearchableDropdown
          control={control}
          registerName="residentialAddressInfo.country"
          options={countryOptions}
          label="Country"
          defaultValue={watch('residentialAddressInfo.country')}
          required={true}
          // emptyColor={true}
          isLabelShow={true}
          showFlag={true}
          showRequired={true}
        ></SearchableDropdown>
      </div>
      <div className="grid grid-cols-2 gap-2 my-4">
        <TextField
          fullWidth
          size="small"
          value={watch('residentialAddressInfo.unitNumber') ?? ''}
          label="Unit Number"
          {...register('residentialAddressInfo.unitNumber', {
            required: false,
            pattern: {
              value: /^[A-Za-z0-9\s\-/.']+$/,
              message: 'Invalid Unit Number',
            },
            maxLength: {
              value: 50,
              message: 'Length limit exceed',
            },
          })}
          error={!!errors?.residentialAddressInfo?.unitNumber}
          helperText={errors?.residentialAddressInfo?.unitNumber?.message}
        />
        <TextField
          fullWidth
          size="small"
          value={watch('residentialAddressInfo.streetNumber') ?? ''}
          label="Street Number"
          {...register('residentialAddressInfo.streetNumber', {
            required: true,
            pattern: {
              value: /^[A-Za-z0-9\s\-/.']+$/,
              message: 'Invalid Street Number',
            },
            maxLength: {
              value: 50,
              message: 'Length limit exceed',
            },
          })}
          sx={{
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: `${watch('residentialAddressInfo.streetNumber') ? '' : '#f87272'}`,
            },
          }}
          InputLabelProps={{
            style: { color: `${watch('residentialAddressInfo.streetNumber') ? '' : '#f87272'}` },
          }}
          error={!!errors?.residentialAddressInfo?.streetNumber}
          helperText={errors?.residentialAddressInfo?.streetNumber?.message}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TextField
          fullWidth
          size="small"
          value={watch('residentialAddressInfo.streetName') ?? ''}
          label="Street Name"
          {...register('residentialAddressInfo.streetName', {
            required: true,
            maxLength: {
              value: 100,
              message: 'Length limit exceed',
            },
          })}
          sx={{
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: `${watch('residentialAddressInfo.streetName') ? '' : '#f87272'}`,
            },
          }}
          InputLabelProps={{
            style: { color: `${watch('residentialAddressInfo.streetName') ? '' : '#f87272'}` },
          }}
          error={!!errors?.residentialAddressInfo?.streetName}
          helperText={errors?.residentialAddressInfo?.streetName?.message}
          required
        />
        <TextField
          fullWidth
          size="small"
          value={watch('residentialAddressInfo.postcode') ?? ''}
          label="Postal Code"
          {...register('residentialAddressInfo.postcode', {
            required: true,
            pattern: {
              value: /^[A-Za-z0-9\s\-/.']+$/,
              message: 'Invalid Postcode',
            },
            maxLength: {
              value: 10,
              message: 'Length limit exceed',
            },
          })}
          sx={{
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: `${watch('residentialAddressInfo.postcode') ? '' : '#f87272'}`,
            },
          }}
          InputLabelProps={{
            style: { color: `${watch('residentialAddressInfo.postcode') ? '' : '#f87272'}` },
          }}
          error={!!errors?.residentialAddressInfo?.postcode}
          helperText={errors?.residentialAddressInfo?.postcode?.message}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2 my-4">
        <TextField
          fullWidth
          size="small"
          value={watch('residentialAddressInfo.suburb') ?? ''}
          label="Suburb"
          {...register('residentialAddressInfo.suburb', {
            required: true,
            maxLength: {
              value: 50,
              message: 'Length limit exceed',
            },
          })}
          sx={{
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: `${watch('residentialAddressInfo.suburb') ? '' : '#f87272'}`,
            },
          }}
          InputLabelProps={{
            style: { color: `${watch('residentialAddressInfo.suburb') ? '' : '#f87272'}` },
          }}
          error={!!errors?.residentialAddressInfo?.suburb}
          helperText={errors?.residentialAddressInfo?.suburb?.message}
          required
        />
        <SearchableDropdown
          control={control}
          registerName="residentialAddressInfo.state"
          options={residentialStateList}
          label="State"
          defaultValue={watch('residentialAddressInfo.state')}
          required={!!(watch('residentialAddressInfo.country') && residentialStateList?.length > 0)}
          disabled={!watch('residentialAddressInfo.country') || residentialStateList?.length === 0}
          validate={validateState}
          // emptyColor={true}
          isLabelShow={true}
          showRequired={!!(watch('residentialAddressInfo.country') && residentialStateList?.length > 0)}
        ></SearchableDropdown>
      </div>
      {/* <div className="my-4">
        <TextField
          fullWidth
          size="small"
          value={watch('residentialAddressInfo.streetAddress') ?? ''}
          label="Street Address"
          disabled={!!selectedResult?.complete_address}
          {...register('residentialAddressInfo.streetAddress', {
            required: true,
            maxLength: {
              value: 150,
              message: 'Length limit exceed',
            },
          })}
          sx={{
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: `${watch('residentialAddressInfo.streetAddress') ? '' : '#f87272'}`,
            },
          }}
          InputLabelProps={{
            style: { color: `${watch('residentialAddressInfo.streetAddress') ? '' : '#f87272'}` },
          }}
          error={!!errors?.residentialAddressInfo?.streetAddress}
          helperText={errors?.residentialAddressInfo?.streetAddress?.message}
          required
        />
      </div> */}
    </div>
  );
};

export default ResidentialAddressDetailsM;
