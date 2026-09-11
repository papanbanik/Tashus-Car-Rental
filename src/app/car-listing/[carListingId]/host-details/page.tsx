import CarGuidelines from '@/components/CarListing/CarGuidelines/CarGuidelines';

export const metadata = {
  title: 'Guidelines | Tashus Vehicle Listing',
  description: '',
};

const HostDetails = () => {
  return (
    <div>
      {/* <OwnerInformation></OwnerInformation> */}
      <CarGuidelines />
    </div>
  );
};

export default HostDetails;
