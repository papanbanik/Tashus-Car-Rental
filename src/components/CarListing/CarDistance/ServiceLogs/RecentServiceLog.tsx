import CommonTooltip from '@/components/Common/CommonTooltip';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { useCarListingContext } from '@/context/CarListingProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { currentDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { IoInformationCircleOutline } from 'react-icons/io5';
import SectionHeader from '../../SectionHeader';

const RecentServiceLog = ({
  register,
  control,
  watch,
  formState,
  setValue,
  reset,
  getValues,
  trigger,
  setError,
  clearErrors,
}: HookFormComponentProps) => {
  const { errors } = formState;
  const { carData } = useCarListingContext();

  const validateSelectedDate = (selectedDate: any) => {
    const serviceLogs = carData?.carServiceLog?.serviceLogs || [];
    if (serviceLogs.length > 0) {
      const latestServiceDate = dayjs(serviceLogs[serviceLogs.length - 1]?.serviceDate);
      return (
        (dayjs(selectedDate).isBefore(currentDateTime) &&
          (dayjs(selectedDate).isAfter(latestServiceDate) || dayjs(selectedDate).isSame(latestServiceDate))) ||
        'Date should not before latest one'
      );
    }
    return true;
  };

  const validateOdometer = (value: any) => {
    const parsedValue = parseFloat(value);
    const hasDecimal = value?.toString()?.includes('.');
    const maxOdometer = 250000;
    if (hasDecimal) {
      return 'Only integer values are allowed';
    }
    if (parsedValue > maxOdometer) {
      return `Odometer reading should not exceed ${maxOdometer}KM`;
    }
    const serviceLogs = carData?.carServiceLog?.serviceLogs || [];
    const carMileage = carData?.car?.mileage?.distance || 0;
    if (serviceLogs && serviceLogs.length > 0) {
      const latestServiceOdometer = serviceLogs[serviceLogs.length - 1]?.odometer || 0;
      if (parsedValue < latestServiceOdometer) {
        return `Odometer must be equal to or greater than the latest service odometer reading ${latestServiceOdometer}.`;
      }
    } else {
      if (parsedValue < (carMileage || 0)) {
        return 'Odometer must be equal to or greater than car mileage.';
      }
    }
    return true;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
      <SectionHeader title="Most Recent Service" textSize="text-md" fontStyle="font-normal" noMargin={true}>
        <CommonTooltip
          title="The system can notify you when Service Due is approaching so you can schedule an appointment. This helps ensure maintenance is timely."
          placement="right"
          arrow
        >
          <IconButton size="small">
            <IoInformationCircleOutline className="text-gray-400 ml-4" size={18} />
          </IconButton>
        </CommonTooltip>
      </SectionHeader>
      <div className="flex flex-row gap-1">
        <SingleDatePicker
          control={control}
          required={true}
          registerName={'serviceLog.serviceDate'}
          placeholder="Date"
          errors={errors?.serviceLog?.serviceDate}
          disablePast={false}
          disableFuture={true}
          disableHighlightToday={true}
          register={register}
          validateDate={validateSelectedDate}
        />
        <div className="md:w-[275px] relative flex">
          <TextField
            size="small"
            label="Odometer"
            type="number"
            value={watch('serviceLog.odometer') || ''}
            {...register('serviceLog.odometer', {
              required: true,
              validate: validateOdometer,
            })}
            error={!!errors?.serviceLog?.odometer}
            helperText={errors?.serviceLog?.odometer?.message}
          />
          <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-e-md" position="end">
            <p>KM</p>
          </InputAdornment>
        </div>
      </div>
    </div>
  );
};

export default RecentServiceLog;
