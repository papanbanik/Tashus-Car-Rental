'use client';
import Link from 'next/link';
import Tashus404 from '../../../public/Images/Tashus404_new.svg';

const Custom404 = () => {
  return (
    <>
      <section className="bg-[#f0f2ee] ">
        <div className="flex flex-col items-center justify-center h-screen px-4 lg:px-0 pb-20">
          {/* Responsive image with max width */}
          <Tashus404 className="w-full max-w-md lg:max-w-lg" width="600" height="400" />

          {/* Heading with responsive font size */}
          <p className="text-[#939393] text-2xl lg:text-4xl font-semibold lg:mt-4 mt-0 text-center">Oops! Page Not Found</p>

          {/* Description with responsive max-width and font size */}
          <p className="text-[#939393] text-sm lg:text-base max-w-[300px] sm:max-w-[500px] lg:max-w-[700px] text-center mt-0">
            {`We're sorry, but the page you're looking for isn't here. Don't worry, we'll help you find what you need. Let's get back on track!`}
          </p>

          {/* Responsive button */}
          <Link href="/" className="no-underline">
            <div className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark cursor-pointer text-sm sm:text-base ">
              Go Back Home
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Custom404;
