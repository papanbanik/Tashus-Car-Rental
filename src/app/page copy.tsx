import dynamic from 'next/dynamic';
const CarSection = dynamic(() => import('@/components/LandingPage/CarSlider/CarSlider'));
const JoinCom = dynamic(() => import('@/components/LandingPage/CommunityJoin/JoinCom'));
const FAQSection = dynamic(() => import('@/components/LandingPage/FAQ/FAQSection'));
const InformativeSection = dynamic(() => import('@/components/LandingPage/Informative/InformativeSection'));
const RentalSection = dynamic(() => import('@/components/LandingPage/Rental/RentalSection'));
const HowItWorks = dynamic(() => import('@/components/howItWorks/HowItWorks'));
// import JoinCom from '@/components/LandingPage/CommunityJoin/JoinCom';
// import FAQSection from '@/components/LandingPage/FAQ/FAQSection';
import AppDownload2 from '@/components/LandingPage/AppDownload/AppDownload2';
import HeroSection from '@/components/LandingPage/HeroUpdated/HeroSection';
import ListYourCar from '@/components/LandingPage/ListYourCar/ListYourCar';
import PopupImage from '@/components/LandingPage/PopUpImage/PopupImage';
import VerifyAccount from '@/components/LandingPage/VerifyAccount/VerifyAccount';
import siteMetadata from '@/utils/siteMetadata';
import TopPlacesCard from './help/TopPlacesCard/TopPlacesCard';
import CookieConsentBanner from '@/components/LandingPage/CookieConsentBanner/CookieConsentBanner';

export async function generateMetadata() {
  return {
    metadataBase: new URL('https://www.tashus.com'),
    title: siteMetadata.title,
    // title: {
    //   default: siteMetadata.title,
    //   template: `%s | ${siteMetadata.title}`,
    // },
    description: siteMetadata.description,
    openGraph: {
      url: './',
      title: siteMetadata.title,
      description: siteMetadata.description,
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: './',
      // types: {
      //   'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
      // },
    },
    robots: {
      index: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? true : false,
      follow: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? true : false,
      googleBot: {
        index: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? true : false,
        follow: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? true : false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      title: siteMetadata.title,
      card: 'summary_large_image',
      images: [siteMetadata.socialBanner],
    },
  };
}
const jsonSchemaLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tashus',
  alternateName: 'Tashus Car Rental',
  url: 'https://www.tashus.com/',
  logo: 'https://www.tashus.com/Logo/TashusLogoNew.svg',
  description:
    'Tashus is an innovative car rental platform located in Australia. It offers a seamless experience for car renters looking to borrow cars for both short and extended periods.',
  sameAs: [
    'https://www.facebook.com/tashus.car',
    'https://www.instagram.com/tashus.car',
    'https://www.linkedin.com/company/tashus-carshare/',
    'https://twitter.com/tashus_carshare',
    'https://www.pinterest.com/tashuscar/',
    'https://www.tumblr.com/blog/tashuscar',
  ],
};

const Home = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonSchemaLd) }} />
      <main className="overflow-hidden relative -mt-28 -lg:mt-16">
        <HeroSection />
        <div className=" lg:px-32 xl:px-52 md:px-24 px-2 mt-32">
          {/* <LaunceDateBanner /> */}
          <CarSection />
          {/* <CarsliderComponent2 /> */}
          {/* <JoinCom /> */}
          {/* <HowItWorksComponent /> */}
          <HowItWorks />
        </div>
        {/* <NumberingSection/> */}

        {/* <HeroSection /> */}
        {/* <div className=" lg:px-32 xl:px-52 md:px-24 px-2  mt-30">
          <LaunceDateBanner />
          <CarSection />
          <JoinCom />
        </div> */}
        {/* <NumberingSection/> */}

        <VerifyAccount />
        {/* <div className=" lg:px-32 xl:px-52 md:px-24 px-2 lg:pb-32 md:pb-24 pb-4 mt-30 mt-8 md:mt-0"> */}
        <div className=" lg:px-32 xl:px-52 md:px-24 px-2 pb-4">
          <InformativeSection />
          {/* {process.env.NEXT_PUBLIC_NODE_ENV === 'development' && <Voucher />} */}
          {/* <AppDownload /> */}
          {/* <rofile /> */}
          {/* <RentalSection /> */}
        </div>

        <ListYourCar />
        <div className="bg-neutral xl:px-52 lg:px-32  md:px-24 px-2 lg:pb-32 md:pb-24 pb-4">
          {/* <ReviewSection/> */}
          <TopPlacesCard />
          <AppDownload2 />
          <FAQSection />
        </div>
        <PopupImage />
        <CookieConsentBanner />
      </main>
    </>
  );
};
export default Home;
