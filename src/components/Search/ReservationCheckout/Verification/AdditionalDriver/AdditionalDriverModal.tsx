import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useRemoveDriver } from '@/hooks/car-listing/additional-drivers/useRemoveDriver';
import { useSaveAddNewDrivers } from '@/hooks/car-listing/useAddNewDrivers';
import { DAdditionalDriverInfo, TFormAdditionalDriverInfo } from '@/types/checkout/guestVerificationTypes';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import Alert from '@mui/material/Alert/Alert';
import Button from '@mui/material/Button/Button';
import dayjs from 'dayjs';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { IoAdd } from 'react-icons/io5';
import AdditionalDriverFields from './AdditionalDriverFields';

interface AdditionalDriverModalProps {
  setData?: React.Dispatch<React.SetStateAction<any>>;
  dataCar?: any;
}
const AdditionalDriverModal = ({ setData, dataCar }: AdditionalDriverModalProps) => {
  const { travelDetails, guestAccess } = useProfileInfoContext();
  const additionalDriversDefaults =
    travelDetails?.additionalDrivers?.map((driver) => ({
      fullName: driver.fullName,
      email: driver.email,
    })) ?? [];

  const methods = useForm<TFormAdditionalDriverInfo>({
    shouldFocusError: false,
    mode: 'all',
    defaultValues: {
      additionalDrivers: additionalDriversDefaults.length > 0 ? additionalDriversDefaults : DAdditionalDriverInfo.additionalDrivers,
    },
  });

  const { isDirty, isValid } = methods?.formState;

  const { fields, prepend, remove } = useFieldArray({
    control: methods?.control,
    name: 'additionalDrivers',
  });

  const pathName = usePathname();
  const { carListingId, vehicleId } = useParams<{ carListingId: string; vehicleId: string }>();
  const maxDriver = pathName?.includes('insurance-policy') ? 3 : 12;
  const { setAdditionalDrivers, additionalDrivers } = useSearchContext();
  const { closeModal } = useModalContext();
  const { updatedTravelData } = useTravelContext();
  const { mutateAsync } = useSaveAddNewDrivers();
  const { mutateAsync: driverRemoved } = useRemoveDriver();

  // console.log(additionalDrivers);
  useEffect(() => {
    if (additionalDrivers?.length > 0) {
      const newAdditionalDrivers = additionalDrivers.map((driver) => ({
        ...driver,
        // driverContactNumber: driver?.phone?.number || '',
      }));
      methods?.setValue('additionalDrivers', newAdditionalDrivers);
      // console.log(newAdditionalDrivers);
    } else {
      methods?.reset();
    }
  }, [additionalDrivers]);

  const handleAddDriver = () => {
    prepend({ fullName: '', email: '', isActive: false });
  };

  const handleRemoveDriver = async (index: number) => {
    const tempList = methods?.watch('additionalDrivers');
    const deletedItem = tempList?.[index];
    if ((deletedItem?._id && pathName.includes('travels')) || pathName.includes('insurance-policy')) {
      await handleRemoveFromDb(index);
    }
    await remove(index);
    tempList?.map((temp: any, ind: number) => {
      methods?.trigger(`additionalDrivers.${ind}.email`);
      // methods?.trigger(`additionalDrivers.${ind}.driverContactNumber`);
    });
  };

  const handleRemoveFromDb = async (index: number) => {
    try {
      const deletedItem = additionalDrivers.find((driver) => driver.email === methods?.watch(`additionalDrivers.${index}.email`));
      if (deletedItem?._id && pathName.includes('travels')) {
        await driverRemoved({
          driverId: deletedItem?._id,
          listingId: travelDetails?.carListingId?.toString(),
          requestId: deletedItem?.requestId ?? '',
          reservationId: travelDetails?.reservationId?.toString(),
        });
        return;
      }

      if (deletedItem?._id && pathName.includes('insurance-policy')) {
        await driverRemoved({
          driverId: deletedItem?._id,
          listingId: carListingId || vehicleId,
          requestId: deletedItem?.requestId ?? '',
        });
        if (setData && dataCar) {
          setData((prevData: any) => ({
            ...prevData,
            additionalDrivers: prevData?.additionalDrivers.map((driver: any) => {
              if (driver._id === deletedItem?._id) {
                return { ...driver, isActive: false };
              }
              return driver;
            }),
          }));
        }
        return;
      }
    } catch (error) {
      console.log('handleRemoveFromDb error', error);
    }
  };
  const handleSaveDriver = async () => {
    const newData = methods.watch('additionalDrivers').map((driver: any) => ({
      fullName: driver?.fullName,
      email: driver?.email,
    }));
    setAdditionalDrivers(newData);
    closeModal();
  };

  const disableButtons =
    travelDetails?.isTripStarted || (!travelDetails?.isTripStarted && dayjs().isAfter(dayjs(updatedTravelData?.returnDate), 'minute'));

  return (
    // <CommonForm handleFunction={methods?.handleSubmit(onAdditionalDriverSave)}>
    <div>
      {/* {!(pathName.includes('travels') || pathName.includes('reservations')) && ( */}
      {(pathName.includes('travels') || pathName.includes('checkout')) && isGuestRestrict(guestAccess) && (
        <CommonAccStatusAlert isGuest={true} isRestrict={true} />
      )}
      {(pathName.includes('travels') || pathName.includes('checkout')) && isGuestSuspended(guestAccess) && (
        <CommonAccStatusAlert isGuest={true} isSuspend={true} />
      )}
      {!pathName.includes('insurance-policy') ? (
        <span className="helping_text">{`You can add another driver to your trip. This means they're approved to drive the vehicle. They must be registered and approved to drive by Tashus to drive the vehicle during your trip`}</span>
      ) : (
        <span className="helping_text">{`You can add an extra driver who can drive your vehicle. They must be approved by Tashus and registered as an additional driver to drive the vehicle.`}</span>
      )}
      <div className="grid grid-cols-12 p-0">
        <div className="md:col-span-11 col-span-12 flex justify-end">
          <Button
            onClick={handleAddDriver}
            className="mb-4 hover:bg-secondary normal-case hover:font-semibold"
            variant="outlined"
            disabled={
              fields?.length >= maxDriver ||
              !isValid ||
              (pathName.includes('travels') && disableButtons) ||
              ((pathName.includes('travels') || pathName.includes('checkout')) && isGuestRestrict(guestAccess)) ||
              ((pathName.includes('travels') || pathName.includes('checkout')) && isGuestSuspended(guestAccess))
            }
            startIcon={<IoAdd />}
          >
            Add New
          </Button>
        </div>
      </div>
      {/*  )} */}
      {fields?.map((field, index) => {
        return (
          <FormProvider key={index} {...methods}>
            <AdditionalDriverFields
              registerName="additionalDrivers"
              index={index}
              fieldNames={['fullName', 'email', 'driverContactNumber']}
              addFieldFn={handleAddDriver}
              removeFieldFn={handleRemoveDriver}
              disableAddBtn={fields?.length >= maxDriver}
              setData={setData}
              dataCar={dataCar}
            ></AdditionalDriverFields>
          </FormProvider>
        );
      })}
      {fields?.length === 0 && (
        <Alert severity="info" className="my-4 bg-cyan-100">
          No additional driver added
        </Alert>
      )}
      {/* Save Button Removed */}
      {pathName.includes('checkout') && (
        <div className="flex justify-center items-center mt-6">
          <Button variant="contained" type="submit" disabled={!isValid || !isDirty} onClick={handleSaveDriver}>
            {/* <Button variant="contained" type="submit" disabled={!isValid || isObjectEmpty(touchedFields)}> */}
            Save
          </Button>
        </div>
      )}
    </div>
    // </CommonForm>
  );
};

export default AdditionalDriverModal;
