'use client';

import { useDraftCarList } from '@/hooks/profile/useDraftCarList';
import { Link, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import ListingStepper from './ListingStepper';

const StepHeading = () => {
  const router = useRouter();
  const { data } = useDraftCarList();
  const searchParams = useSearchParams();
  // console.log(data?.data?.data?.draftList);
  // console.log(data?.data);

  return (
    <>
      <Typography className="font-semibold text-center lg:text-[56px] text-2xl">
        <span>Unlock the </span>
        <span className="text-primary">Road to Rental</span>
        <span className="text-success">_</span>
      </Typography>
      {data?.data?.data?.draftList?.length > 0 && (
        <Typography className="text-center text-gray-400 text-sm lg:mt-6 mt-2">
          <span>{data?.data?.message}. </span>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              router.push(`/dashboard/draft-lists`);
            }}
          >
            See All Drafts
          </Link>
        </Typography>
      )}

      <div className={`sticky ${searchParams.get('from') === 'redirection' ? 'top-0' : 'md:top-22 top-[70px]'} z-40`}>
        <ListingStepper></ListingStepper>
      </div>
    </>
  );
};

export default StepHeading;
