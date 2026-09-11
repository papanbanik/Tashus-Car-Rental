'use client';
import { HowItWorksList } from '@/types/landingPageTypes';
import { howItWorksList } from '@/utils/Lists/landingPage';
import Image from 'next/image';
import Link from 'next/link';

const HowItWorks = () => {
  return (
    <div className="mt-24 mb-48">
      <div className="flex flex-col justify-center my-4">
        <span className="text-center text-lg text-primary">How does it work?</span>
        <span className="text-center font-semibold text-3xl">
          In simple <span className="text-primary">4 Easy</span> Steps
        </span>
      </div>
      <div className="relative bg-cover bg-bottom bg-no-repeat h-auto flex justify-center items-end">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto p-4">
          {howItWorksList.map((card: HowItWorksList, index: number) => (
            <Link href={card.url || '#'} key={index} className="no-underline">
              <div
                className={`relative bg-white border border-gray-200 rounded-lg shadow-md shadow-secondary w-full h-[350px] md:h-[300px] ${
                  index % 2 === 1 ? 'translate-y-32' : ''
                }`}
              >
                <Image src={card.imageUrl} alt={card.alt} width={200} height={100} className="w-full h-2/3 object-cover rounded-t-lg" />
                <div className="p-4 h-1/3 flex flex-col justify-center">
                  <span className="text-sm text-left text-gray-600 font-bold">{card.title}</span>
                  <span className="text-xs text-justify tracking-tighter text-gray-400">{card.description}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
