import { TCancellationDetails } from '@/types/reservations/reservationDeliveryTypes';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { LuCalendar, LuDollarSign, LuFileText, LuXCircle } from 'react-icons/lu';
import { formatCurrency } from './utils/functions/deliveryInfoFn';
import { getCancelledByInfo } from './utils/functions/deliveryInfoStyleFn';

const CancelledDelivery = ({ cancellation, isDelivery }: { cancellation: TCancellationDetails; isDelivery?: boolean }) => {
  const { canceledBy, cancelledAt, reason, cancellationFee = 0 } = cancellation ?? {};
  const cancelledByInfo = getCancelledByInfo(canceledBy);
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col my-2">
        <div className="flex items-center text-gray-600">
          <LuXCircle className="h-4 w-4 mr-2 flex-shrink-0 text-error" />
          <span className="text-sm md:text-lg text-error  font-bold">{`Vehicle ${isDelivery ? 'Delivery' : 'Return'} Cancelled`}</span>
        </div>
        <span className="text-sm italic m-0 text-red-300">This {isDelivery ? 'delivery' : 'return'} has been cancelled</span>
      </div>
      {/* Cancelled By */}
      <div className={`inline-flex items-center p-1 rounded-full ${cancelledByInfo.bgColor}`}>
        <div className="flex items-center gap-1">
          <span className={cancelledByInfo.iconColor}>{cancelledByInfo.icon}</span>
          <span className={`text-sm font-medium ${cancelledByInfo.textColor}`}>Cancelled by {cancelledByInfo.label}</span>
        </div>
      </div>
      {/* Cancellation Details */}
      <div className="flex flex-col gap-1 my-2">
        {/* Cancelled At */}
        <div className="flex items-center gap-2 text-sm">
          <LuCalendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div>
            <span className="text-gray-600">Cancelled on:</span>
            <span className="ml-2 text-gray-900 font-medium">{formatFullDateTime(cancelledAt)}</span>
          </div>
        </div>
        {/* Reason */}
        {!!reason && (
          <div className="grid grid-cols-[auto,1fr] gap-x-2 text-sm items-start">
            <LuFileText className="w-4 h-4 text-gray-500 mt-0.5" />
            <span className="text-gray-600">Reason:</span>
            <div className="col-start-2 text-gray-900 leading-relaxed">{reason}</div>
          </div>
        )}
        {/* Cancellation Fee */}
        {cancellationFee > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <LuDollarSign className="w-4 h-4 text-error flex-shrink-0" />
            <div>
              <span className="text-gray-600">Cancellation Fee:</span>
              <span className="ml-2 text-error font-semibold">{formatCurrency(cancellationFee)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelledDelivery;
