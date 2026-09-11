import { Avatar } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FaCar, FaLocationDot } from 'react-icons/fa6';
import { IoMdSettings, IoMdTime } from 'react-icons/io';
import { MdEvent } from 'react-icons/md';

interface CarItem {
  photos: {
    coverPhotoUrl: string;
  };
  car: {
    make: string;
    model: string;
    year: number;
    seats: number;
    transmissionType: string;
  };
  pickupAddress: {
    street: string;
    city: string;
  };
  rates: {
    hourlyRates: {
      amount: number;
      currency: string;
    };
    dailyRates: {
      amount: number;
      currency: string;
    };
  };
}

const DynamicIcon = ({ item }: { item: any }) => {
  const [locationIconSize, setLocationIconSize] = useState<number>(1); // Default size
  const descriptionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check the number of lines in the description
    const lines = descriptionRef.current ? descriptionRef.current.clientHeight / 16 : 0; // Assuming 16px line height

    // Adjust icon size based on the number of lines
    setLocationIconSize(lines > 1 ? 1.5 : 1); // Change the size values as needed
  }, [item]);

  return (
    <>
      <div className="text-center">
        <Avatar src={item.photos.coverPhotoUrl} alt="Car" className="w-28 h-28 object-cover rounded-full mx-auto mb-1" />
        <h2 className="text-lg font-semibold my-0">
          {item?.car?.make} {item?.car?.model} {item?.car?.year}
        </h2>
      </div>

      <div className="mt-1">
        <p className="text-sm my-0 flex items-center">
          <FaLocationDot
            style={{
              color: '#800080',
              fontSize: `${locationIconSize}rem`,
              marginRight: '0.25rem',
              verticalAlign: 'middle',
            }}
          />{' '}
          <span ref={descriptionRef}>
            {item?.pickupAddress?.city}, {item?.pickupAddress?.state}, {item?.pickupAddress?.country}
            {/* {item.pickupAddress.street}, {item.pickupAddress.city} */}
          </span>
        </p>
      </div>
      {/* <---------------> */}

      <div className="flex flex-row justify-between ">
        <div className="mt-2 mr-2">
          <h3 className="text-md font-semibold my-0">Rates:</h3>
          <p className="text-sm my-0 flex items-center">
            <IoMdTime className="text-primary mr-2 text-base " /> Hourly:{' '}
            <b>
              {item?.rates?.hourlyRates?.amount} {item?.rates?.hourlyRates?.currency}
            </b>
          </p>
          <p className="text-sm my-0 flex items-center">
            <MdEvent className="text-primary mr-2 text-base" /> Daily:{' '}
            <b>
              {item?.rates?.dailyRates?.amount} {item?.rates?.dailyRates?.currency}
            </b>
          </p>
        </div>
        {/* <Divider orientation="vertical" flexItem style={{ height: '50%', position: 'absolute', bottom: 0 }} /> */}
        <div className="mt-2">
          <h3 className="text-md font-semibold my-0">Car Details:</h3>
          <p className="text-sm my-0 flex items-center">
            <FaCar className="text-primary mr-2 text-base" />
            Seats: <b>{item?.car?.seats}</b>
          </p>
          <p className="text-sm my-0 flex items-center">
            <IoMdSettings className="text-primary mr-2 text-base" /> Type: <b>{item?.car?.transmissionType}</b>
          </p>
        </div>
      </div>
    </>
  );
};

export default DynamicIcon;
