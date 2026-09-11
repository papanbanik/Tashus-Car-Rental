'use client';

import SearchArticleResult from '@/components/Help/searchArticles/SearchResult';

const SearchArticlePage = () => {
  return (
    <div className="md:px-44 px-8 mb-24 relative  ">
      <div className={`w-full md:flex flex-col  `}>
        <SearchArticleResult />
      </div>
    </div>
  );
};

export default SearchArticlePage;
