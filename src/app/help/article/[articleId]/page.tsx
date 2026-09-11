import SingleArticle from '@/components/Help/singleArticle/SingleArticle';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
export const metadata = {
  title: 'Discover Tashus Articles| Your Source for Travel Insights',
  description: `Explore Tashus Articles for valuable insights on travel, car rental tips, destination guides, and more. Stay informed and make the most of your journeys with our expertly curated content.`,
  alternates: {
    canonical: `${DOMAIN}/help/article/1`,
  },
};

type Props = {};

const SingleArticlePage = (props: Props) => {
  return (
    <div className="md:px-44 px-8 mb-24 relative  ">
      <div className={`w-full md:flex flex-col  `}>
        <SingleArticle />
      </div>
    </div>
  );
};

export default SingleArticlePage;
