'use client';

import useFeesData from '@/hooks/fees-data/useFeesData';
import { useEffect, useState } from 'react';

type FeeItem = {
  item: string;
  cost: string;
  remarks: string;
};

interface FeeCategory {
  items: FeeItem[];
  category: string;
  icon: JSX.Element | null;
}

export default function FeesPage() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const { sortedFeesData: rawFeesData, loading, error } = useFeesData();
  const [sortedFeesData, setSortedFeesData] = useState<FeeCategory[]>([]);

  useEffect(() => {
    if (rawFeesData) {
      // Sort categories alphabetically
      const sortedCategories = [...rawFeesData].sort((a, b) => a.category.localeCompare(b.category));

      // Sort items within each category alphabetically
      const sortedWithItems = sortedCategories.map((category) => ({
        ...category,
        items: [...category.items].sort((a, b) => a.item.localeCompare(b.item)),
      }));

      setSortedFeesData(sortedWithItems);
    }
  }, [rawFeesData]);

  const toggleCategory = (index: number) => {
    setExpandedCategories((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-6 space-y-6 mx-1 lg:mx-0">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-start mb-4 block">Why These Costs Matter?</h2>
        <p className="text-base md:text-[16px] text-start leading-relaxed">
          At Tashus, we provide reliable service and transparent pricing, ensuring you get the best value for quality vehicles.
          <strong> Additional charges will only apply if rental terms are not followed or if extra services are required,</strong> maintaining
          fairness and clarity throughout your experience.
        </p>
      </div>

      <h1 className="text-2xl font-bold mt-8">Tashus Rental Fees</h1>

      {sortedFeesData.map((category, index) => (
        <div key={index} className="rounded-md shadow-sm bg-white overflow-hidden">
          <button
            className="flex items-center justify-between w-full px-4 py-3 text-left font-bold text-lg bg-[#efe0ef] hover:bg-[#D1A5D1]  border-none"
            onClick={() => toggleCategory(index)}
          >
            <div className="flex items-center gap-3">
              {category.icon}
              {category.category}
            </div>
            <span>{expandedCategories.includes(index) ? '−' : '+'}</span>
          </button>
          {expandedCategories.includes(index) && (
            <table className="w-full text-left table-fixed border-t">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b border-gray-300 w-1/2" style={{ borderBottom: '1px solid #8A909B' }}>
                    Items
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 w-1/2" style={{ borderBottom: '1px solid #8A909B' }}>
                    Cost
                  </th>
                  {/* <th className="px-4 py-2 border-b border-gray-300 w-2/10" style={{ borderBottom: '1px solid #8A909B' }}>
                    Remarks
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {category.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-gray-100'}>
                    <td className="px-4 py-2 border-b w-1/4">{item.item}</td>
                    <td className="px-4 py-2 border-b w-2/4">{item.cost || ''}</td>
                    {/* <td className="px-4 py-2 border-b w-1/4">{item.remarks}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
