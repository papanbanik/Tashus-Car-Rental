'use client';
import { leftElements, rightElements } from '@/utils/Lists/getVerified';
import Image from 'next/image';

const WhyChoose = () => {
  return (
    <div className="flex justify-center py-10 ">
      <div className="w-full lg:w-2/3 flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center pb-5">
          <span className="text-black text-center text-2xl lg:text-4xl font-bold my-2">
            Why Choose <span className="text-primary">Tashus!</span>
          </span>
          <span className="w-full lg:w-2/3 text-center">{`Explore why Tashus is your best choice for car rentals, offering a wide selection, competitive pricing, excellent support, and convenient locations.`}</span>
        </div>
        <div className="grid lg:grid-cols-3">
          {/* Left elements */}
          <div className="flex flex-col items-center mt-0 lg:mt-16">
            {leftElements.map((element, index) => (
              <div className="flex md:mb-12  items-center px-6 py-2 " key={index}>
                <div className="flex flex-col mr-2">
                  <span className="text-primary md:text-right text-base font-bold mb-2">{element.title}</span>
                  <span className=" max-md:text-start text-sm text-end">{element.description}</span>
                </div>
                <div>
                  <Image src={element.icon} alt={element.alt} width={100} height={100} />
                </div>
              </div>
            ))}
          </div>

          {/* Middle image */}
          <div className="col-span-1 flex items-center justify-center lg:flex max-[1100px]:hidden">
            <div className="p-6">
              <Image
                src="/Informative/Tashus-why-choose-us.svg"
                alt="Join Tashus, an expanding network of car rental service providers"
                width={50}
                height={50}
                layout="responsive"
              />
            </div>
          </div>

          {/* Right elements */}
          <div className="flex flex-col items-center sm:pt-2 md:mt-0 lg:mt-20">
            {rightElements.map((element, index) => (
              <div className="flex items-start mb-5 md:mb-12" key={index}>
                <div>
                  <Image src={element.icon} alt={element.alt} width={100} height={100} />
                </div>
                <div className="flex flex-col mr-2">
                  <span className="text-primary text-base font-bold mb-2">{element.title}</span>
                  <span className="text-start text-sm">{element.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
