import { saveSingleImageToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonForm from '@/components/Common/CommonForm';
import DisplayRichText from '@/components/Common/DisplayRichText';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { useSaveKeyStatus } from '@/hooks/travel/start-travel/useSaveKeyStatus';
import { Alert, Button, Typography } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import EndTravelOdometer from '../EndTravel/EndTravelOdometer';

type TravelStartOdometerPhoto = {
  odometerPhoto?: Blob;
  key: boolean;
};

export interface IStartTravelKey {
  pickupInformation: string;
  isTravelStarted: boolean;
}

const StartTravelKey = ({ pickupInformation, isTravelStarted }: IStartTravelKey) => {
  const { travelId: travelIdParam } = useParams<{ travelId: string }>();
  const travelId = parseInt(travelIdParam);
  const router = useRouter();
  const pathName = usePathname();

  const [endOdometer, setEndOdometer] = useState<number | undefined>(undefined);
  const [isPhotoSaving, setIsPhotoSaving] = useState<boolean>(false);
  const isOdometerInvalid: boolean = Number(endOdometer ?? 0) < 0 || Number(endOdometer ?? 0) > 300000000;

  const methods = useForm<TravelStartOdometerPhoto>({
    shouldFocusError: false,
    mode: 'onChange',
  });

  const { watch, control, handleSubmit } = methods;

  const { mutateAsync: saveKeyStatus, isLoading } = useSaveKeyStatus();

  const handleStartTravel: SubmitHandler<TravelStartOdometerPhoto> = async (data) => {
    try {
      const { odometerPhoto } = data;
      let imageInfo;
      if (odometerPhoto) {
        imageInfo = await handleStartOdometerPhoto(odometerPhoto);
      }
      let startTravelOdometer = null;

      startTravelOdometer = {
        ...(imageInfo?.secureUrl && { imageInfo: imageInfo }),
        ...(endOdometer && { odometerValue: endOdometer }),
      };
      // Check if startTravelOdometer is an empty object
      if (Object.keys(startTravelOdometer).length === 0) {
        startTravelOdometer = null;
      }

      await saveKeyStatus({ reservationId: travelId, ...(startTravelOdometer && { startTravelOdometer }) });
      setIsPhotoSaving(false);
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=photos`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartOdometerPhoto = async (odometerPhoto: Blob) => {
    setIsPhotoSaving(true);
    const publicId = `reservations/${travelId}`;
    const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(odometerPhoto, publicId);
    const imageInfo = {
      secureUrl: imageUrl?.imageInfo?.secure_url,
      publicId: imageUrl?.imageInfo?.public_id,
      format: imageUrl?.imageInfo?.format,
      storageProvider: 'cloudinary',
    };
    return imageInfo;
  };

  if (isTravelStarted) {
    return (
      <div className="travel_container">
        <Alert severity="success" className="font-bold">
          {'Travel already started. Enjoy your travel with Tashus!'}
        </Alert>

        <div className="mt-6 flex justify-center items-center">
          <Button
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=photos`)}
            variant="contained"
            color="primary"
            className="normal-case font-bold"
          >
            Continue Uploading Photos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <CommonForm handleFunction={handleSubmit(handleStartTravel)}>
      <div className="travel_container">
        <p className="text-xl font-semibold mb-2">Key Receive</p>
        <Typography variant="body2" className="text-justify text-gray-400 italic">
          {'Please collect the key from partner (car owner) following the instruction from Pickup Information'}
        </Typography>
        {/* <Image src={'/UserProfile/Travels/Key.svg'} alt="Key" height={150} width={150} className="my-8" /> */}
        <DisplayRichText content={pickupInformation || ''}></DisplayRichText>
        <CheckBox
          control={control}
          registerName="key"
          label="I have received the key"
          required={true}
          // icon={<MdOutlineRadioButtonUnchecked className="text-xl" />}
          // checkedIcon={<MdCheckCircle className="text-xl" />}
          helpingText="Please tick the checkbox to confirm that you have received the key"
          isCustomIcon={true}
        />

        <FormProvider {...methods}>
          <EndTravelOdometer endOdometer={endOdometer} setEndOdometer={setEndOdometer} isOdometerInvalid={isOdometerInvalid}></EndTravelOdometer>
        </FormProvider>

        <div className="my-4 flex justify-center items-center">
          <Button
            disabled={!watch('key') || isLoading || isPhotoSaving || isOdometerInvalid}
            type="submit"
            variant="contained"
            color="primary"
            className="normal-case font-bold"
          >
            Continue to Start Travel
          </Button>
        </div>
      </div>
    </CommonForm>
  );
};

export default StartTravelKey;
