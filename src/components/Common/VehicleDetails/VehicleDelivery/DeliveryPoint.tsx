import { getDrivingDistance } from '@/components/CarListing/CarLocation/map.common';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useGetVehicleDeliveryPrice } from '@/hooks/car-search/useGetVehicleDeliveryPrice';
import { useValidateVehiclePostcode } from '@/hooks/car-search/useValidateVehiclePostcode';
import useSearchLocation from '@/hooks/custom-hooks/useSearchLocation';
import { VehicleDeliveryInfoState } from '@/types/vehicle-details/vehicle-details';
import { getCarShortLocation } from '@/utils/Functions/carListingCommonFn';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { getShortAddress } from '../../../../utils/Functions/vehicle-delivery/deliveryFn';
import SearchLocationField from '../../InputFields/SearchLocationField';
import ChargeFee from './CommonUIComponent/ChargeFee';
import LocationInfo from './CommonUIComponent/LocationInfo';
import VehicleReturn from './VehicleReturn';

const DeliveryPoint = () => {
  const { carData: { location } = {} } = useCarListingContext();
  const { pickupAddress, pickupHistory } = location ?? {};
  const [searchText, selectedResult, searchResults, handleAutocompleteChange, handleSearchTextChange] = useSearchLocation();
  const { data, isLoading, mutateAsync: getVehicleDeliveryPrice } = useGetVehicleDeliveryPrice();
  const { mutateAsync, isLoading: isPostCodeLoading } = useValidateVehiclePostcode();
  const { vehicleId } = useParams<{ vehicleId: string }>();

  const { setVehicleDeliveryInfo, deliveryCost, setDeliveryCost, setDeliveryDistance, deliveryDistance } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();

  const carCoordinates = pickupAddress?.coordinates || [0, 0];
  //Get Addresses
  const shortAddress =
    pickupHistory && pickupHistory?.length > 0
      ? pickupHistory?.slice(-1)?.[0]?.shortAddress
      : pickupAddress
      ? getCarShortLocation(pickupAddress)
      : '';
  const deliveryShortAddress = selectedResult ? getShortAddress(selectedResult) : '';
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
      setDeliveryCost(0);
    }
  }, [selectedResult]);

  // update delivery cost whenever delivery distance changes
  useEffect(() => {
    if (deliveryDistance > 0) {
      updateDeliveryPrice();
    }
  }, [deliveryDistance]);

  useEffect(() => {
    if (deliveryCost > 0 && selectedResult) {
      // this state should be set when user confirms the delivery
      setVehicleDeliveryInfo({
        deliveryLocation: selectedResult,
        deliveryFee: deliveryCost,
        drivingDistance: deliveryDistance,
      });
    } else {
      setVehicleDeliveryInfo({} as VehicleDeliveryInfoState);
    }
  }, [deliveryCost]);

  const validateDeliveryLocation = async (postalCode: string, postalCodeCountry: string, postalCodeCity: string) => {
    try {
      const postCodeValidationData = await mutateAsync({ listingId: vehicleId, postalCode, postalCodeCountry, postalCodeCity });
      if (postCodeValidationData?.status === 200 && selectedResult?.coordinates?.length === 2) {
        updateDrivingDistance(selectedResult?.coordinates[0], selectedResult?.coordinates[1]);
      } else {
        setDeliveryCost(0);
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
    setDeliveryCost(0);
    const priceData = await getVehicleDeliveryPrice({ drivingDistanceInKm: deliveryDistance });
    setDeliveryCost(priceData?.data?.data[0]?.finalCost);
  };

  return (
    <div>
      <SearchLocationField
        searchResults={searchResults}
        selectedResult={selectedResult}
        searchText={searchText}
        handleAutocompleteChange={handleAutocompleteChange}
        handleSearchTextChange={handleSearchTextChange}
        helpingText={isLoading ? 'Calculating delivery fee' : 'Please confirm after selecting the delivery location'}
      />
      {!!deliveryShortAddress && deliveryCost ? (
        <>
          {/*Pickup and Delivery Location*/}
          <LocationInfo initialLabel="Pickup Point" initialValue={shortAddress} finalLabel="Delivery Point" finalValue={deliveryShortAddress} />
          {/* Delivery Fee */}
          <ChargeFee label="Delivery Fee" value={deliveryCost} tooltipText={`Delivery Distance: ${deliveryDistance}KM`} />
          <VehicleReturn deliveryAddress={deliveryShortAddress} initialAddress={shortAddress} deliveryCost={deliveryCost} />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default DeliveryPoint;
