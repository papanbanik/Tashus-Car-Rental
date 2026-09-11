import GuestReviews from '@/components/Common/VehicleDetails/VehicleReviews/GuestReviews';
import { Alert, useMediaQuery } from '@mui/material';
import Pagination from '@mui/material/Pagination'; // MUI Pagination component
import dayjs from 'dayjs';
import { useState } from 'react';
import { TBasicReviewRating } from '../types/publicProfileTypes';

const CommonPublicReview = ({
  reviews: initialReviews,
  title,
  helpingText,
}: {
  reviews: TBasicReviewRating[];
  title?: string;
  helpingText?: string;
}) => {
  const isSmallDevice = useMediaQuery('(max-width:600px)');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 5;

  const reviews = initialReviews?.filter((review) => (review?.rating ?? 0) > 0);
  const totalPages = Math.ceil(reviews?.length / reviewsPerPage);

  // Filter reviews with comments
  const reviewsWithComments = reviews?.filter((review) => review?.review?.trim() !== '');
  const reviewsWithoutComments = reviews?.filter((review) => !review?.review?.trim());

  // Combine reviews with comments first, then reviews without comments
  const sortedReviews = [...reviewsWithComments, ...reviewsWithoutComments];

  // Update total reviews count to only include reviews with comments
  const totalReviewsWithComments = reviewsWithComments.length;

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const visibleReviews = sortedReviews?.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Title and Helping Text */}
      <div>
        <h2 className="text-xl font-bold m-0 p-0">{`${title} Reviews`}</h2>
        {!!helpingText && <span className="helping_text">{helpingText}</span>}
        {/* <p className="text-sm text-gray-600">
          Total {title} {getSingularPluralNoun('Review', reviews?.length)}: <span className="font-semibold">{reviews?.length}</span>
        </p> */}
      </div>

      {/* Reviews Container with Fixed Height and Scrollbar */}
      {reviews?.length > 0 ? (
        <>
          <div className="max-h-[400px] overflow-y-auto border border-solid border-accent rounded-lg p-2 shadow-md bg-neutral">
            {visibleReviews?.map((review, index) => (
              <div key={index} className="my-4">
                <GuestReviews
                  guestImage={review.guestImage || review.hostImage}
                  guestName={review?.guestName ?? review?.hostName ?? ''}
                  rating={review?.rating ?? 0}
                  reviewTime={`${
                    isSmallDevice ? `${dayjs(review?.reviewTime).format('DD MMM, YY')}` : `${dayjs(review?.reviewTime).format('DD MMMM, YYYY')}`
                  }`}
                  review={review?.review ?? ''}
                />
                {/* Display carListingId in a user-friendly way */}
                {/* {review.carListingId && (
                  <p className="text-sm text-gray-500 mt-2">
                    Car Listing: <span className="font-semibold">#{review.carListingId}</span>
                  </p>
                )} */}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-end mt-4">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size={isSmallDevice ? 'small' : 'medium'}
                boundaryCount={2}
                siblingCount={isSmallDevice ? 0 : 2}
                // renderItem={(item) => <PaginationItem slots={{ previous: FaChevronLeft, next: FaChevronRight }} {...item} />}
              />
            </div>
          )}
        </>
      ) : (
        <Alert severity="info" className="my-2">
          {' '}
          No {title?.toLowerCase()} review yet
        </Alert>
      )}
    </div>
  );
};

export default CommonPublicReview;
