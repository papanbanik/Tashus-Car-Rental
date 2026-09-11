import CommonTextIcon from '@/components/Common/CommonTextIcon';
import ShowPickupReturnTime from '@/components/Common/DateTimePickers/ShowPickupReturnTime';
import { TDate } from '@/types/commonTypes';
import { Divider } from '@mui/material';
import Link from 'next/link';
import { GoDotFill } from 'react-icons/go';
import { LuCalendarCheck2 } from 'react-icons/lu';
type BasicInfoCardProps = {
  reservationId?: number;
  startDate: TDate;
  endDate: TDate;
  paymentStatus?: string;
  userId: string;
  isPaymentTimeExpired: boolean;
};
const BasicInfoCard = ({ reservationId, startDate, endDate, paymentStatus, userId, isPaymentTimeExpired }: BasicInfoCardProps) => {
  return (
    <div className="bg-primary rounded-md p-4">
      <ShowPickupReturnTime startDate={startDate} endDate={endDate} itemWhite={true} />
      <Divider className="border-white my-2" />
      <div className="flex justify-between items-center">
        <CommonTextIcon
          className="text-white text-xs md:text-sm"
          text={
            <span>
              Reservation Id:{' '}
              {isPaymentTimeExpired ? (
                <span className="font-semibold">{reservationId}</span>
              ) : (
                <Link href={`/dashboard/${userId}/travels/details/${reservationId}`} target="_blank" className="underline font-semibold text-white">
                  {reservationId}
                </Link>
              )}
            </span>
          }
          startIcon={<LuCalendarCheck2 className="text-white mr-2" />}
        />
        <div className="w-1/2 flex justify-center items-center border border-solid border-white p-1 rounded-md">
          <div>
            <CommonTextIcon
              className="text-white text-xs md:text-sm font-semibold"
              text={`${paymentStatus}`}
              startIcon={<GoDotFill className={`${paymentStatus === 'Paid' ? 'text-success' : 'text-warning'}`} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoCard;
