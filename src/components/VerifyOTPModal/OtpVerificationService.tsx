interface OtpVerificationServiceProps {
  otp: string[];
  onClose: () => void;
}

const OtpVerificationService = async ({ otp, onClose }: OtpVerificationServiceProps): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulate some asynchronous verification process
    setTimeout(() => {
      const defaultVerificationCode = '12345';
      const enteredOTP = otp.join('');

      if (enteredOTP === defaultVerificationCode) {
        resolve('success');
      } else {
        reject(new Error('Invalid OTP'));
      }
    }, 2000);
  });
};

export default OtpVerificationService;
