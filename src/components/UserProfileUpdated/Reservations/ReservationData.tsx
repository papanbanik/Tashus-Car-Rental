'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useReservationList } from '@/hooks/reservation/useReservationList';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { AiOutlineLine } from 'react-icons/ai';
type ReservationDataProps = {
  reservationType: string;
};
const ReservationData: React.FC<ReservationDataProps> = ({ reservationType }) => {
  // const ReservationData = () => {
  let matchingReservationsFound = false;
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { userCred } = useUserCredContext();
  const { setDetailsId, vehicleSelect } = useProfileInfoContext();
  const { data } = useReservationList();
  // console.log(data);
  const router = useRouter();
  // console.log(params);
  // const reservationsType = params['reservations-type'];
  const { reservationsType } = useParams<{ reservationsType: string }>();
  // console.log(reservationDetails);
  // console.log('Reservation', data);
  // console.log('Reservation', data?.data);
  // console.log(vehicleSelect);
  const showDetails = (reservationId: number) => {
    setDetailsId(reservationId);
    // console.log(reservationId);
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/profile/${userCred?.userId}/reservations/${reservationsType}/${reservationId}`);
  };
  const formatDate = (dateString: string) => {
    const formattedDate = dayjs(dateString).format('DD MMM YYYY | h:mm A');
    return formattedDate;
  };

  if (!data?.data) {
    return <div className={`${isSmallScreen && ` flex justify-center items-center`}`}>Loading...</div>;
  }
  const groupedData: Record<string, any[]> = {};

  data?.data?.forEach((reservationData: any) => {
    const monthYear = dayjs(reservationData?.startDate).format('MMMM YYYY');
    if (!groupedData[monthYear]) {
      groupedData[monthYear] = [];
    }
    groupedData[monthYear].push(reservationData);
  });
  const currentDate = dayjs();
  return (
    <div>
      {/* {data?.data?.map((reservationData: any, index: number) => ( */}
      {Object.keys(groupedData).length === 0 ? (
        <span className={`${isSmallScreen && ` flex justify-center items-center`}`}>No reservations yet.</span>
      ) : (
        <>
          {Object.keys(groupedData)
            // .filter((monthYear) => groupedData[monthYear].some((car) => !vehicleSelect || car.name === vehicleSelect))
            // .filter((monthYear) => {
            //   return !vehicleSelect || groupedData[monthYear].some((reservationData) => reservationData?.carInfo?.model === vehicleSelect);
            // })
            .filter((monthYear) => {
              return (
                !vehicleSelect ||
                groupedData[monthYear].some((reservationData) => {
                  const startDate = dayjs(reservationData?.startDate);
                  const endDate = dayjs(reservationData?.endDate);
                  const isCurrent = startDate.isBefore(currentDate.add(2, 'hour')) && endDate.isAfter(currentDate);
                  const isPast = endDate.isBefore(currentDate);
                  const isUpcoming = !isPast && !isCurrent;
                  if (reservationType === 'past' && isPast) {
                    return reservationData?.carInfo?.model === vehicleSelect;
                  } else if (reservationType === 'upcoming' && isUpcoming) {
                    return reservationData?.carInfo?.model === vehicleSelect;
                  } else if (reservationType === 'current' && isCurrent) {
                    return reservationData?.carInfo?.model === vehicleSelect;
                  } else {
                    return false;
                  }
                })
              );
            })
            .map((monthYear, index) => (
              <>
                {groupedData[monthYear].some((reservationData) => {
                  const isCurrent =
                    dayjs(reservationData.startDate).isBefore(currentDate.add(2, 'hours')) && dayjs(reservationData.endDate).isAfter(currentDate);
                  const isPast = dayjs(reservationData?.endDate).isBefore(currentDate);
                  const isUpcoming = !isPast && !isCurrent;
                  if (
                    reservationData?.carInfo?.model === vehicleSelect ||
                    (reservationType === 'past' && isPast) ||
                    (reservationType === 'upcoming' && isUpcoming) ||
                    (reservationType === 'current' && isCurrent)
                  ) {
                    matchingReservationsFound = true;
                  }
                  return (
                    reservationData?.carInfo?.model === vehicleSelect ||
                    (reservationType === 'past' && isPast) ||
                    (reservationType === 'upcoming' && isUpcoming) ||
                    (reservationType === 'current' && isCurrent)
                  );
                }) && (
                  <div key={index}>
                    <div className="text-xl font-bold text-right">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="bg-primary h-[2px] flex-grow" />
                        <div className="ml-2">{monthYear}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 my-8">
                      {groupedData[monthYear]
                        // .filter((car) => !vehicleSelect || car.name === vehicleSelect)
                        // .filter((reservationData) => !vehicleSelect || reservationData?.carInfo?.model === vehicleSelect)
                        .filter((reservationData) => {
                          // const isCurrent = dayjs(reservationData.startDate).isBefore(currentDate.add(2, 'hours'));
                          const isCurrent =
                            dayjs(reservationData?.startDate).isBefore(currentDate.add(2, 'hours')) &&
                            dayjs(reservationData?.endDate).isAfter(currentDate);
                          const isPast = dayjs(reservationData?.endDate).isBefore(currentDate);
                          const isUpcoming = !isPast && !isCurrent;

                          if (reservationType === 'past' && isPast) {
                            return !vehicleSelect || reservationData?.carInfo?.model === vehicleSelect;
                          } else if (reservationType === 'upcoming' && isUpcoming) {
                            return !vehicleSelect || reservationData?.carInfo?.model === vehicleSelect;
                          } else if (reservationType === 'current' && isCurrent) {
                            return !vehicleSelect || reservationData?.carInfo?.model === vehicleSelect;
                          } else {
                            return false;
                          }
                        })
                        .map((reservation, index) => (
                          <button
                            key={reservation?.reservationId}
                            className="border-none cursor-pointer"
                            onClick={() => showDetails(reservation?.reservationId)}
                          >
                            <div
                              key={index}
                              className="flex w-auto h-auto md:max-h-[350px] bg-white shadow-md shadow-secondary rounded-lg hover:bg-secondary"
                            >
                              <Image
                                src={`${reservation?.coverPhoto?.secureUrl}`}
                                alt="CarImage"
                                width={isSmallScreen ? 150 : 300}
                                height={isSmallScreen ? 120 : 200}
                                // className={`object-cover rounded-lg ${isSmallScreen && `w-auto h-auto`}`}
                                className="object-cover rounded-lg"
                              />
                              <div className="flex-grow md:p-6 p-2">
                                {reservation?.reservationStatus === 'Canceled' && (
                                  <span
                                    className={`bg-error text-white p-2 flex ${
                                      isSmallScreen ? 'w-1/2 items-end rounded-l-full transform translate-x-full' : 'w-1/4 items-start rounded-r-xl'
                                    }`}
                                  >
                                    Canceled
                                  </span>
                                )}
                                <div className="grid grid-cols-[auto,1fr] font-bold md:text-2xl text-md my-2">
                                  <span className="md:whitespace-nowrap text-start">{reservation?.carInfo?.model}</span>
                                  <span className="text-right ">${reservation?.basePrice?.totalPrice}</span>
                                </div>
                                <div>
                                  <div className="md:text-lg text-md text-start">
                                    <span>
                                      {reservation?.pickupAddress?.city}, {reservation?.pickupAddress?.state}
                                    </span>
                                  </div>
                                  <div className="flex flex-row gap-4 text-sm my-2">
                                    <div className="grid grid-cols-1 w-4 md:my-0">
                                      {reservation.reservationStatus === 'Canceled' ? (
                                        <Image
                                          src="/icons/FromTo/DisabledFromTo.svg"
                                          alt="FromTo"
                                          width={isSmallScreen ? 150 : 300}
                                          height={isSmallScreen ? 100 : 200}
                                          className="object-cover rounded-lg w-auto h-auto"
                                        />
                                      ) : (
                                        <Image
                                          src="/icons/FromTo/EnabledFromTo.svg"
                                          alt="FromTo"
                                          width={isSmallScreen ? 150 : 300}
                                          height={isSmallScreen ? 100 : 200}
                                          className="object-cover rounded-lg w-auto h-auto"
                                        />
                                      )}
                                    </div>
                                    <div className="flex flex-row text-start">
                                      <div className={`${isSmallScreen && `font-bold`}`}>
                                        <div>
                                          <span>From</span>
                                        </div>
                                        <div>To</div>
                                      </div>
                                      <div className="ml-2 md:font-bold">
                                        <div>
                                          <span>{formatDate(reservation?.startDate)}</span>
                                        </div>
                                        <span>{formatDate(reservation?.endDate)}</span>
                                      </div>
                                    </div>
                                    {!isSmallScreen && (
                                      <div className="flex flex-row font-bold text-start">
                                        <AiOutlineLine size={40} className="transform rotate-90 text-primary" />
                                        <div className="grid grid-cols-1 font-bold ml-2">
                                          {reservation?.distance?.maximumDailyDistance ? (
                                            <span>
                                              KM Included:<span className="font-bold"> {`${reservation?.distance?.maximumDailyDistance} KM`}</span>
                                            </span>
                                          ) : (
                                            <span className="font-bold">Unlimited Distance</span>
                                          )}
                                          <span>
                                            <span className="font-bold"> {`$${reservation?.rates?.hourlyRates?.amount}`}</span>/hr
                                            <span className="font-bold"> {`$${reservation?.basePrice?.totalPrice}`}</span>/day
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </>
            ))}
          {!matchingReservationsFound && (
            <div>
              <span className="text-primary font-bold">No {reservationType} reservations found.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReservationData;
