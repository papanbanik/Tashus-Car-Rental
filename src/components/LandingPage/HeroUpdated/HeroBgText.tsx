import { ReactTyped } from 'react-typed';

const HeroBgText = () => {
  return (
    <div className="absolute top-[12%] lg:top-[25%] z-30 p-4 text-center w-full flex justify-center items-center">
      <div className="max-w-screen-md my-4 text-white">
        <ReactTyped
          strings={['Explore Sydney in Style', 'Rent Instantly and Hit the Road!']}
          typeSpeed={70} // Slower typing speed for smoothness
          backSpeed={40} // Slower backspacing speed
          backDelay={1500} // Slightly longer delay before it starts backspacing
          startDelay={500} // Delay before typing starts
          loop={true} // Loop the effect
          showCursor={true} // Show the cursor during typing
          className="text-4xl mt-6 lg:mt-0 lg:text-5xl font-bold leading-tight m-0"
        />
      </div>
    </div>
  );
};

export default HeroBgText;
