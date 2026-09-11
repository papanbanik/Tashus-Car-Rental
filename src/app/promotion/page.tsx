import PromotionBannerImage from '@/components/LandingPage/Promotion/PromotionBannerImage';
import PromotionContent from '@/components/LandingPage/Promotion/PromotionContent';

import Image from 'next/image';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
export const metadata = {
  title: `Tashus | Exclusive Voucher Promotion: Unlock Discounts for Eco-Friendly Car Rental`,
  description: `Don't miss out on exclusive savings with Tashus' voucher promotion! Unlock discounts for eco-friendly car rental and make your journeys more affordable. Explore our limited-time offers and start saving today.`,
  alternates: {
    canonical: `${DOMAIN}/promotion`,
  },
};

const Voucher = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      {/* <Slider {...sliderSettings}> */}
      {/* <div>
          <Image
            src="/Images/tashusVoucher7.svg"
            alt="Unlock Exclusive Discounts with Tashus Vouchers"
            width={1920}
            height={1080}
            style={{ width: '100%', height: 'auto' }}
          />
        </div> */}
      <div>
        {/* <Image
          src="/Images/Tashus-Bonus Incentive-$1000.png"
          alt="Unlock Exclusive Discounts with Tashus Vouchers"
          width={1920}
          height={1080}
          style={{ width: '100%', height: 'auto' }}
        /> */}

        <PromotionBannerImage></PromotionBannerImage>
      </div>
      {/* </Slider> */}

      <div className="lg:px-32 xl:px-52 md:px-24 px-2 mt-10 lg:mt-14 max-w-[1600px] mx-auto">
        <div className="container mx-auto">
          <PromotionContent />
        </div>
      </div>
    </div>
  );
};

export default Voucher;
