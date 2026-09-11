'use client';
import { CommonOTPFieldProps } from '@/types/componentTypes';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';

const CommonOTPField = ({
  control,
  registerName,
  onChange,
  title,
  required = false,
  isVerifying,
  isSuccess,
  separatorShow,
  separatorValue,
  otpDigit = Array.from({ length: 5 }, () => ''),
  handleOnClick,
  timer,
}: CommonOTPFieldProps) => {
  const handleOtpChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const truncatedValue = inputValue.slice(0, 1);
    onChange && onChange(index, truncatedValue);
  };
  return (
    <Controller
      name={registerName}
      control={control}
      rules={{ required: required }}
      defaultValue={0}
      render={({ field }) => (
        <div className="flex items-center justify-center">
          <h2 className="text-lg md:text-xl font-bold mb-4">{title ?? 'Verify OTP'}</h2>

          <div className="flex items-center justify-between mb-4">
            {otpDigit.map((digit, index) => (
              <React.Fragment key={index}>
                <TextField
                  id={`otp-input-${index}`}
                  type="text"
                  size="small"
                  value={digit}
                  onChange={handleOtpChange(index)}
                  inputProps={{ maxLength: 1 }}
                  style={{ borderColor: '#800080' }}
                />
                {separatorShow && <>{index < 4 && <span className="text-center">{separatorValue ?? '-'}</span>}</>}
              </React.Fragment>
            ))}
          </div>

          {isVerifying && <BeatLoader color="#800080" size={10} />}

          {isSuccess && (
            <p className={`text-sm mb-2 ${isSuccess ? 'error' : 'success'}`}>
              {isSuccess ? 'Verification failed. Please try again.' : 'Verification successful!'}
            </p>
          )}

          <span className="text-gray-600 text-sm mb-4">
            {timer > 0 ? `Resend OTP in ${timer} seconds` : "Didn't get the OTP? "}
            {timer <= 0 && (
              <span className="font-bold text-success underline cursor-pointer" onClick={handleOnClick}>
                Resend the OTP
              </span>
            )}
          </span>
        </div>
      )}
    />
  );
};

export default CommonOTPField;
