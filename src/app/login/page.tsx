import SignUpPage from '@/components/SignUp/SignUpPage';
import SignUpPageNew from '@/components/SignUp/SignUpPageNew';

import { allMetaData } from '@/utils/Functions/metaData';

const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;

const pageMetadata = allMetaData?.find((item) => item.route === '/login');
export const metadata = {
  title: pageMetadata?.title ?? 'Tashus | Car Rental Login for car share & Travel',
  description:
    pageMetadata?.description ??
    'Securely log in to your Tashus account and start your car rental journey. Your adventure awaits | Easy access, smooth rides',
  keywords: pageMetadata?.keywords ?? 'Car Rentals Sydney',

  alternates: {
    canonical: `${DOMAIN}/login`,
  },
};

const UserLogin = () => {
  return <SignUpPageNew></SignUpPageNew>;
};

export default UserLogin;
