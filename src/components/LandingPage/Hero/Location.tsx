'use client';
import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import axios from 'axios';
import { FaLocationDot } from 'react-icons/fa6';
import { fetchForwardGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import { HookFormComponentProps } from '@/types/componentTypes';
import { IMapFormattedResult } from '@/types/mapLocations';
import { useSearchContext } from '@/context/SearchProvider';


const Location = ({ setValue }: HookFormComponentProps) => {
  const { searchValue, setSearchValue, selectedSearchedLocation, setSelectedSearchedLocation, locationOptions, setLocationOptions } =
    useSearchContext();

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAutocompleteChange = (event: React.ChangeEvent<{}>, value: IMapFormattedResult | null) => {
    if (value) {
      handleOptionSelect(value);
    }
  };

  const handleOptionSelect = async (selectedLocation: IMapFormattedResult) => {
    // console.log(selectedLocation);
    setSelectedSearchedLocation(selectedLocation);
    setSearchValue(selectedLocation?.complete_address || '');
    setLocationOptions([]);
    setFormValues(selectedLocation);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '100%',
      }}
      className="xl:p-0 pl-0 mr-0 lg:mr-4 w-full"
    >
      <FormControl
        fullWidth
        sx={{
          m: 1,
          width: '100%',
          position: 'relative',
          '::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '10px',
            backgroundColor: 'purple',
          },
        }}
        className="bg-white rounded"
      >
        <Autocomplete
          options={locationOptions}
          getOptionLabel={(option: any) => option?.complete_address}
          renderInput={(params) => (
            <TextField
              {...params}
              size="medium"
              label="Search Address "
              variant="outlined"
              value={searchValue}
              onChange={handleInputChange}
              InputLabelProps={{
                style: { paddingLeft: '14px' }, // Adjust the value as needed
              }}
            />
          )}
          onChange={handleAutocompleteChange} // Pass the selected result to the onChange event handler
          value={selectedSearchedLocation} // Set the value of the input field based on the selected result
        />
      </FormControl>
    </Box>
  );
};

export default Location;
