import Image from 'next/image';
import UserVerification from './UserVerification';

const LandingVerification = () => {
  return (
    <div className="flex items-center justify-center md:py-10">
      <div className="lg:w-1/2">
        <UserVerification />
      </div>
      <div className="hidden lg:block">
        <div className="flex items-center justify-center">
          <Image
            src="/Home/VerifyStepper/VerifyGroup.svg"
            alt="Picture Verify"
            className="max-w-full rounded-lg object-cover"
            width={418}
            height={519}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingVerification;
