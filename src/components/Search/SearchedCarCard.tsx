import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { GiGearStickPattern } from 'react-icons/gi';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { TiStar } from 'react-icons/ti';
import CommonRating from '../Common/CommonRating';

const SearchedCarCard = ({ searchedCar, index }: any) => {
  // console.log(searchedCar);

  return (
    <Card className="col-span-1">
      <CardActionArea>
        <div className="relative">
          <CardMedia component="img" height="140" image={searchedCar?.photos?.coverPhoto?.imageInfo?.secure_url} alt="Searched Car" />
          <p className="m-0 bg-secondary text-primary w-full text-center absolute bottom-0 font-semibold">{searchedCar?.carNickName}</p>
        </div>

        <CardContent className="pr-0">
          <div className="flex justify-between items-center">
            <div>
              <Typography className="font-bold capitalize m-0">
                {searchedCar?.car?.make?.toLowerCase()} {searchedCar?.car?.model.toLowerCase()}
              </Typography>
              <p className="m-0">{searchedCar?.car?.carType}</p>
              {/* <p className="m-0">{searchedCar?.listingId}</p> */}
            </div>
            <div className="bg-primary flex p-0 rounded-l-full">
              <p className="px-2 py-1 m-0 text-white font-bold flex gap-1">
                <span>${searchedCar?.rates?.dailyRates?.amount || '$20.00'}</span> <sub className="subs"> {'/day'}</sub>{' '}
              </p>
            </div>
          </div>
          {/* <Typography variant="body2" color="text-gray-400 mt-8">
            From <span className="font-bold">${searchedCar?.rates?.hourlyRates?.amount || 10}</span> /hr or{' '}
            <span className="font-bold">${searchedCar?.rates?.dailyRates?.amount || 30}</span> /day
          </Typography> */}
          <div className="flex gap-4 items-center justify-start mr-4 p-0">
            <p className="flex justify-start items-center gap-1">
              <span>
                <GiGearStickPattern />
              </span>
              <span>{searchedCar?.car?.transmissionType}</span>
            </p>
            <p className="flex justify-start items-center gap-1">
              <span>
                <MdAirlineSeatReclineExtra size={18} />
              </span>
              <span>{searchedCar?.car?.seats}</span>
            </p>
          </div>
          {/* <p>${searchedCar?.rates?.hourlyRates?.amount}</p> <sub className="subs"> {'/hour'}</sub>{' '} */}
          <div className="flex gap-2 items-center justify-start mr-4 p-0">
            {/* <Rating
              name="half-rating"
              readOnly
              value={
                searchedCar?.ratingsReceivedFrom === 0 ? 0 : parseFloat((searchedCar?.totalRatings / searchedCar?.ratingsReceivedFrom).toFixed(2))
              }
              precision={0.5}
              className="p-0"
              size="small"
              emptyIcon={<AiFillStar />}
            />
            <p className="p-0 font-semibold">{`${
              searchedCar?.ratingsReceivedFrom === 0 ? 0 : parseFloat((searchedCar?.totalRatings / searchedCar?.ratingsReceivedFrom).toFixed(2))
            }/5`}</p> */}
            <CommonRating
              initialRating={
                searchedCar?.ratingsReceivedFrom === 0 ? 0 : parseFloat((searchedCar?.totalRatings / searchedCar?.ratingsReceivedFrom).toFixed(2))
              }
              emptyIcon={<TiStar />}
              readOnly
              size="small"
              showRatingNumber={true}
              noMaxRating={true}
              typographyProps={{ className: 'text-sm md:text-md' }}
            />
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SearchedCarCard;
