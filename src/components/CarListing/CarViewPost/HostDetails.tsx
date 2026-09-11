'use client';

import CommonRating from '@/components/Common/CommonRating';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { Avatar, Box, Link, Skeleton, Typography } from '@mui/material';
import { useState } from 'react';
import { BsDot } from 'react-icons/bs';
import { TiStar } from 'react-icons/ti';
import CarDetailsSectionTitle from '../../Common/VehicleDetails/CarDetailsSectionTitle';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import CarDetailsSectionDivider from '@/components/Common/VehicleDetails/CarDetailsSectionDivider';
import CarDetailsTextContent from './CarDetailsTextContent';

const HostDetails = () => {
  const { carData } = useCarListingContext();
  const { hostInfo } = useSearchContext();
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

  const welcomeMessage = carData?.guidelines?.wordOfWelcome || '';
  const MAX_DESCRIPTION_LENGTH = 150;
  const displayWelcomeMessage = showFullDescription ? welcomeMessage : welcomeMessage.slice(0, MAX_DESCRIPTION_LENGTH);

  const shouldShowToggle = welcomeMessage?.length > MAX_DESCRIPTION_LENGTH;
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div>
      <CarDetailsSectionTitle sectionTitle="Hosted By"></CarDetailsSectionTitle>

      <div className="grid grid-cols-[auto,1fr] items-start">
        <div>
          <Avatar src={`${hostInfo?.picture?.imageInfo?.secure_url}`} sx={{ width: 100, height: 100, borderRadius: '50%' }} />
        </div>

        <div className="ml-4">
          <Typography>
            {hostInfo?.firstName && hostInfo?.lastName ? (
              <Link target="_blank" href={`/user/${hostInfo?.username}`} sx={{ textDecoration: 'none' }}>
                <span className="m-0 font-bold text-lg mr-2">{`${hostInfo?.firstName} ${hostInfo?.lastName}`}</span>
              </Link>
            ) : (
              <>
                <Skeleton animation="wave" className="w-[30px]" />
              </>
            )}
          </Typography>

          <Typography className="flex md:flex-row flex-col md:items-center">
            <span>{`${hostInfo?.hostTotalTrips} ${getSingularPluralNoun('Travel', hostInfo?.hostTotalTrips ?? 0)}`}</span>

            <BsDot className="md:block hidden" />

            {hostInfo?.joiningDate ? (
              <span>
                {' '}
                {`Joined ${hostInfo?.joiningDate?.toLocaleString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}`}
              </span>
            ) : (
              <span>
                <Skeleton animation="wave" className="w-[40px]" />
              </span>
            )}
          </Typography>

          {/* <Typography>
            <span>Typically responds in 12 minutes</span>
          </Typography> */}

          <Box>
            {hostInfo?.hostRatingCount !== undefined && hostInfo?.hostRatingTotal !== undefined && (
              <CommonRating
                initialRating={hostInfo?.hostRatingCount === 0 ? 0 : parseFloat((hostInfo?.hostRatingTotal / hostInfo?.hostRatingCount).toFixed(2))}
                emptyIcon={<TiStar />}
                readOnly
                size="small"
                showRatingNumber={true}
                noMaxRating={true}
                typographyProps={{ className: 'text-sm md:text-md' }}
              />
            )}
          </Box>
        </div>
      </div>

      <CarDetailsTextContent textContent={carData?.guidelines?.wordOfWelcome}></CarDetailsTextContent>

      <CarDetailsSectionDivider></CarDetailsSectionDivider>
    </div>
  );
};

export default HostDetails;
