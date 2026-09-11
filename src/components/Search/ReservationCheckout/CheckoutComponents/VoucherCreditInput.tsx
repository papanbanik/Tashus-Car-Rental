import React, { HTMLInputTypeAttribute } from 'react';
import Image from 'next/image';
import TextField from '@mui/material/TextField';

interface VoucherCreditInputProps {
  imageAlt: string;
  imageSrc: string;
  label: string;
  title: string;
  inputId: string;
  inputName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue?: string;
  inputType?: HTMLInputTypeAttribute;
}

const VoucherCreditInput: React.FC<VoucherCreditInputProps> = ({
  imageAlt,
  imageSrc,
  label,
  title,
  inputId,
  inputName,
  onChange,
  inputValue,
  inputType,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent typing of negative sign
    if (inputType === 'number' && (e.key === '-' || e.key === 'e' || e.key === '+')) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (inputType === 'number') {
      // Allow only numbers with up to 2 decimal places
      const regex = /^\d+(\.\d{0,2})?$/;
      if (regex.test(value) || value === '') {
        onChange(e); // Call the parent onChange only if valid
      }
    } else {
      onChange(e); // For other input types, call onChange directly
    }
  };

  return (
    <div className="flex w-full gap-2">
      <div className="flex items-center mt-4">
        <div className="flex">
          <Image alt={imageAlt} src={imageSrc} width={25} height={25} />
        </div>
        <div className="whitespace-nowrap">{title}</div>
      </div>
      <div className="flex">
        <TextField
          id={inputId}
          name={inputName}
          type={inputType}
          size="small"
          label={label}
          variant="standard"
          onChange={handleChange}
          value={inputValue}
          className="m-0"
          InputProps={{
            inputProps: {
              min: inputType === 'number' ? 0 : undefined,
              step: '0.01', // Allows decimal inputs without warnings
              inputMode: inputType === 'number' ? 'decimal' : undefined, // Allows decimal inputs on mobile
              onKeyDown: inputType === 'number' ? handleKeyDown : undefined, // Restrict negative numbers
            },
          }}
        />
      </div>
    </div>
  );
};

export default VoucherCreditInput;
