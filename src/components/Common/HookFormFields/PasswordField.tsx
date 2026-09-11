'use client';

import { PasswordFieldProps } from '@/types/componentTypes';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const PasswordField = ({ name, label, register, minLength, pattern, validate, errors, size }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl fullWidth variant="outlined" size={size}>
      <InputLabel className={`${errors ? 'text-error' : ''}`} htmlFor={`outlined-adornment-${name}`}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${name}`}
        type={showPassword ? 'text' : 'password'}
        {...register(name, {
          minLength: minLength,
          pattern: pattern,
          validate: validate,
        })}
        error={!!errors}
        autoComplete="off"
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      <FormHelperText className="text-error ml-0">{errors?.message}</FormHelperText>
    </FormControl>
  );
};

export default PasswordField;
