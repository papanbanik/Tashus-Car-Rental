import { getDrivingDistance } from '@/components/CarListing/CarLocation/map.common';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useGetVehicleDeliveryPrice } from '@/hooks/car-search/useGetVehicleDeliveryPrice';
import { useValidateVehiclePostcode } from '@/hooks/car-search/useValidateVehiclePostcode';
import useSearchLocation from '@/hooks/custom-hooks/useSearchLocation';
import { TDeliveryDetails } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import { getCarShortLocation } from '@/utils/Functions/carListingCommonFn';
import { deliveryCostTooltip, getDeliveryInfoData } from '@/utils/Functions/vehicle-delivery/deliveryFn';
import { Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { HiOutlineLightBulb } from 'react-icons/hi';
import InputCheckbox from '../../InputFields/InputCheckbox';
import SearchLocationField from '../../InputFields/SearchLocationField';
import AvailableLocations from './AvailableLocations';
import DeliveryInfo from './CommonUIComponent/DeliveryInfo';
import LocationInfo from './CommonUIComponent/LocationInfo';

const VehiclePickupReturn = () => {
  const { carData: { location } = {} } = useCarListingContext();
  const { pickupAddress, pickupHistory } = location ?? {};
  const [searchText, selectedResult, searchResults, handleAutocompleteChange, handleSearchTextChange] = useSearchLocation();
  const { data, isLoading, mutateAsync: getVehicleDeliveryPrice } = useGetVehicleDeliveryPrice();
  const { mutateAsync, isLoading: isPostCodeLoading } = useValidateVehiclePostcode();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const {
    deliveryCost,
    setDeliveryCost,
    setDeliveryDistance,
    deliveryDistance,
    isReturnToInitialLocation,
    setIsReturnToInitialLocation,
    setDeliveryDetails,
    isDeliverToInitialLocation,
    setCustomMessage,
    customMessage,
  } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();

  const carCoordinates = pickupAddress?.coordinates || [0, 0];
  //Get Addresses
  const shortAddress =
    pickupHistory && pickupHistory?.length > 0
      ? pickupHistory?.slice(-1)?.[0]?.shortAddress
      : pickupAddress
      ? getCarShortLocation(pickupAddress)
      : '';
  // update driving distance and final cost whenever location is selected
  useEffect(() => {
    setCustomMessage('');
    if (selectedResult?.postcode?.text) {
      validateDeliveryLocation(selectedResult?.postcode?.text, selectedResult?.country?.text, selectedResult?.place?.text);
    }
    // Open snackbar if the selected location doesn't have any postal code
    if (selectedResult?.coordinates?.length === 2 && !selectedResult?.postcode?.text) {
      setDeliveryDetails({} as TDeliveryDetails);
      setDeliveryCost(0);
      setDeliveryDistance(0);
      const warnMessage = 'Please select a location with valid postal code';
      setCustomMessage(warnMessage);
      openSnackBar({
        message: warnMessage,
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
      const deliveryVehicle = {
        pickupLocation: {
          address: pickupAddress?.street ?? '',
          postalCode: pickupAddress?.postalCode?.toString() ?? '',
          latitude: Number(pickupAddress?.coordinates[1] ?? 0),
          longitude: Number(pickupAddress?.coordinates[0] ?? 0),
        },
        distanceKm: Number(deliveryDistance ?? 0),
        deliveryLocation: {
          address: selectedResult?.complete_address ?? '',
          postalCode: selectedResult?.postcode?.toString() ?? '',
          latitude: Number(selectedResult?.coordinates?.[1] ?? 0),
          longitude: Number(selectedResult?.coordinates?.[0] ?? 0),
        },
        pricing: {
          deliveryTotalFee: deliveryCost ?? 0,
        },
        returnEnabled: !isReturnToInitialLocation,
      };
      const newDeliveryDetails = {
        deliveryVehicle,
        totalDeliveryFee: deliveryCost,
        totalReturnFee: isReturnToInitialLocation ? 0 : deliveryCost,
        deliveryFeeDiscount: 0,
        returnFeeDiscount: 0,
        isDeliveryEnabled: isDeliverToInitialLocation,
        isReturnEnabled: !isReturnToInitialLocation,
      };
      setDeliveryDetails(newDeliveryDetails);
    } else {
      setDeliveryDetails({} as TDeliveryDetails);
    }
  }, [deliveryCost, isReturnToInitialLocation, isDeliverToInitialLocation, selectedResult]);

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

  const deliveryInfoData = getDeliveryInfoData(isReturnToInitialLocation, deliveryDistance, deliveryCost, deliveryCostTooltip);

  const { openModal } = useModalContext();
  const handleAvailableLocationShow = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      content: <AvailableLocations />,
    });
  };
  return (
    <div>
      <SearchLocationField
        searchResults={searchResults}
        selectedResult={selectedResult}
        searchText={searchText}
        handleAutocompleteChange={handleAutocompleteChange}
        handleSearchTextChange={handleSearchTextChange}
        helpingText={
          isLoading ? 'Calculating delivery fee' : !!customMessage ? customMessage : !selectedResult ? 'Select your address for delivery' : ''
        }
        error={!!customMessage}
        optionTextSmall={true}
        label="Delivery Address"
      />
      <div className="my-1 flex justify-center items-center text-xs">
        <Button
          variant="outlined"
          size="small"
          className="rounded-full normal-case text-xs md:text-sm flex justify-end"
          startIcon={<FaMapLocationDot />}
          onClick={handleAvailableLocationShow}
        >
          Available Locations
        </Button>
      </div>
      {!!selectedResult?.complete_address && deliveryCost ? (
        <>
          {/*Pickup and Delivery Location*/}
          <LocationInfo
            initialLabel="Pickup Location"
            initialValue={shortAddress}
            finalLabel="Delivery Location"
            finalValue={selectedResult?.complete_address}
            isRoundTrip={!isReturnToInitialLocation}
          />
          {/* Delivery Info */}
          <DeliveryInfo data={deliveryInfoData} />
          <div className="flex flex-col mt-4">
            <InputCheckbox
              label={'Free Return to Pickup Point'}
              handleChange={() => setIsReturnToInitialLocation(!isReturnToInitialLocation)}
              isChecked={isReturnToInitialLocation}
              labelClassName="text-sm font-semibold"
            />
            <span className="flex pl-6 helping_text font-normal">
              <HiOutlineLightBulb size={20} />
              {`Choose to drop off the vehicle at its original location for no additional fee`}
            </span>
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default VehiclePickupReturn;
