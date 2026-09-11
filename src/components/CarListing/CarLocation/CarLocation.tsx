'use client';
import CommonForm from '@/components/Common/CommonForm';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { useAddPickupLocation } from '@/hooks/useCarListing';
import { CarPickupLocationValues } from '@/types/car-listing/carListingTypes';
import { IMapFormattedResult } from '@/types/mapLocations';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Theme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import SectionHeader from '../SectionHeader';
// import CustomMap from './LeafletMap';
import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import dynamic from 'next/dynamic';
import { fetchForwardGeocoding, fetchReverseGeocoding, fnSetInitialLocation, transformGeocodingResult } from './map.common';

const DynamicCustomMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
});

const Item = styled(Paper)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const defaultValues: CarPickupLocationValues = {
  street: '',
  state: '',
  city: '',
  country: '',
  postalCode: '',
  coordinates: [151.2099, -33.8688],
  stateShortCode: '',
  countryShortCode: '',
  parkingInstructions: '',
};

// Set the Mapbox access token
const CarLocation = () => {
  const { partnerAccess } = useProfileInfoContext();
  const {
    handleSaveCurrentStep,
    updateCurrentStep,
    listingId,
    carData,
    listingErrorMessage,
    setListingErrorMessage,
    getUpdatedSteps,
    isHideSpaceForEditVehicle,
  } = useCarListingContext();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<IMapFormattedResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<IMapFormattedResult>();

  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue } = useForm({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { errors, isDirty, touchedFields, dirtyFields, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState;

  const { mutateAsync: savePickupLocation, isLoading, isSuccess, isError, error } = useAddPickupLocation();

  const { userCred } = useUserCredContext();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isIPadPro = useIPadProQuery();

  useEffect(() => {
    updateCurrentStep();
  }, []);

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleAutocompleteChange = (event: React.ChangeEvent<{}>, value: IMapFormattedResult | null) => {
    if (value) {
      setSelectedResult(value);
    }
  };

  const handleManualInputOption = () => {
    // setValue('street', '');
    // setValue('postalCode', '');
    // setValue('state', '');
    // setValue('stateShortCode', '');
    // setValue('city', '');
    // setValue('country', '');
    // setValue('countryShortCode', '');
    // setValue('coordinates', selectedResult?.coordinates ?? [151.2099, -33.8688]);
    setFormValues({}, '');
  };

  useEffect(() => {
    if (listingId && carData?.location) {
      const { pickupAddress, parkingInstructions } = carData.location;
      // setValue('street', pickupAddress?.street || defaultValues.street);
      // setValue('postalCode', pickupAddress?.postalCode || defaultValues.postalCode);
      // setValue('state', pickupAddress?.state || defaultValues.state);
      // setValue('stateShortCode', pickupAddress?.stateShortCode || defaultValues.stateShortCode);
      // setValue('city', pickupAddress?.city || defaultValues.city);
      // setValue('country', pickupAddress?.country || defaultValues.country);
      // setValue('countryShortCode', pickupAddress?.countryShortCode || defaultValues.countryShortCode);
      // setValue('coordinates', pickupAddress?.coordinates || defaultValues.coordinates);
      // setValue('parkingInstructions', parkingInstructions || defaultValues.parkingInstructions);
      setFormValues(pickupAddress, parkingInstructions);
      setSelectedResult({
        ...selectedResult,
        country: {
          text: pickupAddress?.country,
          short_code: pickupAddress?.countryShortCode,
        },
        region: {
          text: pickupAddress?.state,
          short_code: pickupAddress?.stateShortCode,
        },
        place: {
          text: pickupAddress?.city,
        },
        city: {
          text: pickupAddress?.city,
        },
        address: pickupAddress?.street,
        postcode: {
          text: pickupAddress?.postalCode,
        },
        complete_address: pickupAddress?.street,
        coordinates: pickupAddress?.coordinates || [151.2099, -33.8688],
      });
    } else {
      reset(); //reset form to default values
      fnSetInitialLocation({ setSelectedResult }); //set default values
    }
  }, [listingId, carData]);

  useEffect(() => {
    if (searchResults.length > 0 && searchResults[0].country === 'manual') {
      handleManualInputOption();
    }
  }, [searchResults]);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const manualAddressOptions = (): IMapFormattedResult[] => {
    return [
      {
        country: {
          text: '',
          short_code: '',
        },
        region: {
          text: '',
          short_code: '',
        },
        place: {
          text: '',
        },
        city: {
          text: '',
        },
        address: '',
        postcode: {
          text: '',
        },
        complete_address: 'Enter Address Details Yourself',
        coordinates: [151.2099, -33.8688],
      },
    ];
  };

  // Debounce the API request to reduce the number of calls
  const debouncedSearch = debounce((text: string) => {
    if (text.trim() !== '') {
      fetchForwardGeocoding(text)
        .then((apiResult) => {
          const response: IMapFormattedResult[] = transformGeocodingResult(apiResult);
          // response.push(manualAddressOptions()[0]);
          setSearchResults(response);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      setSearchResults([]);
    }
  }, 2000); // Adjust the debounce delay (in milliseconds) as per your requirements

  useEffect(() => {
    if (searchText.trim() !== '' && searchText?.length >= 3) {
      debouncedSearch(searchText);
    } else {
      // setSearchResults(manualAddressOptions());
    }
  }, [searchText]);

  const [tempSelectedResult, setTempSelectedResult] = useState<IMapFormattedResult | null>(null);

  const handleMarkerChange = (result: IMapFormattedResult | null) => {
    // console.log(result);
    if (result) {
      setTempSelectedResult(result); // Use tempSelectedResult to hold the temporary selected result
    }
    // No need to handle the case when the result is null, as you are already handling it in CustomMap
  };

  useEffect(() => {
    //console.log(tempSelectedResult, selectedResult);
    // When tempSelectedResult is updated, set the actual selectedResult to the new value
    if (tempSelectedResult) {
      setSelectedResult(tempSelectedResult);
    }
  }, [tempSelectedResult]);

  useEffect(() => {
    if (selectedResult) {
      // console.log(licenseVerifiedData);
      // setValue('street', selectedResult?.complete_address ?? '');
      // setValue('postalCode', selectedResult?.postcode?.text ?? '');
      // setValue('state', selectedResult?.region?.text ?? '');
      // setValue('city', selectedResult?.place?.text ?? '');
      // setValue('country', selectedResult?.country?.text ?? '');
      // setValue('countryShortCode', selectedResult?.country?.short_code ?? '');
      // setValue('stateShortCode', selectedResult?.region?.short_code ?? '');
      // setValue('coordinates', selectedResult?.coordinates ?? [151.2099, -33.8688]);
      setFormValues(selectedResult, '');
      // setValue('parkingInstructions', '');
    }
  }, [selectedResult]);

  const setFormValues = (formValues: IMapFormattedResult, parkingInstructions: string) => {
    setValue('street', formValues?.complete_address || '', { shouldValidate: true });
    setValue('postalCode', formValues?.postcode?.text || '', { shouldValidate: formValues?.postcode?.text ? true : false });
    setValue('state', formValues?.region?.text || '', { shouldValidate: true });
    setValue('city', formValues?.place?.text || '', { shouldValidate: formValues?.place?.text ? true : false });
    setValue('country', formValues?.country?.text || '');
    setValue('countryShortCode', formValues?.country?.short_code || '');
    setValue('stateShortCode', formValues?.region?.short_code || '');
    setValue('coordinates', formValues?.coordinates ? [formValues?.coordinates[0], formValues?.coordinates[1]] : [151.2099, -33.8688]);
    setValue('parkingInstructions', carData?.location?.parkingInstructions || '', { shouldValidate: true });
  };

  const onCarPickupSave: SubmitHandler<CarPickupLocationValues> = async (data) => {
    const { street, state, city, country, coordinates, postalCode, parkingInstructions, stateShortCode, countryShortCode } = data;
    try {
      const { userId: hostId } = userCred;
      const tempSteps = await getUpdatedSteps(2);
      // console.log(tempSteps);
      await savePickupLocation({
        listingId,
        street,
        state,
        city,
        country,
        coordinates,
        postalCode,
        parkingInstructions,
        stateShortCode,
        countryShortCode,
        listingSteps: tempSteps,
      });
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  useEffect(() => {
    if (!selectedResult && !carData.location) {
      // fnSetInitialLocation({ setSelectedResult });
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiResult = await fetchReverseGeocoding(latitude, longitude);
            const response = transformGeocodingResult(apiResult);
            if (response?.length > 0) {
              const selected = response[0];
              setSelectedResult(selected);

              // Check if the selected location is in the Australian region
              if (selected.country.text === 'Australia') {
                // Show map with current location
                setSelectedResult(selected);
              } else {
                // Default to New South Wales
                fnSetInitialLocation({ setSelectedResult });
              }
            } else {
              fnSetInitialLocation({ setSelectedResult });
            }
          } catch (error) {
            console.log(error);
            console.error('Error:', error);
          }
        },
        (error: any) => {
          console.log(error);
          console.error('Error getting user location:', error);

          fnSetInitialLocation({ setSelectedResult });
        }
      );
    }
    setListingErrorMessage('');
  }, []);

  //Save Button Disable Issue
  const hasDataChanged = () => {
    if (listingId && carData?.location) {
      const { pickupAddress, parkingInstructions } = carData.location;
      const currentStreet = watch('street');
      const currentState = watch('state');
      const currentPostalCode = watch('postalCode');
      const currentCity = watch('city');
      const currentParkingInstructions = watch('parkingInstructions');
      return (
        parkingInstructions !== currentParkingInstructions ||
        pickupAddress?.street !== currentStreet ||
        pickupAddress?.city !== currentCity ||
        pickupAddress?.state !== currentState ||
        pickupAddress?.postalCode !== currentPostalCode
      );
    }
    return true;
  };

  return (
    <div
      className={`flex-row bg-white  lg:px-24 lg:py-12 md:px-12 px-2 py-2 rounded-xl shadow-lg ${
        !isHideSpaceForEditVehicle || isSmall || isIPadPro ? 'lg:mx-8 mx-4 ' : ''
      } `}
    >
      {isPartnerRestrict(partnerAccess) && <CommonAccStatusAlert isPartner={true} isRestrict={true} />}
      <SectionHeader title="Vehicle Location"></SectionHeader>
      <Box className="mt-4 mx-0 px-0">
        <FormControl variant="standard" fullWidth>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option: any) => option?.complete_address}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Search Address"
                variant="outlined"
                value={searchText}
                onChange={handleSearchTextChange}
                key={params.id}
              />
            )}
            onChange={handleAutocompleteChange} // Pass the selected result to the onChange event handler
            onInputChange={() => {
              // setSelectedResult(undefined);
            }} // Clear the selected result when the input is changed
            value={selectedResult} // Set the value of the input field based on the selected result
          />
          <FormHelperText id="region-helper-text">Search your address.</FormHelperText>
        </FormControl>
      </Box>
      {/* [Longitude, Latitude] */}
      <CommonForm handleFunction={handleSubmit(onCarPickupSave)}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <DynamicCustomMap
              key={selectedResult?.complete_address}
              center={selectedResult?.coordinates?.slice().reverse() ?? [151.2099, -33.8688]} // New South Wales, Australia
              address={selectedResult?.complete_address}
              setNewSelectedResult={handleMarkerChange}
            />
            {/* <CustomMap
              key={selectedResult?.complete_address}
              center={selectedResult?.coordinates?.slice().reverse() ?? [151.2099, -33.8688]} // New South Wales, Australia
              address={selectedResult?.complete_address}
              setNewSelectedResult={handleMarkerChange}
            /> */}
          </Grid>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <Alert className="bg-blue-50" severity="info" sx={{ fontSize: '0.95rem' }}>
                <div className="text-left">
                  <small>Adjust the marker to precisely position your address on the map.</small>
                </div>
                <div className="text-left">
                  <small>This will ensure accurate pickup information.</small>
                </div>
              </Alert>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Country</InputLabel>
              <Controller
                name="countryShortCode" // This should match the field name in your react-hook-form
                control={control}
                defaultValue={watch('countryShortCode') && watch('countryShortCode')} // Provide the default value
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <Select label="Country" size="small" disabled={!!watch('countryShortCode')} {...field}>
                    <MenuItem value={'au'}>Australia</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel size="small">State/Region</InputLabel>
              <Controller
                name="stateShortCode" // This should match the field name in your react-hook-form
                control={control}
                defaultValue={watch('stateShortCode') && watch('stateShortCode')} // Provide the default value
                render={({ field }) => (
                  <Select label="State/Region" size="small" disabled={!!watch('stateShortCode')} {...field}>
                    <MenuItem value="AU-NSW">New South Wales</MenuItem>
                    <MenuItem value={'AU-VIC'}>Victoria</MenuItem>
                    <MenuItem value={'AU-QLD'}>Queensland</MenuItem>
                    <MenuItem value={'AU-WA'}>Western Australia</MenuItem>
                    <MenuItem value={'AU-SA'}>South Australia</MenuItem>
                    <MenuItem value={'AU-TAS'}>Tasmania</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  value={watch('city') && watch('city')}
                  // disabled={!!watch('city')}
                  label="City or Locality"
                  {...register('city', {
                    required: true,
                  })}
                  error={!!errors?.city}
                  helperText={errors?.city?.message}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  required
                  // rules={{ required: 'Postal code is required' }}
                  value={watch('postalCode') && watch('postalCode')}
                  // disabled={!!watch('postalCode')}
                  label="Postal Code / Zip code"
                  {...register('postalCode', {
                    required: true,
                  })}
                  error={!!errors?.postalCode}
                  helperText={errors?.postalCode?.message}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
            </Grid>
            {/* <TextField fullWidth label="Street" sx={{ marginBottom: 2 }} /> */}
            <TextField
              fullWidth
              size="small"
              value={watch('street') && watch('street')}
              // disabled={!!watch('street')}
              label="Street Address"
              {...register('street', {
                required: !!selectedResult?.complete_address,
              })}
              error={!!errors?.street}
              helperText={errors?.street?.message}
              sx={{ marginBottom: 2 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }} className="text-left">
          <SectionHeader title="Parking Instructions"></SectionHeader>
          <small>This instructions will be available to Guest after they confirm the booking.</small>
          <div className="listing_section_content">
            <RichEditor
              control={control}
              registerName="parkingInstructions"
              label="This instructions will be available to Guest after they confirm the booking. . ."
              required={true}
              errors={errors?.parkingInstructions}
            ></RichEditor>
          </div>
        </Box>
        <Container className="flex justify-center col-span-12 p-0">
          <Button
            disabled={!formState?.isValid || isLoading || !hasDataChanged() || isPartnerRestrict(partnerAccess)}
            // disabled={!formState?.isValid || isLoading || isSuccess}
            type="submit"
            variant="contained"
            color="primary"
          >
            {isLoading ? 'Saving' : 'Save'}
            {/* {isLoading ? 'Saving' : isSuccess ? 'Saved' : 'Save'} */}
          </Button>
        </Container>
      </CommonForm>
      {/* <CommonMap latLng={selectedResult?.coordinates.slice().reverse()} onMarkerChange={handleMarkerChange} address={''} /> */}

      <Grid
        container
        spacing={0}
        direction="column"
        sx={{
          mt: 2, // Maps to "mt-4" in Tailwind CSS
          alignItems: 'center',
          justifyContent: 'center',
        }}
      ></Grid>
    </div>
  );
};

export default CarLocation;
