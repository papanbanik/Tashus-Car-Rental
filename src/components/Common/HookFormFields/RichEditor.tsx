'use client';

import { ControlledFieldProps } from '@/types/componentTypes';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);

// Use this func for manual content set
const stripHtmlTags = (htmlString: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;
  return tempElement.textContent || tempElement.innerText || '';
};

const RichEditor = ({ control, registerName, label, required, errors, disabled }: ControlledFieldProps) => {
  const editorRef = useRef<any>(null);
  const [textLength, setTextLength] = useState<number>(0);

  const validateTextLength = (content: string) => {
    if (registerName === 'comment' || registerName === 'description' || registerName === 'message') {
      return true; // Return true to skip validation for 'comment'.
    }
    // console.log('errors', errors);
    // console.log('content', content);
    // console.log('content', editorRef);
    if (editorRef?.current) {
      // console.log(editorRef?.current);
      const { unprivilegedEditor } = editorRef?.current;
      const { getText, getLength, getContents } = unprivilegedEditor;
      // console.log('quill length', getLength());
      // console.log('quill content', getContents());
      // console.log('quill content details', getContents()?.ops[0]?.insert);
      // console.log('quill text & length', getText(), getLength() - 1);
      const tempTextLength = getLength() - 1;
      setTextLength(tempTextLength);
      // console.log('condition', tempTextLength >= 100 && tempTextLength <= 2000);
      // console.log(`${registerName} errors`, errors);
      // console.log(tempTextLength);

      return (tempTextLength >= 100 && tempTextLength <= 2000) || 'Please write within 100 - 2000 characters.';
      // if (getLength() <= 100) {
      //   return 'Please write at least 100 characters';
      // }

      // if (getLength() >= 2000) {
      //   return 'Maximum length 2000 characters exceeded';
      // }
      // if (getLength() <= 100) {
      //   return 'Please write at least 100 characters';
      // }

      // if (getLength() >= 2000) {
      //   return 'Maximum length 2000 characters exceeded';
      // }
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
                // className={`rounded-xl ${errors ? 'border-error' : 'border-gray-300'}`}
                style={{
                  border: '1px solid',
                  minHeight: '10em',
                }}
                modules={{
                  toolbar: [
                    [{ header: '1' }, { header: '2' }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                  ],
                }}
                formats={['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'indent']}
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={label}
                readOnly={disabled}
              />
              {!(registerName === 'comment' || registerName === 'description' || registerName === 'message') && (
                <span
                  className={`text-xs mt-2 pl-0 lg:pl-2  ${
                    (textLength >= 100 && textLength <= 2000) || !errors ? ' text-purple-400 font-medium' : 'text-error'
                  }`}
                >{`Please write within 100 - 2000 characters. `}</span>
              )}
              {/* {
                <span className={`text-xs mt-2 ${(textLength >= 100 && textLength <= 2000) || !errors ? 'text-purple-400' : 'text-error'}`}>
                  {(textLength >= 100 && textLength <= 2000).toString()} {(!errors).toString()}{' '}
                  {((textLength >= 100 && textLength <= 2000) || !errors).toString()}{' '}
                </span>
              } */}
              {/* {errors ? (
                <span className={`text-xs mt-2 ${errors?.message?.includes('2000') ? 'text-error' : ''}`}>{`${errors?.message}. `}</span>
              ) : (
                <span className={`text-xs mt-2`}>{'Please write within 100 - 2000 characters. '}</span>
              )} */}
              {textLength > 0 && !(registerName === 'comment' || registerName === 'description' || registerName === 'message') && (
                <span
                  className={`text-xs mt-2 ${(textLength >= 100 && textLength <= 2000) || !errors ? 'text-purple-400 font-medium' : 'text-error'}`}
                >
                  You have written {textLength} characters.
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default RichEditor;
