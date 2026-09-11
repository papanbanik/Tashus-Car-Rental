'use client';
import { Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';

type Props = {};
const PhotoUploadGuide = (props: Props) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  return (
    <div className="md:px-44 px-8 mb-24 relative ">
      <div className="container mx-auto p-4">
        <Typography className="text-4xl font-bold text-center mb-10" variant="h1">
          Photo Capture Guideline
        </Typography>

        {/* <h1 className="text-3xl font-bold text-center mb-10">Photo Taking Guide for Guests</h1> */}
        <div className="my-4 mb-2">
          <h2 className="text-xl font-bold mb-1">Why do I need to upload photos?</h2>
          <p className="text-base">
            {`When you upload photos on Tashus, you help ensure a seamless and trustworthy car rental experience. These photos play a crucial role in
            documenting the vehicle's condition, allowing both hosts and guests to feel confident and secure. It's a vital step in building trust
            within the Tashus community, and it enables us to resolve any potential disputes with ease.`}
          </p>
        </div>
        <div className="my-4 mb-5">
          <h2 className="text-xl font-bold mb-1">How to capture photos of the vehicle?</h2>
          <p className="text-base">
            {`To capture photos of the vehicle on Tashus, make sure to provide clear, well-lit images from various angles. Start with a full shot of the
            car, and then focus on important details like the exterior, interior, and any existing damages. Highlight the key features that matter to
            guests, such as the vehicle's cleanliness and functionality. Tashus values high-quality images, as they are a guest's first impression of
            your vehicle and can lead to more bookings.`}
          </p>
        </div>

        <div className="mt-6 lg:mt-8">
          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_1.svg"
                alt="Tashus - Photo Capture Guideline"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  1
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Driver front quarter from left</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  {`Capture the driver's front left-quarter view with sharp and clear photos.`}
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_2.svg"
                alt="Tashus - Full left side car view"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  2
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Full photo of the left</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Ensure sharp, clear left-side car photos to meet our guidelines for trip satisfaction.
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center  pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_3.svg"
                alt="Tashus - Front left door with wheel"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6  lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  3
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold "> Front Left side Door with wheel</Typography>
                <Typography className="mt-1 text-justify font-regular">Take a sharp photo of front Left side Door with wheel</Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_4.svg"
                alt="Tashus - Rear left door with wheel"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  4
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Rare Left side Door with wheel</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Take a clear front left passenger’s door along with the wheel photo
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_5.svg"
                alt="Tashus - Full rear side car view"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  5
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Full rare side</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Take clear full rare side photos of the vehicle including back bumper and back glass
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-start pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_6.svg"
                alt="Tashus - Clear photo of rear bumper"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  6
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Rare bumper </Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Take a clear rare bumper photo of the vehicle along with the back lights{' '}
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_7_2.svg"
                alt="Tashus - Full right side car view"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>

            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  7
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Full right side</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Ensure sharp, clear right-side car photos to meet our guidelines for trip satisfaction.
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_8.svg"
                alt="Tashus - Rear right door with wheel"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  8
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Rare right-side Door with wheel</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Take a clear front right passenger’s door along with the wheel photo
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_9.svg"
                alt="Tashus - Front right door with wheel"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  9
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Front right-side Door with wheel</Typography>
                <Typography className="mt-1 text-justify font-regular">Take a sharp photo of front right side Door along with the wheel</Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_10.svg"
                alt="Tashus - Driver front right quarter view"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  10
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Driver front quarter from right</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  {`Capture the driver's front right-quarter view with sharp and clear photos.`}
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_11.svg"
                alt="Tashus - Front bumper and hood view"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  11
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Front bumper with hood</Typography>
                <Typography className="mt-1 text-justify font-regular">Take a clear photo of the front bumper along with the hood </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_13.svg"
                alt="Tashus - Full front car view"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  12
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Full front view</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Take a clear photo of the car full front view along with bumper, hood looking glass etc
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_12.svg"
                alt="Tashus - Car seats and interior equipment"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  13
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Car seats</Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Take couple of photos of the car seats and other equipment inside the car
                </Typography>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-items-center pt-8 pb-8 " style={{ borderBottom: '2px solid #e5e5e5' }}>
            <div>
              <Image
                src="/Images/Photo-Guideline/Tashus_Photo_guide_14.svg"
                alt="Tashus - Car dashboard and controls"
                //   style={{ objectFit: 'cover' }}
                className="rounded-lg z-0 mr-2 lg:mr-10 "
                // fill={true}
                width={290}
                height={140}

                // width={isSmallScreen ? 144 : 290}
                // height={isSmallScreen ? 70 : 140}
              ></Image>
            </div>
            <div className="flex flex-row items-center  mt-6 lg:mt-0 ">
              <div className="mx-1 my-0">
                <Typography className="text-6xl font-bold text-green-700" variant="h3">
                  14
                </Typography>
              </div>
              <div className="mx-1 my-0 ">
                <Typography className="mb-1 text-md font-bold ">Car dashboard </Typography>
                <Typography className="mt-1 text-justify font-regular">
                  Take couple of photos of the dashboard and other controlling equipment
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadGuide;
