import { CarSliderList, FAQItem, HowItWorksList } from '@/types/landingPageTypes';
import { OptionType } from './carListInfo';

export const heroBgImageList: string[] = ['/Hero/tashus_cover_images1.webp', '/Hero/tashus_cover_images2.webp', '/Hero/tashus_cover_images3.webp'];

export const carsSliderList: CarSliderList[] = [
  { title: 'Hybrid', alt: 'Hybrid Hire in Sydney ', image: '/CarSlider/new/hybrid.png', value: 'Sedan' },
  { title: 'Sedan', alt: 'Sedan Hire in Sydney', image: '/CarSlider/new/vehicleSedan.png', value: 'Sedan' },
  { title: '4 Wheel Drive', alt: '4 Wheel Drive Hire in Sydney', image: '/CarSlider/new/4wheel.png', value: 'SUV' },
  { title: 'Pickup truck', alt: 'Pickup Hire in Sydney', image: '/CarSlider/new/vehicle2.png', value: 'Pickup' },
  { title: 'SUV Hire', alt: 'SUV Hire in Sydney', image: '/CarSlider/new/vehicle1.png', value: 'SUV' },
  { title: 'Van Hire', alt: 'Van Hire in Sydney | Car rental Sydney', image: '/CarSlider/new/vehicle4.png', value: 'Van' },
  { title: 'Hybrid', alt: 'Hybrid Hire in Sydney ', image: '/CarSlider/new/hybrid.png', value: 'Sedan' },
  { title: 'Sedan', alt: 'Sedan Hire in Sydney', image: '/CarSlider/new/vehicleSedan.png', value: 'Sedan' },
  { title: '4 Wheel Drive', alt: '4 Wheel Drive Hire in Sydney', image: '/CarSlider/new/4wheel.png', value: 'SUV' },
  { title: 'Pickup truck', alt: 'Pickup Hire in Sydney', image: '/CarSlider/new/vehicle2.png', value: 'Pickup' },
  { title: 'SUV Hire', alt: 'SUV Hire in Sydney', image: '/CarSlider/new/vehicle1.png', value: 'SUV' },
  { title: 'Van Hire', alt: 'Van Hire in Sydney | Car rental Sydney', image: '/CarSlider/new/vehicle4.png', value: 'Van' },
];

export const howItWorksList: HowItWorksList[] = [
  {
    title: 'Verify Your Account',
    description: 'Ensure a smooth rental experience by verifying your account.',
    imageUrl: '/Home/verify-account/verifystep2.webp',
    url: '/get-verified',
    alt: 'Car rental Sydney - Verify Your Account with Tashus',
  },
  {
    title: 'Select Your Vehicle',
    description: 'Browse our diverse selection of vehicles to find the perfect ride for your journey.',
    imageUrl: '/Home/verify-account/verifystep1.webp',
    url: '/search?country=au&region=AU-NSW&postcode=&city=Sydney&lat=0&long=0',
    alt: 'Car rental Sydney - Select Your Vehicle from Tashus',
  },
  {
    title: 'Make Payment',
    description: 'Securely complete your booking by making an online payment.',
    imageUrl: '/Home/verify-account/verifystep3.webp',
    alt: 'Car rental Sydney - Make Payment for Your Booking with Tashus',
  },
  {
    title: 'Grab the Key',
    description: 'Pick up your keys and get ready to hit the road!',
    imageUrl: '/Home/verify-account/verifystep4.webp',
    alt: 'Car rental Sydney - Grab the Key for Your Tashus Vehicle',
  },
];

export const faqData: FAQItem[] = [
  {
    question: 'What is Tashus?',
    answer:
      // 'Tashus is an innovative car rental platform located in Australia. It simplifies the process for car owners to rent out their vehicles, offering a seamless experience for car renters looking to borrow cars for both short and extended periods. Tashus provides a flexible and convenient transportation solution to meet a variety of needs.  ',
      `Tashus is an innovative car rental platform located in Australia. It offers a seamless experience for car renters looking to borrow cars for both short and extended periods. Tashus provides a flexible and convenient transportation solution to meet a variety of needs.`,
  },
  {
    question: 'How does Tashus work?',
    answer:
      // 'Hosts list their cars on Tashus, accept booking requests, and earn income when guests rent their vehicles. Guests browse and book available cars on Tashus, pick up the vehicle, use it, and return it after the rental period, paying through the platform for a hassle-free experience. ',
      'Guests browse and book available cars on Tashus, pick up the vehicle, use it, and return it after the rental period, paying through the platform for a hassle-free experience. Whether you need a compact car for a quick trip or a spacious SUV for a family vacation, Tashus has you covered!',
  },
  {
    question: 'Where is Tashus available in Australia?  ',
    answer: `Tashus is currently available in major cities and regions across Australia. Check our app or website for specific locations.`,
  },
  {
    question: 'What are the requirements for reserving a car on Tashus?',
    answer: `To reserve a car through Tashus, you'll need to establish a Tashus account, The Driver must be at least 21 and not over 75 years of age and have no less than 12 months of driving experience. You must also possess a valid driver’s license and receive authorization to drive on Tashus. During your initial booking, you'll undergo a swift approval process where you'll input your driver’s license and some additional details. In most instances, you'll receive immediate approval, ensuring you're all set for all your upcoming road adventures, day trips, and business travels!`,
  },
  {
    question: 'Do I need to be verified before reserving a vehicle?',
    answer: `Yes, you need to be verified before reserving a vehicle. To complete the verification process, admin approval is required, which may take up to 24 hours. However, verification is typically completed as soon as possible by the support team.`,
  },
  // {
  //   question: 'As a Partner, how do I list my vehicle?',
  //   // answer: `
  //   //   Simply click on
  //   //   "<a href="/car-listing">Be a Partner</a>"
  //   //   and then "<a href="/car-listing">Login/Sign up</a>" with your Email and Password or you can login with your Google and other social media,
  //   //   and you are ready to list your car.
  //   //   There are a total of 9 steps including: Vehicle Information, Location, Availability, Rates, Guidelines, Photos, Distance, Insurance Policy, and View and Post.
  //   // `,
  //   answer: `
  //   Simply click on <b>"Be a Partner"</b> and then <b>"Login/Sign up"</b> with your Email and Password or you can login with your Google and other social media,
  //   and you are ready to list your car.
  //   There are a total of 9 steps including: Vehicle Information, Location, Availability, Rates, Guidelines, Photos, Distance, Insurance Policy, and View and Post.
  // `,
  // },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept various payment methods, including major credit cards like Visa, MasterCard, American Express, Maestro, Discover, etc. Our system is powered by Stripe, allowing for secure and convenient transactions with a range of payment choices.',
  },
  {
    question: 'Can I cancel a reservation?',
    answer:
      'Yes, you can cancel a reservation without any charges up to a certain period before the scheduled time. Check the cancelation policy for details.  ',
  },
  {
    question: 'Can I extend my reservation if I need more time with the vehicle?',
    answer: 'Yes, you can extend your reservation if the vehicle is available. Use the web or app to check availability and make the extension.',
  },
  {
    question: 'How do you ensure data privacy and security?',
    answer: 'Tashus has robust security measures in place to protect user data. We comply with Australian data privacy laws. ',
  },
  {
    question: 'What happens if I return the vehicle late? ',
    answer: 'Late returns may result in additional charges. Check the web or app for details on late return policies.   ',
  },
];
