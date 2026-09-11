import InsurancePolicy from '@/components/CarListing/InsurancePolicy/InsurancePolicy';

export const metadata = {
  title: 'Insurance Policy | Tashus Vehicle Listing',
  description: '',
};

const HostCarInsurance = () => {
  return (
    <div>
      <InsurancePolicy isEdit={false}></InsurancePolicy>
    </div>
  );
};

export default HostCarInsurance;
