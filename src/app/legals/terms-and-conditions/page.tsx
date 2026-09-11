import TermsAndConditions from '@/components/Legals/TermsAndConditions/TermsAndConditions';
import { allMetaData } from '@/utils/Functions/metaData';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;

const pageMetadata = allMetaData?.find((item) => item.route === '/legals/terms-and-conditions');

export const metadata = {
  title: pageMetadata?.title ?? 'Tashus | Terms of Service & Condition',
  description:
    pageMetadata?.description ??
    'Explore the terms and conditions that govern the use of Tashus. We are committed to providing a safe and reliable service.',
  keywords: pageMetadata?.keywords ?? '',

  alternates: {
    canonical: `${DOMAIN}/legals/terms-and-conditions`,
  },
};

const TermsConditionPage = () => {
  return (
    <div>
      <TermsAndConditions></TermsAndConditions>
    </div>
  );
};

export default TermsConditionPage;
