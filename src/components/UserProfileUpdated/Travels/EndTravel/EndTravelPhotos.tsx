import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import PhotoGuidelinesButton from '@/components/Common/Buttons/PhotoGuidelinesButton';
import { useTravelContext } from '@/context/TravelProvider';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import Button from '@mui/material/Button/Button';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';
import { TEndQueries } from './EndTravel';

interface IEndTravelPhotos {
  photoUrlList: string[];
  setPhotoUrlList: Dispatch<SetStateAction<string[]>>;
  fileList: File[];
  setFileList: Dispatch<SetStateAction<File[]>>;
  deleteFileList: File[];
  setDeleteFileList: Dispatch<SetStateAction<File[]>>;
  handlePhotoSkip: (redirectType: string) => void;
  disableSkip: boolean;
  endQueries: TEndQueries;
}

const EndTravelPhotos = ({
  photoUrlList,
  setPhotoUrlList,
  fileList,
  setFileList,
  deleteFileList,
  setDeleteFileList,
  handlePhotoSkip,
  disableSkip,
  endQueries,
}: IEndTravelPhotos) => {
  const router = useRouter();
  const pathName = usePathname();
  const { control, setValue, trigger } = useFormContext();
  const { data } = useTravelDetails();

  const { updatedTravelData } = useTravelContext();

  // useEffect(() => {
  //   if (updatedTravelData?.travelType === 'current' && !endQueries?.isCarParkedByGuest) {
  //     router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=parking`);
  //   }
  // }, [updatedTravelData, endQueries]);

  const commonProps = {
    control,
    photoUrlList,
    fileList,
    setFileList,
    setPhotoUrlList,
    registerName: 'imageUrlList',
    // limit: 20,
    multiple: true,
    setValue,
    trigger,
    deleteFileList,
    setDeleteFileList,
    multipleRequired: false,
    disableDelete: true,
  };

  return (
    <div className="travel_container">
      <p className="text-xl font-semibold mb-2 capitalize">Upload vehicle photos before ending your travel</p>
      <PhotoGuidelinesButton></PhotoGuidelinesButton>

      <div className={`grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4 max-h-[4000px] mt-6`}>
        <FileUpload2 {...commonProps} />
      </div>

      <div className="flex items-center justify-center my-4">
        <Button onClick={() => handlePhotoSkip('next')} disabled={disableSkip} className="font-bold italic underline normal-case">
          Skip uploading photos
        </Button>
      </div>
    </div>
  );
};

export default EndTravelPhotos;
