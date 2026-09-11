'use client';

import HeroBgImage from './HeroBgImage';
import HeroBgText from './HeroBgText';
import SearchSection from './SearchSection';

const HeroSection = () => {
  return (
    <div className="relative w-full">
      <HeroBgImage />
      <HeroBgText />
      <SearchSection />
    </div>
  );
};
export default HeroSection;
