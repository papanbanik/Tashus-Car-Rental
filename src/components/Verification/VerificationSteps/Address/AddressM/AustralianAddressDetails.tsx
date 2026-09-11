'use client';
import { fetchForwardGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import SectionHeader from '@/components/CarListing/SectionHeader';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { IMapFormattedResult } from '@/types/mapLocations';
import { IMapSearchResidential, TOptions } from '@/types/user-verification/userVerificationTypes';
import { getFlagUrl } from '@/utils/Functions/randomCommonFn';
import { extractAddressFields, getFullAddress, setFormValues, useWatchedAddressFields } from '@/utils/Functions/verification/verificationFn';
import { ExpandMore } from '@/utils/Functions/verification/verificationStyleFn';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { IState, State } from 'country-state-city';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

const AustralianAddressDetails = ({ register, control, watch, formState, setValue }: HookFormComponentProps) => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { errors } = formState;
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IMapSearchResidential[]>([]);
  const [selectedResult, setSelectedResult] = useState<IMapSearchResidential>();
  const [australianStateList, setResidentialStateList] = useState<TOptions[]>([]);
  const [sameAsResidential, setSameAsResidential] = useState<boolean>(false);
  //expand
  const [isExpand, setIsExpand] = useState<boolean>(true);

  const handleSearchTextChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    if (value.trim() !== '' && value?.length >= 3) {
      try {
        const locationList = await fetchForwardGeocoding(value);
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
    }
  };
  useEffect(() => {
    if (selectedResult) {
      setFormValues(selectedResult, 'australianAddressInfo', setValue);
    }
  }, [selectedResult]);

  const australiaOption = {
    id: 'AU',
    label: 'Australia',
    value: 'AU',
    icon: getFlagUrl('AU'),
  };
  const countryOptions = [australiaOption];

  useEffect(() => {
    if (watch('australianAddressInfo.country')) {
      const getCountryId = countryOptions?.find((option) => option.value === watch('australianAddressInfo.country'));
      const stateList: IState[] = State.getStatesOfCountry(getCountryId?.id);
      const stateOptions = stateList?.map((state) => ({
        id: state.isoCode,
        label: state.name,
        value: state.isoCode,
      }));
      setResidentialStateList(stateOptions);
      // console.log(stateOptions);
      if (stateOptions?.length === 0) {
        setValue('australianAddressInfo.state', '');
      }
    }
  }, [watch('australianAddressInfo.country')]);

  const validateState = (value: any) => {
    return !!(australianStateList?.length > 0 && value) || !!(australianStateList?.length === 0 && !value) || '';
  };

  const { streetName, countryName, stateName, streetNumber, unitNumber, suburb, postcode } = useWatchedAddressFields('australianAddressInfo', watch);
  //Street Address Dynamically Add
  useEffect(() => {
    if (!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo || !!selectedResult) {
      return;
    }
    const addressValue = getFullAddress(unitNumber, streetNumber, streetName, suburb, stateName, postcode, countryName);
    setValue('australianAddressInfo.streetAddress', addressValue, { shouldValidate: true });
  }, [
    unitNumber,
    streetNumber,
    countryName,
    streetName,
    suburb,
    postcode,
    stateName,
    userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo,
    selectedResult,
  ]);
  const {
    streetName: streetNameRes,
    countryName: countryNameRes,
    stateName: stateNameRes,
    streetNumber: streetNumberRes,
    unitNumber: unitNumberRes,
    suburb: suburbRes,
    postcode: postcodeRes,
  } = useWatchedAddressFields('residentialAddressInfo', watch);
  const handleResidentialAddressCopy = () => {
    setValue('australianAddressInfo.unitNumber', watch('residentialAddressInfo.unitNumber'), { shouldValidate: true });
    setValue('australianAddressInfo.streetNumber', watch('residentialAddressInfo.streetNumber'), { shouldValidate: true });
    setValue('australianAddressInfo.streetName', watch('residentialAddressInfo.streetName'), { shouldValidate: true });
    setValue('australianAddressInfo.postcode', watch('residentialAddressInfo.postcode'), { shouldValidate: true });
    setValue('australianAddressInfo.state', watch('residentialAddressInfo.state'), { shouldValidate: true });
    setValue('australianAddressInfo.city', watch('residentialAddressInfo.city'), { shouldValidate: true });
    setValue('australianAddressInfo.country', watch('residentialAddressInfo.country'), { shouldValidate: true });
    setValue('australianAddressInfo.suburb', watch('residentialAddressInfo.suburb'), { shouldValidate: true });
    setValue('australianAddressInfo.streetAddress', watch('residentialAddressInfo.streetAddress'), { shouldValidate: true });
    setValue('australianAddressInfo.streetType', watch('residentialAddressInfo.streetType') ?? '', {
      shouldValidate: true,
    });
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsResidential(event.target.checked);
    // setIsExpand(!event.target.checked);
  };

  useEffect(() => {
    if (watch('residentialAddressInfo.country') !== 'AU') {
      setSameAsResidential(false);
    }
    if (sameAsResidential) {
      handleResidentialAddressCopy();
    }
  }, [streetNameRes, countryNameRes, streetNumberRes, unitNumberRes, suburbRes, postcodeRes, stateNameRes, sameAsResidential]);

  //Define residential address match
  useEffect(() => {
    if (
      !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.country &&
      !!userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo?.country
    ) {
      const residentialAddressInfo = extractAddressFields(userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo);
      const australianAddressInfo = extractAddressFields(userProfileVerificationInfo?.guestVerification?.residentialAddress?.australianAddressInfo);
      if (JSON.stringify(residentialAddressInfo) === JSON.stringify(australianAddressInfo)) {
        setSameAsResidential(true);
      } else {
        setSameAsResidential(false);
      }
    } else if (!!userProfileVerificationInfo?.guestVerification?.residentialAddress?.residentialAddressInfo?.country) {
      setSameAsResidential(false);
    } else if (watch('residentialAddressInfo.country') === 'AU') {
      setSameAsResidential(true);
    } else {
      setSameAsResidential(false);
    }
  }, [watch('residentialAddressInfo.country'), userProfileVerificationInfo?.guestVerification?.residentialAddress]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <SectionHeader title="Australian Address" textSize="text-md" noMargin={true} isMandatory={true} />
        <ExpandMore expand={isExpand} onClick={() => setIsExpand(!isExpand)} aria-expanded={isExpand} className="text-md md:text-lg">
          <FaChevronDown />
        </ExpandMore>
      </div>
      <div>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox id="sameAsResidential" size="small" onChange={handleCheckboxChange} checked={sameAsResidential} />}
            disabled={watch('residentialAddressInfo.country') !== 'AU'}
            label="Same as Residential Address"
            className="text-xs md:text-md whitespace-nowrap my-2"
          />
        </FormGroup>
      </div>
      {isExpand && (
        <>
          {!sameAsResidential && (
            <FormControl variant="standard" fullWidth>
              <Autocomplete
                options={searchResults}
                getOptionLabel={(option: any) => option?.complete_address}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Search your Australian Address"
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
          )}
          <div className="my-4">
            <SearchableDropdown
              control={control}
              registerName="australianAddressInfo.country"
              // disabled={sameAsResidential}
              disabled
              options={countryOptions}
              label="Country"
              defaultValue={watch('australianAddressInfo.country') ?? 'AU'}
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
              value={watch('australianAddressInfo.unitNumber') ?? ''}
              label="Unit Number"
              disabled={sameAsResidential}
              {...register('australianAddressInfo.unitNumber', {
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
              error={!!errors?.australianAddressInfo?.unitNumber}
              helperText={errors?.australianAddressInfo?.unitNumber?.message}
            />
            <TextField
              fullWidth
              size="small"
              value={watch('australianAddressInfo.streetNumber') ?? ''}
              label="Street Number"
              disabled={sameAsResidential}
              {...register('australianAddressInfo.streetNumber', {
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
                  borderColor: `${watch('australianAddressInfo.streetNumber') ? '' : '#f87272'}`,
                },
              }}
              InputLabelProps={{
                style: { color: `${watch('australianAddressInfo.streetNumber') ? '' : '#f87272'}` },
              }}
              error={!!errors?.australianAddressInfo?.streetNumber}
              helperText={errors?.australianAddressInfo?.streetNumber?.message}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <TextField
              fullWidth
              size="small"
              value={watch('australianAddressInfo.streetName') ?? ''}
              label="Street Name"
              disabled={sameAsResidential}
              {...register('australianAddressInfo.streetName', {
                required: true,
                maxLength: {
                  value: 100,
                  message: 'Length limit exceed',
                },
              })}
              sx={{
                '& fieldset.MuiOutlinedInput-notchedOutline': {
                  borderColor: `${watch('australianAddressInfo.streetName') ? '' : '#f87272'}`,
                },
              }}
              InputLabelProps={{
                style: { color: `${watch('australianAddressInfo.streetName') ? '' : '#f87272'}` },
              }}
              error={!!errors?.australianAddressInfo?.streetName}
              helperText={errors?.australianAddressInfo?.streetName?.message}
              required
            />
            <TextField
              fullWidth
              size="small"
              value={watch('australianAddressInfo.postcode') ?? ''}
              label="Postal Code"
              disabled={sameAsResidential}
              {...register('australianAddressInfo.postcode', {
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
                  borderColor: `${watch('australianAddressInfo.postcode') ? '' : '#f87272'}`,
                },
              }}
              InputLabelProps={{
                style: { color: `${watch('australianAddressInfo.postcode') ? '' : '#f87272'}` },
              }}
              error={!!errors?.australianAddressInfo?.postcode}
              helperText={errors?.australianAddressInfo?.postcode?.message}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2 my-4">
            <TextField
              fullWidth
              size="small"
              value={watch('australianAddressInfo.suburb') ?? ''}
              label="Suburb"
              disabled={sameAsResidential}
              {...register('australianAddressInfo.suburb', {
                required: true,
                maxLength: {
                  value: 50,
                  message: 'Length limit exceed',
                },
              })}
              sx={{
                '& fieldset.MuiOutlinedInput-notchedOutline': {
                  borderColor: `${watch('australianAddressInfo.suburb') ? '' : '#f87272'}`,
                },
              }}
              InputLabelProps={{
                style: { color: `${watch('australianAddressInfo.suburb') ? '' : '#f87272'}` },
              }}
              error={!!errors?.australianAddressInfo?.suburb}
              helperText={errors?.australianAddressInfo?.suburb?.message}
              required
            />
            <SearchableDropdown
              control={control}
              registerName="australianAddressInfo.state"
              options={australianStateList}
              label="State"
              defaultValue={watch('australianAddressInfo.state')}
              required={!!(watch('australianAddressInfo.country') && australianStateList?.length > 0)}
              disabled={!watch('australianAddressInfo.country') || australianStateList?.length === 0 || sameAsResidential}
              validate={validateState}
              // emptyColor={true}
              isLabelShow={true}
              showRequired={!!(watch('australianAddressInfo.country') && australianStateList?.length > 0)}
            ></SearchableDropdown>
          </div>
          {/* <div className="mt-4">
            <TextField
              fullWidth
              size="small"
              value={watch('australianAddressInfo.streetAddress') ?? ''}
              label="Street Address"
              disabled={!!selectedResult?.complete_address || sameAsResidential}
              {...register('australianAddressInfo.streetAddress', {
                required: true,
                maxLength: {
                  value: 150,
                  message: 'Length limit exceed',
                },
              })}
              sx={{
                '& fieldset.MuiOutlinedInput-notchedOutline': {
                  borderColor: `${watch('australianAddressInfo.streetAddress') ? '' : '#f87272'}`,
                },
              }}
              InputLabelProps={{
                style: { color: `${watch('australianAddressInfo.streetAddress') ? '' : '#f87272'}` },
              }}
              error={!!errors?.australianAddressInfo?.streetAddress}
              helperText={errors?.australianAddressInfo?.streetAddress?.message}
              required
            />
          </div> */}
        </>
      )}
    </div>
  );
};

export default AustralianAddressDetails;
