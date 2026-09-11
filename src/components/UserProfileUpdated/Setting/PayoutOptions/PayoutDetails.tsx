'use client';
import { HookFormComponentProps } from '@/types/componentTypes';
import { FormControl, FormHelperText, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
interface PayoutDetailsProps extends HookFormComponentProps {
  isEditing: boolean;
}
const PayoutDetails = ({ register, watch, formState, isEditing }: PayoutDetailsProps) => {
  const [showBsb, setShowBsb] = useState<boolean>(false);
  const [showAccNumber, setShowAccNumber] = useState<boolean>(false);
  const { errors } = formState;
  const handleMouseDownNumber = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <div className="grid md:grid-cols-[auto,1fr] mt-4 md:gap-x-24 w-full">
      <div className="md:flex items-center">
        <span className="text-base">Account Name</span>
      </div>
      <div className="mb-2">
        <FormControl fullWidth variant="outlined" size="small">
          <OutlinedInput
            id="outlined-adornment-password"
            disabled={!isEditing}
            {...register('accountName', { required: true })}
            // defaultValue={watch('accountName')}
            value={watch('accountName') || ''}
            error={!!errors.accountName}
            // helperText={errors.accountName && errors.accountName.message}
          />
        </FormControl>
      </div>
      <div className="md:flex items-center">
        <span className="text-base">BSB</span>
      </div>
      <div className="mb-2">
        <FormControl fullWidth variant="outlined" size="small">
          <OutlinedInput
            id="outlined-adornment-bsb"
            disabled={!isEditing}
            type={showBsb ? 'text' : 'password'}
            inputProps={{
              pattern: '[0-9]*',
              inputMode: 'numeric',
              title: 'Please enter only numbers.',
              onInput: (event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
              },
            }}
            {...(register('bsb', {
              required: true,
              pattern: {
                value: /^[0-9]*$/,
                message: 'Please enter only numbers.',
              },
              minLength: {
                value: 6,
                message: 'The BSB must be at least 6 digits long.',
              },
              maxLength: {
                value: 6,
                message: 'The BSB cannot exceed 6 digits.',
              },
            }) as any)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowBsb(!showBsb)}
                  onMouseDown={handleMouseDownNumber}
                  edge="end"
                >
                  {showBsb ? <FaEye /> : <FaEyeSlash />}
                </IconButton>
              </InputAdornment>
            }
            // error={!!errors.bsb}
            // helperText={errors?.bsb?.message}
          />
          <FormHelperText className="text-error ml-0">{errors?.bsb?.message}</FormHelperText>
        </FormControl>
      </div>
      <div className=" md:flex items-center">
        <span className="text-base">Account Number</span>
      </div>
      <div>
        <FormControl fullWidth variant="outlined" size="small">
          <OutlinedInput
            id="outlined-adornment-accountNumber"
            disabled={!isEditing}
            type={showAccNumber ? 'text' : 'password'}
            inputProps={{
              pattern: '[0-9]*',
              inputMode: 'numeric',
              title: 'Please enter only numbers.',
              onInput: (event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
              },
            }}
            {...(register('accountNumber', {
              required: true,
              pattern: {
                value: /^[0-9]*$/,
                message: 'Please enter only numbers.',
              },
              minLength: {
                value: 6,
                message: 'The Account Number must be at least 6 digits.',
              },
              maxLength: {
                value: 12,
                message: 'The Account Number cannot exceed 12 digits.',
              },
            }) as any)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowAccNumber(!showAccNumber)}
                  onMouseDown={handleMouseDownNumber}
                  edge="end"
                >
                  {showAccNumber ? <FaEye /> : <FaEyeSlash />}
                </IconButton>
              </InputAdornment>
            }
            // error={!!errors.accountNumber}
            // helperText={errors.accountNumber && errors.accountNumber.message}
          />
          <FormHelperText className="text-error ml-0">{errors?.accountNumber?.message}</FormHelperText>
        </FormControl>
      </div>
    </div>
  );
};

export default PayoutDetails;
