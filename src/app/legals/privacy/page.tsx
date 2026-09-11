import PrivacyPage from '@/components/Legals/Privacy/Privacy';
import { allMetaData } from '@/utils/Functions/metaData';

const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;

const pageMetadata = allMetaData?.find((item) => item.route === '/legals/privacy');

export const metadata = {
  title: pageMetadata?.title ?? 'Tashus | Your Car Rental Data Safeguards: Tashus Privacy Policy',
  description:
    pageMetadata?.description ??
    'Ride & rent with confidence! Understand how Tashus protects your car rental data. Read our clear Privacy Policy now. join Tashus.',

  alternates: {
    canonical: `${DOMAIN}/legals/privacy`,
  },
};

const Privacy = () => {
  return (
    <div>
      <PrivacyPage></PrivacyPage>
    </div>
  );
};

export default Privacy;
