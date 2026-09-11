import { z } from 'zod';
import { TDate } from '../commonTypes';
import { PhoneNumberSchema, PhotoSchema } from './reservationDeliverySchema';

export type TDeliveryLocation = {
  address: string;
  latitude: number;
  longitude: number;
};

export enum EDeliveryRequestType {
  Delivery = 'delivery',
  Return = 'return',
}

export enum EDeliveryRequestStatus {
  Pending = 'pending',
  Assigned = 'assigned',
  Accepted = 'accepted',
  InProgress = 'inprogress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum EDeliveryPaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Refunded = 'refunded',
  Failed = 'failed', // Payment failed (could be due to an issue with processing)
  Cancelled = 'cancelled', // Payment was cancelled (could be by the user or system)
  PartiallyPaid = 'partially_paid', // Payment made but not complete
  UnderReview = 'under_review', // Payment is under review (e.g., fraud check or manual approval)
}

export enum EDeliveryStage {
  // Delivery stages
  RequestCreated = 'request_created',
  DriverAssigned = 'driver_assigned',
  DriverAccepted = 'driver_accepted',
  DriverPickup = 'driver_pickup',
  StartOnWay = 'start_on_way',
  ReachDeliveryPoint = 'reach_delivery_point',
  HandoverKey = 'handover_key',
  Completed = 'completed',
  // Return stages
  ReturnStarted = 'return_started',
  ReturnDriverAssigned = 'return_driver_assigned',
  ReturnDriverAccepted = 'return_driver_accepted',
  ReturnDriverPickup = 'return_driver_pickup',
  ReturnOnWay = 'return_on_way',
  ReturnReachPickup = 'return_reach_pickup',
  ReturnHandoverKey = 'return_handover_key',
  ReturnCompleted = 'return_completed',
}

export type TDeliveryTracker = {
  stage: EDeliveryStage;
  timestamp: TDate;
  description: string; // custom notes on the stage
};

export enum EDeliveryCancelledBy {
  User = 'user',
  Driver = 'driver',
  TashusAdmin = 'tashus_admin',
  System = 'system',
}

export enum EPlatform {
  Tashus = 'tashus',
  TashusDriver = 'driver_app',
}

export type TCancellationDetails = {
  canceledBy: EDeliveryCancelledBy;
  reason?: string;
  cancellationFee?: number;
  cancelledAt: TDate;
};
export type TDeliveryPricing = {
  discount: number;
  cancellationFee: number;
  tips: number;
  deliveryTotalFee: number;
  currency: string;
  createdAt: TDate;
  updatedAt: TDate;
};
type TPhoneNumber = z.infer<typeof PhoneNumberSchema>;
type TProfilePicture = z.infer<typeof PhotoSchema>;
export type TAssignedDriver = {
  // driverName: string;
  // driverEmail: string;
  // driverPhone: string;
  // driverPhoto?: string; // URL to driver's photo
  // assignedAt: TDate;
  // notes: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: TPhoneNumber;
  profilePicture: TProfilePicture;
  assignedAt: TDate;
};
export type TDeliveryRequestInfo = {
  requestType: EDeliveryRequestType;
  carListingId: number;
  reservationId: number;
  platform: EPlatform;
  pickupLocation: TDeliveryLocation;
  deliveryLocation: TDeliveryLocation;
  distanceKm: number;
  requestStatus: EDeliveryRequestStatus;
  paymentStatus: EDeliveryPaymentStatus;
  deliveryTracker: TDeliveryTracker[];
  deliveryTime: TDate;
  pricing: TDeliveryPricing;
  additionalNotes?: string;
  cancellationDetails?: TCancellationDetails;
  createdAt: TDate;
  updatedAt: TDate;
  assignedDriver?: TAssignedDriver;
};

export type TDeliveryRequest = {
  deliveryRequest?: TDeliveryRequestInfo;
  returnRequest?: TDeliveryRequestInfo;
};
