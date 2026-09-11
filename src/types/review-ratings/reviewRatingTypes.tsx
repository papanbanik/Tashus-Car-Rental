//Guest-Review
export type GuestReviewTypes = {
  userId?: string;
  carRating: {
    averageRating: number;
  };
  hostRating: {
    averageRating: number;
  };
  carReviewComment?: string | undefined;
  userReviewComment?: string | undefined;
};

//Host-Review
export type HostReviewTypes = {
  userId?: string;
  guestRating: {
    averageRating: number;
  };
  userReviewComment?: string | undefined;
  carReviewComment?: string | undefined; //For car reply
};
