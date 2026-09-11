'use client';
import { Button } from '@mui/material';
import { FaUpload } from 'react-icons/fa';

const ReturnPhotos = () => {
  return (
    <div>
      <div>
        <span className="font-bold">Updated by Partner</span>
        <div className="flex items-center justify-center">
          <Button sx={{ border: 2, borderColor: 'grey.500' }} className="flex flex-col normal-case p-4">
            <FaUpload size={50} />
            <span>Upload a new Image</span>
          </Button>
        </div>
      </div>
      <div className="my-8">
        <span className="font-bold">Updated by Guest</span>
      </div>
    </div>
  );
};

export default ReturnPhotos;
