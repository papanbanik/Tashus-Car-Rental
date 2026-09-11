'use client';
import { fetchAllCountryGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { IMapFormattedResult } from '@/types/mapLocations';
import { IMapSearchResidential, TOptions } from '@/types/user-verification/userVerificationTypes';
import { getFlagUrl } from '@/utils/Functions/randomCommonFn';
import { getFullAddress, setFormValues, useWatchedAddressFields } from '@/utils/Functions/verification/verificationFn';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { Country, ICountry, IState, State } from 'country-state-city';
import { ChangeEvent, useEffect, useState } from 'react';

const PostalAddressDetails = ({ register, control, watch, formState, setValue }: HookFormComponentProps) => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { errors } = formState;
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IMapSearchResidential[]>([]);
  const [selectedResult, setSelectedResult] = useState<IMapSearchResidential>();
  const [postalStateList, setResidentialStateList] = useState<TOptions[]>([]);
  const handleSearchTextChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    if (value.trim() !== '' && value?.length >= 3) {
      try {
        const locationList = await fetchAllCountryGeocoding(value);
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
    if (!!selectedResult) {
      setFormValues(selectedResult, 'postalAddressInfo', setValue);
    }
  }, [selectedResult]);

  const allCountries: ICountry[] = Country.getAllCountries();
  const countryOptions = allCountries?.map((country) => ({
    id: country.isoCode,
    label: country.name,
    value: country.isoCode,
    icon: getFlagUrl(country.isoCode),
  }));

  useEffect(() => {
    if (watch('postalAddressInfo.country')) {
      const getCountryId = countryOptions?.find((option) => option.value === watch('postalAddressInfo.country'));
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
        setValue('postalAddressInfo.state', '');
      }
    }
  }, [watch('postalAddressInfo.country')]);

  const validateState = (value: any) => {
    return !!(postalStateList?.length > 0 && value) || !!(postalStateList?.length === 0 && !value) || '';
  };

  const { streetName, countryName, stateName, streetNumber, unitNumber, suburb, postcode } = useWatchedAddressFields('postalAddressInfo', watch);

  //Reset country change
  useEffect(() => {
    if (!!userProfileVerificationInfo?.guestVerification?.residentialAddress) {
      const { postalAddressInfo } = userProfileVerificationInfo?.guestVerification?.residentialAddress;
      const isCountryChanged = countryName !== postalAddressInfo?.country;
      const isStreetChanged = streetName !== postalAddressInfo?.streetName;
      const isStateChanged = stateName !== postalAddressInfo?.state;
      const isUnitChanged = unitNumber !== postalAddressInfo?.unitNumber;
      const isStreetNumChanged = streetNumber !== postalAddressInfo?.streetNumber;
      if ((isCountryChanged || isStateChanged) && (!isUnitChanged || !isStreetNumChanged || !isStreetChanged) && !selectedResult) {
        const fieldsToReset = ['suburb', 'postcode', 'unitNumber', 'streetNumber', 'streetName'];
        fieldsToReset.forEach((field) => {
          setValue(`postalAddressInfo.${field}`, '');
        });
      } else if (!!selectedResult && (!isUnitChanged || !isStreetNumChanged)) {
        const fieldsToReset = ['unitNumber', 'streetNumber'];
        fieldsToReset.forEach((field) => {
          setValue(`postalAddressInfo.${field}`, '');
        });
      }
    }
  }, [countryName, streetName, stateName, userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddressInfo]);

  //Street Address Dynamically Add
  useEffect(() => {
    if (!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddressInfo || selectedResult) {
      return;
    }
    const addressValue = getFullAddress(unitNumber, streetNumber, streetName, suburb, stateName, postcode, countryName);
    setValue('postalAddressInfo.streetAddress', addressValue, { shouldValidate: true });
  }, [
    unitNumber,
    streetNumber,
    countryName,
    streetName,
    suburb,
    postcode,
    stateName,
    userProfileVerificationInfo?.guestVerification?.residentialAddress?.postalAddressInfo,
    selectedResult,
  ]);

  return (
    <div>
      <FormControl variant="standard" fullWidth>
        <Autocomplete
          options={searchResults}
          getOptionLabel={(option: any) => option?.complete_address}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Search your Postal Address"
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
          registerName="postalAddressInfo.country"
          options={countryOptions}
          label="Country"
          defaultValue={watch('postalAddressInfo.country')}
          emptyColor={true}
          isLabelShow={true}
          showFlag={true}
        ></SearchableDropdown>
      </div>
      <div className="grid grid-cols-2 gap-2 my-4">
        <TextField
          fullWidth
          size="small"
          value={watch('postalAddressInfo.unitNumber') ?? ''}
          label="Unit Number"
          {...register('postalAddressInfo.unitNumber', {
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
          error={!!errors?.postalAddressInfo?.unitNumber}
          helperText={errors?.postalAddressInfo?.unitNumber?.message}
        />
        <TextField
          fullWidth
          size="small"
          value={watch('postalAddressInfo.streetNumber') ?? ''}
          label="Street Number"
          {...register('postalAddressInfo.streetNumber', {
            pattern: {
              value: /^[A-Za-z0-9\s\-/.']+$/,
              message: 'Invalid Street Number',
            },
            maxLength: {
              value: 50,
              message: 'Length limit exceed',
            },
          })}
          error={!!errors?.postalAddressInfo?.streetNumber}
          helperText={errors?.postalAddressInfo?.streetNumber?.message}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TextField
          fullWidth
          size="small"
          value={watch('postalAddressInfo.streetName') ?? ''}
          label="Street Name"
          {...register('postalAddressInfo.streetName', {
            maxLength: {
              value: 100,
              message: 'Length limit exceed',
            },
          })}
          error={!!errors?.postalAddressInfo?.streetName}
          helperText={errors?.postalAddressInfo?.streetName?.message}
        />
        <TextField
          fullWidth
          size="small"
          value={watch('postalAddressInfo.postcode') ?? ''}
          label="Postal Code"
          {...register('postalAddressInfo.postcode', {
            pattern: {
              value: /^[A-Za-z0-9\s\-/.']+$/,
              message: 'Invalid Postcode',
            },
            maxLength: {
              value: 10,
              message: 'Length limit exceed',
            },
          })}
          error={!!errors?.postalAddressInfo?.postcode}
          helperText={errors?.postalAddressInfo?.postcode?.message}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 my-4">
        <TextField
          fullWidth
          size="small"
          value={watch('postalAddressInfo.suburb') ?? ''}
          label="Suburb"
          {...register('postalAddressInfo.suburb', {
            maxLength: {
              value: 50,
              message: 'Length limit exceed',
            },
          })}
          error={!!errors?.postalAddressInfo?.suburb}
          helperText={errors?.postalAddressInfo?.suburb?.message}
        />
        <SearchableDropdown
          control={control}
          registerName="postalAddressInfo.state"
          options={postalStateList}
          label="State"
          defaultValue={watch('postalAddressInfo.state')}
          // required={!!(watch('postalAddressInfo.country') && postalStateList?.length > 0)}
          disabled={!watch('postalAddressInfo.country') || postalStateList?.length === 0}
          validate={validateState}
          // emptyColor={true}
          isLabelShow={true}
        ></SearchableDropdown>
      </div>
      {/* <div className="my-4">
        <TextField
          fullWidth
          size="small"
          value={watch('postalAddressInfo.streetAddress') ?? ''}
          label="Street Address"
          disabled={!!selectedResult?.complete_address}
          {...register('postalAddressInfo.streetAddress', {
            maxLength: {
              value: 150,
              message: 'Length limit exceed',
            },
          })}
          error={!!errors?.postalAddressInfo?.streetAddress}
          helperText={errors?.postalAddressInfo?.streetAddress?.message}
        />
      </div> */}
    </div>
  );
};

export default PostalAddressDetails;
