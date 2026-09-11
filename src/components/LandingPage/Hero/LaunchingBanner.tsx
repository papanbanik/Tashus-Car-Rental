import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import { animated, useSpring } from 'react-spring';

const LaunchingBanner = () => {
  const message = `Exciting News! 🚀 We're gearing up for something amazing! Our official launch is set for December 13, 2023. Stay tuned for an incredible experience. Counting down the days! ⏰`;

  const messageAnimation = useSpring({
    loop: { reverse: true },
    from: {
      color: '#800080', // Purple color
      // textShadow: '0 0 2px #800080, 0 0 2px #800080, 0 0 2px #800080',
      fontSize: '40px',
      fontWeight: 'bold',
    },
    to: [
      {
        color: '#5C8D07', // Green color
        // textShadow: '0 0 2px #5C8D07, 0 0 2px #5C8D07, 0 0 2px #5C8D07',
        fontSize: '40px',
        fontWeight: 'normal',
      },
      {
        color: '#800080', // Purple color
        // textShadow: '0 0 2px #800080, 0 0 2px #800080, 0 0 2px #800080',
        fontSize: '40px',
        fontWeight: 'bold',
      },
    ],
    config: { duration: 1000 },
  });

  return (
    <Box
      style={{ border: '1px solid #800080', backgroundColor: 'transparent' }}
      className="h-[95px] md:h-[130px] lg:h-[150px] pt-5 bg-neutral w-full mt-16"
    >
      <animated.div style={{ ...messageAnimation, textAlign: 'center' }}>
        <Typography className="text-[12px] xs:text-[12px] md:text-[16px] lg:text-[22px] xl:text-[28px] text-center pl-2 pr-2 lg:pl-4 lg:pr-4">
          {message}
        </Typography>
      </animated.div>
    </Box>
  );
};

export default LaunchingBanner;
