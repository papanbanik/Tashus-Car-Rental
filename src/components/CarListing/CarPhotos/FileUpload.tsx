import ImageUploader from '@/components/Common/HookFormFields/ImageUploader';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { ControlledFieldProps } from '@/types/componentTypes';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSearchParams } from 'next/navigation';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { TbReplace } from 'react-icons/tb';
import ImageView from './ImageView';

// ? FileUpload Props Here
interface IFileUploadProps extends ControlledFieldProps {
  limit?: number;
  multiple: boolean;
  multipleRequired?: boolean;
  singleRequired?: boolean;
  disableDelete?: boolean;
  name?: string;
  coverUrl?: string | undefined;
  setCoverUrl?: Dispatch<SetStateAction<string>>;
  singleFile?: File[];
  setSingleFile?: Dispatch<SetStateAction<File[]>>;
  fileList?: File[];
  setFileList?: Dispatch<SetStateAction<File[]>>;
  deleteFileList?: File[];
  setDeleteFileList?: Dispatch<SetStateAction<File[]>>;
  photoUrlList?: string[];
  setPhotoUrlList?: Dispatch<SetStateAction<string[]>>;
  handleOpen?: (photoUrlOrIndex: string | number) => void;
}

// ? Custom Styles for the Box Component
const CustomBox = styled(Box)({
  '&.MuiBox-root': {
    backgroundColor: '#fff',
    borderRadius: '2rem',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
    padding: '1rem',
  },
  '&.MuiBox-root:hover, &.MuiBox-root.dragover': {
    opacity: 0.6,
  },
});

