'use client';

import SingleTopic from '@/components/Help/singleTopic/SingleTopic';

const SingleTopicPage = () => {
  // const params = useParams();
  // const dynamicId = params['topic-id'];
  // console.log('params', params['topic-id']);

  return (
    <div className="md:px-44 px-8 mb-24 relative  ">
      <div className={`w-full md:flex flex-col  `}>
        <SingleTopic />
      </div>
    </div>
  );
};

export default SingleTopicPage;
