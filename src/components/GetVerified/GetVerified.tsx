import HowItWorks from './HowItWorks';
import LandingVerification from './Verification/LandingVerification';
import VerificationFAQ from './VerificationFAQ';
import WhyChoose from './WhyChoose';

const GetVerified = () => {
  return (
    <div>
      <LandingVerification />
      <WhyChoose />
      <HowItWorks />
      <VerificationFAQ />
    </div>
  );
};

export default GetVerified;
