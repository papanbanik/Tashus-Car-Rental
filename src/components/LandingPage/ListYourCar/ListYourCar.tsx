'use client';
import CarListModal from '@/components/GuestVerification/PartnerVerification/CarListModal';
import SignUp from '@/components/SignUp/SignUp';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { getDefaultPickupTime, getDefaultReturnTime } from '@/utils/Functions/dateTimeCommonFn';
import { defaultCoordinate } from '@/utils/Functions/searchCommonFn';
import { getInitialLocation } from '@/utils/Lists/initialLocations';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowCircleRight } from 'react-icons/fa';
// function ListYourCar() {
const ListYourCar = () => {
  const router = useRouter();
  const { place: iniCity, countryShortCode: iniCountry, stateShortCode: iniState, complete_address } = getInitialLocation()[0];
  const pickupTime = getDefaultPickupTime();
  const returnTime = getDefaultReturnTime();
  const { openModal } = useModalContext();
  const { userCred, userProfileInfo } = useUserCredContext();
  const { handleAddNewListing } = useCarListingContext();
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('lg'));
  const { verificationStatusFlags } = useSearchContext();
  const handleVehicleList = () => {
    if (userCred?.loggedIn) {
      if (Object.values(verificationStatusFlags).some((value) => value === false)) {
        openModal({
          content: <CarListModal handleAddNewListing={handleAddNewListing} />,
        });
      } else {
        handleAddNewListing();
      }
    } else {
      openModal({
        title: 'Login or Sign Up',
        content: (
          <div className="md:mx-4 md:my-2">
            <SignUp></SignUp>
          </div>
        ),
      });
    }
  };
  return (
    <>
      <div
        className="min-h-[600px] lg:min-h-[415px] xl:min-h-[460px] lg:h-full w-full lg:w-screen commonMarginBottom"
        style={{
          backgroundImage: 'url("/Hero/Rent_on_our_platform.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="min-h-[600px] lg:min-h-[415px] xl:min-h-[460px] lg:h-full w-full lg:w-screen xl:px-52 lg:px-32  md:px-24 px-2 max-w-[1600px] mx-auto"
          style={{ backgroundImage: 'url("/Hero/Rent_on_our_platform.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className=" px-2">
            <div className="py-10 justify-between">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex flex-col max-w-[100%] lg:max-w-[60%]">
                  <Typography
                    className="text-white text-[24px] lg:text-[40px] font-bold text-center lg:text-left mb-4 md:mb-0"
                    style={{ lineHeight: '1.2' }}
                  >
                    Explore Convenient <br></br>
                    Car Rental with Tashus
                  </Typography>
                  <Typography className="flex flex-col text-center lg:text-start text-white mt-2 lg:mt-6 mr-4 mx-6 lg:mx-0">
                    {`Tashus Car Rental offers a simple and flexible way to book a car rental in Sydney or car rental Liverpool NSW—perfect for short trips or long stays. Whether you need a vehicle for an hour, a weekend, or a week, choose from our wide range, including SUV rentals, van hire, and hybrid cars. We serve both Liverpool NSW and the greater metro area, making local travel easy. Skip the hassle of ownership with our affordable and convenient options, including cheap car rental and airport car hire. Book today and enjoy the freedom to drive on your terms!`}
                  </Typography>
                  {isLargeDevice ? (
                    <span className="inline-flex items-center mt-8">
                      {/* <button
                      onClick={() => (window.location.href = '/car-listing')}
                      className="bg-white text-primary font-bold py-1 px-4 rounded-full text-[14px] flex items-center border-none hover:bg-gray-100 transition-colors duration-300 hover:text-gray-800"
                      style={{ cursor: 'pointer' }} // Change cursor to pointer
                    >
                      List my vehicle
                      <span className="ml-3">
                        <ArrowCircleRightIcon style={{ fontSize: 25 }} />
                      </span>
                    </button> */}
                      <Button
                        className="normal-case cursor-pointer bg-white text-primary font-bold py-1 px-4 rounded-full text-[14px] flex items-center border-none  transition-colors duration-300 hover:text-white hover:bg-[#5C8D07]"
                        onClick={() =>
                          router.push(
                            `/search?lat=${defaultCoordinate[1].toString()}&long=${defaultCoordinate[0].toString()}&pickup=${pickupTime}&return=${returnTime}&city=${iniCity}&region=${iniState}&country=${iniCountry}&address=${complete_address}`
                          )
                        }
                        endIcon={<FaArrowCircleRight />}
                      >
                        Get Your Ride Now
                      </Button>
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center mt-4 lg:mt-0 mx-6">
                  <Image
                    src="/landingPageNew/TashusLandingPage3.jpeg"
                    alt="Your vehicle can help you earn money Tashus"
                    className="max-w-full rounded-lg object-cover"
                    width={444}
                    height={isSmallDevice ? 240 : 300}
                    style={{
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginTop: isSmallDevice ? 'auto' : '0',
                      marginBottom: isSmallDevice ? 'auto' : '0',
                    }}
                  />
                  {!isLargeDevice && (
                    <span className="inline-flex items-center mt-8">
                      <button
                        className="bg-white text-primary font-bold py-1 px-4 rounded-full text-[14px] flex items-center border-none"
                        onClick={() =>
                          router.push(
                            `${process.env.NEXT_PUBLIC_DOMAIN}//search?lat=-33.866275&long=151.21310699999998&pickup=2024-11-19T15:15:00.000Z&return=2024-11-22T15:15:00.000Z&city=Sydney&region=AU-NSW&country=au&address=Sydney,%20New%20South%20Wales,%20Australia`
                          )
                        }
                      >
                        Get Your Ride
                        <span className="ml-3">
                          <FaArrowCircleRight style={{ fontSize: 25 }} />
                        </span>
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListYourCar;
