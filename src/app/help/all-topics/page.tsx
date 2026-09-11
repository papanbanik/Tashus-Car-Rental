import AllTopics from '@/components/Help/allTopics/AllTopicTabs';
import { allMetaData } from '@/utils/Functions/metaData';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;

const pageMetadata = allMetaData?.find((item) => item.route === '/all-topics');
export const metadata = {
  title: pageMetadata?.title ?? 'Tashus | All Topic section for learn more about Tashus',
  description:
    pageMetadata?.description ??
    "Discover a wealth of knowledge on Tashus Car Rental's 'All Topics' page. Dive into the world of seamless ride experiences, expert renting tips, and a comprehensive guide to make the most of your car rental journey",
  keywords: pageMetadata?.keywords ?? '',

  // title: 'Tashus | All Topic section for learn more about Tashus',
  // description: `Discover a wealth of knowledge on Tashus Car Rental's 'All Topics' page. Dive into the world of seamless ride experiences, expert renting tips, and a comprehensive guide to make the most of your car rental journey.`,

  alternates: {
    canonical: `${DOMAIN}/help/all-topics`,
  },
};
type Props = {};

const HelpPageHome = (props: Props) => {
  return (
    <div>
      <AllTopics />
    </div>
  );
};

export default HelpPageHome;
