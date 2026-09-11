/* eslint-disable @next/next/no-img-element */
'use client';
import StepHeader from '@/components/CarListing/StepHeader';
import CarListModal from '@/components/GuestVerification/PartnerVerification/CarListModal';
import SignUp from '@/components/SignUp/SignUp';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { Button, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';

type Props = {};

const AboutUs = (props: Props) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { openModal } = useModalContext();
  const { userCred } = useUserCredContext();
  const { handleAddNewListing } = useCarListingContext();
  const { verificationStatusFlags } = useSearchContext();
  const handleBePartner = () => {
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
    <div className="container mx-auto p-4">
      <div className="md:px-44 lg:px-20 px-8 mb-24 relative ">
        <div className="flex flex-col items-center align-middle">
          <StepHeader title="About Us"></StepHeader>
        </div>
        <div className="my-4 mb-2">
          <h1 className="text-xl font-bold mb-1">About Tashus</h1>
          <p className="text-base text-justify">
            {`At Tashus, we are redefining the way you think about car rental. Our story is one of innovation, community, and a passion for connecting people with the freedom of the open road. We're not just another car rental platform; we are a movement that's transforming the way we move, share, and experience life.`}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center mt-10">
          <div>
            <Typography className="text-xl font-bold mb-1 " variant="h2">
              Our Story
            </Typography>
            <p className="text-justify">
              {` Tashus was born out of a shared vision to create a platform that not only connects people with vehicles but also fosters a sense of
            belonging, trust, and collaboration. Our founders and our team came together with one common goal: to make transportation more efficient,
            sustainable, and, most importantly, personal.`}
            </p>
          </div>
          <div>
            <Image
              src="/Images/tashus-about-uS.svg"
              // alt="Tashus redefining the way you think about car rental"
              alt="Tashus - Car Hire Service in Sydney"
              //   style={{ objectFit: 'cover' }}
              className="rounded-lg z-0 mr-0 lg:mr-10 mt-8 lg:mt-0 "
              // fill={true}
              // width={500}
              // height={230}

              width={isSmallScreen ? 400 : 560}
              height={isSmallScreen ? 190 : 280}
            ></Image>
          </div>
        </div>

        <div>
          <div className="flex flex-col lg:flex-row justify-center lg:space-x-4 mt-12">
            {/* First Box */}
            <div className="container bg-white shadow-lg flex flex-col justify-between items-center p-6 rounded-lg w-460 h-550 mb-6 lg:mb-0">
              <div className="text-center">
                <div className=" ">
                  <img className="h-20 w-20 lg:h-30 lg:w-30" src="/icons/mission.png" alt="Tashus - Our Mission in Car Hire Service" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold mt-3">Our Mission</h3>
                <p className="text-gray-600 text-justify">
                  {`At Tashus, our mission is to revolutionize the way people think about transportation. We're committed to creating a sustainable and
                collaborative mobility ecosystem where rental is not just a convenience but a way of life. We aim to provide individuals with easy
                access to a diverse range of vehicles while fostering a sense of community, trust, and environmental responsibility.`}
                </p>
              </div>
            </div>

            <div className="container bg-white shadow-lg  p-6 rounded-lg w-460 h-550 flex flex-col justify-between items-center ">
              <div className="text-center mt-2 ">
                <div className="">
                  <img className="h-17 w-28 " src="/icons/vission.png" alt="Tashus - Our Vision for Car Hire Service in Sydney" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold mt-4.5">Our Vision</h3>
                <p className="text-gray-600 text-justify">
                  {` Our vision for Tashus is to become the leading force in the transformation of how the world moves. We see a future where our platform
                connects people, empowers shared experiences, and contributes to a cleaner and more sustainable planet. By 2030, we aspire to have a
                global community of Tashus members who actively reduce the number of cars on the road, making our world a better place for everyone.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center align-middle">
        <StepHeader title="How we stands out"></StepHeader>
      </div>

      <div className="pl-0 pr-0 lg:pl-40 lg:pr-40">
        <div className="flex flex-row justify-center items-center pb-6 pt-6" style={{ borderBottom: '2px solid #e5e5e5' }}>
          <img src="/icons/about-us-icons/Tashus-About-us_1.png" alt="fsf" className="h-10 w-15 mr-8" />
          <div>
            <Typography variant="h2" className="text-lg font-bold">
              Community-Centric Approach:
            </Typography>
            <Typography>
              {`  We're not just a platform; we're a community of like-minded individuals who believe in the power of rental. We encourage collaboration,
              respect, and trust within our network.`}
            </Typography>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center pb-6 pt-6" style={{ borderBottom: '2px solid #e5e5e5' }}>
          <img src="/icons/about-us-icons/Tashus-About-us_2.png" alt="fsf" className="h-10 w-15 mr-8" />
          <div>
            <Typography variant="h2" className="text-lg font-bold">
              Diverse Fleet:
            </Typography>
            <Typography>
              {` Tashus offers a wide variety of vehicles to choose from, ensuring you have the right set of wheels for any occasion, whether it's a
              weekend getaway, a daily commute, or a special event.`}
            </Typography>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center pb-6 pt-6" style={{ borderBottom: '2px solid #e5e5e5' }}>
          <img src="/icons/about-us-icons/Tashus-About-us_4.png" alt="fsf" className="h-10 w-15 mr-8" />
          <div>
            <Typography variant="h2" className="text-lg font-bold">
              Sustainability:
            </Typography>
            <Typography>
              {`We're committed to reducing the environmental impact of transportation. By rental vehicles, we're collectively reducing the number of
              cars on the road and promoting a more eco-friendly way to get around.`}
            </Typography>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center pb-6 pt-6" style={{ borderBottom: '2px solid #e5e5e5' }}>
          <img src="/icons/about-us-icons/Tashus-About-us_5.png" alt="fsf" className="h-10 w-15 mr-8" />
          <div>
            <Typography variant="h2" className="text-lg font-bold">
              Seamless Technology:
            </Typography>
            <Typography>
              {` Our user-friendly app and website make it a breeze to find, book, and access vehicles. We're always innovating to provide the most
              straightforward and hassle-free experience.`}
            </Typography>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center pb-6 pt-6" style={{ borderBottom: '2px solid #e5e5e5' }}>
          <img src="/icons/about-us-icons/Tashus-About-us_3.png" alt="fsf" className="h-10 w-15 mr-8" />
          <div>
            <Typography variant="h2" className="text-lg font-bold">
              Personal Touch:
            </Typography>
            <Typography>
              {`Tashus is all about the personal connection. Every car rental experience is an opportunity to meet new people, learn from one another,
              and create lasting memories.`}
            </Typography>
          </div>
        </div>
      </div>
      <div>
        <Typography className="mt-20 text-center pl-2 pr-2 lg:pl-40 lg:pr-40 lg:text-lg">
          {`At Tashus, we're not just about the destination; we're all about the journey. Whether you're a vehicle-rental partner or a traveler, join
          our Tashus family and shape the future of transportation with us. Be a part of a vibrant community that values connection, sustainability,
          and the open road.Your journey begins here.`}
        </Typography>

        <Typography variant="h2" className="text1xl font-bold text-center mt-10 mb-12">
          <span className="text-primary">Unlock the Road. </span> <span className="text-green-900"> Unlock Tashus.</span>
        </Typography>
        <div className="flex flex-row justify-center items-center space-x-6 mb-20">
          {/* <a href="/car-listing"> */}
          {/* <button className="bg-primary  text-white font-bold py-2 px-4 rounded ">Be a Partner</button> */}
          {/* <Button size="large" variant="contained" onClick={handleBePartner}>
            Be a Partner
          </Button> */}
          {/* </a> */}
          <a href="/">
            <Button size="large" variant="contained">
              Book a car
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
