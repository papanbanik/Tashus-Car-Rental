import { CancellationInfo } from '@/types/travels/typeTravels';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { getCancelledTravelReturnAmountText } from '../../TravelDetails/TravelBilling/travelBillingFn';

const TravelCancellationInfoM = ({ cancellationInfo }: { cancellationInfo: CancellationInfo }) => {
  const { guestInconvenienceFee = 0, guestInconvenienceFeeReason, returnAmount = 0, isRefundable, returnStatus, cancellationTime } = cancellationInfo;
  return (
    <div className="my-2">
      <Divider className="border border-black my-1" />
      <span className="flex justify-between items-center px-2 bg-primary text-white">
        <span className="text-lg font-bold">Cancellation Info</span>
        <span className="text-md font-bold">{formatFullDateTime(cancellationTime)}</span>
      </span>
      <Divider className="border border-black my-1" />
      {guestInconvenienceFee > 0 && (
        <div className="flex justify-between items-center text-xs p-2 bg-[#ececec]">
          <div>
            <span>Inconvenience Fee</span>
            {guestInconvenienceFeeReason && (
              <Tooltip enterTouchDelay={0} title={guestInconvenienceFeeReason} arrow={true} placement="top">
                <IconButton size="small">
                  <AiOutlineInfoCircle />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <span className="text-error"> {`-$${guestInconvenienceFee}`}</span>
        </div>
      )}
      {returnAmount > 0 && (
        <div className="flex justify-between items-center text-xs p-2 bg-[#fafafa]">
          <span>{getCancelledTravelReturnAmountText(isRefundable, returnStatus ?? '')}</span>
          <span className="text-success"> {`+$${returnAmount}`}</span>{' '}
        </div>
      )}
    </div>
  );
};

export default TravelCancellationInfoM;
