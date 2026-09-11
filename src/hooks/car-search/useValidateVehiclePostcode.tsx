import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TDeliveryDetails } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ValidateVehicleDropOffParams {
  listingId: string;
  postalCode: string;
  postalCodeCountry: string;
  postalCodeCity: string;
}

const validateVehiclePostcode = async (bodyValues: ValidateVehicleDropOffParams) => {
  const { listingId, ...rest } = bodyValues;
  const response = await axios.put(`${apiUrl}/search/vehicle-postcode-validation/${listingId}`, {
    ...rest,
  });
  return response;
};

export const useValidateVehiclePostcode = () => {
  const { openSnackBar } = useSnackBarContext();
  const { setCustomMessage, setDeliveryCost, setDeliveryDetails, setDeliveryDistance } = useSearchContext();
  return useMutation({
    mutationFn: (bodyValues: ValidateVehicleDropOffParams) => validateVehiclePostcode(bodyValues),
    onSuccess: (data) => {},
    onError: (err: any) => {
      console.error('useValidateVehiclePostcode mutation error', err);
      setDeliveryDetails({} as TDeliveryDetails);
      setDeliveryCost(0);
      setDeliveryDistance(0);
      setCustomMessage(err?.response?.data?.message ?? err?.message ?? 'An error occurred while validating location.');
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'An error occurred while validating location.',
        severity: 'error',
      });
      return err;
    },
  });
};
