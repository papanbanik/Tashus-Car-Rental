'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NavLink = () => {
  const pathName = usePathname();
  const { isScrolled } = useUserCredContext();
  const [textColor, setTextColor] = useState<string>('text-primary');
  // useEffect(() => {
  //   if (pathName === '/' && !isScrolled) {
  //     setTextColor('text-neutral');
  //   } else {
  //     setTextColor('text-primary');
  //   }
  // }, [pathName, isScrolled]);
  return (
    // <div className="ml-8 flex gap-6 ">
    <div className="md:ml-8 hidden md:flex lg:flex items-center space-x-8">
      <Link
        className={`text-sm font-bold md:text-md no-underline ${textColor} hover:font-extrabold  hover:underline`}
        href="/search?country=au&region=AU-NSW&postcode=&city=Sydney&lat=0&long=0"
      >
        Find Vehicles
      </Link>
      <Link className={`text-sm font-bold md:text-md no-underline ${textColor} hover:font-extrabold  hover:underline`} href="/get-verified">
        Get Verified
      </Link>
      <Link
        className={`text-sm font-bold md:text-md no-underline ${textColor} hover:font-extrabold  hover:underline`}
        href="https://www.tashus.com/blog"
        target="_blank"
      >
        Blogs
      </Link>
    </div>
  );
};

export default NavLink;
