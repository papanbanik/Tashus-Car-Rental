'use client';
import ConfirmationCheck from '@/components/Common/ConfirmationCheck';
import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useUnlistedVehicle } from '@/hooks/vehicle/useUnlistedVehicle';
import { VehicleStatusEditProps } from '@/types/car-listing/carListingTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Autocomplete, Button, Grid, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StepContainer from '../StepContainer';
import StepHeader from '../StepHeader';

const VehicleStatus = ({ vehicleId }: VehicleStatusEditProps) => {
  const { partnerAccess } = useProfileInfoContext();
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { carData, setCarData } = useCarListingContext();
  const { mutateAsync: unlistedVehicle } = useUnlistedVehicle();
  const [isPrevUnlisted, setIsPrevUnlisted] = useState(carData?.listingStatus === 'unlisted' ? true : false);
  const [isReservation, setIsReservation] = useState<boolean>(false);
  const [isUnlisted, setIsUnlisted] = useState<boolean>(false);
  const { openModal, closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();
  const { setVehicleUnlisted } = useGetAllCommentsOfATicketContext();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  const listingStatusTypes = [{ label: 'Listed' }, { label: 'Unlisted' }];
  const [selectedStatus, setSelectedStatus] = useState<{ label: string } | null>({ label: carData?.listingStatus });

  useEffect(() => {
    if (carData?.listingStatus) {
      const initialSelectedStatus = listingStatusTypes.find((status) => status.label.toLowerCase() === carData?.listingStatus.toLowerCase()) || null;
      setSelectedStatus({ label: initialSelectedStatus?.label || '' });
      if (carData?.listingStatus === 'unlisted') {
        setIsPrevUnlisted(true);
      } else {
        setIsPrevUnlisted(false);
      }
    }
  }, [carData?.listingStatus]);

  const handleUnlistedVehicle = async () => {
    setVehicleUnlisted(true);
    try {
      userId && (await unlistedVehicle({ userId: userId, vehicleId: parseInt(vehicleId) }));
      setIsUnlisted(true);
      closeModal();
    } catch (error) {
      console.log(error);
      setIsReservation(true);
      closeModal();
    }
  };

  const handleStatusChange = (event: React.SyntheticEvent, newValue: string | null) => {
    if (newValue === null) {
      setSelectedStatus(null);
    } else if (newValue === 'Unlisted') {
      setSelectedStatus({ label: newValue });
    } else {
      setSelectedStatus({ label: newValue });
    }
  };

  const GenerateSubtitleText = () => {
    const showVehicleName = `${carData.carNickName} (${carData?.listingId})`;
    if (isPrevUnlisted || isUnlisted) {
      return (
        <>
          If you wish to relist your vehicle, please{' '}
          <Link href={`/support/support-center/general?status=listed&carNickName=${showVehicleName}`}>contact support</Link> for assistance
        </>
      );
    } else if (isReservation && selectedStatus?.label !== 'Listed') {
      return (
        <>
          This vehicle has active reservations, please{' '}
          <Link href={`/support/support-center/general?status=unlisted&carNickName=${showVehicleName}`}>contact support</Link> to manage this listing.
        </>
      );
    } else if (selectedStatus?.label === 'Unlisted' && !isReservation) {
      return (
        'If you unlist your Vehicle, No user will be able to find and reserve it. ' +
        'You can be able to list it again by contacting our support team.'
      );
    } else if (carData?.listingStatus === 'unlistedByTashus') {
      return (
        <>
          This vehicle has been unlisted by Tashus, please{' '}
          <Link href={`/support/support-center/general?status=listed&carNickName=${showVehicleName}`}>contact support</Link> to manage this listing.
        </>
      );
    } else if (carData?.listingStatus === 'pending') {
      return <>Your vehicle&apos;s status is pending for now. You&apos;ll be notified via email when any updates to its status occur.</>;
    } else if (carData?.listingStatus === 'user-deactivated') {
      return (
        <>
          If you wish to relist your vehicle, please{' '}
          <Link href={`/support/support-center/general?status=listed&carNickName=${showVehicleName}`}>contact support</Link> for assistance
        </>
      );
    } else if (selectedStatus?.label === 'listed') {
      return '';
    }
  };

  const subtitleText = GenerateSubtitleText();

  useEffect(() => {
    GenerateSubtitleText();
  }, [selectedStatus]);

  const handleDoubleConfirmation = () => {
    openModal({
      content: (
        <ConfirmationCheck
          title="Are you sure to unlist your vehicle?"
          agreeButtonText="Yes"
          disagreeButtonText="No"
          agreeButtonAction={handleUnlistedVehicle}
          disagreeButtonAction={closeModal}
        ></ConfirmationCheck>
      ),
    });
  };

  return (
    <StepContainer>
      <StepHeader title="Status" />

      <Grid container spacing={2} className="flex items-center text-left mb-4">
        <Grid item xs={12} md={4}>
          <Typography variant="h6" component="h2">
            Vehicle listing status
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            size="small"
            disablePortal
            id="status-autocomplete"
            disabled={
              isUnlisted ||
              isPrevUnlisted ||
              carData?.listingStatus === 'pending' ||
              carData?.listingStatus === 'unlistedByTashus' ||
              carData?.listingStatus === 'user-deactivated'
            }
            options={listingStatusTypes}
            value={
              carData?.listingStatus === 'unlistedByTashus'
                ? { label: 'Unlisted By Tashus' }
                : carData?.listingStatus === 'pending'
                ? { label: 'Pending' }
                : carData?.listingStatus === 'user-deactivated'
                ? { label: 'User Deactivated' }
                : selectedStatus
            }
            // value={carData?.listingStatus ? { label: carData?.listingStatus } : selectedStatus}
            onChange={(event, newValue) => handleStatusChange(event, newValue?.label || null)}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} label="Status" variant="outlined" />}
          />
        </Grid>

        <Grid item xs={12} md={2} className={isSmall ? 'text-end' : ''}>
          {isSmall && <Typography className="md:text-sm text-sm font-thin text-red-400 italic text-left">{subtitleText}</Typography>}
          <Button
            variant="contained"
            color="primary"
            className={isSmall ? 'text-end pointer mt-1' : 'pointer'}
            onClick={handleDoubleConfirmation}
            disabled={
              selectedStatus?.label === 'Listed' ||
              isPrevUnlisted ||
              isReservation ||
              isUnlisted ||
              carData?.listingStatus === 'pending' ||
              selectedStatus === null ||
              carData?.listingStatus === 'unlistedByTashus' ||
              carData?.listingStatus === 'user-deactivated' ||
              isPartnerRestrict(partnerAccess)
            }
          >
            Update
          </Button>
        </Grid>
      </Grid>
      {!isSmall && <Typography className="md:text-sm text-sm font-thin text-red-400 italic text-left">{subtitleText}</Typography>}
    </StepContainer>
  );
};

export default VehicleStatus;
