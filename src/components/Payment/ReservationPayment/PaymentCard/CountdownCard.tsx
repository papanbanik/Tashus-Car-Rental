import { TDate } from '@/types/commonTypes';
import { Divider } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

dayjs.extend(duration);

interface CountdownTime {
  minutes: string;
  seconds: string;
}
const CountdownCard = ({
  reservedAt,
  paymentStatus,
  isPaymentTimeExpired,
  isHoldSuccess,
}: {
  reservedAt?: TDate;
  paymentStatus?: string;
  isPaymentTimeExpired: boolean;
  isHoldSuccess?: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ minutes: '30', seconds: '00' });
  const isPaymentPaid = paymentStatus === 'Paid';
  const isPaymentPendingCharge = paymentStatus === 'Pending Charge' || paymentStatus === 'Partially Paid';
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const updateCountdown = () => {
      // const now = dayjs();
      // const end = dayjs(reservedAt).add(30, 'minute');
      // const diff = end.diff(now);
      const diffInMinutes = dayjs().diff(dayjs(reservedAt), 'minute');
      if (diffInMinutes >= 30 || isPaymentPaid || isPaymentPendingCharge) {
        setTimeLeft({ minutes: '00', seconds: '00' });
      } else {
        const diffInMilliseconds = dayjs(reservedAt).add(30, 'minute').diff(dayjs());
        const durationLeft = dayjs.duration(diffInMilliseconds);
        const minutes = durationLeft.minutes().toString().padStart(2, '0');
        const seconds = durationLeft.seconds().toString().padStart(2, '0');
        setTimeLeft({ minutes, seconds });
        timeoutId = setTimeout(updateCountdown, 1000);
      }
    };
    updateCountdown();
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [reservedAt, paymentStatus]);
  return (
    <div className="w-full md:w-[500px] relative z-10 opacity-100 p-4 bg-white border border-solid border-primary shadow-md shadow-fuchsia-400 rounded-lg">
      <div className="flex justify-center items-center">
        <span className="text-md md:text-lg lg:text-2xl font-semibold w-1/2 text-center">
          {isHoldSuccess === false ? (
            <span className="text-error">Due Hold</span>
          ) : isPaymentPaid ? (
            <span className="text-success">Reservation Paid</span>
          ) : isPaymentTimeExpired ? (
            <span className="text-error">Time Expired</span>
          ) : isPaymentPendingCharge ? (
            <span className="text-warning">Pending Payment</span>
          ) : (
            <span>
              Complete <br /> Payment Within
            </span>
          )}
        </span>
        <Divider orientation="vertical" flexItem className=" border-accent mx-4  self-stretch" />
        <div className="flex gap-2 justify-center items-center w-1/2 ">
          <div className="flex flex-col gap-1">
            <div className="bg-primary text-white rounded-md p-2 flex justify-center">
              <span className="digital-font font-bold text-md md:text-lg lg:text-2xl">
                {timeLeft?.minutes === '00' && timeLeft?.seconds === '00' ? '--' : timeLeft?.minutes}
              </span>
            </div>
            <span className="font-bold text-xs md:text-sm">Minutes</span>
          </div>
          <span className="digital-font font-bold text-md md:text-2xl"> {`:`}</span>
          <div className="flex flex-col gap-1">
            <div className="bg-primary text-white rounded-md p-2 flex justify-center">
              <span className="digital-font font-bold text-md md:text-lg lg:text-2xl">
                {timeLeft?.minutes === '00' && timeLeft?.seconds === '00' ? '--' : timeLeft?.seconds}
              </span>
            </div>
            <span className="font-bold text-xs md:text-sm">Seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownCard;
