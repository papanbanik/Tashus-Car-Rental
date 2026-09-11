import CommonTooltip from '@/components/Common/CommonTooltip';
import { useCarListingContext } from '@/context/CarListingProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { calculateCost } from '@/utils/Functions/carListingCommonFn';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import SectionHeader from '../../SectionHeader';

const FuelEconomy = ({ register, control, watch, formState, setValue, reset, getValues, trigger, setError, clearErrors }: HookFormComponentProps) => {
  const { errors } = formState;
  const iconTextMap = {
    fuelEconomy: 'This represents the maximum amount of fuel required to travel 100 km, as specified by the car manufacturer or guides.',
  };
  const { carData } = useCarListingContext();
  const unitPrice = carData?.car?.fuelInfo?.unitPrice ?? 0;
  const maxFuel = !!watch('fuelEconomy.maxFuel') ? watch('fuelEconomy.maxFuel') : 0;
  useEffect(() => {
    const calculateAndSetCost = async () => {
      if (!!maxFuel) {
        const cost = await calculateCost(unitPrice, maxFuel);
        const formattedCost = cost.toFixed(2);
        setValue('fuelEconomy.fuelCost', formattedCost);
      }
    };
    calculateAndSetCost();
  }, [watch('fuelEconomy.maxFuel'), maxFuel]);

  return (
    <div>
      <Box className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <SectionHeader title="Fuel Economy" textSize="text-md" fontStyle="font-normal" noMargin={true}>
            <CommonTooltip title={iconTextMap.fuelEconomy} arrow={true}>
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
            value={watch('fuelEconomy.maxFuel') || ''}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${!!watch('fuelEconomy.maxFuel') ? '' : '#f87272'}`,
              },
              '& .MuiInputLabel-outlined': {
                color: `${!!watch('fuelEconomy.maxFuel') ? '' : '#f87272'}`,
              },
            }}
            label="Fuel Economy"
            type="number"
            {...register('fuelEconomy.maxFuel', {
              required: !watch('fuelGauge.vehicleKilometersRange'),
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: 'Invalid Fuel Economy',
              },
              validate: {
                positiveNumber: (value) => {
                  const numberValue = parseFloat(value);
                  if (isNaN(numberValue) || numberValue <= 0) {
                    return 'Fuel Economy must be a positive number greater than zero';
                  }
                  return true;
                },
              },
            })}
            error={!!errors?.fuelEconomy?.maxFuel}
            helperText={errors?.fuelEconomy?.maxFuel?.message || ''}
          />
          <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-e-md" position="end">
            {/* will add dynamic unitName */}
            <p>{`${carData?.car?.fuelInfo?.unitName ?? 'Litre'}`}</p>
          </InputAdornment>
        </div>
      </Box>
      <Box className="grid md:grid-cols-2 grid-cols-1 gap-4 my-4">
        <div>
          <SectionHeader title="Per KM Cost" textSize="text-md" fontStyle="font-normal" noMargin={true} />
        </div>
        <div className="relative flex">
          <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-s-md" position="start">
            <p>{`$`}</p>
          </InputAdornment>
          <TextField
            size="small"
            fullWidth
            value={watch('fuelEconomy.fuelCost') || ''}
            label="Per KM Cost"
            {...register('fuelEconomy.fuelCost', {
              required: !!watch('fuelEconomy.maxFuel'),
            })}
            disabled
          />
        </div>
      </Box>
    </div>
  );
};

export default FuelEconomy;
