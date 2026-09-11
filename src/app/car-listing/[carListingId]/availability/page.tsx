import CarAvailability from '@/components/CarListing/CarAvailability/CarAvailability';

export const metadata = {
  title: 'Availability | Tashus Vehicle Listing',
  description: '',
};

const HostCarAvailability = () => {
  return (
    <div>
      <CarAvailability></CarAvailability>
    </div>
  );
};

export default HostCarAvailability;
