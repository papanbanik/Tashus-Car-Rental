import CarInformation from '@/components/CarListing/CarInformation/CarInformation';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
export const metadata = {
  title: 'Tashus | List Your Vehicle at Tashus',
  description: `Join Tashus, the premier car rental platform, and unlock the potential of your vehicle. List your car effortlessly and start earning extra income today. With Tashus, enjoy seamless experiences and hassle-free earning opportunities.`,
  alternates: {
    canonical: `${DOMAIN}/car-listing`,
  },
};

const Host = () => {
  return (
    <div>
      <CarInformation isEdit={false} />{' '}
    </div>
  );
};

export default Host;
