'use client';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const HowTravelWorks = () => {
  const beforeYouDrive = [
    "Remember, you're using someone's real car. Treat it with care, just like you would for a friend.",
    "Only verified members can drive the car. Other drivers won't have coverage under the damage and loss policy.",
    'No smoking or vaping in or near the car.',
    'Return the car clean and tidy for the next driver.',
    "If anything goes wrong, inform the owner immediately. Don't wait for them to discover any issues.",
    'Getting the Keys and Locating the Car',
  ];

  const rentingTheCar = [
    'Start the return instructions in the app. Follow the directions for parking. Some cars have designated spots, while others are on the street.',
    'In busy areas, plan extra time to find parking at the end of your trip.',
    `If the car is on the street, check instructions and parking signs carefully. If you get a parking fine, you're responsible for payment`,
    'For Key Handover cars, enter the final odometer reading and upload another photo of the dash showing the odometer.',
    'For all cars, take another set of photos showing all surfaces and the interior, and upload them through the app or website..',
  ];

  const beforeLeaving = [
    'Ensure you have all your belongings.',
    'Leave the car clean with the same fuel level as indicated at the start of the reservation .',
    `Close all windows and turn off all lights.`,
    'Lock the doors.',
    'Use the app to generate a lockbox code, return the key, and securely close the lockbox.',
  ];

  return (
    <Box>
      <Typography variant="h1" className="text-black text-center text-[32px] lg:text-[48px] font-bold pb-4">
        How <span className="text-primary ">Travel</span>
        <span className="text-black"> Works at</span>
        <span className="text-primary"> Tashus?</span>
      </Typography>
      <Box>
        <Image
          src="/Images/how-travel-works-at-tashus.svg" // Replace with the actual path to your image
          alt="Banner Image"
          layout="responsive"
          width={1920} // Set the width of your image
          height={600} // Set the height of your image
        />
        <Box className="md:px-44 px-8 mb-24 relative ">
          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1">Signing up</Typography>
            <p className="text-base">
              {`After completing your sign-up and having your details confirmed and verified, you are ready to start your Travel with reserved car. Here are described how a travel works in Tashus first to finish:`}
            </p>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1" variant="h6" gutterBottom>
              Safety Guidelines
            </Typography>
            <ul>
              {beforeYouDrive.map((point, index) => (
                <li key={index}>
                  <Typography>{point}</Typography>
                </li>
              ))}
            </ul>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1">For cars with Instant Keys</Typography>
            <p className="text-base">
              {`You'll receive the approximate location before your trip starts in the app. Head to that area. 15 minutes before the trip starts, check Pickup instructions in the app for step-by-step guidance on picking up the car. Keys for most Instant Keys cars are in a lockbox. Follow the app's tailored instructions for the specific car you've booked.`}
            </p>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1">For cars with Key Handover</Typography>
            <p className="text-base">
              {`Arrange to meet the owner to pick up the keys. The app will guide you on how to contact the owner and where to find the parked car.`}
            </p>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1">Checking the Car and Taking Photos</Typography>
            <p className="text-base">
              {`Now that the car is unlocked, give it a quick check. The app will prompt you to take several photos of the car. The Guest must inspect the vehicle upon receipt and report any pre-existing damages to the Host using the Tashus platform.
Snap photos of all surfaces and the interior, and upload them through the app. This is crucial if the car isn't in good condition, is dirty, or has less than ¼ tank of fuel. Take photos again when you return the car, or upload them within 24 hours of your trip ending. Learn more at: `}
              <a href="https://tashus.com/help/photo-upload-guide" target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Photo Taking Guide for Guest
              </a>
            </p>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1">{`Reading the Owner’s Instructions`}</Typography>
            <p className="text-base">
              {`Each car is unique. The owner's instructions will provide tips and tricks for using their specific car. You'll also receive the owner's contact details in case you have questions. For Key Handover cars, enter the current odometer reading and upload a photo of the dash showing the odometer before driving.`}
            </p>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1">{`Refueling if Needed`}</Typography>
            <p className="text-base">
              {`The Guest is responsible for returning the vehicle with the same fuel level as indicated at the start of the reservation, so the next driver can continue their journey. The car’s instructions will specify the type of fuel to use.
Not returning the vehicle with the agreed-upon fuel level will lead to extra fees. These additional charges will be determined by assessing the difference in the fuel gauge readings. The difference measures the distance in kilometers compared to the vehicle's full-tank mileage range.`}
            </p>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1" variant="h6" gutterBottom>
              Returning the Car
            </Typography>
            <ul>
              {rentingTheCar.map((point, index) => (
                <li key={index}>
                  <Typography>{point}</Typography>
                </li>
              ))}
            </ul>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1" variant="h6" gutterBottom>
              Before leaving
            </Typography>
            <ul>
              {beforeLeaving.map((point, index) => (
                <li key={index}>
                  <Typography>{point}</Typography>
                </li>
              ))}
            </ul>
          </Box>

          <Box className="mt-6 md:mt-10">
            <Typography className="text-xl font-bold mb-1">{`Need Extra Time?`}</Typography>
            <p className="text-base">
              {`You can easily extend your travel through the app if no one else has reserved the car. Follow the prompts to set a new end time to avoid late fees.
If you return the car early, you'll still pay for the booked time unless someone else books it. This ensures fairness to the owner who may have made arrangements around your booking.`}
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HowTravelWorks;
