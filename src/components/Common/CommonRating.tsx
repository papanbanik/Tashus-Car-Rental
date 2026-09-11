import Rating, { RatingProps } from '@mui/material/Rating';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { TiStar } from 'react-icons/ti';

interface CommonRatingProps extends RatingProps {
  showRatingNumber?: boolean;
  noMaxRating?: boolean;
  initialRating: number;
  typographyProps?: TypographyProps;
  customClassNames?: string;
  showStar?: boolean;
  starClassName?: string;
  starSize?: number;
}

const CommonRating = ({
  initialRating,
  showRatingNumber,
  noMaxRating,
  customClassNames,
  showStar,
  starClassName,
  starSize,
  typographyProps,
  ...ratingProps
}: CommonRatingProps) => {
  const maxRating = ratingProps.max || 5;
  return (
    <div className={`${customClassNames ?? 'flex items-center gap-2'}`}>
      {showStar ? (
        <>
          <TiStar className={starClassName ?? 'text-warning text-sm md:text-md'} size={starSize} />
        </>
      ) : (
        <>
          <Rating value={initialRating} max={maxRating} precision={ratingProps.precision || 0.5} readOnly={ratingProps.readOnly} {...ratingProps} />
        </>
      )}
      {showRatingNumber && (
        <Typography {...typographyProps}>
          {initialRating}
          {noMaxRating ? '' : `/${maxRating}`}
        </Typography>
      )}
    </div>
  );
};

export default CommonRating;
