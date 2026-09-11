import { CommonImageUploadProps } from '@/types/user-verification/verificationListingSteps';
import { ECommonText } from '@/utils/Functions/randomCommonFn';
import { Button } from '@mui/material';
import Image from 'next/image';
import { FiRefreshCcw, FiUpload } from 'react-icons/fi';
import ImageUploader from '../HookFormFields/ImageUploader';
import CommonEmptyImageBox from './CommonEmptyImageBox';

const CommonImageUpload = ({ selectedImage, onFileDrop, control, registerName, required, title, disabled, isMandatory }: CommonImageUploadProps) => {
  return (
    <>
      <span className="text-sm md:text-md my-4 font-bold">
        {!!title ? title : ''}
        {isMandatory && <span className="text-error">{ECommonText.RequiredSign}</span>}
      </span>
      <div className="grid grid-cols-2 gap-2">
        {!!selectedImage ? (
          <div className="w-full relative h-auto rounded-lg">
            <Image
              src={selectedImage}
              alt="profile-photo"
              //   width={258} height={170}
              style={{ objectFit: 'cover' }}
              // className="rounded-lg z-0"
              className="rounded-lg"
              fill={true}
            />
          </div>
        ) : (
          <CommonEmptyImageBox />
        )}
        <Button variant="outlined" className="normal-case flex flex-col gap-2 justify-center items-center md:h-[170px]" disabled={disabled}>
          {!selectedImage ? <FiUpload size={20} /> : <FiRefreshCcw size={20} />}
          <span>{selectedImage ? 'Replace' : 'Upload'}</span>
          <ImageUploader
            control={control}
            registerName={registerName}
            onChangeFn={onFileDrop}
            multiple={false}
            required={required}
            disabled={disabled}
          />
        </Button>
      </div>
    </>
  );
};

export default CommonImageUpload;
