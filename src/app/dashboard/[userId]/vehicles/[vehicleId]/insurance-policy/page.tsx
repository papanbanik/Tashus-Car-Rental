import InsurancePolicy from '@/components/CarListing/InsurancePolicy/InsurancePolicy';

const EditVehicleInsurance = () => {
  return <div className="mt-5 lg:mt-0">{<InsurancePolicy isEdit={true}></InsurancePolicy>}</div>;
};

export default EditVehicleInsurance;
