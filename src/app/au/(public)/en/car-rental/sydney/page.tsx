import Sydney from '@/components/Search/vehicleHireSydney/Sydney';
import { allMetaData } from '@/utils/Functions/metaData';

const pageMetadata = allMetaData?.find((item) => item.route === '/car-rental/sydney');

export const metadata = {
  title: pageMetadata?.title ?? 'Easy Car Rental Sydney | Convenient Car Hire with Tashus',
  description:
    pageMetadata?.description ??
    'Experience easy car rental in Sydney with Tashus. Our seamless booking process, wide vehicle selection make car hire convenient for everyone. Book now!',

  openGraph: {
    url: './',
    title: 'Car Rental in Sydney | Tashus Australia',
    description:
      'Experience eco-friendly car rental in Sydney, Australia, with Tashus. Navigate sustainably, embracing efficient urban mobility solutions',
    siteName: 'Tashus',
    images: [`${process.env.NEXT_PUBLIC_DOMAIN}/Images/Sydney/Top-places/Sydney_Opera_House_Tashus_Car_shareing.jpg`],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
  },
};

const SydneyPage = () => {
  return (
    <div>
      <Sydney />
    </div>
  );
};

export default SydneyPage;
