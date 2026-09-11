const title = `Tashus | Eco-Friendly Car Rental in Australia`;
const description = `Tashus: eco-friendly car rental in Australia. Affordable rentals for students and professionals. Sustainable travel made simple.`;
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;

export function layoutMetadata() {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
    return {
      title: title,
      metadataBase: new URL(DOMAIN),
      applicationName: 'Tashus',
      description: description,
      openGraph: {
        type: 'website',
        title: title,
        description: description,
        images: [
          {
            url: `${DOMAIN}/icons/tashus-512x512.png`,
            alt: 'Tashus Car Share',
            width: 1200, // Width of the image in pixels
            height: 630, // Height of the image in pixels
          },
        ],
        url: `https://facebook.com/134854959713161`, // Your page URL
        // countryName: 'Australia',
        emails: 'info@tashus.com',
        siteName: 'Tashus',
      },
      generator: 'Tashus',
      keywords: keywords,
      twitter: twitterMetadata,
      authors: [{ name: 'Tashus', url: DOMAIN }],
      creator: 'Tashus',
      publisher: 'Tashus',
      icons: '/favicon.ico',
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1.0',
      themeColor: '#ffffff',
      alternates: {
        canonical: `${DOMAIN}`,
      },
      verification: {
        google: 'google',
      },
      // appLinks: {
      //   web: {
      //     url: DOMAIN,
      //     should_fallback: true,
      //   },
      // },
    };
  } else {
    return {
      description: description,
      title: title,
    };
  }
}

export const twitterMetadata = {
  card: 'app',
  title: title,
  description: description,
  // siteId: '1467726470533754880', // Your specific site ID
  creator: '@tashus_carshare',
  // creatorId: '1234567890123456789', // Your specific creator ID
  images: {
    url: `${DOMAIN}/icons/tashus-512x512.png`, // URL to your logo or image
    alt: 'Tashus Car Share Logo',
  },
  app: {
    name: 'tashus_carshare',
    id: {
      iphone: 'tashus_carshare://iphone',
      ipad: 'tashus_carshare://ipad',
      // googleplay: 'com.tashus.carshare.android',
    },
  },
};

const openGraphMetaData = {};

export const keywords = [
  'Car rental',
  'Peer-to-peer car rental',
  'Car rental alternatives',
  'Car rental services',
  'Car rental near me',
  'Car rental benefits',
  'Eco-friendly transportation',
  'Car rental Sydney',
  'Car rental Sydney',
  'Share car Sydney',
  'Peer-to-peer car rental Sydney',
  'Best car rental in Sydney',
  'Affordable car rental Sydney',
  // 'Convenient car sharing Sydney',
  // 'Affordable car sharing options for students',
  // 'Car sharing for occasional use or weekend trips',
  // 'Car sharing for business travelers and professionals',
  // 'Car sharing as a solution for urban congestion',
  // 'Benefits of car sharing for commuters in Sydney',
  // 'Environmental impact of car sharing in Sydney',
  // 'How to find available car sharing vehicles near you in Sydney',
];

// dynamic meta data
// export async function generateMetadata({ params }) {
//   return {
//     title: '...',
//   };
// }

// interface Metadata {
//   title: string;
//   description?: string;
//   url?: string;
//   siteName?: string;
//   locale?: string;
//   type?: string;
//   image?: string;
//   keywords?: string[];
//   icons?: string;
//   twitterHandle?: string;
//   facebookId?: string;
//   linkedInId?: string;
//   instagramId?: string;
//   robots?: string;
//   contentEncoding?: string;
//   viewport?: string;
//   themeColor?: string;
//   appleMobileWebAppTitle?: string;
//   appleMobileWebAppCapable?: string;
//   appleMobileWebAppStatusBarStyle?: string;
//   mobileWebAppCapable?: string;
//   msTileColor?: string;
//   msTileImage?: string;
// }

// all metadata

export const allMetaData = [
  {
    route: '/',
    title: 'Car Rental Sydney | Affordable Car Hire - Tashus',
    description: 'Discover the best car rental service in Sydney with Tashus. Affordable, convenient, and available at Sydney Airport. Book now!',
    keywords: 'Car rental Sydney',
  },
  {
    route: '/about-us',
    title: 'About Tashus Car Rentals | Your Trusted Car Hire Service in Sydney',
    description:
      "Learn more about Tashus, Sydney's reliable car rental service. Offering a wide range of vehicles for all your travel needs. Book with us today!",
    keywords: 'Car Hire Service in Sydney',
  },
  {
    route: '/help',
    title: 'Help & Support | Tashus cheap Rent a car in Sydney',
    description:
      "Find answers to your questions about Tashus car rentals in Sydney. Get support for bookings, services, and more. We're here to help!",
    keywords: 'Car Rentals Sydney',
  },
  {
    route: '/help/photo-upload-guide',
    title: 'Photo Upload Guide | Tashus Rent a car service Sydney',
    description:
      'Step-by-step guide on how to upload photos for Tashus car rentals. Ensure a smooth and easy process for uploading your documents and vehicle images.',
    keywords: '',
  },
  {
    route: '/legals/terms-and-conditions',
    title: 'Tashus | Terms of Service & Condition',
    description: 'Explore the terms and conditions that govern the use of Tashus. We are committed to providing a safe and reliable service.',
    keywords: '',
  },
  {
    route: '/login',
    title: 'Tashus | Car Rental Login for car share & Travel',
    description: 'Securely log in to your Tashus account and start your car rental journey. Your adventure awaits | Easy access, smooth rides',
    keywords: '',
  },
  {
    route: '/all-topics',
    title: 'Tashus | All Topic section for learn more about Tashus',
    description:
      "Discover a wealth of knowledge on Tashus Car Rental's 'All Topics' page. Dive into the world of seamless ride experiences, expert renting tips, and a comprehensive guide to make the most of your car rental journey",
    keywords: '',
  },
  {
    route: '/legals/privacy',
    title: 'Tashus | Your Car Rental Data Safeguards: Tashus Privacy Policy',
    description: 'Ride & rent with confidence! Understand how Tashus protects your car rental data. Read our clear Privacy Policy now. join Tashus.',
    keywords: '',
  },
  {
    route: '/car-rental/sydney',
    title: 'Easy Car Rental Sydney | Convenient Car Hire with Tashus',
    description:
      'Experience easy car rental in Sydney with Tashus. Our seamless booking process, wide vehicle selection make car hire convenient for everyone. Book now!',
    keywords: 'Easy Car Rental Sydney',
  },
  {
    route: '/eco-friendly-car-rental',
    title: 'Eco-Friendly Car Rental | Sustainable Car Hire Options with Tashus',
    description: 'Eco-friendly car-rental: Reduce your carbon footprint with sustainable on-demand transportation in our fast-paced world',
    keywords: 'eco friendly car rental',
  },
];
