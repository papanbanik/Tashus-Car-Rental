'use client';

import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { BeforeReservationInfo } from './BeforeReservationOdometer';
import CommonForm from '@/components/Common/CommonForm';
import UpdateReservationOdometer from './UpdateReservationOdometer';
import useReservedVehicleInfoUpdate from '@/hooks/custom-hooks/useReservedVehicleInfoUpdate';
import { useTravelContext } from '@/context/TravelProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { getSingleFileByUrl } from '@/components/CarListing/CarPhotos/photosCommonFn';
import UpdateIconButton from './UpdateIconButton';
import ViewReservedVehicleInfo from './ViewReservedVehicleInfo';

const AfterReservationOdometer = () => {
  const methods = useForm<BeforeReservationInfo>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const { handleSubmit, setValue } = methods;

  const {
    handleOdometerUpdate,
    isLoading,
    isEditable,
    handleChangeEditable,
    shouldDisableReservedVehicle,
    setCoverUrl,
    setSingleFile,
    ...photoProps
  } = useReservedVehicleInfoUpdate(false);
  const { updatedTravelData } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();

  useEffect(() => {
    updateFormValues();
  }, [travelDetails?.tripInformation]);

  const updateFormValues = async () => {
    setValue('odometerValue', travelDetails?.tripInformation?.vehicleInfoAfterReservation?.odometerValue?.toString() ?? undefined, {
      shouldValidate: true,
    });

    if (travelDetails?.tripInformation?.vehicleInfoAfterReservation?.odometerPhoto) {
      const { secureUrl, format, publicId } = travelDetails?.tripInformation?.vehicleInfoAfterReservation?.odometerPhoto ?? {};
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
        odometerValue: Number(odometerValue),
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
          After Reservation Completes
        </Typography>

        {updatedTravelData?.returnDate && (
          <UpdateIconButton isEditable={isEditable} handleChangeEditable={handleChangeEditable} isDisabled={isDisabled}></UpdateIconButton>
        )}
      </div>

      {!isEditable && (
        <p className="helping_text">Reserved vehicle Information can be updated within 15 days following the completion of the travel</p>
      )}

      {isEditable ? (
        <FormProvider {...methods}>
          <CommonForm handleFunction={handleSubmit(onSaveVehicleUpdateInfo)}>
            <UpdateReservationOdometer
              isLoading={isLoading}
              setCoverUrl={setCoverUrl}
              setSingleFile={setSingleFile}
              {...photoProps}
            ></UpdateReservationOdometer>
          </CommonForm>
        </FormProvider>
      ) : (
        <ViewReservedVehicleInfo
          odometerPhotoSecureUrl={travelDetails?.tripInformation?.vehicleInfoAfterReservation?.odometerPhoto?.secureUrl ?? ''}
          odometerValue={travelDetails?.tripInformation?.vehicleInfoAfterReservation?.odometerValue}
        ></ViewReservedVehicleInfo>
      )}
    </div>
  );
};

export default AfterReservationOdometer;
