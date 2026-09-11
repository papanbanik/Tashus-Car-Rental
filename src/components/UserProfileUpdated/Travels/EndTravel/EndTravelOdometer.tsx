import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface EndTravelOdometerProps {
  endOdometer: number | undefined;
  setEndOdometer: Dispatch<SetStateAction<number | undefined>>;
  isOdometerInvalid: boolean;
}

const EndTravelOdometer = ({ endOdometer, setEndOdometer, isOdometerInvalid }: EndTravelOdometerProps) => {
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);

  const handleOdometerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setEndOdometer(value);
  };

  const { control, setValue } = useFormContext();

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

  return (
    <div>
      <p className="text-xl font-semibold mb-2">Odometer</p>
      <Typography>Please provide the current odometer reading</Typography>
      <div className="mt-2">
        <TextField
          size="small"
          className="p-0 md:w-1/2 w-full"
          label="Odometer Value"
          type="number"
          value={endOdometer}
          onChange={handleOdometerChange}
          error={isOdometerInvalid}
          helperText={<span className="text-error">{isOdometerInvalid ? 'Provide valid odometer reading' : ''}</span>}
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingRight: 0,
            },
          }}
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
      <Typography>Upload the picture of the odometer reading of the vehicle</Typography>
      <div className={`grid grid-cols-4 gap-4 max-h-96`}>
        <FileUpload2 {...commonProps} />
      </div>
    </div>
  );
};

export default EndTravelOdometer;
