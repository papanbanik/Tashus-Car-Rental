'use client';
import { fetchForwardGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import { useSearchContext } from '@/context/SearchProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { IMapFormattedResult } from '@/types/mapLocations';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { ChangeEvent } from 'react';

const SearchLocation = ({ setValue }: HookFormComponentProps) => {
  const { searchValue, setSearchValue, selectedSearchedLocation, setSelectedSearchedLocation, locationOptions, setLocationOptions } =
    useSearchContext();
  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value.trim() !== '' && value?.length >= 3) {
      try {
        const locationList = await fetchForwardGeocoding(value);
        const response: IMapFormattedResult[] = transformGeocodingResult(locationList);
        // console.log(response);
        setLocationOptions(response);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    } else {
      setLocationOptions([]);
    }
  };
  const setFormValues = (formValues: IMapFormattedResult) => {
    setValue('location.street', formValues?.complete_address || '');
    setValue('location.postalCode', formValues?.postcode?.text || '');
    setValue('location.state', formValues?.region?.text || '');
    setValue('location.city', formValues?.place?.text || '');
    setValue('location.country', formValues?.country?.text || '');
    setValue('location.countryShortCode', formValues?.country?.short_code || '');
    setValue('location.stateShortCode', formValues?.region?.short_code || '');
    setValue('location.coordinates', formValues?.coordinates || '');
  };

  const handleAutocompleteChange = (event: ChangeEvent<{}>, value: IMapFormattedResult | null) => {
    if (value) {
      handleOptionSelect(value);
    }
  };
  const handleOptionSelect = async (selectedLocation: IMapFormattedResult) => {
    setSelectedSearchedLocation(selectedLocation);
    setSearchValue(selectedLocation?.complete_address || '');
    setLocationOptions([]);
    setFormValues(selectedLocation);
  };

  return (
    <div className="w-full lg:w-1/2 h-full flex items-center justify-center rounded-md ">
      <FormControl fullWidth className="  rounded">
        <Autocomplete
          options={locationOptions}
          getOptionLabel={(option: any) => option?.complete_address}
          renderInput={(params) => (
            <TextField
              {...params}
              size="medium"
              variant="outlined"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Search Address"
              InputProps={{
                ...params.InputProps,
                style: {
                  height: '48px',
                  textAlign: 'center',
                  borderRadius: '6px', // Increase the border radius here
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px', // Increase border radius
                },
              }}
            />
          )}
          onChange={handleAutocompleteChange}
          value={selectedSearchedLocation}
        />
      </FormControl>
    </div>
  );
};

export default SearchLocation;
