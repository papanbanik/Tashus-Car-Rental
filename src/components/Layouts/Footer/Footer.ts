import { handleFooterRedirection } from '@/utils/Functions/searchCommonFn';

interface FooterElement {
  title: string;
  links: { label: string; url: string }[];
}
export const footerData: FooterElement[] = [
  {
    title: 'About Tashus',
    links: [
      // { label: 'List a Car', url: `${process.env.NEXT_PUBLIC_DOMAIN}/car-listing` },
      // { label: 'List a Car', url: `${process.env.NEXT_PUBLIC_DOMAIN}/on-boarding/verification` },
      { label: 'Policies', url: `${process.env.NEXT_PUBLIC_DOMAIN}/legals/privacy` },
      { label: 'Eligibility in AUS', url: `${process.env.NEXT_PUBLIC_DOMAIN}/help/article/1` },
      //{ label: 'Team', url: '/contact' },
      { label: 'Support', url: `${process.env.NEXT_PUBLIC_DOMAIN}/help` },

      { label: 'Connect Support', url: `${process.env.NEXT_PUBLIC_DOMAIN}/support/support-center/general?from=general` },

      { label: 'Eco Friendly Car Rental ', url: `${process.env.NEXT_PUBLIC_DOMAIN}/eco-friendly-car-rental` },
      { label: 'Car Rental in Sydney ', url: `${process.env.NEXT_PUBLIC_DOMAIN}/au/en/car-rental/sydney` },
    ],
  },
  {
    title: 'How it works',
    links: [
      { label: 'Promotions', url: `${process.env.NEXT_PUBLIC_DOMAIN}/promotion` },
      { label: 'How Travel works', url: `${process.env.NEXT_PUBLIC_DOMAIN}/help/how-travel-works` },
      { label: 'Photo Capture Guideline', url: `${process.env.NEXT_PUBLIC_DOMAIN}/help/photo-upload-guide` },
      { label: 'Damage Inspection', url: `${process.env.NEXT_PUBLIC_DOMAIN}/help/vehicle-inspection` },
      { label: 'Additional fees', url: `${process.env.NEXT_PUBLIC_DOMAIN}/fees` },
      // { label: 'Car Rental in Sydney ', url: `${process.env.NEXT_PUBLIC_DOMAIN}/au/en/car-share/sydney` },
      // { label: 'Eco Friendly Car Rental ', url: `${process.env.NEXT_PUBLIC_DOMAIN}/eco-friendly-car-share` },
    ],
  },
  // {
  //   title: 'Popular Pages',
  //   links: [
  //     { label: 'Lorem Ipsum  page 1', url: '/about' },
  //     { label: 'Lorem Ipsum  page 2', url: '/about' },
  //     { label: 'Lorem Ipsum  page 3', url: '/about' },
  //     { label: 'Lorem Ipsum  page 4', url: '/about' },
  //     { label: 'Lorem Ipsum  page 5', url: '/about' },
  //   ],
  // },
  {
    title: 'Vehicle Type',
    links: ['SUV', 'Sedan', 'Coupe', 'Convertible', 'Hatchback', 'Pickup', 'Van', 'Minivan', 'Wagon'].map((type) => ({
      label: type,
      url: handleFooterRedirection({
        city: 'Sydney',
        address: 'Sydney, New South Wales, Australia',
        source: 'footer',
        vehicleType: type,
      }),
    })),
  },
  {
    title: 'Top Cities',
    links: [
      {
        label: 'Sydney',
        url: handleFooterRedirection({
          city: 'Sydney',
          address: 'Sydney, New South Wales, Australia',
          source: 'footer',
        }),
      },
      {
        label: 'Melbourne',
        url: handleFooterRedirection({
          city: 'Melbourne',
          address: 'Melbourne, Victoria, Australia',
          region: 'AU-VIC',
          lat: '-37.814198',
          long: '144.96333',
          source: 'footer',
        }),
      },
      {
        label: 'Newcastle',
        url: handleFooterRedirection({
          city: 'Newcastle',
          address: 'Newcastle, New South Wales, Australia',
          lat: '-32.926773',
          long: '151.77478',
          source: 'footer',
        }),
      },
      {
        label: 'Wollongong',
        url: handleFooterRedirection({
          city: 'Wollongong',
          address: 'Wollongong, New South Wales, Australia',
          lat: '-34.426968',
          long: '150.89957',
          source: 'footer',
        }),
      },
      {
        label: 'Armidale',
        url: handleFooterRedirection({
          city: 'Armidale',
          address: 'Armidale, New South Wales, Australia',
          lat: '-30.51369',
          long: '151.6671',
          source: 'footer',
        }),
      },
    ],
  },
];
