import AccountVerify from '@/components/Verification/AccountVerify';

export const metadata = {
  title: 'Verification Step | Verify Your Account in Tashus Car Rental Platform',
};

const DynamicVerifyAccount = () => {
  return (
    <div className="container mx-auto p-4">
      <AccountVerify />
    </div>
  );
};

export default DynamicVerifyAccount;
