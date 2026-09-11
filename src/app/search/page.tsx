// import Search from '@/components/Search/Search';

import SearchUpdated from '@/components/Search/SearchUpdated/SearchUpdated';

export const metadata = {
  title: 'Tashus | Find Cars in Sydney, Melbourne, Brisbane, and More',
  description:
    'Search for cars in top cities of Australia including Sydney, Melbourne, and Brisbane and more. Explore car rental options in New South Wales and other regions. Book a car with Tashus today.',
};

const CarSearch = () => {
  return (
    // <Suspense fallback={<p>Loading feed...</p>}>
    <div className=" min-h-screen lg:px-30 xl:px-52 md:px-24 px-2  max-w-[1600px] mx-auto">
      {/* <Search></Search> */}
      <SearchUpdated></SearchUpdated>
    </div>

    // </Suspense>
  );
};

export default CarSearch;
