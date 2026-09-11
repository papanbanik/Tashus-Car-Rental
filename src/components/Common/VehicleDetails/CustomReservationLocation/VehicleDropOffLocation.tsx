import { useEffect } from 'react';
import CarDetailsSectionDivider from '../CarDetailsSectionDivider';
import HeadingSemiSmall from '../../Typographies/HeadingSemiSmall';
import SearchLocationField from '../../InputFields/SearchLocationField';
import useSearchLocation from '@/hooks/custom-hooks/useSearchLocation';
import { useParams } from 'next/navigation';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useValidateVehiclePostcode } from '@/hooks/car-search/useValidateVehiclePostcode';
import { useSearchContext } from '@/context/SearchProvider';
import { VehicleDropInfoState } from '@/types/vehicle-details/vehicle-details';
import { ReservationLocationState } from '@/types/travels/typeTravels';

const VehicleDropOffLocation = () => {
  const [searchText, selectedResult, searchResults, handleAutocompleteChange, handleSearchTextChange] = useSearchLocation();
  const { mutateAsync, isLoading, data } = useValidateVehiclePostcode();
  const { openSnackBar } = useSnackBarContext();
  const { setVehicleDropInfo, vehicleDropInfo } = useSearchContext();

  const { vehicleId } = useParams<{ vehicleId: string }>();

  // validate drop off location whenever location is selected
  useEffect(() => {
    if (selectedResult?.postcode?.text) {
      validateDropOffLocation(selectedResult?.postcode?.text, selectedResult?.country?.text, selectedResult?.place?.text);
    } else {
      setVehicleDropInfo({} as VehicleDropInfoState);
    }

    // Open snackbar if the selected location doesn't have any postal code
    if (selectedResult?.coordinates?.length === 2 && !selectedResult?.postcode?.text) {
      openSnackBar({
        message: 'Please select a location with valid postal code',
        severity: 'warning',
      });
    }
  }, [selectedResult]);

  const validateDropOffLocation = async (postalCode: string, postalCodeCountry: string, postalCodeCity: string) => {
    try {
      const validationData = await mutateAsync({ listingId: vehicleId, postalCode, postalCodeCountry, postalCodeCity });
      if (selectedResult?.postcode && validationData?.status === 200) {
        const shortAddress = `${selectedResult?.place?.text}, ${selectedResult?.region?.text}, ${selectedResult?.country?.text}`;
        const dropOffLocation: ReservationLocationState = {
          coordinates: selectedResult?.coordinates as [number, number],
          streetAddress: selectedResult?.complete_address as string,
          shortAddress,
          postalCode,
        };
        setVehicleDropInfo({
          dropOffLocation,
        });
      }
    } catch (error) {
      console.error(error);
      setVehicleDropInfo({} as VehicleDropInfoState);
    }
  };

  return (
    <div>
      <CarDetailsSectionDivider></CarDetailsSectionDivider>

      <HeadingSemiSmall
        title="Drop-off Location"
        description="Please select a drop-off location within the Sydney metropolitan area"
      ></HeadingSemiSmall>

      <SearchLocationField
        searchResults={searchResults}
        selectedResult={selectedResult}
        searchText={searchText}
        handleAutocompleteChange={handleAutocompleteChange}
        handleSearchTextChange={handleSearchTextChange}
        helpingText={
          isLoading ? (
            'Validating drop off location'
          ) : selectedResult?.postcode && data?.status === 200 ? (
            <span className="text-success">Drop off location is valid</span>
          ) : (selectedResult?.coordinates && !selectedResult?.postcode?.text) || (selectedResult?.postcode && data?.status !== 200) ? (
            <span className="text-error">This location will not be added as drop off location</span>
          ) : (
            ''
          )
        }
        disabled={isLoading}
      ></SearchLocationField>
    </div>
  );
};

export default VehicleDropOffLocation;
