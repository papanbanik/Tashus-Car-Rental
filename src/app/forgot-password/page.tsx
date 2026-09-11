import ForgotPassword from '@/components/ForgotPassword/ForgotPassword';

export const metadata = {
  title: 'Tashus | Forgot Password Recovery',
  description:
    'Recover your Tashus account password with ease. Follow the steps to reset your password and regain access to your car rental account.',
};

const ForgotPass = () => {
  return (
    <div>
      <ForgotPassword />
    </div>
  );
};

export default ForgotPass;
