import { allMetaData } from '@/utils/Functions/metaData';
import HelpPage from '../../components/Help/helpHome/HelpHomePage';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;

const pageMetadata = allMetaData?.find((item) => item.route === '/help');
export const metadata = {
  title: pageMetadata?.title ?? 'Help & Support | Tashus cheap Rent a car in Sydney',
  description:
    pageMetadata?.description ??
    "Find answers to your questions about Tashus car rentals in Sydney. Get support for bookings, services, and more. We're here to help!",

  alternates: {
    canonical: `${DOMAIN}/help`,
  },
};

const HelpPageHome = () => {
  return (
    <div>
      <HelpPage />
    </div>
  );
};

export default HelpPageHome;
