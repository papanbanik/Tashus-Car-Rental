'use client';
import React from 'react';
import Image from 'next/image';

const cardData = [
  {
    title: 'Step 1',
    description: 'Step 1',
    smallDescription: 'In publishing and graphic design, Lorem ipsum is a placeholder a  ',
    imageUrl: '/Images/Tashus-login-3.png',
  },
  {
    title: 'Step 2',
    description: 'Step 2',
    smallDescription: 'In publishing and graphic design, Lorem ipsum is a placeholder a ',
    imageUrl: '/Images/Tashus-login-3.png',
  },
  {
    title: 'Step 3',
    description: 'Step 3',
    smallDescription: 'In publishing and graphic design, Lorem ipsum is a placeholder a ',
    imageUrl: '/Images/Tashus-login-3.png',
  },
  {
    title: 'Step 4',
    description: 'Step 4',
    smallDescription: 'In publishing and graphic design, Lorem ipsum is a placeholder a',
    imageUrl: '/Images/Tashus-login-3.png',
  },
];

function HowItWorksComponent() {
  return (
    <div className="mb-48">
      <p className="text-center text-[18px] mb-0">How does it work?</p> {/* Added a smaller bottom margin */}
      <p className="text-center font-semibold text-[32px] mb-4 mt-0">In simple 4 Easy Steps</p> {/* Removed top margin */}
      <div className="relative bg-cover bg-bottom bg-no-repeat h-auto flex justify-center items-end">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto p-4">
          {cardData.map((card, index) => (
            <div
              key={index}
              className={`relative bg-white border border-gray-200 rounded-lg shadow-lg w-full h-[300px] ${index % 2 === 1 ? 'translate-y-32' : ''}`}
            >
              <Image src={card.imageUrl} alt={card.title} width={200} height={100} className="w-full h-2/3 object-cover rounded-t-lg" />
              <div className="p-4 h-1/3 flex flex-col justify-center">
                <p className="text-sm text-gray-600 mb-0 mt-0">{card.description}</p>
                <p className="text-xs text-gray-400 mt-1">{card.smallDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorksComponent;
