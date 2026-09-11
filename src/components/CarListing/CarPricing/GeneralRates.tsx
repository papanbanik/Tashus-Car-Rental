import React from 'react';
import { Typography, TextField, Box, Grid, InputAdornment } from '@mui/material';
import { HookFormComponentProps } from '@/types/componentTypes';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

const GeneralRates = ({ register, watch, formState }: HookFormComponentProps) => {
  const { errors, isDirty, touchedFields, isValid, isSubmitting } = formState;
  return (
    <Grid container className="p-0" rowGap={1}>
      <Grid className="p-0 justify-start items-center" container item xs={12} sm={12} md={12} lg={6} xl={6}>
        <Grid item className="flex items-center gap-3" xs={6} sm={6} md={6} lg={6} xl={4}>
          <p className="font-semibold text-lg">Daily Rates</p>
          {/* <AiOutlineExclamationCircle className="text-gray-400" size={22} /> */}
        </Grid>
        <Grid item className="" xs={5} sm={6} md={4} lg={4} xl={4}>
          <TextField
            size="small"
            label="Rate"
            value={watch('dailyRates.amount')}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('dailyRates.amount') ? '' : '#800080'}`,
              },
              '& .MuiOutlinedInput-root': {
                paddingRight: 0,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('dailyRates.amount') ? '' : '#800080'}` },
            }}
            {...register('dailyRates.amount', {
              required: true,
              pattern: {
                value: /^\d{1,5}(\.\d{1,2})?$/, //includes positive digits (0-9), supports decimal, 5 characters before . and 2 after decimal
                message: 'Invalid amount',
              },
              validate: (value) => value > 0 || '0 is invalid',
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment className="bg-gray-200 px-2 m-0 h-10 rounded-e-md max-h-10" position="end">
                  <p>AUD</p>
                </InputAdornment>
              ),
            }}
            error={!!errors?.dailyRates?.amount}
            helperText={errors?.dailyRates?.amount.message}
          />
        </Grid>
      </Grid>
      <Grid className="p-0 justify-start md:justify-end items-center" item container xs={12} sm={12} md={12} lg={6}>
        <Grid item className="flex items-center gap-3" xs={6} sm={6} md={6} lg={6} xl={4}>
          <p className="font-semibold text-lg p-0">Hour Rates</p>
          {/* <AiOutlineExclamationCircle className="text-gray-400" size={22} /> */}
        </Grid>
        <Grid item className="" xs={5} sm={6} md={6} lg={4} xl={4}>
          <TextField
            size="small"
            label="Rate"
            value={watch('hourlyRates.amount')}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('hourlyRates.amount') ? '' : '#800080'}`,
              },
              '& .MuiOutlinedInput-root': {
                paddingRight: 0,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('hourlyRates.amount') ? '' : '#800080'}` },
            }}
            {...register('hourlyRates.amount', {
              required: true,
              pattern: {
                value: /^\d{1,5}(\.\d{1,2})?$/, //includes positive digits (0-9), supports decimal, 5 characters before . and 2 after decimal
                message: 'Invalid amount',
              },
              validate: (value) => value > 0 || '0 is invalid',
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-e-md" position="end">
                  <p>AUD</p>
                </InputAdornment>
              ),
            }}
            error={!!errors?.hourlyRates?.amount}
            helperText={errors?.hourlyRates?.amount.message}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GeneralRates;