// ? FileUpload Component
const FileUpload2: React.FC<IFileUploadProps> = ({
  limit,
  multiple,
  name,
  control,
  registerName,
  coverUrl,
  setCoverUrl,
  singleFile,
  setSingleFile,
  fileList,
  setFileList,
  photoUrlList,
  setPhotoUrlList,
  setValue,
  trigger,
  deleteFileList,
  setDeleteFileList,
  multipleRequired,
  disableDelete,
  singleRequired,
  handleOpen,
}) => {
  // ? Form Context
  // const {
  //   control,
  //   formState: { isSubmitting, errors },
  // } = useFormContext();

  // ? State with useState()
  const { field } = useController({ name: registerName, control });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { openSnackBar } = useSnackBarContext();

  // ? Toggle the dragover class
  const onDragEnter = () => wrapperRef.current?.classList.add('dragover');
  const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');

  // ? Image Upload Service
  const onFileDrop = useCallback(
    (e: React.SyntheticEvent<EventTarget>) => {
      const target = e.target as HTMLInputElement;
      // console.log(target.files);
      if (!target.files) return;

      if (limit === 1 && singleFile && setSingleFile && setCoverUrl) {
        const newFile = Object.values(target.files).map((file: File) => file);
        // if (!coverUrl && singleFile.length >= 1) return alert('Only a single image allowed');
        if (!coverUrl && singleFile.length >= 1) {
          openSnackBar({
            message: 'Only single image is allowed',
            severity: 'warning',
          });
          return;
        }
        setSingleFile(newFile);
        field.onChange(newFile[0]);
        // preview
        const reader = new FileReader();
        reader.onload = () => {
          setCoverUrl(reader.result as string);
        };
        reader.readAsDataURL(newFile[0]);
      }

      if (multiple && fileList && setFileList) {
        const newFiles = Object.values(target.files).map((file: File) => file);
        if (newFiles && setPhotoUrlList) {
          const existingFileNames = new Set(fileList.map((file) => file.name));
          // const uniqueNewFiles = newFiles.filter((newFile) => !existingFileNames.has(newFile.name));
          //? Ensure all new files have unique names
          const uniqueNewFiles = newFiles.map((newFile) => {
            if (existingFileNames?.has(newFile?.name)) {
              const uniqueName = generateUniqueName(newFile?.name, existingFileNames);
              const updatedFile = new File([newFile], uniqueName, { type: newFile?.type });
              return updatedFile;
            }
            existingFileNames.add(newFile?.name);
            return newFile;
          });
          const updatedList = [...fileList, ...uniqueNewFiles];
          // console.log(existingFileNames, uniqueNewFiles, updatedList);
          // if (limit && (updatedList.length > limit || newFiles.length > limit)) {
          //   return alert(`Image must not be more than ${limit}`);
          // }
          if (limit && (updatedList.length > limit || newFiles.length > limit)) {
            openSnackBar({
              message: `Images must not be more than ${limit}`,
              severity: 'warning',
            });
            return;
          }
          setFileList(updatedList);
          field.onChange(updatedList);

          // preview
          const previewUrls: string[] = [];
          const readerPromises: Promise<void>[] = [];

          for (const file of updatedList) {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              if (event.target && event.target.result) {
                previewUrls.push(event.target.result as string);
              }
            };
            const promise = new Promise<void>((resolve) => {
              reader.onloadend = () => resolve();
            });
            reader.readAsDataURL(file);
            readerPromises.push(promise);
          }

          Promise.all(readerPromises).then(() => {
            // console.log(previewUrls);
            setPhotoUrlList(previewUrls);
            openSnackBar({
              // Success message after upload completion
              message: 'Photo added successfully!',
              severity: 'success',
            });
          });
        }
      }
    },
    [field, fileList, limit, multiple, singleFile]
  );

  // ? Function to generate a unique name if there's a conflict
  const generateUniqueName = (name: string, existingNames: Set<string>): string => {
    let uniqueName = name;
    let count = 1;
    while (existingNames?.has(uniqueName)) {
      const nameParts = name.split('.');
      const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
      const baseName = nameParts.join('.');
      uniqueName = `${baseName}_${count}${extension}`;
      count++;
    }
    existingNames.add(uniqueName);
    return uniqueName;
  };
  // ? remove multiple images
  const fileRemove = async (file?: File, url?: string) => {
    if (fileList && setFileList && photoUrlList && setPhotoUrlList && url && file && setValue && trigger && setDeleteFileList) {
      let fileToBeDeleted: any = {};
      let updatedList: any = [];
      let updatedPhotoUrlList: any = [];
      // console.log(url);
      // console.log(file);
      if (url?.includes('cloudinary')) {
        // console.log('cl');
        updatedPhotoUrlList = photoUrlList?.filter((photoUrl) => photoUrl !== url);
        updatedList = fileList?.filter((photoFile: any) => !url?.includes(photoFile?.name));
        fileToBeDeleted = fileList?.find((photoFile: any) => url?.includes(photoFile?.name));
        // console.log(fileToBeDeleted);
      } else {
        // console.log('n cl');
        updatedPhotoUrlList = photoUrlList?.filter((photoUrl) => photoUrl !== url);
        updatedList = fileList?.filter((photoFile: any) => photoFile?.name !== file?.name);
        fileToBeDeleted = fileList?.find((photoFile: any) => photoFile?.name === file?.name);
        // console.log(fileToBeDeleted);
      }

      // const fileToBeDeleted: any = fileList[fileList.indexOf(file)];
      // const updatedList = [...fileList];
      // const updatedPhotoUrlList = [...photoUrlList];
      // console.log(fileList.indexOf(file));
      // console.log(photoUrlList.indexOf(url));

      // console.log('updatedList', updatedList);
      // console.log('updatedPhotoUrlList', updatedPhotoUrlList);

      // Reset the value of the file input
      if (wrapperRef.current) {
        const inputRef = wrapperRef.current.querySelector(`input[name="${registerName}"]`) as HTMLInputElement;
        if (inputRef) {
          inputRef.value = '';
        }
      }

      setFileList(updatedList);
      field.onChange(updatedList);
      setPhotoUrlList(updatedPhotoUrlList);
      setValue(registerName, updatedList, { shouldValidate: true });
      console.log(fileToBeDeleted);
      fileToBeDeleted?.publicId ? setDeleteFileList((prevDeleteFileList) => [...prevDeleteFileList, fileToBeDeleted]) : '';
    }
  };

  // ? remove single image
  const fileSingleRemove = (file?: any) => {
    if (setSingleFile && setCoverUrl && setDeleteFileList && setValue) {
      file?.publicId ? setDeleteFileList((prevDeleteFileList) => [...prevDeleteFileList, file]) : '';
      setSingleFile([]);
      setCoverUrl('');
      setValue(registerName, [], { shouldValidate: true });
    }
  };

  // ? TypeScript Type
  type CustomType = 'jpg' | 'png' | 'svg';

  // ? Calculate Size in KiloByte and MegaByte
  const calcSize = (size: number) => {
    return size < 1000000 ? `${Math.floor(size / 1000)} KB` : `${Math.floor(size / 1000000)} MB`;
  };

  // console.log(photoUrlList);
  // console.log(fileList);

  const getPhotoName = (url: any, index: number) => {
    // Get the last part (filename) after the last '/'
    if (url?.includes('cloudinary')) {
      const filename = url?.substring(url.lastIndexOf('/') + 1);
      return decodeURIComponent(filename);
    }

    if (fileList) return fileList[index]?.name;
  };

  //For App Redirection
  const [isApp, setIsApp] = useState<boolean>(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('from') === 'redirection') {
      setIsApp(true);
    } else {
      setIsApp(false);
    }
  }, [searchParams]);

  return (
    <>
      {/* multiple image display */}
      {fileList &&
        photoUrlList?.map((url: any, index) => (
          <div className={`col-span-1 relative h-44 rounded-lg border border-gray-400`} key={index} style={{ border: '1px solid red' }}>
            <ImageView
              multiple={true}
              url={url}
              removeFile={fileRemove}
              index={index}
              fileList={fileList}
              imageSize={calcSize(fileList[index]?.size)}
              imageName={getPhotoName(url, index) || ''}
              // imageName={fileList[index]?.name || ''}
              //@ts-ignore
              disableDelete={disableDelete && fileList[index]?.publicId}
              handleOpen={handleOpen}
            ></ImageView>
          </div>
        ))}

      {/* single image display */}
      {coverUrl && singleFile && (
        <div className={`col-span-4 relative md:h-96 h-72 rounded-lg`}>
          <ImageView
            multiple={false}
            url={coverUrl}
            removeFile={fileSingleRemove}
            fileList={singleFile}
            imageSize={calcSize(singleFile[0]?.size)}
            imageName={singleFile[0]?.name || ''}
            //@ts-ignore
            disableDelete={disableDelete && singleFile[0]?.publicId} //Disable Delete for single file
            handleOpen={handleOpen}
          >
            <Tooltip enterTouchDelay={0} title="Replace" placement="top">
              <IconButton>
                <TbReplace />
                <ImageUploader
                  control={control}
                  registerName={registerName}
                  onChangeFn={onFileDrop}
                  multiple={multiple}
                  required={singleRequired}
                ></ImageUploader>
              </IconButton>
            </Tooltip>
          </ImageView>
        </div>
      )}

      {/* Display Uploader */}
      {/* {((!coverUrl && singleFile && singleFile?.length < limit) || (fileList && fileList?.length < limit)) && ( */}
      {((!coverUrl && singleFile && limit && singleFile?.length < limit) || (photoUrlList && limit && photoUrlList?.length < limit) || !limit) && (
        <CustomBox className={`${multiple && photoUrlList && photoUrlList?.length > 0 ? 'md:col-span-1 col-span-2' : 'col-span-4'}`}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              border: '2px dashed #800080',
            }}
            ref={wrapperRef}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDragLeave}
            onClick={() => {
              if (isApp && !(fileList && !!limit && fileList?.length === limit)) {
                wrapperRef?.current?.click();
              }
            }}
            className={`h-36 relative rounded-xl`}
          >
            <Stack justifyContent="center" sx={{ p: 1, textAlign: 'center' }}>
              <Typography className="text-gray-500 text-base sm:text-sm">
                {limit && (
                  <>
                    {photoUrlList && photoUrlList?.length > 0 ? (
                      <span className="flex justify-center gap-2 text-base sm:text-sm">
                        {`Add ${limit - (photoUrlList?.length || 0)} More`}
                        <AiOutlinePlus size={22} />
                      </span>
                    ) : (
                      <span className="text-base sm:text-sm">{`Browse ${limit > 1 ? 'files' : 'file'} to upload`}</span>
                    )}
                  </>
                )}
                {!limit && <span className="text-base sm:text-sm">{`Browse files to upload`}</span>}
              </Typography>
              <Typography className="text-gray-500 text-base sm:text-sm" variant="body1" component="span">
                <strong>Supported Files</strong>
              </Typography>
              <Typography className="text-gray-500 text-sm sm:text-xs" variant="body2" component="span">
                JPG, JPEG, PNG
              </Typography>
            </Stack>
            <ImageUploader
              disabled={fileList && !!limit && fileList?.length === limit}
              control={control}
              registerName={registerName}
              isApp={isApp}
              onChangeFn={onFileDrop}
              multiple={multiple}
              required={multiple ? multipleRequired : singleRequired}
            ></ImageUploader>
          </Box>
        </CustomBox>
      )}
    </>
  );
};

export default FileUpload2;
