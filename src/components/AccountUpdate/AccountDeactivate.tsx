'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useDeactivateAccount } from '@/hooks/profile/profile-info/account-security/useDeactivateAccount';
import { useReservationList } from '@/hooks/reservation/useReservationList';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { useTravelList } from '@/hooks/travel/useTravelList';
import { TSingleTravel } from '@/types/travels/typeEditTravels';
import { isGuestRestrict, isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { getCurrentTravels, getUpcomingTravels, getUpdatedTravelList } from '@/utils/Functions/travelCommonFn';
import { Alert, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Checked from '../../../public/icons/checked.svg';
import Unchecked from '../../../public/icons/unchecked.svg';
import CommonBreadCrumb from '../Common/Breadcrumbs/CommonBreadCrumb';
import CommonAccStatusAlert from '../Common/CommonAccStatusAlert';
import ConfirmationCheck from '../Common/ConfirmationCheck';

const AccountDeactivate = () => {
  useReservationList();
  useTravelList();
  const [currentReservationList, setCurrentReservationList] = useState<TSingleTravel[]>([]);
  const [upcomingReservationList, setUpcomingReservationList] = useState<TSingleTravel[]>([]);
  const [currentTravelList, setCurrentTravelList] = useState<TSingleTravel[]>([]);
  const [upcomingTravelList, setUpcomingTravelList] = useState<TSingleTravel[]>([]);
  const { partnerAccess, guestAccess, travelList } = useProfileInfoContext();
  const { reservationList } = useTravelContext();
  const isIPadPro = useIPadProQuery();
  const { mutateAsync: deactivatedAccount } = useDeactivateAccount();
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const router = useRouter();
  const [reason, setReason] = useState<string>('');
  const { openModal, closeModal } = useModalContext();
  const { userCred, setUserCred, userProfileInfo } = useUserCredContext();
  const { data: session } = useSession();
  useEffect(() => {
    if (travelList?.length > 0 || reservationList?.length > 0) {
      handleUpdate();
    }
  }, [travelList, reservationList]);
  const handleUpdate = async () => {
    //Current Reservation
    const tempCurrentReservationList = await getCurrentTravels(reservationList);
    const updatedCurrentReservationList: TSingleTravel[] = await getUpdatedTravelList(tempCurrentReservationList, false);
    const updatedCurrentReservationFilteredList = updatedCurrentReservationList.filter((reservation) => reservation?.reservationStatus !== 'pending');
    setCurrentReservationList(updatedCurrentReservationFilteredList);
    //Upcoming Reservation
    const tempUpcomingReservationList = await getUpcomingTravels(reservationList);
    const updatedReservationList: TSingleTravel[] = await getUpdatedTravelList(tempUpcomingReservationList, false);
    const updatedReservationFilteredList = updatedReservationList.filter((reservation) => reservation?.reservationStatus !== 'pending');
    setUpcomingReservationList(updatedReservationFilteredList);
    //Current Travel
    const tempCurrentList = await getCurrentTravels(travelList);
    const updatedCurrentTravelList: TSingleTravel[] = await getUpdatedTravelList(tempCurrentList, true);
    setCurrentTravelList(updatedCurrentTravelList);
    //Upcoming Travel
    const tempUpcomingList = await getUpcomingTravels(travelList);
    const updatedUpcomingTravelList: TSingleTravel[] = await getUpdatedTravelList(tempUpcomingList, true);
    setUpcomingTravelList(updatedUpcomingTravelList);
  };
  const isHaveReservationORTravel =
    currentReservationList?.length > 0 || upcomingReservationList.length > 0 || currentTravelList.length > 0 || upcomingTravelList?.length > 0;

  const handleDeactivateAccount = async () => {
    if (!!userCred?.userId) {
      try {
        await deactivatedAccount({ userId: userCred?.userId, reason: reason });
        handleLogout();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleDoubleConfirmation = () => {
    openModal({
      content: (
        <ConfirmationCheck
          title="Are you sure to Deactivate your account?"
          agreeButtonText="Yes"
          disagreeButtonText="No"
          agreeButtonAction={handleDeactivateAccount}
          disagreeButtonAction={closeModal}
        ></ConfirmationCheck>
      ),
    });
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      const userData = { ...userCred, loggedIn: false, accessToken: '' };
      localStorage.setItem('tashus', JSON.stringify({}));
      setUserCred(userData);
      console.log(session?.user);
      if (session?.user) {
        const redirectUrl = await signOut({ redirect: false, callbackUrl: '/' });
        router.push(redirectUrl.url);
      } else {
        router.push('/');
      }
    }
  };
  const reservationText = userProfileInfo?.isAllowListing ? 'reservations or' : '';
  const accountDeactivationBreadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Account Security', href: `/dashboard/${userCred?.userId}/setting/account-security` },
    { label: `Account Deactivation` },
  ];
  return (
    <div>
      <Container className="w-full lg:w-8/12 mt-24 mb-4">
        <CommonBreadCrumb items={accountDeactivationBreadcrumbItems} />
      </Container>
      <Container className="w-full lg:w-8/12 bg-white rounded-lg shadow-lg px-4 lg:px-24 py-4 lg:py-12 mb-0 md:mb-16">
        {isPartnerRestrict(partnerAccess) && <CommonAccStatusAlert isPartner={true} isRestrict={true} />}
        {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
        <Typography className="font-bold text-xl md:text-[32px] pb-4">Account Deactivation on Tashus:</Typography>
        <div>
          <p className="mb-8 text-justify">
            When you decide to deactivate your account on Tashus platform, it&apos;s important to be aware of the available options:
          </p>
          <ol type="1">
            <li className="mb-4 ml-1 md:ml-10 text-justify">
              <span className="font-semibold">Relisting Your Vehicles:</span> If you choose to reactivate your account and want to showcase your
              previously listed vehicles again, our dedicated support team is here to assist you. They will guide you through the process of relisting
              your vehicles, ensuring they are once again visible in search results.
            </li>
            <li className="mb-4 ml-1 md:ml-10 text-justify">
              <span className="font-semibold">Hiding Your Vehicles:</span> Alternatively, if you prefer to temporarily hide your vehicles from search
              results, you can effortlessly unlist them from your vehicle inventory. To manage your vehicle status, please visit [url] and make the
              necessary adjustments.
            </li>
            <li className="mb-8 ml-1 md:ml-10 text-justify">
              <span className="font-semibold">Reactivation:</span> Should you decide to reactivate your account after deactivation, the procedure is
              straightforward. Simply log in to your Tashus account to regain access to our platform.
            </li>
          </ol>
          <p className="text-justify">
            These options grant you the flexibility to manage your account and vehicles according to your specific needs and preferences.
          </p>
          <p className="text-justify">
            Please note that before deactivation, it&apos;s essential to ensure that there are no outstanding reservations, whether you are a guest or
            host, and no unresolved support or billing issues with Tashus. This will help facilitate a smooth and efficient account deactivation
            process.
          </p>
        </div>

        <section className="mt-16">
          <FormGroup className={` ${isIPadPro ? '' : 'lg:mt-6'}`}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    setIsAgreed(e.target.checked);
                  }}
                  checked={isAgreed}
                  icon={<Unchecked className="text-xl" />}
                  checkedIcon={<Checked className="text-xl" />}
                />
              }
              label={<>I want to Deactivate my account:</>}
            />
            <TextField
              onChange={(e) => setReason(e.target.value)}
              className="w-11/12 md:w-full mx-auto mt-6"
              multiline
              rows={6}
              id="filled-basic"
              label="Reason (Optional)"
              variant="filled"
            />
            {isHaveReservationORTravel && (
              <Alert severity="error" className="mt-2">
                {`There are unfinished ${reservationText} travels on your account. To deactivate your account, you must cancel or complete your ${reservationText} travels.`}
              </Alert>
            )}
            <div className="mt-6 md:mt-12 flex justify-center items-center gap-10">
              <Button onClick={() => router.back()} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleDoubleConfirmation}
                disabled={!isAgreed || isPartnerRestrict(partnerAccess) || isGuestRestrict(guestAccess) || isHaveReservationORTravel}
                color="error"
                variant="contained"
              >
                Deactivate
              </Button>
            </div>
          </FormGroup>
        </section>
      </Container>
    </div>
  );
};

export default AccountDeactivate;
