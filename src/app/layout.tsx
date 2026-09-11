import { MaxWidthProvider } from '@/components/Layouts/NavBar/MaxWidthProvider';
import LoginPopupLandingPageNew from '@/components/LoginPopUp/loginPopupLandingPageNew';
import SessProvider from '@/components/Provider/SessProvider';
import ThemeRegistry from '@/components/Theme/ThemeRegistry';
import VerificationModal from '@/components/VerificationPopUp/VerificationPopUp';
import { GetAllCommentsProvider } from '@/context/AllCommentsOfATicketProvider';
import { CarListingProvider } from '@/context/CarListingProvider';
import { HelpTopicsArticlesProvider } from '@/context/HelpTopicsArticlesProvider';
import { ModalProvider } from '@/context/ModalProvider';
import { PaymentDetailsProvider } from '@/context/PaymentDetailsProvider';
import { ProfileInfoProvider } from '@/context/ProfileInfoProvider';
import { ReviewRatingProvider } from '@/context/ReviewRatingProvider';
import { SearchProvider } from '@/context/SearchProvider';
import { SnackBarProvider } from '@/context/SnackBarProvider';
import { TravelProvider } from '@/context/TravelProvider';
import { UserCredProvider } from '@/context/UserCredProvider';
import { allMetaData } from '@/utils/Functions/metaData';
import QueryProviders from '@/utils/QueryProviders';
import siteMetadata from '@/utils/siteMetadata';
import { Analytics } from '@vercel/analytics/react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';

// Import AI Widget Loader
import AIWidgetLoader from '@/components/AI-Widget-Loader/AIWidgetLoader';
import { isDevelopment } from '@/utils/Functions/randomCommonFn';

const NavBar = dynamic(() => import('@/components/Layouts/NavBar/NavBar'));
const FooterSection = dynamic(() => import('@/components/Layouts/Footer/FooterSection'));

const pageMetadata = allMetaData?.find((item) => item.route === '/');

export const metadata = {
  title: pageMetadata?.title ?? 'Car Rental Sydney | Affordable Car Hire - Tashus',
  description:
    pageMetadata?.description ??
    'Discover the best car rental service in Sydney with Tashus. Affordable, convenient, and available at Sydney Airport. Book now!',
  openGraph: {
    images: `${siteMetadata.socialBanner}`,
  },
  verification: {
    other: {
      'facebook-domain-verification': ['o9c2byapn1odfftzvpr4kvpwfr49zm'],
    },
  },
};

export default function RootLayout({ children, session }: { children: React.ReactNode; session: any }) {
  const gtmScript = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
  `;

  const hotjarScript = `
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `;

  const CrispWithNoSSR = dynamic(() => import('@/components/crisp-chatbot/crisp'));

  return (
    <html lang={siteMetadata.language}>
      {process.env.NEXT_PUBLIC_NODE_ENV === 'production' && (
        <>
          <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/tashus-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/tashus-16x16.png" />
          <meta name="msvalidate.01" content="51C6FDDCFEF7A377F5CFC4F9E0664344" />
          <meta name="p:domain_verify" content="023595fdaaa0aa32d7b5ba9a31406518" />
          <meta name="google-site-verification" content="b1wMLmU_xeebnVnnPazick0yReQ2hIBhZGO0XIpmCas" />
          <Script id="google-tag-manager" strategy="lazyOnload">
            {gtmScript}
          </Script>
          <Script id="hotjar-snippet" dangerouslySetInnerHTML={{ __html: hotjarScript }} />
        </>
      )}
      <body className="bg-neutral">
        <MaxWidthProvider>
          <SessProvider session={session}>
            <Suspense fallback={null}>
              <ThemeRegistry>
                <QueryProviders>
                  <UserCredProvider>
                    <PaymentDetailsProvider>
                      <SearchProvider>
                        <TravelProvider>
                          <ProfileInfoProvider>
                            <ReviewRatingProvider>
                              <HelpTopicsArticlesProvider>
                                <GetAllCommentsProvider>
                                  <SnackBarProvider>
                                    <ModalProvider>
                                      <CarListingProvider>
                                        <NavBar />
                                        <div className="mt-28 lg:mt-16">
                                          {children}
                                          <VerificationModal />
                                          <LoginPopupLandingPageNew />

                                          {isDevelopment ? <AIWidgetLoader /> : <CrispWithNoSSR />}
                                          <Analytics />
                                        </div>
                                        <FooterSection />
                                      </CarListingProvider>
                                    </ModalProvider>
                                  </SnackBarProvider>
                                </GetAllCommentsProvider>
                              </HelpTopicsArticlesProvider>
                            </ReviewRatingProvider>
                          </ProfileInfoProvider>
                        </TravelProvider>
                      </SearchProvider>
                    </PaymentDetailsProvider>
                  </UserCredProvider>
                </QueryProviders>
              </ThemeRegistry>
            </Suspense>
          </SessProvider>
        </MaxWidthProvider>
        {process.env.NEXT_PUBLIC_NODE_ENV === 'production' && (
          <Suspense fallback={null}>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              ></iframe>
            </noscript>
          </Suspense>
        )}
      </body>
    </html>
  );
}
