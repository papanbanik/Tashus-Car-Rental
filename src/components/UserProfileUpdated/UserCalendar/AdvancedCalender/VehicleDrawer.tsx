'use client';
import CommonForm from '@/components/Common/CommonForm';
import ConfirmationCheck from '@/components/Common/ConfirmationCheck';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useRemoveCustomPrice } from '@/hooks/vehicle/custom-pricing/useRemoveCustomPrice';
import { useVehicleCustomPrice } from '@/hooks/vehicle/custom-pricing/useVehicleCustomPrice';
import { CustomPricingValues, VehicleDrawerProps } from '@/types/user-profile/customPriceTypes';
import { createCustomDateAtMidnight } from '@/utils/Functions/advancedCalenderFn';
import { Button, Divider, Drawer } from '@mui/material';
import dayjs from 'dayjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import VehicleCustomPrice from './VehicleDrawer/VehicleCustomPrice';
import VehicleFromDate from './VehicleDrawer/VehicleFromDate';
import VehicleIds from './VehicleDrawer/VehicleIds';

const defaultValues: CustomPricingValues = {
  customPricing: {
    fromDate: null,
    toDate: null,
    hostId: '',
    listingIds: [],
    // rateType: 'F',
    // rateChange: 'I',
  },
};
const VehicleDrawer = ({ isDrawerOpen, setIsDrawerOpen, selectedDate, groupData }: VehicleDrawerProps) => {
  const {
    userCred: { userId },
  } = useUserCredContext();
  const { openModal, closeModal } = useModalContext();
  const { mutateAsync: removeCustomPrice, isLoading: isRemoveLoading } = useRemoveCustomPrice();
  const { mutateAsync: saveCustomPrice, isLoading } = useVehicleCustomPrice();
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger, setError, clearErrors } =
    useForm<CustomPricingValues>({
      shouldFocusError: false,
      mode: 'onChange',
      defaultValues: defaultValues,
    });
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
  // useEffect(() => {
  //   const fromDate = watch('customPricing.fromDate');
  //   const toDate = watch('customPricing.toDate');
  //   const getFromDate = dayjs(fromDate).date();
  //   const getFromMonth = dayjs(fromDate).year();
  //   const getFromYear = dayjs(fromDate).month();
  //   const customFromDate = createDateAtMidnight(getFromDate, getFromMonth, getFromYear);
  //   console.log(customFromDate);
  //   const getToDate = dayjs(toDate).date();
  //   const getToMonth = dayjs(toDate).year();
  //   const getToYear = dayjs(toDate).month();
  //   const customToDate = createDateAtMidnight(getToDate, getToMonth, getToYear);
  //   console.log(customToDate);
  //   // if (!dayjs(fromDate).isSame(dayjs(customFromDate), 'date')) {
  //   //   setValue('customPricing.fromDate', customFromDate);
  //   // }
  //   // if (!dayjs(toDate).isSame(dayjs(customToDate), 'date')) {
  //   //   setValue('customPricing.toDate', customToDate);
  //   // }
  // }, [watch('customPricing.fromDate'), watch('customPricing.toDate')]);
  const onCustomPriceSave: SubmitHandler<CustomPricingValues> = async (data) => {
    // console.log('onCustomPriceSave', data);
    const selectedListingIds = groupData?.length > 0 ? groupData.filter((data: any) => data.isSelected).map((data: any) => data.id) : [];
    // const formDate = setToMidnightUTC(data?.customPricing?.fromDate);
    // const toDate = setToMidnightUTC(data?.customPricing?.toDate);
    // const fromDate = data?.customPricing?.fromDate;
    // const toDate = data?.customPricing?.toDate;
    // const getFromDate = dayjs(fromDate).date();
    // const getFromMonth = dayjs(fromDate).month();
    // const getFromYear = dayjs(fromDate).year();
    // const customFromDate = createDateAtMidnight(getFromDate, getFromMonth, getFromYear);
    // const getToDate = dayjs(toDate).date();
    // const getToMonth = dayjs(toDate).month();
    // const getToYear = dayjs(toDate).year();
    // const customToDate = createDateAtMidnight(getToDate, getToMonth, getToYear);
    // console.log(customToDate);
    const customFromDate = createCustomDateAtMidnight(data?.customPricing?.fromDate);
    const customToDate = createCustomDateAtMidnight(data?.customPricing?.toDate);
    if (!!userId) {
      try {
        await saveCustomPrice({
          customPricing: {
            fromDate: customFromDate,
            toDate: customToDate,
            hostId: userId,
            listingIds: selectedListingIds,
            hourlyRates: data?.customPricing?.hourlyRates,
            dailyRates: data?.customPricing?.dailyRates,
            // rateType: data?.customPricing?.rateType,
            // rateChange: data?.customPricing?.rateChange,
          },
        });
        setIsDrawerOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleDoubleConfirmation = () => {
    const fromDate = dayjs(watch('customPricing.fromDate')).format('DD MMM, YYYY');
    const toDate = dayjs(watch('customPricing.toDate')).format('DD MMM, YYYY');
    const selectedListingIds =
      groupData?.length > 0 ? groupData.filter((data: any) => data.isSelected).map((data: any) => `${data?.vehicleName}`) : [];
    const vehicleNames = selectedListingIds.length > 0 ? selectedListingIds?.join(', ') : [];
    const subTitle = `All of your custom prices within ${fromDate} to ${toDate} will be removed from your vehicles: ${vehicleNames}.`;
    openModal({
      content: (
        <ConfirmationCheck
          title="Are you sure to remove the custom prices?"
          subTitle={subTitle}
          agreeButtonText="Yes"
          disagreeButtonText="No"
          agreeButtonAction={onRemoveCustomPriceClick}
          disagreeButtonAction={closeModal}
        ></ConfirmationCheck>
      ),
    });
  };
  const onRemoveCustomPriceClick = async () => {
    const selectedListingIds = groupData?.length > 0 ? groupData.filter((data: any) => data.isSelected).map((data: any) => data.id) : [];
    const customFromDate = createCustomDateAtMidnight(watch('customPricing.fromDate'));
    const customToDate = createCustomDateAtMidnight(watch('customPricing.toDate'));
    if (!!userId) {
      try {
        await removeCustomPrice({
          customPricing: {
            fromDate: customFromDate,
            toDate: customToDate,
            hostId: userId,
            listingIds: selectedListingIds,
          },
        });
        setIsDrawerOpen(false);
        closeModal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} PaperProps={{ style: { maxWidth: '400px' } }}>
      <CommonForm handleFunction={handleSubmit(onCustomPriceSave)}>
        <VehicleFromDate {...commonProps} selectedDate={selectedDate} setIsDrawerOpen={setIsDrawerOpen} />
        <Divider />
        <VehicleIds groupData={groupData} setIsDrawerOpen={setIsDrawerOpen} />
        <Divider />
        <VehicleCustomPrice {...commonProps} />
        <div className="flex flex-col items-center justify-center">
          <Button disabled={!formState?.isValid || isLoading} type="submit" variant="contained" color="primary" className="justify-end normal-case">
            {isLoading ? 'Updating Price' : 'Update Price'}
          </Button>
          <Button
            onClick={handleDoubleConfirmation}
            variant="text"
            color="primary"
            className="normal-case mt-2"
            disabled={!watch('customPricing.toDate') || !!formState?.errors?.customPricing?.toDate || isRemoveLoading}
          >
            {isRemoveLoading ? 'Removing' : 'Remove'} Custom Price
          </Button>
        </div>
      </CommonForm>
    </Drawer>
  );
};

export default VehicleDrawer;
