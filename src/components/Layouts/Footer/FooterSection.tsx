'use client';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Popover, Theme, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BiLogoLinkedin } from 'react-icons/bi';
import { FaAngleDown } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { footerData } from './Footer';

const FooterSection: React.FC = () => {
  const { openModal } = useModalContext();
  const { userCred } = useUserCredContext();
  const { handleAddNewListing } = useCarListingContext();
  const { verificationStatusFlags } = useSearchContext();
  const MAX_VISIBLE_LINKS = 5;
  const [showAllLinks, setShowAllLinks] = useState(false);
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [showAllLinksMap, setShowAllLinksMap] = useState<{ [title: string]: boolean }>({});
  const handleShowMoreToggle = (sectionTitle: string) => {
    setShowAllLinksMap((prevMap) => ({
      ...prevMap,
      [sectionTitle]: !prevMap[sectionTitle],
    }));
  };
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hide, setHide] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    if (
      pathname === '/external-pages/payment-success' ||
      pathname.includes('/support/support-ticket') ||
      searchParams.get('from') === 'redirection' ||
      pathname.includes('payment')
    ) {
      setHide('hidden');
    } else {
      setHide('');
    }
  }, [pathname, searchParams]);
  //Firefox issue
  // const handleLinkDirection = (url: string) => {
  //   if (url === `${process.env.NEXT_PUBLIC_DOMAIN}/car-listing`) {
  //     if (userCred?.loggedIn) {
  //       if (Object.values(verificationStatusFlags).some((value) => value === false)) {
  //         openModal({
  //           content: <CarListModal handleAddNewListing={handleAddNewListing} />,
  //         });
  //       } else {
  //         handleAddNewListing();
  //       }
  //     } else {
  //       openModal({
  //         title: 'Login or Sign Up',
  //         content: (
  //           <div className="md:mx-4 md:my-2">
  //             <SignUp></SignUp>
  //           </div>
  //         ),
  //       });
  //     }
  //   } else {
  //     router.push(url);
  //   }
  // };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <footer className={`p-12 bg-primary text-white flex flex-col justify-around items-center m-0 ${hide ?? ''}`}>
      {/* <Box className="flex flex-col md:flex-row"> */}
      {!isSmallScreen ? (
        <Box
          className="lg:grid lg:grid-cols-4
                xs:grid xs:grid-cols-1
                grid grid-cols-2
                md:grid-cols-3 gap-6 md:gap-12"
        >
          {footerData.map((element, index) => {
            const linksToShow = showAllLinksMap[element.title] ? element.links : element.links.slice(0, MAX_VISIBLE_LINKS);

            return (
              <Box key={index} className="flex flex-col md:mr-12 p-4">
                <Typography variant="h6" className="mb-4 text-[22px] font-semibold">
                  {element.title}
                </Typography>
                <ul className="list-none p-0 m-0">
                  {linksToShow.map((link, index) => (
                    <li key={index} className="mb-2 text-[14px] ">
                      <Link href={link.url} className="no-underline text-white hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {element.links.length > MAX_VISIBLE_LINKS && (
                  <button
                    onClick={() => handleShowMoreToggle(element.title)}
                    // onClick={() => setShowAllLinks(!showAllLinks)}
                    className="bg-transparent text-white text-justify lg:text-[14px] text-[10px] border-none hover:underline cursor-pointer mt-1"
                  >
                    {showAllLinks ? 'Show less' : 'Show more'} &rarr;
                  </button>
                )}
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box>
          {footerData.map((element, index) => {
            const linksToShow = showAllLinks ? element.links : element.links.slice(0, MAX_VISIBLE_LINKS);
            return (
              <Accordion elevation={0} key={element.title} className="bg-transparent text-white ">
                <AccordionSummary
                  expandIcon={<FaAngleDown className="text-white text-[16px]" />}
                  aria-controls={`${element.title}-content`}
                  id={`${element.title}-header`}
                >
                  <Typography variant="h6" className="text-[16px] font-semibold ">
                    {element.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className="list-none p-0 m-0">
                    {linksToShow.map((link, index) => (
                      <li key={index} className="mb-2 text-[14px] md:text-[18px]">
                        <Link href={link.url} className="no-underline text-white hover:underline">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {element.links.length > MAX_VISIBLE_LINKS && (
                    <button
                      onClick={() => setShowAllLinks(!showAllLinks)}
                      className="bg-transparent text-white text-justify text-[20px] border-none hover:underline cursor-pointer mt-1"
                    >
                      {showAllLinks ? 'Show less' : 'Show more'} &rarr;
                    </button>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
      {/* <Box display="flex" justifyContent="center" mt={2} className="flex flex-row gap-8" alignItems="center"> */}
      <Box
        justifyContent="center"
        mt={2}
        alignItems="center"
        className="lg:flex lg:flex-row lg:gap-8
                  md:flex md:flex-row md:gap-8
                  sm:flex sm:flex-col sm:gap-2"
      >
        <Typography className="text-white text-[24px] font-semibold text-center mt-4 lg:mt-0">Get the app now</Typography>
        {/* <Box className="h-5 w-1 bg-white" /> */}
        <Box
          className="lg:h-5 lg:w-1 lg:bg-white
                     md:h-5 md:w-1 md:bg-white"
        />
        <Box className="flex items-center gap-8">
          <div>
            <Link href="https://play.google.com/store/apps/details?id=com.tashus.app&hl=en" target="_blank" className="no-underline">
              <Image src="/Footer/google.svg" alt="Download Tashus app on Google Play Store" width={100} height={100} className="" />
            </Link>
          </div>
          <div>
            <Button onClick={handleClick}>
              <Image src="/Footer/apple.svg" alt="Download Tashus app on Apple App Store" width={100} height={100} className="" />
            </Button>
          </div>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mt={2}>
        <Link href="/legals/privacy" color="inherit " className=" text-white underline decoration-white">
          <Typography className="text-white text-[20px]  mr-4 ">Privacy</Typography>
        </Link>
        <Link href="/legals/terms-and-conditions" color="inherit" className=" text-white underline decoration-white">
          <Typography className="text-white text-[20px]   mr-4 ">Terms</Typography>
        </Link>
        {/* <Link href="/site-map" color="inherit">
          <Typography className="text-white text-[20px]  mr-4 mb-2">Site Map</Typography>
        </Link> */}
      </Box>
      <Box display="flex" justifyContent="center" mt={1}>
        <Typography className="text-[14px] text-white text-center mr-4 mb-2 md:mb-0 lg:max-w-[1280px]">
          Your privacy matters to us at Tashus Car Rental Platform. By using our services, you consent to our Privacy Policy and the use of cookies.
          We prioritize your data security and adhere to the highest standards of online privacy. Our commitment is to make your Tashus Car Rental
          experience safe, seamless, and tailored to your needs. To learn more about how we handle your data and use cookies, please review our{' '}
          <Link href="/legals/privacy" color="inherit" className=" text-white underline decoration-white">
            Privacy Policy
          </Link>
        </Typography>
      </Box>

      <Typography className="mt-8 text-md">Find Us On</Typography>
      <div className="flex justify-center items-center mt-2 ">
        <Link
          href="https://www.facebook.com/tashus.car"
          target="_blank"
          rel="noopener noreferrer"
          // className="mx-2 lg:transition duration-300 ease-in-out lg:transform hover:scale-105 "
          className="mx-2"
          title="Tashus Facebook"
        >
          {/* <Image src="/icons/socialMediaIcons/facebook.svg" alt="Follow Tashus on Facebook" width={30} height={30} /> */}
          <FaFacebook size={30} className="text-white" />
        </Link>

        <Link
          href="https://www.linkedin.com/company/tashus-carshare/"
          target="_blank"
          rel="noopener noreferrer"
          // className="mx-2 lg:transition duration-300 ease-in-out lg:transform hover:scale-105 "
          className="mx-2 text-primary"
          title="Tashus LinkedIn"
        >
          {/* <Image src="/icons/socialMediaIcons/linkedin.svg" alt="Connect with Tashus on LinkedIn" width={30} height={30} /> */}
          <BiLogoLinkedin size={30} className="rounded-full bg-white" style={{ padding: '5px' }} />
        </Link>

        <Link
          href="https://twitter.com/tashus_carshare"
          target="_blank"
          rel="noopener noreferrer"
          // className="mx-2 lg:transition duration-300 ease-in-out lg:transform hover:scale-105 "
          className="mx-2"
          title="Tashus Twitter"
        >
          {/* <Image src="/icons/socialMediaIcons/twitter.svg" alt="Follow Tashus on Twitter" width={30} height={30} /> */}
          <FaXTwitter size={30} className="rounded-full bg-white text-primary" style={{ padding: '5px' }} />
        </Link>

        <Link
          href="https://www.instagram.com/tashus.car"
          target="_blank"
          rel="noopener noreferrer"
          // className="mx-2 lg:transition duration-300 ease-in-out lg:transform hover:scale-105 "
          className="mx-2"
          title="Tashus Instagram"
        >
          {/* <Image src="/icons/socialMediaIcons/Instagram.png" alt="Follow Tashus on Instagram" width={30} height={30} /> */}
          <FaInstagram size={30} className="rounded-full bg-white text-primary" style={{ padding: '5px' }} />
        </Link>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className="p-2">Coming Soon...</Typography>
      </Popover>
    </footer>
  );
};

export default FooterSection;
