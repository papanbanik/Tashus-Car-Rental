'use client';
import CommonForm from '@/components/Common/CommonForm';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSaveCarDistance } from '@/hooks/car-listing/useCarDistance';
import { CarDistanceValues } from '@/types/car-listing/carListingTypes';
import { TPhoto } from '@/types/commonTypes';
import { isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { extractRelevantDistanceFields, extractRelevantFuelGaugeFields, extractServiceInfo } from '@/utils/Functions/carListingCommonFn';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowRight } from 'react-icons/fa';
import { saveSingleImageToCloudinary, urlToFile } from '../CarPhotos/photosCommonFn';
import StepContainer from '../StepContainer';
import StepHeader from '../StepHeader';
import DashboardPhoto from './FuelGauge/DashboardPhoto';
import FuelEconomy from './FuelGauge/FuelEconomy';
import FuelGauge from './FuelGauge/FuelGauge';
import FuelHistory from './FuelGauge/FuelHistory';
import FuelInfo from './FuelGauge/FuelInfo';
import LogsHistory from './ServiceLogs/LogsHistory';
import NextServiceLog from './ServiceLogs/NextServiceLog';
import RecentServiceLog from './ServiceLogs/RecentServiceLog';
import ServiceLog from './ServiceLogs/ServiceLog';
import ServicePhoto from './ServiceLogs/ServicePhoto';
import UnlimitedTravel from './UnlimitedTravel';

const defaultValues: CarDistanceValues = {
  distance: {
    unlimitedTravel: true,
    additionalFeePerKilometer: undefined,
  },
  serviceLogAdd: true,
  fuelInfoAdd: true,
};

