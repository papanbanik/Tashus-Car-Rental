import { ImageUploaderProps } from '@/types/componentTypes';
import { Controller } from 'react-hook-form';

const ImageUploader = ({ registerName, control, onChangeFn, multiple, required, disabled, isApp }: ImageUploaderProps) => {
  return (
    <Controller
      name={registerName}
      defaultValue=""
      control={control}
      rules={{
        required: required,
      }}
      render={({ field: { name, onBlur, ref } }) => (
        <input
          type="file"
          disabled={disabled}
          name={name}
          onBlur={onBlur}
          ref={ref}
          onChange={onChangeFn}
          onClick={isApp ? onChangeFn : undefined}
          multiple={multiple}
          accept="image/jpg, image/png, image/jpeg"
          // accept="*/*"
          style={{
            opacity: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        />
      )}
    />
  );
};

export default ImageUploader;
