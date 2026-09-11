export type SupportTicketInputs = {
  category: string | null;
  subject: string;
  description: string;
  returnedKilometersRange: string;
  rentedKilometersRange: string;
  vehicleNickName?: string;
  chatPhotosUrl: Blob[];
};

export const partnerIssueCategories = [
  'Reservation',
  'Vehicle Damage',
  'Fuel Gap',
  'Missing Parts',
  'Illegal Parking',
  'Infringements',
  'Cleanliness',
  'Smoking Odour',
  'Tolls',
  'Other',
];

export const cancelCurrentReservationCategories = [
  'Guest Not Present',
  'Driver License Not Shown',
  'Driver License Expired',
  'Guest Has Animal',
  'Other',
];

export const guestIssueCategories = ['Low Fuel', 'Cleanliness', 'Vehicle Damage', 'Other'];

export const generalIssueCategories = ['Billing Info', 'Payment Claim', 'Other'];

export const ownerIssueCategories = ['Billing Info', 'Payment Claim', 'Vehicle Listing', 'Vehicle Unlisting ', 'Other'];

export interface AddUserNewCommentType {
  status: 'all' | 'open' | 'inprogress' | 'closed';
  commentData: {
    userId: string;
    supportAgentId: string;
    isSupportAgentComment: boolean;
    comment: string;
    attachments: Blob[];
    // attachments: {
    //   filename: string;
    //   fileInfo: {
    //     url: string;
    //   };
    // }[];
  };
  ticketId: string;
}
export type SupportChatValues = {
  comment: string;
  chatPhotosUrl: Blob[];
};

export type AddSupportTicketType = {
  reservationId?: number;
  ticket: any;
};
