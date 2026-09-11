import CommonTooltip from '@/components/Common/CommonTooltip';
import { HookFormComponentProps } from '@/types/componentTypes';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { IoInformationCircleOutline } from 'react-icons/io5';
import SectionHeader from '../../SectionHeader';

const FuelInfo = ({ register, control, watch, formState, setValue, reset, getValues, trigger, setError, clearErrors }: HookFormComponentProps) => {
  const { errors } = formState;
  const iconTextMap = {
    fuelRange:
      'Please provide an estimate of the distance that your car can travel with the current amount of fuel. This information will help us ensure that you have enough fuel for your trip.',
    fuelPicture: `To assist our system in documenting the fuel range accurately and resolving any potential fuel gap claims, please upload a clear picture of your car's dashboard that includes the fuel range display`,
  };
  const validateVehicleRangeOld = (value: any) => {
    if (!!watch('fuelEconomy.maxFuel')) {
      return true;
    }
    const parsedValue = parseFloat(value);
    const hasDecimal = value?.toString()?.includes('.');
    const maxValue = 2000;
    if (hasDecimal) {
      return 'Only integer values are allowed';
    }

    return (parsedValue >= 0 && parsedValue <= maxValue) || `Vehicle range must be between 0 to ${maxValue} km`;
  };
  const validateVehicleRange = (value: any) => {
    if (value) {
      const parsedValue = parseFloat(value);
      const hasDecimal = value?.toString()?.includes('.');
      const maxValue = 2000;
      if (hasDecimal) {
        return 'Only integer values are allowed';
      }
      return (parsedValue >= 0 && parsedValue <= maxValue) || `Vehicle range must be between 0 to ${maxValue} km`;
    } else if (!!watch('fuelEconomy.maxFuel')) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <Box className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <SectionHeader title="Range when Full Tank" textSize="text-md" fontStyle="font-normal" noMargin={true}>
            <CommonTooltip title={iconTextMap.fuelRange} arrow={true} placement="bottom">
              <IconButton className="bg-transparent">
                <IoInformationCircleOutline className="text-gray-400 ml-4" size={18} />
              </IconButton>
            </CommonTooltip>
          </SectionHeader>
        </div>
        <div className="relative flex">
          <TextField
            size="small"
            fullWidth
            label="Vehicle Range"
            type="number"
            value={watch('fuelGauge.vehicleKilometersRange') || ''}
            {...register('fuelGauge.vehicleKilometersRange', {
              required: !watch('fuelEconomy.maxFuel'),
              validate: validateVehicleRange,
            })}
            error={!!errors?.fuelGauge?.vehicleKilometersRange}
            helperText={errors?.fuelGauge?.vehicleKilometersRange?.message}
          />
          <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-e-md" position="end">
            <p>KM</p>
          </InputAdornment>
        </div>
      </Box>
    </div>
  );
};

export default FuelInfo;
