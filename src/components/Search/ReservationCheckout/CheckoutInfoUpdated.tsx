import ShowPickupReturnTime from '@/components/Common/DateTimePickers/ShowPickupReturnTime';
import theme from '@/components/Theme/theme';
import { useCarListingContext } from '@/context/CarListingProvider';
import { TReservationInfo } from '@/context/SearchProvider';
import { getDurationDayHourMin } from '@/utils/Functions/dateTimeCommonFn';
import { loadText } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import { FaCar } from 'react-icons/fa';
import { LuCircleDollarSign } from 'react-icons/lu';
import { TbCalendarTime } from 'react-icons/tb';

interface ICheckoutInfoUpdatedProps {
  reservationInfo: TReservationInfo | null;
  totalPrice: number;
}

const CheckoutInfoUpdated = ({ reservationInfo, totalPrice }: ICheckoutInfoUpdatedProps) => {
  const { carData } = useCarListingContext();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  if (!reservationInfo) return null;
  return (
    <div className={` bg-white shadow-lg shadow-secondary rounded-lg w-full md:my-6 mb-3`}>
      <div className="w-full bg-success rounded-t-lg flex justify-center items-center">
        <FaCar className="text-white mr-2" />
        <span className="text-white text-xs sm:text-sm md:text-base lg:text-lg m-0 p-1">
          {!!carData
            ? `${carData?.car?.make ?? loadText} ${carData?.car?.model ?? loadText} (${carData?.carNickName ?? loadText})`
            : `Reservation Info`}
        </span>
      </div>
      <div className="col-span-2 flex justify-between items-center md:p-4 px-2">
        <ShowPickupReturnTime startDate={reservationInfo?.pickupTime} endDate={reservationInfo?.returnTime} />
        {!isSmallDevice && (
          <div className="flex md:gap-4 gap-2">
            <div className={`font-bold flex flex-col justify-around items-start sm:flex-none`}>
              <div className="flex">
                <TbCalendarTime className="text-primary md:text-xl text-md" />
              </div>
              <div className="flex">
                <LuCircleDollarSign className="text-primary md:text-xl text-md" />
              </div>
            </div>
            <div className="flex flex-col justify-around items-start sm:flex-none">
              <p className="m-0 flex md:gap-1 md:text-base text-xs">
                <span>{'Duration: '}</span>
                <span className="font-bold">{getDurationDayHourMin(reservationInfo?.pickupTime, reservationInfo?.returnTime)}</span>
              </p>
              <p className="m-0 flex md:gap-1 md:text-base text-xs">
                <span>{'Reservation Price: '}</span> <span className="font-bold">{`$${totalPrice?.toFixed(2)}`}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutInfoUpdated;
