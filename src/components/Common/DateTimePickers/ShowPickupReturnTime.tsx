import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Dayjs } from 'dayjs';
import Image from 'next/image';

export interface IShowPickupReturnTime {
  startDate: string | Date | Dayjs;
  endDate: string | Date | Dayjs;
  hideText?: boolean;
  itemWhite?: boolean;
}

const ShowPickupReturnTime = ({ startDate, endDate, hideText, itemWhite }: IShowPickupReturnTime) => {
  return (
    <div className="flex justify-start items-center md:gap-2">
      {/* <EnabledFromTo className="text-4xl" /> */}

      <div className="flex justify-center">
        <Image
          src="/icons/FromTo/EnabledFromTo.svg"
          alt="FromTo"
          width={90}
          height={70}
          // className="object-cover rounded-lg w-auto md:h-8 h-8 m-1 mr-2 lg:mr-0"
          className={`object-cover rounded-lg w-auto md:h-8 h-8 m-1 mr-2 lg:mr-0 ${itemWhite ? ' filter invert brightness-0' : ''}`}
        />
        {/* <Image src="/icons/FromTo/EnabledFromTo.svg" alt="FromTo" width={300} height={200} className="object-cover rounded-lg w-auto h-auto m-1" /> */}
      </div>

      <div className={`flex  lg:gap-4 md:gap-2 gap-1 ${itemWhite ? 'text-white' : ''}`}>
        <div className={`${hideText ? 'md:block hidden' : ''}`}>
          <p className="m-0 text-xs md:text-sm ">From</p>
          <p className="m-0 text-xs md:text-sm">To</p>
        </div>
        <div className="font-bold">
          <p className="m-0 text-xs md:text-sm ">{formatFullDateTimeUtc(startDate)}</p>
          <p className="m-0 text-xs md:text-sm ">{formatFullDateTimeUtc(endDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowPickupReturnTime;
