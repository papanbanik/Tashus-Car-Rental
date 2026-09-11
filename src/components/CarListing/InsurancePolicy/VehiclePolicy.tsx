import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { VehicleInfoEditProps } from '@/types/car-listing/carListingTypes';
import { HookFormComponentProps } from '@/types/componentTypes';
import { InputAdornment, TextField, Typography } from '@mui/material';
import SectionHeader from '../SectionHeader';

const VehiclePolicy = ({
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
  isEdit,
}: HookFormComponentProps & VehicleInfoEditProps) => {
  const { errors } = formState;
  const helpText = {
    vehicleMarketValue: `Kindly enter the present market value of your vehicle. The accepted range is from 0 to $50,000 AUD. The assessment is also contingent upon our insurance provider's evaluation. By listing your car, you acknowledge and confirm your understanding of this coverage limit`,
    partnershipPolicy: `Check to confirm understanding of the 75% partner income share.`,
  };
  return (
    <div>
      <SectionHeader title="Vehicle Market Value" subtitle={helpText.vehicleMarketValue} />
      <CheckBox
        control={control}
        registerName="isAgreedCoverage"
        htmlLabel={<span className={`text-justify `}>I hereby acknowledge and agree to the contingent coverage terms as stated.</span>}
        required={true}
        // disabled={isEdit}
      />
      {/* <Box className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4  md:gap-x-20 items-center mt-4">
        <div>
          <Typography className="font-semibold text-lg">Vehicle Market Value</Typography>
        </div>
        <div className="relative flex">
          <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-l-md" position="start">
            <p>$</p>
          </InputAdornment>
          <TextField
            size="small"
            label="Vehicle value"
            type="number"
            value={watch('carMarketValue')}
            {...register('carMarketValue', {
              required: true,
              pattern: {
                value: /^(?:[0-4]\d{4}|50000|[0-9]|[1-9]\d{1,3})$/, // 0 to 50000 dollar
                message: 'Market value surpasses the insurance threshold for listing the car on Tashus',
              },
            })}
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment className="bg-gray-200 px-2 m-0 h-10 rounded-e-md max-h-10" position="start">
            //       <p>$</p>
            //     </InputAdornment>
            //   ),
            // }}
            error={!!errors?.carMarketValue}
            // helperText={errors?.carMarketValue?.message}
            disabled={isEdit}
          />
        </div>
      </Box> */}
      <div className=" grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4  md:gap-x-20 gap-y-0 items-center mt-4">
        <div>
          <Typography className="font-semibold text-lg">Vehicle Market Value</Typography>
        </div>
        <div className="relative flex mt-4 md:mt-0">
          <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-l-md" position="start">
            <p>$</p>
          </InputAdornment>
          <TextField
            size="small"
            label="Vehicle value"
            // type="number"
            value={watch('insurance.carMarketValue')}
            {...register('insurance.carMarketValue', {
              required: true,
              pattern: {
                value: /^(?:[0-4]\d{4}|50000|[0-9]|[1-9]\d{1,3})$/, // 0 to 50000 dollar
                message: 'Market value surpasses the insurance threshold for listing the car on Tashus',
              },
            })}
            error={!!errors?.insurance?.carMarketValue}
            // helperText={errors?.carMarketValue?.message}
            // disabled={isEdit}
          />
        </div>
        <div className="bg-green-300" />
        <span>
          {errors?.insurance?.carMarketValue && (
            <span className="text-error text-sm transform translate-y-full">{errors?.insurance?.carMarketValue?.message}</span>
          )}
        </span>
      </div>
      <Typography className="my-4 text-justify text-sm text-accent">
        <b>{`N.B:`}</b>{' '}
        {`Please note that if the market value of your vehicle exceeds $50,000, it may not fall under insurance coverage. The value you
        provide will be considered by the insurance provider for determining coverage. Your input is vital for accurate insurance valuation. Ensuring
        an updated and precise market value of your vehicle is crucial for comprehensive coverage and future assessments.`}
      </Typography>
      {/* <SectionHeader title="Partnership Policy" subtitle={helpText.partnershipPolicy} />
      <CheckBox
        control={control}
        registerName="isPartnerAgreed"
        htmlLabel={
          <span className={` text-justify `}>
            As a valued partner, you receive 75% of income from each successful booking, with Tashus retaining 25%.
          </span>
        }
        required={true}
        disabled={isEdit}
      />
      <Typography className="my-4 text-justify text-sm text-accent">
        <b>{`N.B:`}</b>{' '}
        {`This checkbox confirms your understanding of the partnership policy. As a partner, you'll receive 75% of the income from every
        successful reservation, while Tashus retains 25%. Check this box to acknowledge your agreement with this policy.`}
      </Typography> */}
    </div>
  );
};

export default VehiclePolicy;