const CarDistance = () => {
  const { partnerAccess } = useProfileInfoContext();
  const pathName = usePathname();
  const { openModal, closeModal } = useModalContext();
  const { handleSaveCurrentStep, updateCurrentStep, listingId, carData, getUpdatedSteps } = useCarListingContext();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } =
    useForm<CarDistanceValues>({
      shouldFocusError: false,
      mode: 'onChange',
      defaultValues: defaultValues,
    });
  const { isDirty, isValid, isSubmitted } = formState;
  const { mutateAsync: saveCarDistance, isLoading, isSuccess, isError, error } = useSaveCarDistance();
  //Photo
  const [profileUrl, setProfileUrl] = useState('');
  const [singleFile, setSingleFile] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
    setError,
    clearErrors,
  };
  const commonUploadProps = {
    control,
    profileUrl,
    singleFile,
    setSingleFile,
    setProfileUrl,
    registerName: 'picture',
    limit: 1,
    multiple: false,
    deleteFileList,
    setDeleteFileList,
  };
  useEffect(() => {
    updateCurrentStep();
  }, []);

  const onDistanceSave: SubmitHandler<CarDistanceValues> = async (data) => {
    // console.log('onDistanceSave', data);
    try {
      const tempSteps = await getUpdatedSteps(7);
      const shouldIncludeServiceLog = data?.serviceLogAdd !== false;
      const shouldIncludeDocumentInfo = data?.picture !== undefined;
      const shouldIncludeAttachment = data?.fuelPicture !== undefined;
      const shouldIncludeFuelGauge = data?.fuelInfoAdd !== false && (!!data?.fuelGauge?.vehicleKilometersRange || shouldIncludeAttachment);
      const shouldIncludeFuelEconomy = data?.fuelInfoAdd !== false && (data?.fuelEconomy?.maxFuel !== undefined || data?.fuelEconomy?.maxFuel !== '');

      let serviceImageInfo: { public_id?: string; secure_url?: string; format?: string } = {};
      let serviceImageDetails: { storageProvider?: string } = {};
      if (data?.picture) {
        const photoName = data.picture.name;
        const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(data.picture, `listing-photos/${listingId}/${photoName}`);
        serviceImageInfo = imageUrl?.imageInfo || {};
        serviceImageDetails.storageProvider = imageUrl?.storageProvider;
      }

      let fuelImageInfo: { public_id?: string; secure_url?: string; format?: string } = {};
      let fuelImageDetails: { storageProvider?: string } = {};
      if (data?.fuelPicture) {
        const photoName = data.fuelPicture.name;
        const { imageUrl, uploadedUrl } = await saveSingleImageToCloudinary(data.fuelPicture, `listing-photos/${listingId}/${photoName}`);
        fuelImageInfo = imageUrl?.imageInfo || {};
        fuelImageDetails.storageProvider = imageUrl?.storageProvider;
      }
      await saveCarDistance({
        listingId: listingId,
        distance: {
          unlimitedTravel: data?.distance?.unlimitedTravel,
          maximumDailyDistance: data?.distance?.unlimitedTravel ? undefined : data?.distance?.maximumDailyDistance,
          // additionalFeePerKilometer: data?.distance.unlimitedTravel ? undefined : data?.distance.additionalFeePerKilometer,
          additionalFeePerKilometer: data?.distance?.unlimitedTravel ? undefined : data?.distance?.additionalFeePerKilometer,
        },
        fuelGauge: shouldIncludeFuelGauge
          ? {
              vehicleKilometersRange: !!data?.fuelGauge?.vehicleKilometersRange ? data?.fuelGauge?.vehicleKilometersRange : undefined,
              attachmentOfFuelGauge: shouldIncludeAttachment
                ? ({
                    imageInfo: {
                      public_id: fuelImageInfo?.public_id || '',
                      secure_url: fuelImageInfo?.secure_url,
                      format: fuelImageInfo?.format,
                    },
                    storageProvider: fuelImageDetails?.storageProvider,
                  } as TPhoto)
                : undefined,
            }
          : undefined,
        fuelEconomy: shouldIncludeFuelEconomy
          ? {
              maxFuel: data?.fuelEconomy?.maxFuel ?? 0,
              fuelCost: data?.fuelEconomy?.fuelCost ?? 0,
            }
          : undefined,
        serviceLog: shouldIncludeServiceLog
          ? {
              serviceDate: data?.serviceLog?.serviceDate,
              odometer: data?.serviceLog?.odometer,
              documentInfo: shouldIncludeDocumentInfo
                ? {
                    info: {
                      public_id: serviceImageInfo?.public_id,
                      secure_url: serviceImageInfo?.secure_url,
                      format: serviceImageInfo?.format,
                    },
                    storageProvider: serviceImageDetails?.storageProvider,
                  }
                : undefined,
              nextServiceDate: data?.serviceLog?.nextServiceDate,
              nextServiceDueOdometer: data?.serviceLog?.nextServiceDueOdometer,
            }
          : undefined,
        listingSteps: tempSteps,
        showServiceLog: data?.serviceLogAdd,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUpdatedDistance = async () => {
      // console.log('Check list and Data', listingId, carData);
      // console.log('Car Data', carData?.carServiceLog);
      if (listingId && carData?.distance) {
        const { unlimitedTravel, maximumDailyDistance, additionalFeePerKilometer } = carData?.distance;
        // Set Distance
        setValue('distance.unlimitedTravel', unlimitedTravel);
        setValue('distance.maximumDailyDistance', maximumDailyDistance);
        setValue('distance.additionalFeePerKilometer', additionalFeePerKilometer);
        // Set Fuel Gauge
        const { distance } = carData || {};
        const { fuelGauges, fuelEconomy } = distance || {};
        // console.log(fuelGauges);
        if (fuelGauges && fuelGauges.length > 0) {
          const lastIndex = fuelGauges.length - 1;
          const lastFuelGauge = fuelGauges[lastIndex];
          // console.log(lastIndex);
          const { vehicleKilometersRange, attachmentOfFuelGauge } = lastFuelGauge;
          // console.log(lastFuelGauge);
          setValue('fuelGauge.vehicleKilometersRange', vehicleKilometersRange);
          setValue('fuelGauge.attachmentOfFuelGauge', attachmentOfFuelGauge);
          if (lastFuelGauge?.attachmentOfFuelGauge?.imageInfo?.secure_url) {
            const url = lastFuelGauge?.attachmentOfFuelGauge?.imageInfo?.secure_url;
            const parts = url.split('/');
            const filename = parts[parts.length - 1];
            const fuelImageFile: any = await urlToFile(url, filename, `image/${lastFuelGauge?.attachmentOfFuelGauge?.imageInfo?.format}`);
            // console.log(fuelImageFile);
            setValue('fuelPicture', fuelImageFile);
          }
        } else {
          setValue('fuelInfoAdd', false);
        }
        if (!!fuelEconomy) {
          const { maxFuel, fuelCost } = fuelEconomy || {};
          setValue('fuelEconomy.maxFuel', maxFuel);
          setValue('fuelEconomy.fuelCost', fuelCost);
          setValue('fuelInfoAdd', true);
        } else {
          setValue('fuelInfoAdd', false);
        }
        // Set Service Log
        const { carServiceLog } = carData || {};
        const { serviceLogs, showServiceLog } = carServiceLog || {};
        // console.log(serviceLogs);
        const checkShowServiceLog = typeof showServiceLog === 'boolean' ? showServiceLog : true;
        if (checkShowServiceLog && serviceLogs && serviceLogs.length > 0) {
          const lastIndex = serviceLogs.length - 1;
          const lastServiceLog = serviceLogs[lastIndex];
          // console.log(lastIndex);
          const { serviceDate, odometer, documentInfo, nextServiceDate, nextServiceDueOdometer } = lastServiceLog;
          // console.log(lastServiceLog);
          setValue('serviceLog.serviceDate', dayjs(serviceDate).toDate());
          setValue('serviceLog.odometer', odometer);
          setValue('serviceLog.documentInfo', documentInfo);
          setValue('serviceLog.nextServiceDate', dayjs(nextServiceDate).toDate());
          setValue('serviceLog.nextServiceDueOdometer', nextServiceDueOdometer);
          if (lastServiceLog?.documentInfo?.info?.secure_url) {
            const url = lastServiceLog?.documentInfo?.info?.secure_url;
            const parts = url.split('/');
            const filename = parts[parts.length - 1];
            const ServiceImageFile: any = await urlToFile(url, filename, `image/${lastServiceLog?.documentInfo?.info?.format}`);
            // console.log(ServiceImageFile);
            setValue('picture', ServiceImageFile);
          }
        } else if (typeof showServiceLog === 'boolean') {
          setValue('serviceLogAdd', showServiceLog);
        } else {
          setValue('serviceLogAdd', false);
        }
      } else {
        reset();
      }
    };
    getUpdatedDistance();
  }, [listingId, carData?.distance, carData?.carServiceLog]);
  // console.log(watch('serviceLogAdd'));

  const handleHistory = () => {
    openModal({
      content: <LogsHistory dataCar={carData} />,
      title: 'Service Logs History',
    });
  };

  const handleFuelHistory = () => {
    openModal({
      content: <FuelHistory dataCar={carData} />,
      title: 'Fuel Gauge History',
    });
  };

  // added to resolve recent date validation
  useEffect(() => {
    if (watch('serviceLog.serviceDate')) {
      trigger('serviceLog.serviceDate');
    }
    //add to trigger next service odometer validation
    if (watch('serviceLog.odometer') && carData?.carServiceLog?.serviceLogs && carData?.carServiceLog?.serviceLogs?.length > 0) {
      trigger('serviceLog.nextServiceDueOdometer');
    }
  }, [watch('serviceLog.serviceDate'), watch('serviceLog.odometer')]);

  const hasDataChanged = () => {
    let hasFuelData = false;
    let hasServiceData = false;
    if (listingId && (carData?.distance || carData?.carServiceLog)) {
      const distanceData = carData?.distance;
      //console.log('CarDistance Data', JSON.stringify(extractRelevantDistanceFields(distanceData)) !== JSON.stringify(watch('distance')));
      const distanceChanged = JSON.stringify(extractRelevantDistanceFields(distanceData)) !== JSON.stringify(watch('distance'));
      // Extract relevant fields for comparison
      const lastFuelGauge = carData?.distance?.fuelGauges[carData.distance.fuelGauges.length - 1];
      const currentFuelGauge = watch('fuelGauge');
      const lastFuelGaugeRelevant = extractRelevantFuelGaugeFields(lastFuelGauge);
      const currentFuelGaugeRelevant = extractRelevantFuelGaugeFields(currentFuelGauge);
      const fuelInfoChanged =
        watch(['fuelInfoAdd']) &&
        !!currentFuelGauge &&
        // (carData?.distance?.fuelGauges?.length ?? 0) > 0 &&
        JSON.stringify(lastFuelGaugeRelevant) !== JSON.stringify(currentFuelGaugeRelevant);
      hasFuelData = Object.keys(lastFuelGaugeRelevant).length !== 0;
      // console.log('Fuel', fuelInfoChanged);
      // console.log('Fuel Car', lastFuelGaugeRelevant);
      // console.log('Fuel Current', currentFuelGaugeRelevant);
      //Service Log
      const showServiceLog = carData?.carServiceLog?.showServiceLog ?? false;
      const serviceLogChanged =
        watch(['serviceLogAdd']) &&
        // (carData?.carServiceLog?.serviceLogs?.length ?? 0) > 0 &&
        JSON.stringify(extractServiceInfo(carData?.carServiceLog?.serviceLogs[carData?.carServiceLog?.serviceLogs?.length - 1])) !==
          JSON.stringify(extractServiceInfo(watch('serviceLog')));
      hasServiceData =
        Object.keys(extractServiceInfo(carData?.carServiceLog?.serviceLogs[carData?.carServiceLog?.serviceLogs?.length - 1])).length !== 0;
      // console.log('Service Log', serviceLogChanged);
      // console.log(
      //   'Service Log Car',
      //   JSON.stringify(extractServiceInfo(carData?.carServiceLog?.serviceLogs[carData?.carServiceLog?.serviceLogs?.length - 1]))
      // );
      // console.log('Service Log Current', JSON.stringify(extractServiceInfo(watch('serviceLog'))));
      // Check if fuel economy has changed
      const carMaxFuel = (carData?.distance?.fuelEconomy?.maxFuel ?? '').toString();
      const formMaxFuel = (watch('fuelEconomy.maxFuel') ?? '').toString();
      const fuelEconomyChanged = carMaxFuel !== formMaxFuel;
      //Button Changed Checking
      const unlimitedTravelChanged = carData?.distance?.unlimitedTravel !== watch('distance.unlimitedTravel');
      const fuelButtonChanged = hasFuelData !== watch('fuelInfoAdd');
      const serviceButtonChanged = (showServiceLog && hasServiceData) !== watch('serviceLogAdd');

      return (
        distanceChanged ||
        fuelInfoChanged ||
        serviceLogChanged ||
        fuelEconomyChanged ||
        unlimitedTravelChanged ||
        fuelButtonChanged ||
        serviceButtonChanged
      );
    }
    return true;
  };

  return (
    <StepContainer>
      <StepHeader
        title="Distance"
        //subtitle="Please provide whether you would like unlimited distance or input a maximum distance limit. Maximum distances help guests know what they're working on and make additional costs transparent. Having unlimited distance gives you more flexibility."
      />
      <CommonForm handleFunction={handleSubmit(onDistanceSave)}>
        {/* Distance */}
        <UnlimitedTravel {...commonProps} />
        {/* {!watch('distance.unlimitedTravel') && <MaximumDistance {...commonProps} />} */}
        {/* Fuel Gauge */}
        <div className="mt-2">
          <FuelGauge {...commonProps} />
        </div>
        {watch('fuelInfoAdd') && (
          <>
            <FuelInfo {...commonProps} />{' '}
            <div className="my-4">
              <DashboardPhoto {...commonUploadProps} />
            </div>
            {!!carData?.car?.fuelInfo?.fuelType && (
              <div className="my-4">
                <FuelEconomy {...commonProps} />
              </div>
            )}
          </>
        )}
        {pathName.includes('vehicles') && carData?.distance?.fuelGauges?.length > 0 && (
          <Button
            variant="text"
            color="primary"
            className="flex items-end justify-end normal-case font-bold hover:text-success"
            onClick={handleFuelHistory}
            endIcon={<FaArrowRight />}
          >
            Fuel Gauge History
          </Button>
        )}
        {/* Service Log */}
        <div className="mt-2">
          <ServiceLog {...commonProps} />
        </div>
        {watch('serviceLogAdd') && (
          <>
            <RecentServiceLog {...commonProps} />
            <div className="my-4">
              <ServicePhoto {...commonUploadProps} />
            </div>
            <NextServiceLog {...commonProps} />
          </>
        )}
        {pathName.includes('vehicles') && (carData?.carServiceLog?.serviceLogs?.length ?? 0) > 0 && (
          <Button
            variant="text"
            color="primary"
            className="flex items-end justify-end normal-case font-bold hover:text-success"
            onClick={handleHistory}
            endIcon={<FaArrowRight />}
          >
            Service Logs History
          </Button>
        )}
        <div className="flex justify-center mt-8">
          <Button
            // disabled={!isValid || isLoading || !isDirty || isSubmitted || isPartnerRestrict(partnerAccess)}
            disabled={!isValid || isLoading || !hasDataChanged() || isPartnerRestrict(partnerAccess)}
            type="submit"
            variant="contained"
            color="primary"
            className="justify-end"
          >
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      </CommonForm>
    </StepContainer>
  );
};

export default CarDistance;
