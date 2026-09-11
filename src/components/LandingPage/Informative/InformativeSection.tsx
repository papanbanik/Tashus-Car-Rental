'use client';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { leftElements, rightElements } from './Informative';

const InformativeSection: React.FC = () => {
  return (
    <Box style={{ maxWidth: '1300px', margin: '0 auto' }} className="justify-center w-full md:mb-0 flex flex-col items-center -mt-4 lg:-mt-3">
      <Typography variant="h1" className="text-black text-center mb-6 md:mb-6 text-[24px] lg:text-[40px] font-bold">
        Why <span className="lg:text-primary text-black ">Choose Us</span>
        <span className="text-black">!</span>
      </Typography>
      <Box className="grid lg:grid-cols-3">
        {/* Left elements */}
        <Box className="flex flex-col items-center mt-0 lg:mt-10">
          {leftElements.map((element, index) => (
            <Box className="flex max-[1000px]:flex-row-reverse mb-5 md:mb-12" key={index}>
              <Box className="mr-2">
                <Typography variant="h6" className="text-primary text-right max-[1000px]:text-left text-[18px] font-bold mb-2">
                  {element.title}
                </Typography>
                <Typography variant="body2" className="max-md:text-start text-[14px] max-[1000px]:text-left overflow-hidden max-w-[350px] text-end">
                  {element.description}
                </Typography>
              </Box>
              <Box>
                <Image src={element.icon} alt={element.alt} width={100} height={100} />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Middle image */}
        <Box className="col-span-1 flex items-center justify-center lg:flex max-[1100px]:hidden">
          <Box className="p-6">
            <Image
              src="/Informative/Tashus-why-choose-us.svg"
              alt="Join Tashus, an expanding network of car rental service providers"
              width={210} // Reduced width
              height={210} // Reduced height
              layout="intrinsic" // Keeps the aspect ratio
            />
          </Box>
        </Box>

        {/* Right elements */}
        <Box className="flex flex-col items-center mt-0 lg:mt-10">
          {rightElements.map((element, index) => (
            <Box className="flex items-start mb-5 md:mb-12" key={index}>
              <Box>
                <Image src={element.icon} alt={element.alt} width={100} height={100} />
              </Box>
              <Box className="mr-2">
                <Typography variant="h6" className="text-primary text-[18px] font-bold mb-2">
                  {element.title}
                </Typography>
                <Typography variant="body2" className="text-start text-[14px] overflow-hidden max-w-[350px]">
                  {element.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default InformativeSection;
