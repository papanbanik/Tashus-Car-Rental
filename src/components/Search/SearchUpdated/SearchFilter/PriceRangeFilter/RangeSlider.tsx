import React from 'react';
import { PriceRange } from './types';

interface RangeSliderProps {
  range: PriceRange;
  initialRange: PriceRange;
  onRangeChange: (key: keyof PriceRange) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RangeSlider({ range, initialRange, onRangeChange }: RangeSliderProps) {
  const minPosition = ((range.min - initialRange.min) / (initialRange.max - initialRange.min)) * 100;
  const maxPosition = ((range.max - initialRange.min) / (initialRange.max - initialRange.min)) * 100;

  const adjustedMin = Math.max(initialRange.min, range.min);
  const adjustedMax = Math.min(initialRange.max, range.max);

  // Handle click on the range track
  const handleTrackClick = (e: React.MouseEvent) => {
    const track = e.currentTarget;
    const trackRect = track.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left; // Get click position relative to track
    const newValue = Math.round((clickX / trackRect.width) * (initialRange.max - initialRange.min) + initialRange.min);

    // Decide whether to update min or max based on the distance
    if (Math.abs(newValue - range.min) < Math.abs(newValue - range.max)) {
      onRangeChange('min')({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      onRangeChange('max')({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="relative mt-4 mx-3">
      <style>{`
        .range-input {
          -webkit-appearance: none;
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          z-index: 2;
        }

        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: all;
          width: 20px;
          height: 20px;
          background: #800080;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          margin-top: -10px;
          transition: all 0.2s ease;
          
          /* Add this to move the thumb left by a small value */
          margin-left: -3px; /* Adjust this value to control how far left the thumb moves */
        }

        .range-input::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        }

        .range-input::-moz-range-thumb {
          pointer-events: all;
          width: 20px;
          height: 20px;
          background: #800080;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
          
          /* Add this to move the thumb left by a small value */
          margin-left: -3px; /* Adjust this value to control how far left the thumb moves */
        }

        .range-input::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        }

        .range-track {
          position: relative;
          height: 4px;
          background: #E5E7EB;
          border-radius: 9999px;
          cursor: pointer;
        }

        .range-track-highlight {
          position: absolute;
          height: 100%;
          background: #800080;
          border-radius: 9999px;
          top: 0;
          /* Removed transition for "follow track" animation */
        }
      `}</style>

      <div className="range-track" onClick={handleTrackClick}>
        <div
          className="range-track-highlight"
          style={{
            left: `${minPosition}%`,
            width: `${maxPosition - minPosition}%`,
          }}
        />
      </div>
      <input type="range" min={initialRange.min} max={initialRange.max} value={adjustedMin} onChange={onRangeChange('min')} className="range-input" />
      <input type="range" min={initialRange.min} max={initialRange.max} value={adjustedMax} onChange={onRangeChange('max')} className="range-input" />
    </div>
  );
}
