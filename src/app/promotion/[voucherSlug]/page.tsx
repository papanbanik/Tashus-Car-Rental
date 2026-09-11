import VoucherDetails from '@/components/LandingPage/Promotion/VoucherDetails/VoucherDetails';

const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
export const metadata = {
  title: `Tashus | Exclusive Voucher Promotion: Unlock Discounts for Eco-Friendly Car Rental`,
  description: `Don't miss out on exclusive savings with Tashus' voucher promotion! Unlock discounts for eco-friendly car rental and make your journeys more affordable. Explore our limited-time offers and start saving today.`,
  alternates: {
    canonical: `${DOMAIN}/promotion`,
  },
};

const PromotionVoucherDetails = () => {
  return (
    <div className="lg:px-32 xl:px-52 md:px-24 px-2 mt-10 lg:mt-14 max-w-[1600px] mx-auto">
      <div className="container mx-auto">
        <VoucherDetails />
      </div>
    </div>
  );
};

export default PromotionVoucherDetails;
