'use client';

import CommonForm from '@/components/Common/CommonForm';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import UpdateReservationOdometer from './UpdateReservationOdometer';
import { Typography } from '@mui/material';
import useReservedVehicleInfoUpdate from '@/hooks/custom-hooks/useReservedVehicleInfoUpdate';
import { useTravelContext } from '@/context/TravelProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useEffect } from 'react';
import { getSingleFileByUrl } from '@/components/CarListing/CarPhotos/photosCommonFn';
import ViewReservedVehicleInfo from './ViewReservedVehicleInfo';
import UpdateIconButton from './UpdateIconButton';

export type BeforeReservationInfo = {
  odometerValue?: number | string;
  odometerPhoto?: Blob | File;
};

const defaultValues: BeforeReservationInfo = {
  odometerValue: undefined,
  odometerPhoto: undefined,
};

const BeforeReservationOdometer = () => {
  const methods = useForm<BeforeReservationInfo>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues,
  });
  const { handleSubmit, setValue } = methods;

  const {
    handleOdometerUpdate,
    isLoading,
    isEditable,
    handleChangeEditable,
    setSingleFile,
    setCoverUrl,
    shouldDisableReservedVehicle,
    ...photoProps
  } = useReservedVehicleInfoUpdate(true);
  const { updatedTravelData } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();

  useEffect(() => {
    updateFormValues();
  }, [travelDetails?.tripInformation]);

  const updateFormValues = async () => {
    setValue('odometerValue', travelDetails?.tripInformation?.vehicleInfoBeforeReservation?.odometerValue?.toString() ?? undefined, {
      shouldValidate: true,
    });

    if (travelDetails?.tripInformation?.vehicleInfoBeforeReservation?.odometerPhoto?.secureUrl) {
      const { secureUrl, format, publicId } = travelDetails?.tripInformation?.vehicleInfoBeforeReservation?.odometerPhoto ?? {};
      const photoFile = await getSingleFileByUrl(secureUrl, format, publicId);
      setValue('odometerPhoto', photoFile, { shouldValidate: true });
      setCoverUrl(secureUrl);
      setSingleFile([photoFile]);
    }
  };

  const onSaveVehicleUpdateInfo: SubmitHandler<BeforeReservationInfo> = async (data) => {
    try {
      const { odometerPhoto, odometerValue } = data;
      await handleOdometerUpdate({
        reservationId: updatedTravelData?.reservationId,
        tempOdometerPhoto: odometerPhoto,
        odometerValue: odometerValue !== '' ? Number(odometerValue) : undefined,
      });
    } catch (error) {
      console.error('onSaveVehicleUpdateInfo error', error);
    }
  };

  const isDisabled = shouldDisableReservedVehicle(updatedTravelData?.returnDate, updatedTravelData?.reservationStatus);

  return (
    <div className="lg:w-1/2 w-full">
      <div className="flex justify-between">
        <Typography variant="h6" className="font-semibold text-primary md:text-xl text-lg">
          Before Reservation Starts
        </Typography>
        <UpdateIconButton isEditable={isEditable} handleChangeEditable={handleChangeEditable} isDisabled={isDisabled}></UpdateIconButton>
      </div>

      {!isEditable && (
        <p className="helping_text">Reserved vehicle Information can be updated within 15 days following the completion of the travel</p>
      )}

      {isEditable ? (
        <FormProvider {...methods}>
          <CommonForm handleFunction={handleSubmit(onSaveVehicleUpdateInfo)}>
            <UpdateReservationOdometer
              isBeforeReservation={true}
              isLoading={isLoading}
              {...photoProps}
              setCoverUrl={setCoverUrl}
              setSingleFile={setSingleFile}
            ></UpdateReservationOdometer>
          </CommonForm>
        </FormProvider>
      ) : (
        <ViewReservedVehicleInfo
          odometerPhotoSecureUrl={travelDetails?.tripInformation?.vehicleInfoBeforeReservation?.odometerPhoto?.secureUrl ?? ''}
          odometerValue={travelDetails?.tripInformation?.vehicleInfoBeforeReservation?.odometerValue}
        ></ViewReservedVehicleInfo>
      )}
    </div>
  );
};

export default BeforeReservationOdometer;
