import CarInformation from '@/components/CarListing/CarInformation/CarInformation';

const EditVehicleInfo = () => {
  return (
    <div className="mt-5 lg:mt-0">
      <CarInformation isEdit={true}></CarInformation>
    </div>
  );
};

export default EditVehicleInfo;
