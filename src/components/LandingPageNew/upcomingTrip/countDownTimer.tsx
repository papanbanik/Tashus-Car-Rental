import { calculateLiveDuration } from '@/utils/Functions/dateTimeCommonFn';
import { dayjsUtc, getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetTime: Date;
}

interface TimeBoxProps {
  label: string;
  value: number | string;
}

interface TimeCount {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime }) => {
  const [timeCount, setTimeCount] = useState<TimeCount>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimeCount = () => {
      const currentTime = dayjs();
      const utcCountStartTime = getPickerTimeStringInUtc(currentTime, true);
      const duration = calculateLiveDuration(utcCountStartTime?.formattedTimeDayObj, dayjsUtc(targetTime));

      // Log to inspect the duration format
      // console.log('Duration:', duration);

      // Check if the duration contains '|' (the expected format for days and time)
      if (typeof duration === 'string' && duration.includes('|')) {
        const [daysPart, timePart] = duration.split('|').map((part) => part.trim());

        const days = parseInt(daysPart.replace('days', '').trim());
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        setTimeCount({ days, hours, minutes, seconds });
      } else if (typeof duration === 'string' && duration.match(/\d{2}:\d{2}:\d{2}/)) {
        // Handle the case where duration is in the format 'HH:mm:ss'
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        setTimeCount({ days: 0, hours, minutes, seconds });
      } else {
        // Handle error case if duration is not in the expected format
        console.error('Invalid duration format:', duration);
        // console.log(timeCount);

        // Set fallback values in case of error
        setTimeCount({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimeCount(); // Initial calculation
    const timer = setInterval(updateTimeCount, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [targetTime]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-0.5 text-center mt-1">
        <TimeBox label="Days" value={timeCount.days} />
        <span className="text-lg font-bold text-gray-500">:</span>
        <TimeBox label="Hours" value={timeCount.hours} />
        <span className="text-lg font-bold text-gray-500">:</span>
        <TimeBox label="Minutes" value={timeCount.minutes} />
        <span className="text-lg font-bold text-gray-500">:</span>
        <TimeBox label="Seconds" value={timeCount.seconds} />
      </div>
    </div>
  );
};

const TimeBox: React.FC<TimeBoxProps> = ({ label, value }) => {
  const formattedValue = typeof value === 'number' && value < 10 ? `0${value}` : value;

  return (
    <div className="flex flex-col items-center w-16 mb-1">
      <div className="bg-[#800080] text-white font-bold text-md py-1 px-1 rounded-md shadow-md">{formattedValue}</div>
      <span className="text-sm font-medium text-gray-500 mt-0.5">{label}</span>
    </div>
  );
};

export default CountdownTimer;
