import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import HeadingSemiSmall from '../../Typographies/HeadingSemiSmall';
import { Autocomplete, Box, Button, FormControl, FormHelperText, IconButton, TextField } from '@mui/material';
import { IMapFormattedResult } from '@/types/mapLocations';
import { fetchForwardGeocoding, getDrivingDistance, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import { AddressState } from '@/types/car-listing/carLocationTypes';
import SearchLocationField from '../../InputFields/SearchLocationField';
import useSearchLocation from '@/hooks/custom-hooks/useSearchLocation';
import { useGetVehicleDeliveryPrice } from '@/hooks/car-search/useGetVehicleDeliveryPrice';
import { useSearchContext } from '@/context/SearchProvider';
import { VehicleDeliveryInfoState } from '@/types/vehicle-details/vehicle-details';
import { useValidateVehiclePostcode } from '@/hooks/car-search/useValidateVehiclePostcode';
import { useParams } from 'next/navigation';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import CommonTooltip from '../../CommonTooltip';
import { IoInformationCircleOutline } from 'react-icons/io5';
import InputCheckbox from '../../InputFields/InputCheckbox';

interface VehicleDeliverToGuestProps {
  vehiclePickupAddress: AddressState;
  isDeliverToInitialLocation: boolean;
  setIsDeliverToInitialLocation: Dispatch<SetStateAction<boolean>>;
}

const VehicleDeliverToGuest = ({ vehiclePickupAddress, isDeliverToInitialLocation, setIsDeliverToInitialLocation }: VehicleDeliverToGuestProps) => {
  const { coordinates: carCoordinates } = vehiclePickupAddress;
  const [searchText, selectedResult, searchResults, handleAutocompleteChange, handleSearchTextChange] = useSearchLocation();
  const [deliveryDistance, setDeliveryDistance] = useState<number>(0);
  const [singleDeliveryCost, setSingleDeliveryCost] = useState<number>(0);
  const [finalDeliveryCost, setFinalDeliveryCost] = useState<number>(0);
  const { data, isLoading, mutateAsync: getVehicleDeliveryPrice } = useGetVehicleDeliveryPrice();
  const { mutateAsync, isLoading: isPostCodeLoading } = useValidateVehiclePostcode();

  const { vehicleId } = useParams<{ vehicleId: string }>();

  const { setVehicleDeliveryInfo } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();

  // update driving distance and final cost whenever location is selected
  useEffect(() => {
    if (selectedResult?.postcode?.text) {
      validateDeliveryLocation(selectedResult?.postcode?.text, selectedResult?.country?.text, selectedResult?.place?.text);
    }

    // Open snackbar if the selected location doesn't have any postal code
    if (selectedResult?.coordinates?.length === 2 && !selectedResult?.postcode?.text) {
      openSnackBar({
        message: 'Please select a location with valid postal code',
        severity: 'warning',
      });
    }

    if (!selectedResult) {
      setDeliveryDistance(0);
      setSingleDeliveryCost(0);
      setFinalDeliveryCost(0);
      setIsDeliverToInitialLocation(false);
    }
  }, [selectedResult]);

  // update delivery cost whenever delivery distance changes
  useEffect(() => {
    if (deliveryDistance > 0) {
      updateDeliveryPrice();
    }
  }, [deliveryDistance]);

  useEffect(() => {
    if (finalDeliveryCost > 0 && selectedResult) {
      // this state should be set when user confirms the delivery
      setVehicleDeliveryInfo({
        deliveryLocation: selectedResult,
        deliveryFee: finalDeliveryCost,
        drivingDistance: deliveryDistance,
      });
    } else {
      setVehicleDeliveryInfo({} as VehicleDeliveryInfoState);
    }
  }, [finalDeliveryCost]);

  useEffect(() => {
    if (isDeliverToInitialLocation) {
      setFinalDeliveryCost(2 * singleDeliveryCost);
    } else {
      setFinalDeliveryCost(singleDeliveryCost);
    }
  }, [isDeliverToInitialLocation]);

  const validateDeliveryLocation = async (postalCode: string, postalCodeCountry: string, postalCodeCity: string) => {
    try {
      const postCodeValidationData = await mutateAsync({ listingId: vehicleId, postalCode, postalCodeCountry, postalCodeCity });
      if (postCodeValidationData?.status === 200 && selectedResult?.coordinates?.length === 2) {
        updateDrivingDistance(selectedResult?.coordinates[0], selectedResult?.coordinates[1]);
      } else {
        setSingleDeliveryCost(0);
      }
    } catch (error) {}
  };

  // get updated driving distance and update the state
  const updateDrivingDistance = async (long: number, lat: number) => {
    const drivingDistanceInKm = await getDrivingDistance(`${carCoordinates[0]},${carCoordinates[1]}`, `${long},${lat}`);
    setDeliveryDistance(Number(drivingDistanceInKm));
  };

  // refetch delivery price API
  const updateDeliveryPrice = async () => {
    setSingleDeliveryCost(0);
    setFinalDeliveryCost(0);
    const priceData = await getVehicleDeliveryPrice({ drivingDistanceInKm: deliveryDistance });
    setSingleDeliveryCost(priceData?.data?.data[0]?.finalCost);
    setFinalDeliveryCost(priceData?.data?.data[0]?.finalCost);
  };

  const handleDeliverToInitialLocation = (value: any) => {
    setIsDeliverToInitialLocation(Boolean(value));
  };

  return (
    <div>
      <HeadingSemiSmall title="Bring the vehicle to me" description="Vehicle will be delivered to your selected location"></HeadingSemiSmall>

      <SearchLocationField
        searchResults={searchResults}
        selectedResult={selectedResult}
        searchText={searchText}
        handleAutocompleteChange={handleAutocompleteChange}
        handleSearchTextChange={handleSearchTextChange}
        helpingText={isLoading ? 'Calculating delivery fee' : 'Please confirm after selecting the delivery location'}
      ></SearchLocationField>

      {finalDeliveryCost > 0 && (
        <div>
          <InputCheckbox
            label="Vehicle should be picked up from this location and delivered to the initial location after the travel end"
            handleChange={handleDeliverToInitialLocation}
            isChecked={isDeliverToInitialLocation}
          ></InputCheckbox>
          <div className="flex justify-between items-center">
            <p className="m-0 flex gap-1 items-center text-sm text-gray-500">
              <span>Delivery Fee:</span>
              <span>{` $${finalDeliveryCost}`}</span>

              <CommonTooltip title={`One way driving distance: ${deliveryDistance} km`}>
                <IconButton size="small">
                  <IoInformationCircleOutline className="text-gray-400" />
                </IconButton>
              </CommonTooltip>
            </p>

            <Button className="underline">Confirm</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDeliverToGuest;
