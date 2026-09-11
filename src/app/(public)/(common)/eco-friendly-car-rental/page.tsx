import EcoFriendly from '@/components/Search/Eco-Friendly-Car-Sharing/EcoFriendly';
import { allMetaData } from '@/utils/Functions/metaData';

const pageMetadata = allMetaData?.find((item) => item.route === '/eco-friendly-car-rental');

export const metadata = {
  title: pageMetadata?.title ?? 'Eco-Friendly Car Rental | Sustainable Car Hire Options with Tashus',
  description:
    pageMetadata?.description ??
    'Eco-friendly car-rental: Reduce your carbon footprint with sustainable on-demand transportation in our fast-paced world',

  // title: 'Share Rides, Save Earth: Tashus Eco Car Rental Movement',
  // description: `Eco-friendly car-rental: Reduce your carbon footprint with sustainable on-demand transportation in our fast-paced world`,
  // keywords: `Sustainable transportation,
  // Green car rental,
  // Environmental car rental,
  // Low-emission vehicle rental,
  // Eco-conscious ride-rental,
  // Electric car-rental,
  // Eco-friendly mobility services,
  // Carbon-neutral carpooling,
  // Green transportation solutions,
  // Environmentally responsible car-rental`,
  openGraph: {
    url: './',
    title: 'Tashus | Eco Friendly Car rental',
    description: 'Eco-friendly car-rental: Reduce your carbon footprint with sustainable on-demand transportation in our fast-paced world',
    siteName: 'Tashus',
    images: [`${process.env.NEXT_PUBLIC_DOMAIN}/Images/Eco-Friendly-page/Tashus-carShare.webp`],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
  },
};

const EcoFriendlyPage = () => {
  return <EcoFriendly />;
};

export default EcoFriendlyPage;
