import ShowPickupReturnTime from '@/components/Common/DateTimePickers/ShowPickupReturnTime';
import { TDate } from '@/types/commonTypes';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';

type PaymentInfoCardProps = {
  reservationId?: number;
  withHoldPayment: boolean;
  startDate: TDate;
  endDate: TDate;
  depositAmount: number;
  paymentAmount: number;
};
const PaymentInfoCard = ({ reservationId, withHoldPayment, startDate, endDate, depositAmount, paymentAmount }: PaymentInfoCardProps) => {
  return (
    <div
      className={`w-full md:w-2/3 lg:w-3/5 lg:max-w-[1024px] grid grid-cols-3 justify-between items-center bg-white shadow-lg shadow-secondary rounded-lg lg:p-4`}
    >
      {/* Reservation Id(Date & Time for Small and Medium Screen) */}
      <div className="relative col-span-2 lg:col-span-1">
        <div
          className="z-10 relative bg-primary text-white text-sm p-2 w-full flex flex-col"
          style={{
            clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
            zIndex: 100,
          }}
        >
          <span className="ml-4">Reservation Id : {reservationId} </span>
          <div className="lg:hidden">
            <hr className="w-11/12" />
            <div className="ml-4">
              <div className="flex font-bold lg:gap-4 md:gap-2 gap-1 text-[10px]">
                <div className={``}>
                  <p className="m-0 ">From </p>
                  <p className="m-0 ">To </p>
                </div>
                <div className="font-normal">
                  <p className="m-0">| {formatFullDateTimeUtc(startDate)}</p>
                  <p className="m-0">| {formatFullDateTimeUtc(endDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="col-span-1 hidden lg:flex justify-center items-center">
        <ShowPickupReturnTime startDate={startDate} endDate={endDate} />
      </div>

      {/* Payment & Hold Amount */}
      <div className="col-span-1 flex flex-col justify-center items-end font-bold text-xs md:text-base lg:text-2xl mr-2 lg:mr-0">
        {withHoldPayment ? (
          <>
            <span>
              Payable: <span className=" text-success">${paymentAmount}</span>
            </span>
            <span>
              On Hold: <span className=" text-success"> ${depositAmount}</span>
            </span>
          </>
        ) : (
          <span>
            Total: <span className=" text-success">${paymentAmount}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default PaymentInfoCard;
