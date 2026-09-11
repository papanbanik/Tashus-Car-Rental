import { fetchForwardGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import { IMapFormattedResult } from '@/types/mapLocations';
import { useEffect, useState } from 'react';

const useSearchLocation = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IMapFormattedResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<IMapFormattedResult>();

  useEffect(() => {
    if (searchText.trim() !== '' && searchText?.length >= 3) {
      debouncedSearch(searchText);
    }
  }, [searchText]);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  // Debounce the API request to reduce the number of calls
  const debouncedSearch = debounce((text: string) => {
    if (text.trim() !== '') {
      fetchForwardGeocoding(text)
        .then((apiResult) => {
          const response: IMapFormattedResult[] = transformGeocodingResult(apiResult);

          setSearchResults(response);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      setSearchResults([]);
    }
  }, 2000); // Adjust the debounce delay (in milliseconds) as per your requirements

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleAutocompleteChange = (event: React.ChangeEvent<{}>, value: IMapFormattedResult | null) => {
    if (value) {
      setSelectedResult(value);
    } else {
      setSelectedResult(undefined);
    }
  };

  const handleClearResult = () => {
    setSelectedResult(undefined);
    setSearchText('');
    setSearchResults([]);
  };

  return [searchText, selectedResult, searchResults, handleAutocompleteChange, handleSearchTextChange, handleClearResult] as const;
};

export default useSearchLocation;
