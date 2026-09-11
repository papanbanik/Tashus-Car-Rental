import React, { useState } from 'react';
import { PriceDataPoint, PriceRange } from './types';
import { FaCarAlt } from 'react-icons/fa';

interface HistogramProps {
  data: PriceDataPoint[];
  currentRange: PriceRange;
  maxCount: number;
}

export function Histogram({ data, currentRange, maxCount }: HistogramProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="relative flex items-end h-32 gap-1 mb-4 mx-3">
      {data.map((point, index) => {
        const height = (point.count / maxCount) * 100;

        const isInRange =
          (point.price >= currentRange.min && point.price <= currentRange.max) ||
          (point.endPrice >= currentRange.min && point.endPrice <= currentRange.max);

        return (
          <div
            key={index}
            className="flex-1 rounded-t-md transition-colors duration-300 ease-in-out relative"
            style={{
              height: `${height}%`,
              backgroundColor: isInRange ? '#800080' : '#E5E7EB',
            }}
            onMouseEnter={() => setHoveredBar(index)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            {/* Tooltip */}
            {hoveredBar === index && (
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow z-10"
                style={{ zIndex: 10 }}
              >
                <FaCarAlt className="text-sm" />
                <span>{point.count}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
