'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Button, IconButton, Popover, Tooltip, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import CancelTravelM from '../TravelPriceUpdated/CancelTravelM';
import { reservationPendingStatus } from '@/utils/Lists/travelInfoList';

const EditTravel = () => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const router = useRouter();
  const pathName = usePathname();

  const { updatedTravelData } = useTravelContext();
  const { travelDetails, guestAccess } = useProfileInfoContext();
  const { openModal } = useModalContext();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const { paymentStatus, travelType, returnDate } = updatedTravelData;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (travelType === 'current') {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/edit-travel`);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancelTravel = () => {
    openModal({
      content: <CancelTravelM />,
    });
  };

  // Disable update button when travel is not started & end date passed
  const isEndDayPassed = !travelDetails?.isTripStarted && dayjs().isAfter(dayjs(returnDate), 'minute');
  const isPending = reservationPendingStatus.includes(paymentStatus);

  return (
    <>
      <Button
        sx={{ border: 2 }}
        onClick={handleClick}
        disabled={isPending || isEndDayPassed || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
        className="flex flex-col justify-start items-center font-bold hover:bg-primary hover:text-white normal-case w-10 md:w-32"
      >
        {/* Update Travel */}
        {isSmallScreen ? 'Update' : 'Update Travel'}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="flex gap-4 bg-neutral p-2">
          <Button
            variant="contained"
            className="font-semibold"
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/edit-travel`)}
            // disabled={paymentStatus !== 'paid'} //uncomment
            disabled={isPending || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
            // disabled={process.env.NEXT_PUBLIC_NODE_ENV === 'production' || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
          >
            Edit
          </Button>
          <Button
            onClick={handleCancelTravel}
            variant="contained"
            color="error"
            className="text-white font-semibold"
            disabled={travelType !== 'upcoming' || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess)}
          >
            Cancel
          </Button>
        </div>
      </Popover>
      <div className="mt-1 flex justify-start items-center">
        <span className="text-gray-400">{travelType === 'current' ? 'Travel Edit' : 'Edit / Cancel'}</span>
        {/* {process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && ( */}
        <Tooltip enterTouchDelay={0} title="Only paid travels can be updated" placement="top">
          <IconButton size="small">
            <AiOutlineQuestionCircle />
          </IconButton>
        </Tooltip>
        {/* )} */}
      </div>
    </>
  );
};

export default EditTravel;
