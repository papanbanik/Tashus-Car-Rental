/* eslint-disable @next/next/no-img-element */
// components/CustomImage.tsx

import { useEffect, useRef, useState } from 'react';

interface CustomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, width, height, className }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [shouldLoadImmediately, setShouldLoadImmediately] = useState(false);

  useEffect(() => {
    const isInViewport = () => {
      if (!imageRef.current) return false;
      const rect = imageRef.current.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    const handleScroll = () => {
      const isInView = isInViewport();
      if (isInView) {
        setShouldLoadImmediately(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={imageRef}>
      <img src={src} alt={alt} width={width} height={height} className={className} loading={shouldLoadImmediately ? 'eager' : 'lazy'} />
    </div>
  );
};

export default CustomImage;
