import { howItWorks } from '@/utils/Lists/getVerified';

const HowItWorks = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center pb-5">
          <span className="text-center text-2xl lg:text-4xl font-bold pb-2">How It Works?</span>
          <span className="w-full lg:w-2/3 text-center">{`Discover the simple steps to renting a car with Tashus. Our streamlined process ensures a hassle-free experience from start to finish. Follow these easy steps and hit the road with ease`}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 w-full my-2">
          {howItWorks.map((step: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
              <div className="w-full h-full flex items-center justify-center my-4">
                <span className="text-primary text-xl md:text-4xl font-bold">{step.id}</span>
              </div>
              <div className="w-full h-full flex items-center justify-center my-2">
                <span className="text-md  text-center font-bold ">{step.title}</span>
              </div>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs  text-center ">{step.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
