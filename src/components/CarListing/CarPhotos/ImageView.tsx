import { IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { ReactNode } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { IoTrashSharp } from 'react-icons/io5';

export interface ImageViewProps {
  multiple: boolean;
  url: string;
  removeFile: (file?: File, url?: string) => void;
  imageSize: number | string;
  imageName: string;
  index?: number;
  fileList?: File[];
  children?: ReactNode;
  disableDelete?: boolean;
  handleOpen?: (photoUrlOrIndex: string | number) => void;
}

const ImageView = ({ multiple, url, removeFile, index, fileList, children, imageName, imageSize, disableDelete, handleOpen }: ImageViewProps) => {
  return (
    <>
      <Image
        src={url}
        alt="cover-photo"
        style={{ objectFit: 'contain' }}
        className="rounded-lg z-0 cursor-pointer"
        fill={true}
        onClick={() => {
          if (handleOpen) {
            handleOpen(multiple ? index ?? 0 : url);
          }
        }}
      ></Image>
      <div className="w-full h-8 absolute bottom-0 z-10 rounded-b-lg flex justify-center items-center gap-4">
        <div className="bg-gray-500 opacity-70 w-full h-full absolute rounded-b-lg"></div>
        <Tooltip
          enterTouchDelay={0}
          title={
            <div className="p-0">
              <p className="p-0 m-0 max-w-[200px]">{imageName}</p>
              <p className="p-0 m-0">{imageSize}</p>
            </div>
          }
          placement="top"
        >
          <div className="flex z-10">
            <AiOutlineExclamationCircle className="text-primary" size={22} />
          </div>
        </Tooltip>

        {/* Replace Button */}
        {!multiple && children}

        {/* Delete button */}
        {!disableDelete && (
          <IconButton
            onClick={() => {
              if (multiple && fileList && index !== undefined) {
                removeFile(fileList[index], url);
              } else if (!multiple && fileList) {
                removeFile(fileList[0]);
              }
            }}
            className="text-red-00 p-0 col-span-1"
          >
            <IoTrashSharp />
          </IconButton>
        )}
      </div>
    </>
  );
};

export default ImageView;
