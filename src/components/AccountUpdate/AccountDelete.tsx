'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { isGuestRestrict, isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Checked from '../../../public/icons/checked.svg';
import Unchecked from '../../../public/icons/unchecked.svg';
import CommonAccStatusAlert from '../Common/CommonAccStatusAlert';
import ConfirmationCheck from '../Common/ConfirmationCheck';

const AccountDelete = () => {
  const { partnerAccess, guestAccess } = useProfileInfoContext();
  const isIPadPro = useIPadProQuery();
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const router = useRouter();
  const [reason, setReason] = useState<string>();
  const { openModal, closeModal } = useModalContext();
  const { userCred, setUserCred, setUserType } = useUserCredContext();
  const { data: session } = useSession();

  const handleDeactivateAccount = async () => {
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);
    if (!userCred || Object.keys(userCred).length <= 0) {
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/setting/account-deactivate/${userCred?.userId}`,
        { reason: reason },
        {
          headers: {
            Authorization: `Bearer ${userCred.accessToken}`,
          },
        }
      );

      console.log(res);
      if (res) {
        closeModal();
        if (res?.data?.status === 200) {
          handleLogout();
        }
      }
    } catch (error) {
      console.log(error);
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
  return (
    <div>
      <Container className="w-full lg:w-8/12 bg-white rounded-lg shadow-lg px-4 lg:px-24 py-4 lg:py-12 mb-0 md:mb-16">
        {isPartnerRestrict(partnerAccess) && <CommonAccStatusAlert isPartner={true} isRestrict={true} />}
        {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
        <Typography className="font-bold text-xl md:text-[32px] pb-4">Account Deletion</Typography>
        <div>
          <p className="mb-8 text-justify">
            When you make the decision to permanently delete your Tashus account, please be aware that certain strict rules apply to ensure a smooth
            and final process:
          </p>
          <ol type="1">
            <li className="mb-4 ml-1 md:ml-10 text-justify">
              <span className="font-semibold">Reservation and Outstanding Issues: </span> To proceed with account deletion, it&apos;s imperative that
              there are no outstanding reservations, whether you have hosted or booked trips, and that there are no unresolved support or billing
              issues with Tashus. This is essential to guarantee a seamless account removal process.
            </li>
            <li className="mb-4 ml-1 md:ml-10 text-justify">
              <span className="font-semibold">Irreversible Action:</span> Once your account is deleted, it cannot be reactivated, and you will no
              longer have access to any of the account-related features or data.
            </li>
            <li className="mb-4 ml-1 md:ml-10 text-justify">
              <span className="font-semibold">Invisible Listings:</span> Any vehicles you previously listed on our platform will no longer be
              accessible to you or other users. They will be permanently removed from our system, ensuring your privacy.
            </li>
            <li className="mb-4 ml-1 md:ml-10 text-justify">
              <span className="font-semibold">Inaccessibility: </span>After deletion, you will not be able to log in or retrieve any information
              associated with your account, such as booking history, profile details, or messaging history.
            </li>
            <li className="mb-8 ml-1 md:ml-10 text-justify">
              <span className="font-semibold">Search Invisibility: </span> Your account will no longer appear in searches or listings, ensuring that
              other users cannot find your account or any of your previously listed vehicles.
            </li>
          </ol>
          <p className="text-justify">
            Please consider these guidelines carefully before proceeding with the deletion of your Tashus account. We are committed to safeguarding
            your privacy and ensuring a secure and efficient process
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
              label={<>I want to Delete my account:</>}
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

            <div className="mt-6 md:mt-12 flex justify-center items-center gap-10">
              <Button onClick={() => router.back()} variant="outlined">
                Cancel
              </Button>
              <Button disabled={!isAgreed || isPartnerRestrict(partnerAccess) || isGuestRestrict(guestAccess)} color="error" variant="contained">
                Delete
              </Button>
            </div>
          </FormGroup>
        </section>
      </Container>
    </div>
  );
};

export default AccountDelete;
