'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TVerifyGuestInfoByPartner } from '@/types/reservations/typeReservationsActions';
import { TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { TPeakIncreasedDates } from '@/types/user-profile/customPriceTypes';
import { generatePeakIncreasedDates, getUpdatedTravelData } from '@/utils/Functions/travelCommonFn';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getTravelDetails = async (reservationId: number | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/find-details/${reservationId}`);
  // console.log('Travel Response', response);
  return response;
};

export const useTravelDetails = () => {
  const { travelId, reservationId: reservationIdParam } = useParams<{ travelId: string; reservationId: string }>();
  const reservationID = parseInt(travelId) || parseInt(reservationIdParam);
  const { setTravelDetails } = useProfileInfoContext();
  const { setUpdatedTravelData, setVerifyGuestInfoByPartner, setPeakIncreasedDates } = useTravelContext();
  const { userCred } = useUserCredContext();
  const { setListingId } = useCarListingContext();
  const { setAdditionalDrivers } = useSearchContext();
  return useQuery({
    queryKey: ['travel-details', { reservationID }],
    queryFn: () => getTravelDetails(reservationID),
    enabled: !!reservationID && !!userCred?.userId,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data);
      if (userCred?.userId) {
        setTravelDetails(data?.data);
        setAdditionalDrivers(data?.data?.additionalDrivers);
        setListingId(data?.data?.carListingId);
        const updatedData: TUpdatedTravelData = getUpdatedTravelData(data?.data, userCred?.userId);
        // console.log('updated travel Data', updatedData);
        setUpdatedTravelData(updatedData);
        setVerifyGuestInfoByPartner({} as TVerifyGuestInfoByPartner);
        const { reservationInfo, startDate: initialPickupDate, endDate: initialReturnDate } = data?.data ?? {};
        const { peakIncrease: initialPeakIncrease, basePrice, revisedReservations = [] } = reservationInfo ?? {};
        const { dailyPrice: initialDailyPrice, hourlyPrice: initialHourlyPrice } = basePrice ?? {};
        const result: TPeakIncreasedDates[] = generatePeakIncreasedDates({
          initialPickupDate,
          initialReturnDate,
          initialDailyPrice,
          initialHourlyPrice,
          initialPeakIncrease,
          revisedReservations,
        });
        setPeakIncreasedDates(result);
      }
    },
    onError: (err) => {
      console.log('useTravelDetails error', err);
      return err;
    },
  });
};
