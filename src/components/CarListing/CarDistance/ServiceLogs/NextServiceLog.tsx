import CommonTooltip from '@/components/Common/CommonTooltip';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { HookFormComponentProps } from '@/types/componentTypes';
import { validateServiceLogExpiryDate } from '@/utils/Functions/carListingCommonFn';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { IoInformationCircleOutline } from 'react-icons/io5';
import SectionHeader from '../../SectionHeader';

const NextServiceLog = ({
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
    return (
      (parsedValue >= watch('serviceLog.odometer') && parsedValue <= maxOdometer) || 'Odometer must be equal to or greater than service odometer.'
    );
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
      <SectionHeader title="Service Due" textSize="text-md" fontStyle="font-normal" noMargin={true}>
        <CommonTooltip
          title={`When you drop your vehicle off for service, it's a good idea to schedule its next maintenance appointment before you leave. This helps ensure your vehicle continues to receive timely care.`}
          placement="right"
          arrow
        >
          <IconButton className="bg-transparent">
            <IoInformationCircleOutline
              className="text-gray-400 ml-4"
              size={18}
              // onClick={() => toggleIcon('maximumDailyDistance')}
            />
          </IconButton>
        </CommonTooltip>
      </SectionHeader>

      <div className="flex flex-row gap-1">
        <SingleDatePicker
          control={control}
          required={true}
          registerName={'serviceLog.nextServiceDate'}
          placeholder="Due Date"
          errors={errors?.serviceLog?.nextServiceDate}
          disablePast={true}
          register={register}
          validateDate={validateServiceLogExpiryDate}
          minDate={dayjs().add(1, 'day').toDate()}
          pickerHeight="40px"
        />
        <div className="md:w-[275px] relative flex">
          <TextField
            size="small"
            label="Due Odometer"
            type="number"
            value={watch('serviceLog.nextServiceDueOdometer') || ''}
            {...register('serviceLog.nextServiceDueOdometer', {
              required: true,
              validate: validateOdometer,
              // validate: (value) => value >= (watch('serviceLog.odometer') || 0) || 'Odometer must be equal to or greater than service odometer.',
            })}
            error={!!errors?.serviceLog?.nextServiceDueOdometer}
            helperText={errors?.serviceLog?.nextServiceDueOdometer?.message}
          />
          <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-e-md" position="end">
            <p>KM</p>
          </InputAdornment>
        </div>
      </div>
    </div>
  );
};

export default NextServiceLog;
