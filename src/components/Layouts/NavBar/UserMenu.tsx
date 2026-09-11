'use client';

import CommonTextIcon from '@/components/Common/CommonTextIcon';
import ProfileAvatar from '@/components/Common/ProfileAvatar';
import LogInPopUpNavBar from '@/components/LoginPopUp/LoginPopUpNavBar';
import SignUpPopUpNavBar from '@/components/LoginPopUp/SignUppopupNavBar';
import SignUp from '@/components/SignUp/SignUp';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { ProfileGeneralInfo, useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { CustomUser } from '@/types/signUpTypes';
import { getVerificationFlags } from '@/utils/Functions/verification/verificationFn';
import { Box, Button, Container, Divider, Menu, MenuItem, Tooltip } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import { BsCalendar2Check, BsFillCarFrontFill, BsFillTicketDetailedFill } from 'react-icons/bs';
import { FaCar } from 'react-icons/fa';
import { GiRoad } from 'react-icons/gi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { IoNotifications } from 'react-icons/io5';
import { LuHeartHandshake } from 'react-icons/lu';
import { MdSupportAgent } from 'react-icons/md';
import { RxAvatar } from 'react-icons/rx';
import UserProfile from './UserProfile';
import { handleDeleteAuthCookies, handleSetAuthCookies } from '@/utils/Functions/auth/cookiesHelper';
import { getUserFullName } from '@/utils/Functions/randomCommonFn';

const UserMenu = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { setGuestVerificationFlags, verificationStatusFlags, setVerificationStatusFlags } = useSearchContext();
  const { isModalOpen, openModal } = useModalContext();
  const {
    userCred,
    setUserCred,
    setUserType,
    userProfileInfo,
    setUserProfileInfo,
    setProfileHookEnableKeys,
    setIsLogOut,
    profileHookEnableKeys,
    isScrolled,
  } = useUserCredContext();
  const { profileGeneralInfo, setProfileGeneralInfo, userProfileVerificationInfo } = useProfileInfoContext(); //Added Profile GeneralInfo for Logout
  const { setListingId, setListingSteps, handleAddNewListing, setCarData } = useCarListingContext();
  const { data: session } = useSession();
  const [textColor, setTextColor] = useState<string>('text-primary');
  // useEffect(() => {
  //   if (pathName === '/' && !isScrolled) {
  //     setTextColor('text-neutral');
  //   } else {
  //     setTextColor('text-primary');
  //   }
  // }, [pathName, isScrolled]);
  // console.log(userProfileInfo);
  // console.log(userCred);
  useEffect(() => {
    const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
    // console.log('tashus', tashus);
    handleSetAuthCookies(tashus?.accessToken || '');
    setUserCred(tashus);
  }, []);

  // useEffect(() => {
  //   if (userCred?.loggedIn && userCred?.userId) {
  //     setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: true });
  //   }
  // }, [userCred?.userId]);
  useEffect(() => {
    if (userCred?.loggedIn) {
      // let isExpired = false;
      // if (userProfileInfo?.guestVerification?.drivingLicenseInfo?.expiryDate) {
      //   isExpired = isLicenseExpired(userProfileInfo?.guestVerification?.drivingLicenseInfo?.expiryDate);
      // }
      // let isAgeValid = false;
      // if (userProfileInfo?.dateOfBirth) {
      //   isAgeValid = isDrivingAgeValid(userProfileInfo?.dateOfBirth);
      // }
      // let isSecondaryIDExpired = false;
      // if (!!userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate) {
      //   isSecondaryIDExpired = isLicenseExpired(userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate);
      // }
      // const isCountryAustralia = userProfileInfo?.guestVerification?.drivingLicenseInfo?.country === 'Australia';
      // let verificationFlags = {
      //   isEmailVerified: userProfileInfo?.verificationInfo?.email?.isVerified || false,
      //   isMobileVerified: !!userProfileInfo?.verificationInfo?.phone?.isVerified || false,
      //   isAddressVerified: !!userProfileInfo?.contactDetails?.residentialAddressInfo, //Modified the residential addressInfo
      //   isLicenseVerified: !!userProfileInfo?.guestVerification?.drivingLicenseInfo && !isExpired && isAgeValid,
      //   // isProfilePhotoVerified: !!userProfileInfo?.picture?.imageInfo?.secure_url,
      //   isProfilePhotoVerified: true,
      //   isLicenseFaceVerified: !!userProfileInfo?.guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url,
      //   isLicensePhotoVerified: !!userProfileInfo?.guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url,
      //   isSecondaryIDVerified: !isCountryAustralia
      //     ? !!userProfileInfo?.guestVerification?.secondaryIdInfo?.idType &&
      //       (!!userProfileInfo?.guestVerification?.secondaryIdInfo?.expiryDate ? !isSecondaryIDExpired : true)
      //     : true,
      // };
      const verificationFlags = getVerificationFlags(userProfileVerificationInfo);
      setGuestVerificationFlags(verificationFlags);
      let verificationStatusFlags = {
        isEmailApproved: verificationFlags?.isEmailVerified,
        isMobileApproved: verificationFlags?.isMobileVerified,
        isAddressApproved: verificationFlags?.isAddressVerified && userProfileInfo?.contactDetails?.status === 'approved',
        isLicenseApproved: verificationFlags?.isLicenseVerified && userProfileInfo?.guestVerification?.drivingLicenseInfo?.status === 'approved',
        isProfilePhotoApproved: verificationFlags?.isProfilePhotoVerified && userProfileInfo?.picture?.status === 'approved',
        isLicenseFaceApproved:
          verificationFlags?.isLicenseFaceVerified && userProfileInfo?.guestVerification?.drivingLicenseWithFace?.status === 'approved',
        isLicensePhotoApproved:
          verificationFlags?.isLicensePhotoVerified &&
          userProfileInfo?.guestVerification?.drivingLicensePhoto?.status === 'approved' &&
          (userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.status !== undefined
            ? userProfileInfo?.guestVerification?.drivingLicensePhotoBackside?.status === 'approved'
            : true),
        isSecondaryIDApproved: verificationFlags?.isSecondaryIDVerified && userProfileInfo?.guestVerification?.secondaryIdInfo?.status === 'approved',
      };
      setVerificationStatusFlags(verificationStatusFlags);
    }
  }, [userProfileInfo, userCred?.loggedIn]);
  useEffect(() => {
    let temp = true;
    const keepUserData = async () => {
      // console.log(session);
      if (session && (session as CustomUser)?.user?.accessToken) {
        // console.log(session);
        // console.log(userProfileInfo);
        const userData = {
          userId: (session as CustomUser)?.user?.userId || '',
          email: session?.user?.email || '',
          loggedIn: true,
          userType: '',
          isAllowListing: userProfileInfo?.isAllowListing || false,
        };
        setUserCred(userData);
        setIsLogOut(false);
        // const nameParts = (!!session?.user?.name ?? '').split(' '); // Split name, default to empty string if undefined
        // const profileData = {
        //   ...profileGeneralInfo,
        //   firstName: nameParts[0] || '', // Set first name
        //   lastName: nameParts[1] || '', // Set last name
        // }; // Set Profile Info
        // setProfileGeneralInfo(profileData); //Set Profile Info

        const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
        const type = tashus?.userType;
        const userAccessToken = (session as CustomUser)?.user?.accessToken || '';
        localStorage.setItem('tashus', JSON.stringify({ ...tashus, ...userData, accessToken: userAccessToken }));
        handleSetAuthCookies(userAccessToken);
        // console.log(searchParams.get('return_url'));
        // console.log(type);

        if (type) {
          // console.log('type', type);
          type === 'partner' ? router.push('/car-listing') : router.push('/');
        } else if (searchParams.get('return_url')) {
          router.push(`${searchParams.get('return_url')}`);
        } else if (pathName.includes('/login') && !!session?.user?.name) {
          router.push('/?from=registered');
        }
        // else {
        //   router.push('/');
        // }
      }
    };

    keepUserData();

    return () => {
      temp = false;
    };
  }, [session]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignUpMenu = (userType: string) => {
    if (userType !== 'partner' && pathName !== '/') {
      setUserType('guest-booking');
    } else {
      setListingId('');
      setCarData({} as CarDataState);
      setUserType(userType);
    }
    if (typeof window !== 'undefined') {
      const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
      const userData = { ...tashus, userType: userType, listingId: '', isAllowListing: userProfileInfo?.isAllowListing || false };
      localStorage.setItem('tashus', JSON.stringify(userData));
    }
    setListingSteps([]);
    // setListingId(''); // these are commented otherwise vehicle details page remains in loading state if logged in from Login or Be a guest
    // setCarData({});
    handleCloseUserMenu();
    userCred.loggedIn
      ? // ? router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing`)
        handleVehicleList()
      : pathName.includes('/login')
      ? ''
      : openModal({
          title: 'Login or Sign Up',
          content: (
            <div className="md:mx-4 md:my-2">
              <SignUp></SignUp>
            </div>
          ),
        });
  };

  const handleCarListingMenu = (url?: string | undefined) => {
    handleCloseUserMenu();
    // console.log(`${process.env.NEXT_PUBLIC_DOMAIN}/${url}`);
    url ? router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${url}`) : handleAddNewListing();
  };

  const handleSupportTicketMenu = (url?: string | undefined) => {
    handleCloseUserMenu();
    // console.log(`${process.env.NEXT_PUBLIC_DOMAIN}/${url}`);
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${url}`);
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      const userData = { userId: '', email: '', loggedIn: false, accessToken: '' };
      // const profileData = { ...userProfileInfo, firstName: '', lastName: '', picture: undefined }; //Remove Profile Info
      // const profileData = { ...profileGeneralInfo, firstName: '', lastName: '', picture: undefined }; //Remove Profile Info
      localStorage.setItem('tashus', JSON.stringify({}));
      handleDeleteAuthCookies();
      setUserCred(userData);
      setIsLogOut(true);
      // setUserProfileInfo(profileData); //Remove Profile Info
      setProfileGeneralInfo({} as ProfileGeneralInfo); //Remove Profile Info
      handleCloseUserMenu();
      // console.log(session?.user);
      if (session?.user) {
        const redirectUrl = await signOut({ redirect: false, callbackUrl: '/' });
        router.push(redirectUrl.url);
      } else {
        router.push('/');
      }
    }
  };

  const handleNotificationMenu = (url?: string | undefined) => {
    handleCloseUserMenu();
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${url}`);
  };
  // console.log(verificationStatusFlags);
  const handleVehicleList = () => {
    // if (Object.values(verificationStatusFlags).some((value) => value === false)) {
    //   handleCloseUserMenu();
    //   openModal({
    //     content: <CarListModal handleAddNewListing={handleAddNewListing} />,
    //   });
    // } else {
    handleCloseUserMenu();
    handleAddNewListing();
    // }
  };
  const handleLogin = () => {
    openModal({
      title: 'Log In',
      content: (
        <div className="md:mx-4 md:my-2">
          <LogInPopUpNavBar />
        </div>
      ),
    });
  };
  const handleSignUp = () => {
    openModal({
      title: 'Log In',
      content: (
        <div className="md:mx-4 md:my-2">
          <SignUpPopUpNavBar />
        </div>
      ),
    });
  };

  return (
    <Container className="col-span-3 flex justify-end pr-0">
      {/* <Button
          variant="contained"
          className="search text-[12px]  md:text-[12px] normal-case whitespace-nowrap bg-primary text-slate-100 flex justify-center items-center mr-4"
          onClick={() => handleSignUpMenu('partner')}
          startIcon={<FaHandshakeSimple />}
          style={{ paddingTop: '2px', paddingBottom: '2px', fontSize: '12px' }}
        >
          Be a Partner
        </Button> */}
      {!!profileGeneralInfo?.firstName && (
        <div className="flex items-center ">
          <Link href={`/dashboard/${userCred?.userId}/profile-info`} className="no-underline hover:underline cursor-pointer">
            <span className={`font-bold ${textColor}`}>
              {getUserFullName(profileGeneralInfo?.firstName, profileGeneralInfo?.middleName, profileGeneralInfo?.lastName)}
            </span>
          </Link>
        </div>
      )}
      <Box className="px-0">
        <Tooltip enterTouchDelay={0} title="Open Menu">
          {/* <Button className="bg-transparent rounded-xl border-none px-4 py-2" variant="outlined" color="inherit" onClick={handleOpenUserMenu}> */}
          <div className="bg-transparent rounded-xl border-none pr-0" color="inherit">
            {userCred?.loggedIn ? (
              <div className="flex flex-row items-center">
                {/* <Avatar
                  src={profileGeneralInfo?.picture?.imageInfo?.secure_url}
                  alt="Profile Photo"
                  // sx={{ width: 40, height: 40 }}
                  sx={{
                    border: '1px solid #800080',
                  }}
                /> */}
                <div onClick={handleOpenUserMenu} className="flex flex-row items-center cursor-pointer">
                  <ProfileAvatar
                    firstName={profileGeneralInfo.firstName}
                    lastName={profileGeneralInfo.lastName}
                    profilePictureUrl={profileGeneralInfo.picture?.imageInfo?.secure_url}
                    // onClick={handleOpenUserMenu}
                    className="ml-2"
                  />
                  <IoMdArrowDropdown size={20} className={`${textColor}`} />
                </div>
              </div>
            ) : (
              !pathName.includes('/login') && (
                <>
                  <div className="flex gap-4">
                    <Button
                      variant="outlined"
                      color="primary"
                      className="border-primary text-primary rounded-lg px-4 py-2"
                      sx={{ textTransform: 'none' }}
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className="bg-primary text-white rounded-lg px-4 py-2"
                      sx={{ textTransform: 'none' }}
                      onClick={handleLogin}
                    >
                      Log In
                    </Button>
                  </div>
                </>
              )
            )}
          </div>
          {/* <Button className="text-slate-100 rounded-xl px-4 py-2" variant='outlined' color='inherit' startIcon={<AiOutlineMenu />} endIcon={<CiUser />} onClick={handleOpenUserMenu}>
            
          </Button> */}
        </Tooltip>
        <Menu
          // sx={{ mt: '45px' }}
          sx={{ mt: '55px' }}
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {userCred.loggedIn || session?.user ? (
            // <Container className="md:w-[300px]">
            <Container>
              <UserProfile />
              <Divider className="mb-2" />
              <MenuItem onClick={() => handleCarListingMenu(`dashboard/${userCred?.userId}/profile-info`)}>
                <CommonTextIcon text="Profile" startIcon={<RxAvatar className="text-primary text-md mr-4" size={18} />} />
              </MenuItem>
              <Divider />
              {userProfileInfo?.isAllowListing && (
                <>
                  <MenuItem onClick={handleVehicleList}>
                    <CommonTextIcon text="List a Vehicle" startIcon={<BsFillCarFrontFill className="text-primary text-md mr-4" size={18} />} />
                  </MenuItem>
                  <Divider />
                  {/* <MenuItem onClick={() => handleCarListingMenu('profile/draft-lists')}>
                    <CommonTextIcon text="Draft Lists" startIcon={<RiFolderOpenFill className="text-primary text-md mr-4" size={18} />} />
                  </MenuItem>
                  <Divider /> */}
                  <MenuItem onClick={() => handleCarListingMenu(`dashboard/${userCred?.userId}/vehicles`)}>
                    <CommonTextIcon text="Vehicles" startIcon={<FaCar className="text-primary text-md mr-4" size={18} />} />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleCarListingMenu(`dashboard/${userCred?.userId}/reservations/current`)}>
                    <CommonTextIcon text="Reservations" startIcon={<BsCalendar2Check className="text-primary text-md mr-4" size={18} />} />
                  </MenuItem>
                  <Divider />
                </>
              )}
              <MenuItem onClick={() => handleCarListingMenu(`dashboard/${userCred?.userId}/travels/current`)}>
                <CommonTextIcon text="Travels" startIcon={<GiRoad className="text-primary text-md mr-4" size={18} />} />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleNotificationMenu(`/notifications`)}>
                <CommonTextIcon text="Notifications" startIcon={<IoNotifications className="text-primary text-md mr-4" size={18} />} />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleSupportTicketMenu('/support/support-center/general?from=general')}>
                <CommonTextIcon text=" Contact Support" startIcon={<MdSupportAgent className="text-primary text-md mr-4" size={18} />} />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleCarListingMenu(`support/support-ticket`)}>
                <CommonTextIcon text=" Support Tickets" startIcon={<BsFillTicketDetailedFill className="text-primary text-md mr-4" size={18} />} />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <CommonTextIcon text="Logout" startIcon={<AiOutlineLogout className="text-primary text-md mr-4" size={18} />} />
              </MenuItem>
            </Container>
          ) : (
            <Container>
              <MenuItem onClick={() => handleSignUpMenu('')}>
                <CommonTextIcon text=" Login" startIcon={<AiOutlineLogin className="text-primary text-md mr-4" size={18} />} />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleSignUpMenu('guest')}>
                <CommonTextIcon text="Be a Guest" startIcon={<LuHeartHandshake className="text-primary text-md mr-4" size={18} />} />
              </MenuItem>
            </Container>
          )}

          {/* {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          ))} */}
        </Menu>
      </Box>
    </Container>
  );
};

export default UserMenu;
