import AboutUs from '@/components/Help/AboutUs/AboutUs';
import { Metadata } from 'next';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
import { allMetaData } from '@/utils/Functions/metaData';

const pageMetadata = allMetaData?.find((item) => item.route === '/about-us');

export const metadata: Metadata = {
  title: pageMetadata?.title ?? 'About Tashus Car Rentals | Your Trusted Car Hire Service in Sydney',
  description:
    pageMetadata?.description ??
    "Learn more about Tashus, Sydney's reliable car rental service. Offering a wide range of vehicles for all your travel needs. Book with us today!",
  alternates: {
    canonical: `${DOMAIN}/about-us`,
  },
  openGraph: {
    images: [
      {
        url: `${DOMAIN}/Images/tashus-about-us.svg`,
        alt: 'Tashus About Us',
      },
    ],
  },
};

const AboutUsPage = () => {
  return (
    <div>
      <AboutUs />
    </div>
  );
};

export default AboutUsPage;
