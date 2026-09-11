'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmailPopup from './EmailPopup';

const UserMenu = dynamic(() => import('./UserMenu'));
const NavLink = dynamic(() => import('./NavLink'));

const NavBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hide, setHide] = useState<string>('');
  const { isScrolled, setIsScrolled } = useUserCredContext();
  // const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    if (pathname === '/external-pages/payment-success' || searchParams.get('from') === 'redirection') {
      setHide('hidden');
    } else {
      setHide('');
    }
  }, [pathname, searchParams]);

  const [navBarPx, setNavBarPx] = useState<string>('52');
  useEffect(() => {
    if (pathname === '/search') {
      setNavBarPx('24');
    } else if (pathname.includes('/vehicle-details')) {
      setNavBarPx('24');
    } else if (pathname.includes('/dashboard')) {
      setNavBarPx('24');
    } else if (pathname.includes('/profile')) {
      setNavBarPx('20');
    } else if (pathname.includes('/support/support-center')) {
      setNavBarPx('28');
    } else if (pathname.includes('/support/support-ticket')) {
      setNavBarPx('10');
    } else {
      setNavBarPx('52');
    }
  }, [pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (hide === 'hidden') return <></>;

  return (
    <nav
      className={`fixed top-0 w-full ${
        pathname.includes('/dashboard') && pathname.includes('/calendar') ? 'z-[100]' : 'z-50'
      } xl:px-${navBarPx} lg:px-${navBarPx} md:px-24 px-2 h-16 ${
        isScrolled ? 'bg-[#F5E4F8]' : `${pathname === '/' ? 'bg-[rgba(255,255,255,0.5)]' : 'bg-neutral'}`
        // : `${pathname === '/' ? 'bg-transparent bg-gradient-to-b from-[rgba(0,0,0,0.3)] to-[rgba(102,102,102,0)]' : 'bg-transparent'}`
      } transition-colors duration-300 flex items-center`}
    >
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between h-full">
        <div className="md:flex items-center hidden ">
          <div>
            <Link className="no-underline" href="/">
              <Image
                // src={`${pathname === '/' && !isScrolled ? '/Logo/TashusLogoWhite.svg' : '/Logo/TashusLogoNew.svg'}`}
                src={`/Logo/TashusLogoNew.svg`}
                alt="Tashus Logo"
                width={80}
                height={64}
                className="py-2"
              />
            </Link>
          </div>
          <NavLink />
        </div>
        <div className="md:hidden lg:hidden">
          <Link className="no-underline text-stone-100" href="/">
            <Image src="/Logo/TashusLogo2.png" alt="Tashus Logo for mobile responsive" width={60} height={60} />
          </Link>
        </div>
        {/* User menu section */}
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
      <EmailPopup />
    </nav>
  );
};

export default NavBar;
