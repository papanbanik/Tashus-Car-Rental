'use client';
import { fetchForwardGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import { useUserCredContext } from '@/context/UserCredProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { HookFormComponentProps } from '@/types/componentTypes';
import { IMapSearchResidential, TOptions } from '@/types/user-verification/userVerificationTypes';
import { Autocomplete, FormControl, TextField, debounce } from '@mui/material';
import { Country, ICountry, IState, State } from 'country-state-city';
import { useEffect, useState } from 'react';
interface ResidentialAddressInfoProps extends HookFormComponentProps {
  isDisabledData?: boolean;
}
const ResidentialAddressInfo = ({
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
  isDisabledData,
}: ResidentialAddressInfoProps) => {
  const { errors } = formState;
  const { userProfileInfo } = useUserCredContext();
  const isIPadPro = useIPadProQuery();
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IMapSearchResidential[]>([]);
  const [selectedResult, setSelectedResult] = useState<IMapSearchResidential>();
  const [residentialStateList, setResidentialStateList] = useState<TOptions[]>([]);
  const debouncedSearch = debounce((text: string) => {
    if (text.trim() !== '') {
      fetchForwardGeocoding(text)
        .then((apiResult) => {
          const response: IMapSearchResidential[] = transformGeocodingResult(apiResult);
          // console.log(response);
          setSearchResults(response);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      setSearchResults([]);
    }
  }, 2000);

  useEffect(() => {
    if (searchText.trim() !== '' && searchText?.length >= 3) {
      debouncedSearch(searchText);
    }
  }, [searchText]);

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
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
      // console.log(selectedResult);
    }
  }, [selectedResult]);
  const setFormValues = (formValues: IMapSearchResidential) => {
    setValue('residentialAddressInfo.streetName', formValues?.address || '', { shouldValidate: true });
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
      if (isStreetChanged && (!isStateChanged || !isStreetChanged) && !selectedResult) {
        const fieldsToReset = ['suburb', 'postcode', 'unitNumber', 'streetNumber'];
        fieldsToReset.forEach((field) => {
          setValue(`residentialAddressInfo.${field}`, '');
        });
      } else if ((isCountryChanged || isStateChanged) && !selectedResult) {
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
          // sx={{
          //   '& fieldset.MuiOutlinedInput-notchedOutline': {
          //     borderColor: `${watch('residentialAddressInfo.unitNumber') ? '' : '#f87272'}`,
          //   },
          // }}
          // InputLabelProps={{
          //   style: { color: `${watch('residentialAddressInfo.unitNumber') ? '' : '#f87272'}` },
          // }}
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
          label="Street Address"
          {...register('residentialAddressInfo.streetName', {
            required: true,
            // pattern: {
            //   value: /^[A-Za-z0-9\s\-/.']+$/,
            //   message: 'Invalid street address',
            // },
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
            // pattern: {
            //   value: /^[A-Za-z\s\-]+$/,
            //   message: 'Invalid Suburb',
            // },
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

export default ResidentialAddressInfo;
