import SupportCenterUpdated from '@/components/Support/SupportCenter/SupportCenterUpdated';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
export const metadata = {
  title: 'Tashus Assistance Hub| Tashus Support Center',
  description: `Find expert assistance and solutions at Tashus Assistance Hub. Our dedicated team is committed to providing seamless support for all your queries and needs. Get in touch today!`,
  alternates: {
    canonical: `${DOMAIN}/support/support-center/general?from=general`,
  },
};

const SupportCenterPage = () => {
  return (
    <div className="lg:px-32 xl:px-52 md:px-24 px-2  max-w-[1600px] mx-auto mb-10">
      {/* <SupportCenter /> */}
      <SupportCenterUpdated />
    </div>
  );
};

export default SupportCenterPage;
