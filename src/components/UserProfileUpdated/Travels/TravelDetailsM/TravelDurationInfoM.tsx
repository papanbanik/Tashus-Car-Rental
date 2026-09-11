import { useTravelContext } from '@/context/TravelProvider';
import { LuCalendarCheck2 } from 'react-icons/lu';
import { TbCalendarTime } from 'react-icons/tb';

interface ITravelDurationInfo {
  hideText?: boolean;
}

const TravelDurationInfoM = ({ hideText }: ITravelDurationInfo) => {
  const { updatedTravelData } = useTravelContext();

  return (
    <>
      <div className="flex md:gap-4 gap-2">
        <div className={`font-bold flex flex-col justify-around items-start sm:flex-none`}>
          <div className="flex">
            <TbCalendarTime className="text-primary md:text-xl text-md" />
          </div>
          <div className="flex">
            <LuCalendarCheck2 className="text-primary md:text-xl text-md" />
          </div>
        </div>
        <div className="flex flex-col justify-around items-start sm:flex-none">
          <p className="m-0 flex md:gap-1 md:text-base text-xs">
            <span className={`${hideText ? 'md:block hidden' : ''}`}>{'Duration: '}</span>
            <span className="font-bold">{updatedTravelData?.totalDurationText}</span>
          </p>
          <p className="m-0 flex md:gap-1 md:text-base text-xs">
            <span className={`${hideText ? 'md:block hidden' : ''}`}>{'Reservation ID: '}</span>{' '}
            <span className="font-bold">{updatedTravelData?.reservationId}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default TravelDurationInfoM;
