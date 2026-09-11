'use client';
// VerifyOTPModal.tsx

import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import OtpVerificationService from './OtpVerificationService';

interface VerifyOTPModalProps {
  onClose: () => void;
}

const VerifyOTPModal: React.FC<VerifyOTPModalProps> = ({ onClose }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  const handleOtpChange = async (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input box
    if (index < 4 && value !== '') {
      const nextIndex = index + 1;
      document.getElementById(`otp-input-${nextIndex}`)?.focus();
    }

    // Check OTP when the last input box is filled
    if (index === 4 && value !== '') {
      // Set loading state and initiate verification
      setIsVerifying(true);

      try {
        // Call the asynchronous OtpVerificationService
        const result = await OtpVerificationService({ otp: newOtp, onClose });

        // Set the verification result and stop loading
        setVerificationResult(result);
      } catch (error) {
        // Handle error, stop loading, and show an error message
        console.error('Verification failed:', error);
        setVerificationResult('error');
      } finally {
        // Stop the loading animation
        setIsVerifying(false);
      }
    }
  };

  const handleResendClick = () => {
    // Implement resend OTP logic here
    setIsResendDisabled(true);
    setTimer(60);

    // You may trigger OTP resend API call or any other logic here
  };

  const handleCloseClick = () => {
    // Implement close modal logic
    onClose();
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>

      <div className="flex items-center justify-between mb-4">
        {otp.map((digit, index) => (
          <React.Fragment key={index}>
            <input
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-12 text-4xl border-b text-center rounded"
              style={{ borderColor: '#800080' }}
            />
            {index < 4 && <span className="text-center mx-2">-</span>}
          </React.Fragment>
        ))}
      </div>

      {isVerifying && <BeatLoader color="#00BFFF" size={10} />}

      {verificationResult && (
        <p className={`text-sm mb-2 ${verificationResult === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {verificationResult === 'error' ? 'Verification failed. Please try again.' : 'Verification successful!'}
        </p>
      )}

      <p className="text-gray-600 text-sm mb-4">
        {timer > 0 ? `Resend OTP in ${timer} seconds` : "Didn't get the OTP? "}
        {timer <= 0 && (
          <span className="font-bold text-success underline cursor-pointer" onClick={handleResendClick}>
            Resend the OTP
          </span>
        )}
      </p>

      <button className="px-4 py-2 bg-primary text-white rounded-md ml-2" onClick={handleCloseClick}>
        Close
      </button>
    </div>
  );
};

export default VerifyOTPModal;
