'use client';

import { ControlledFieldProps } from '@/types/componentTypes';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { deleteFromCloudinary, getFilesByUrls, saveImageListToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';

import { useCallback } from 'react'; // Import useCallback

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);

const RichEditor = ({ control, registerName, label, required, errors, disabled }: ControlledFieldProps) => {
  const editorRef = useRef<any>(null);
  const [textLength, setTextLength] = useState<number>(0);

  //   const { imageUrlList, uploadedUrls } = await saveImageListToCloudinary(data?.additionalPhotosUrl, listingId);

  // Define a custom image handler
  const handleImageInsert = useCallback((value: any, callback: any) => {
    const url = window.prompt('Enter the image URL');
    if (url) {
      const editor = editorRef?.current?.getEditor();
      editor.insertEmbed(editor.getSelection().index, 'image', url);
      callback();
    }
  }, []);

  const validateTextLength = (content: string) => {
    if (editorRef?.current) {
      const { unprivilegedEditor } = editorRef?.current;
      const { getLength } = unprivilegedEditor;
      const tempTextLength = getLength() - 1;
      setTextLength(tempTextLength);

      return (tempTextLength >= 100 && tempTextLength <= 2000) || 'Please write within 100 - 2000 characters.';
    }
    return true;
  };

  return (
    <div>
      <Controller
        name={registerName}
        control={control}
        rules={{
          required: required,
          validate: validateTextLength,
        }}
        render={({ field: { value, onChange, onBlur, ref } }) => {
          return (
            <div>
              <ReactQuill
                forwardedRef={editorRef}
                className={`rounded-xl border-gray-300`}
                style={{
                  border: '1px solid',
                  minHeight: '7em',
                }}
                modules={{
                  toolbar: [
                    [{ header: '1' }, { header: '2' }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                    [{ image: handleImageInsert }], // Add the custom image handler
                  ],
                }}
                formats={['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'indent', 'image']}
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={label}
                readOnly={disabled}
              />
              <span
                className={`text-xs mt-2 ${(textLength >= 100 && textLength <= 2000) || !errors ? ' text-purple-400 font-medium' : 'text-error'}`}
              >{`Please write within 100 - 2000 characters. `}</span>
            </div>
          );
        }}
      />
    </div>
  );
};

export default RichEditor;
