import { EDeliveryCancelledBy, EDeliveryRequestStatus, EDeliveryStage } from '@/types/reservations/reservationDeliveryTypes';
import { LuBot, LuCheckCircle, LuClock, LuKey, LuMapPin, LuPackage, LuRotateCcw, LuShield, LuTruck, LuUser, LuXCircle } from 'react-icons/lu';

export const getStageIcon = (stage: string) => {
  switch (stage) {
    case EDeliveryStage.RequestCreated:
      return <LuPackage className="h-4 w-4" />;
    case EDeliveryStage.DriverAssigned:
    case EDeliveryStage.ReturnDriverAssigned:
      return <LuTruck className="h-4 w-4" />;
    case EDeliveryStage.DriverAccepted:
    case EDeliveryStage.ReturnDriverAccepted:
      return <LuCheckCircle className="h-4 w-4" />;
    case EDeliveryStage.DriverPickup:
    case EDeliveryStage.ReturnDriverPickup:
      return <LuMapPin className="h-4 w-4" />;
    case EDeliveryStage.StartOnWay:
    case EDeliveryStage.ReturnOnWay:
      return <LuTruck className="h-4 w-4" />;
    case EDeliveryStage.ReachDeliveryPoint:
    case EDeliveryStage.ReturnReachPickup:
      return <LuMapPin className="h-4 w-4" />;
    case EDeliveryStage.HandoverKey:
    case EDeliveryStage.ReturnHandoverKey:
      return <LuKey className="h-4 w-4" />;
    case EDeliveryStage.Completed:
    case EDeliveryStage.ReturnCompleted:
      return <LuCheckCircle className="h-4 w-4" />;
    case EDeliveryStage.ReturnStarted:
      return <LuRotateCcw className="h-4 w-4" />;
    default:
      return <LuClock className="h-4 w-4" />;
  }
};

export const getStageColor = (stage: string) => {
  if (stage.includes('return')) {
    return 'text-blue-600 bg-blue-50';
  }
  switch (stage) {
    case EDeliveryStage.RequestCreated:
      return 'text-yellow-600 bg-yellow-50';
    case EDeliveryStage.DriverAssigned:
      return 'text-blue-600 bg-blue-50';
    case EDeliveryStage.DriverPickup:
    case EDeliveryStage.StartOnWay:
    case EDeliveryStage.ReachDeliveryPoint:
      return 'text-purple-600 bg-purple-50';
    case EDeliveryStage.HandoverKey:
    case EDeliveryStage.Completed:
    case EDeliveryStage.DriverAccepted:
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getCancelledByInfo = (cancelledBy: EDeliveryCancelledBy) => {
  switch (cancelledBy) {
    case EDeliveryCancelledBy.User:
      return {
        icon: <LuUser className="w-4 h-4" />,
        label: 'Customer',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-800',
      };
    case EDeliveryCancelledBy.Driver:
      return {
        icon: <LuTruck className="w-4 h-4" />,
        label: 'Driver',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-800',
      };
    case EDeliveryCancelledBy.TashusAdmin:
      return {
        icon: <LuShield className="w-4 h-4" />,
        label: 'Tashus Admin',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-800',
      };
    case EDeliveryCancelledBy.System:
      return {
        icon: <LuBot className="w-4 h-4" />,
        label: 'System',
        bgColor: 'bg-gray-50',
        iconColor: 'text-gray-600',
        textColor: 'text-gray-800',
      };
    default:
      return {
        icon: <LuXCircle className="w-4 h-4" />,
        label: 'Unknown',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
      };
  }
};

export const getDeliveryRequestStatusColor = (status: string) => {
  switch (status) {
    case EDeliveryRequestStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case EDeliveryRequestStatus.Assigned:
      return 'bg-blue-100 text-blue-800';
    case EDeliveryRequestStatus.Accepted:
      return 'bg-indigo-100 text-indigo-800';
    case EDeliveryRequestStatus.InProgress:
      return 'bg-purple-100 text-purple-800';
    case EDeliveryRequestStatus.Completed:
      return 'bg-green-100 text-green-800';
    case EDeliveryRequestStatus.Cancelled:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getDarkStatusColor = (status: EDeliveryRequestStatus) => {
  switch (status) {
    case EDeliveryRequestStatus.Pending:
      return '#fcbf49';
    case EDeliveryRequestStatus.Assigned:
      return '#1e40af';
    case EDeliveryRequestStatus.Accepted:
      return '#15803d';
    case EDeliveryRequestStatus.InProgress:
      return '#800080';
    case EDeliveryRequestStatus.Completed:
      return '#5C8D07';
    case EDeliveryRequestStatus.Cancelled:
      return '#f87272';
    default:
      return '#374151';
  }
};
