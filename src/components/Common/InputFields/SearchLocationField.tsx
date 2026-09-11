import { IMapFormattedResult } from '@/types/mapLocations';
import { Autocomplete, Box, FormControl, FormHelperText, TextField } from '@mui/material';
import React, { ReactElement } from 'react';

interface SearchLocationFieldProps {
  searchResults: IMapFormattedResult[];
  searchText: string;
  handleSearchTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAutocompleteChange: (event: React.ChangeEvent<{}>, value: IMapFormattedResult | null) => void;
  selectedResult: IMapFormattedResult | undefined;
  helpingText?: string | ReactElement;
  disabled?: boolean;
  optionTextSmall?: boolean;
  label?: string;
  divClassNames?: string;
  error?: boolean;
}

const SearchLocationField = ({
  searchResults,
  searchText,
  handleAutocompleteChange,
  handleSearchTextChange,
  selectedResult,
  helpingText,
  disabled,
  optionTextSmall,
  label = 'Search Address',
  divClassNames,
  error,
}: SearchLocationFieldProps) => {
  return (
    <Box className={divClassNames ?? 'mt-4 mx-0 px-0'}>
      <FormControl variant="standard" fullWidth>
        <Autocomplete
          options={searchResults}
          getOptionLabel={(option: any) => option?.complete_address}
          renderOption={(props, option) => {
            return (
              <li {...props}>
                <span className={optionTextSmall ? 'text-sm' : ''}>{option?.complete_address}</span>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label={label}
              variant="outlined"
              value={searchText}
              onChange={handleSearchTextChange}
              key={params.id}
              disabled={disabled}
              InputProps={{
                ...params.InputProps,
                className: optionTextSmall ? 'text-sm' : '',
              }}
            />
          )}
          onChange={handleAutocompleteChange} // Pass the selected result to the onChange event handler
          onInputChange={() => {
            // setSelectedResult(undefined);
          }} // Clear the selected result when the input is changed
          value={selectedResult} // Set the value of the input field based on the selected result
          size="small"
        />
        <FormHelperText id="region-helper-text" className={`${error ? 'text-error' : ''}`}>
          {helpingText}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default SearchLocationField;
