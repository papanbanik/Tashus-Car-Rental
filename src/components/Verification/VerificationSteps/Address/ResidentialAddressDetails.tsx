'use client';
import { fetchForwardGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import SectionHeader from '@/components/CarListing/SectionHeader';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import { useUserCredContext } from '@/context/UserCredProvider';
import { IMapFormattedResult } from '@/types/mapLocations';
import { IMapSearchResidential, TOptions } from '@/types/user-verification/userVerificationTypes';
import { ResidentialAddressDetailsProps } from '@/types/user-verification/verificationListingSteps';
import { extractStreetInfo } from '@/utils/Functions/verification/verificationFn';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { Country, ICountry, IState, State } from 'country-state-city';
import { ChangeEvent, useEffect, useState } from 'react';

const ResidentialAddressDetails = ({ register, control, watch, formState, setValue, isDisabledData }: ResidentialAddressDetailsProps) => {
  const { errors } = formState;
  const { userProfileInfo } = useUserCredContext();
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IMapSearchResidential[]>([]);
  const [selectedResult, setSelectedResult] = useState<IMapSearchResidential>();
  const [residentialStateList, setResidentialStateList] = useState<TOptions[]>([]);

  const handleSearchTextChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    if (value.trim() !== '' && value?.length >= 3) {
      try {
        const locationList = await fetchForwardGeocoding(value);
        const response: IMapFormattedResult[] = transformGeocodingResult(locationList);
        // console.log(response);
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
    }
  };
  const handleManualInputOption = () => {
    setFormValues({});
  };
  useEffect(() => {
    if (searchResults.length > 0 && searchResults[0].country === 'manual') {
      handleManualInputOption();
    }
  }, [searchResults]);

  useEffect(() => {
    if (selectedResult) {
      setFormValues(selectedResult);
    }
  }, [selectedResult]);

  const setFormValues = (formValues: IMapSearchResidential) => {
    let streetNumber = '';
    //let streetName = formValues?.address || formValues?.place?.text || ''; //formValues?.place?.text is city
    let streetName = formValues?.address || '';

    if (!streetName && formValues?.complete_address) {
      const streetInfo = extractStreetInfo(formValues?.complete_address, formValues?.country?.text, formValues?.region?.text);
      streetNumber = streetInfo?.streetNumber ?? '';
      streetName = streetInfo?.streetName ?? '';
    }
    setValue('residentialAddressInfo.streetNumber', streetNumber, { shouldValidate: true });
    setValue('residentialAddressInfo.streetName', streetName, { shouldValidate: true });
    //  setValue('residentialAddressInfo.streetName', formValues?.address || '', { shouldValidate: true });
    setValue('residentialAddressInfo.postcode', formValues?.postcode?.text || '', { shouldValidate: formValues?.postcode?.text ? true : false });
    // setValue('residentialAddressInfo.state', formValues?.region?.text || '', { shouldValidate: true });
    // Convert region
    let convertRegion = formValues?.region?.short_code || '';
    convertRegion = convertRegion.split('-').pop() || ''; // Remove any prefix followed by a hyphen from the region short code
    // console.log(convertRegion);
    setValue('residentialAddressInfo.state', convertRegion, { shouldValidate: true });
    setValue('residentialAddressInfo.city', formValues?.place?.text || '', { shouldValidate: formValues?.place?.text ? true : false });
    // setValue('residentialAddressInfo.country', formValues?.country?.text || '');
    // Convert country short code
    const convertedCountryShortCode = formValues?.country?.short_code?.toUpperCase() || '';
    setValue('residentialAddressInfo.country', convertedCountryShortCode);
    // console.log(convertedCountryShortCode);
    setValue('residentialAddressInfo.suburb', formValues?.locality?.text || '', { shouldValidate: formValues?.locality?.text ? true : false });
  };
  const allCountries: ICountry[] = Country.getAllCountries();
  const countryOptions = allCountries?.map((country) => ({
    id: country.isoCode,
    label: country.name,
    value: country.isoCode,
  }));

  useEffect(() => {
    if (watch('residentialAddressInfo.country')) {
      const getCountryId = countryOptions?.find((option) => option.value === watch('residentialAddressInfo.country'));
      const stateList: IState[] = State.getStatesOfCountry(getCountryId?.id);
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
  // console.log(watch('residentialAddressInfo.country'));
  // console.log(watch('residentialAddressInfo.state'));
  const streetName = watch('residentialAddressInfo.streetName');
  const countryName = watch('residentialAddressInfo.country');
  const stateName = watch('residentialAddressInfo.state');
  const streetNumber = watch('residentialAddressInfo.streetNumber');
  const unitNumber = watch('residentialAddressInfo.unitNumber');
  // console.log(countryName);
  // console.log(userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.country);
  useEffect(() => {
    if (userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo) {
      const { residentialAddressInfo } = userProfileInfo.guestVerification?.residentialAddress;
      const isCountryChanged = countryName !== residentialAddressInfo?.country;
      const isStreetChanged = streetName !== residentialAddressInfo?.streetName;
      const isStateChanged = stateName !== residentialAddressInfo?.state;
      const isUnitChanged = unitNumber !== residentialAddressInfo?.unitNumber;
      const isStreetNumChanged = streetNumber !== residentialAddressInfo?.streetNumber;
      // console.log(selectedResult);
      // if (isStreetChanged && (!isStateChanged || !isStreetChanged) && !selectedResult) {
      //   const fieldsToReset = ['suburb', 'postcode', 'unitNumber', 'streetNumber'];
      //   fieldsToReset.forEach((field) => {
      //     setValue(`residentialAddressInfo.${field}`, '');
      //   });
      // } else
      if ((isCountryChanged || isStateChanged) && (!isUnitChanged || !isStreetNumChanged || !isStreetChanged) && !selectedResult) {
        const fieldsToReset = ['suburb', 'postcode', 'unitNumber', 'streetNumber', 'streetName'];
        fieldsToReset.forEach((field) => {
          setValue(`residentialAddressInfo.${field}`, '');
        });
      } else if (!!selectedResult && (!isUnitChanged || !isStreetNumChanged)) {
        const fieldsToReset = ['unitNumber', 'streetNumber'];
        fieldsToReset.forEach((field) => {
          setValue(`residentialAddressInfo.${field}`, '');
        });
      }
    }
  }, [countryName, streetName, stateName, userProfileInfo?.guestVerification?.residentialAddress?.residentialAddressInfo]);

  return (
    <div>
      <SectionHeader
        title={`${userProfileInfo?.guestVerification?.drivingLicenseInfo?.country === 'Australia' ? 'Residential' : 'Current'} Address`}
        textSize="text-md"
      />
      <FormControl variant="standard" fullWidth>
        <Autocomplete
          options={searchResults}
          getOptionLabel={(option: any) => option?.complete_address}
          disabled={isDisabledData}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Search your Residential Address"
              variant="outlined"
              value={searchText}
              onChange={handleSearchTextChange}
              key={params.id}
              disabled={isDisabledData}
            />
          )}
          onChange={handleAutocompleteChange}
          onInputChange={() => {}}
          value={selectedResult}
        />
      </FormControl>
      <div className="my-4">
        <SearchableDropdown
          disabled={isDisabledData || !!selectedResult?.country}
          control={control}
          registerName="residentialAddressInfo.country"
          options={countryOptions}
          label="Country"
          defaultValue={watch('residentialAddressInfo.country')}
          required={true}
          // emptyColor={true}
          isLabelShow={true}
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
          disabled={isDisabledData}
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
          disabled={isDisabledData}
          error={!!errors?.residentialAddressInfo?.streetNumber}
          helperText={errors?.residentialAddressInfo?.streetNumber?.message}
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
          disabled={isDisabledData || !!selectedResult?.address}
          error={!!errors?.residentialAddressInfo?.streetName}
          helperText={errors?.residentialAddressInfo?.streetName?.message}
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
          disabled={isDisabledData || !!selectedResult?.postcode}
          error={!!errors?.residentialAddressInfo?.postcode}
          helperText={errors?.residentialAddressInfo?.postcode?.message}
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
          disabled={isDisabledData || !!selectedResult?.locality}
          error={!!errors?.residentialAddressInfo?.suburb}
          helperText={errors?.residentialAddressInfo?.suburb?.message}
        />
        <SearchableDropdown
          control={control}
          registerName="residentialAddressInfo.state"
          options={residentialStateList}
          label="State"
          defaultValue={watch('residentialAddressInfo.state')}
          required={!!(watch('residentialAddressInfo.country') && residentialStateList?.length > 0)}
          disabled={!watch('residentialAddressInfo.country') || residentialStateList?.length === 0 || isDisabledData || !!selectedResult?.region}
          validate={validateState}
          // emptyColor={true}
          isLabelShow={true}
        ></SearchableDropdown>
      </div>
    </div>
  );
};

export default ResidentialAddressDetails;
