'use client';

import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface UpdateReservationOdometerProps {
  isBeforeReservation?: boolean;
  isLoading?: boolean;
  coverUrl: string;
  setCoverUrl: Dispatch<SetStateAction<string>>;
  singleFile: File[];
  setSingleFile: Dispatch<SetStateAction<File[]>>;
  deleteFileList: File[];
  setDeleteFileList: Dispatch<SetStateAction<File[]>>;
}

const UpdateReservationOdometer = ({
  isBeforeReservation,
  isLoading,
  coverUrl,
  setCoverUrl,
  singleFile,
  setSingleFile,
  deleteFileList,
  setDeleteFileList,
}: UpdateReservationOdometerProps) => {
  const { control, setValue, register, watch, formState } = useFormContext();
  const { errors } = formState;

  const commonProps = {
    control,
    coverUrl,
    singleFile,
    setSingleFile,
    setCoverUrl,
    registerName: 'odometerPhoto',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
    singleRequired: false,
    setValue,
  };

  const validateOdometer = (odometerValue: string | number) => {
    const isValid = Number(odometerValue ?? 0) >= 0 && Number(odometerValue ?? 0) <= 300000000;
    return isValid || 'Please provide valid odometer';
  };

  return (
    <div>
      <p className="text-xl font-semibold mb-0">Odometer</p>

      <Typography className="helping_text">
        Please provide the odometer reading {isBeforeReservation ? 'before ' : 'after '} reservation starts
      </Typography>
      <div className="mt-2">
        <TextField
          className="p-0 md:w-1/2 w-full"
          type="number"
          size="small"
          value={watch('odometerValue') || ''}
          label="Odometer value"
          {...register('odometerValue', {
            required: false,
            validate: validateOdometer,
          })}
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingRight: 0,
            },
          }}
          error={!!errors?.odometerValue}
          // helperText={<span className="text-error">{isOdometerInvalid ? 'Provide valid odometer reading' : ''}</span>}
          helperText={<span>{(errors?.odometerValue?.message as string) ?? ''}</span>}
          InputProps={{
            endAdornment: (
              <InputAdornment className="bg-gray-200 px-2 m-0 h-10 rounded-e-md max-h-10" position="end">
                <p>KM</p>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <p className="text-xl font-semibold mb-2">Upload Odometer Photo</p>
      <Typography className="helping_text">Upload the picture of the odometer reading of the vehicle</Typography>
      <div className={`grid grid-cols-4 gap-4 max-h-96`}>
        <FileUpload2 {...commonProps} />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          type="submit"
          disabled={
            isLoading ||
            ((!watch('odometerPhoto') || watch('odometerPhoto')?.length === 0) && (watch('odometerValue') === '' || !watch('odometerValue')))
          }
        >
          {isLoading ? 'Saving' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default UpdateReservationOdometer;
