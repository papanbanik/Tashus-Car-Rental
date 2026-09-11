'use client';
import { separateFullName } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import { TiStar } from 'react-icons/ti';
import CommonExpandText from '../../CommonExpandText';
import CommonRating from '../../CommonRating';
import ProfileAvatar from '../../ProfileAvatar';

interface GuestReviewProps {
  guestImage?: string;
  guestName: string;
  rating: number;
  reviewTime: string;
  review: string;
}

const GuestReview = ({ guestImage, guestName, rating, reviewTime, review }: GuestReviewProps) => {
  const isSmallDevice = useMediaQuery('(max-width:600px)');
  const { firstName, lastName } = separateFullName(guestName);
  return (
    <div className="relative">
      <div className=" absolute left-0 top-1/2 transform -translate-y-1/2">
        {/* <Avatar src={guestImage ?? ''} sx={{ width: 60, height: 60 }} /> */}
        <ProfileAvatar
          firstName={firstName}
          lastName={lastName}
          profilePictureUrl={guestImage}
          sx={{ width: 60, height: 60, bgcolor: !guestImage ? '#800080' : 'transparent', fontSize: 24 }}
        />
      </div>
      <div className="flex flex-row items-center bg-white p-4 rounded-lg ml-8">
        <div className="flex flex-col ml-6">
          <div className={`flex ${isSmallDevice ? 'flex-col' : 'flex-row'}`}>
            <div>
              <span className="font-bold pr-4">{guestName}</span>
            </div>
            <div className="flex">
              {/* <Rating initialRating={rating} /> */}
              <CommonRating
                initialRating={rating}
                emptyIcon={<TiStar />}
                readOnly
                size="small"
                // showRatingNumber={true}
                // noMaxRating={true}
                typographyProps={{ className: 'text-sm md:text-md' }}
              />
              <span className="pl-2 md:pl-4  text-gray-500 text-sm">{reviewTime}</span>
            </div>
          </div>
          <CommonExpandText className="text-justify" maxLines={2} multiMaxLine={isSmallDevice ? 30 : 50} text={review ?? ''} />
        </div>
      </div>
    </div>
  );
};

export default GuestReview;
