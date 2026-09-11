import CommonTooltip from '@/components/Common/CommonTooltip';
import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import { HookFormComponentProps } from '@/types/componentTypes';
import { maxDistanceKM } from '@/utils/Lists/carListInfo';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { IoInformationCircleOutline } from 'react-icons/io5';
import SectionHeader from '../SectionHeader';

const UnlimitedTravel = ({
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
  const iconTextMap = {
    maximumDailyDistance: "Set driving limits to accommodate your guests' needs",
    additionalFeePerKilometer: `${
      watch('distance.unlimitedTravel')
        ? 'There will be an additional fee per kilometer if guests do not return with the same fuel.'
        : 'Guests will incur an additional fee per kilometer if they drive beyond the included distance. You can set how much you want to charge per additional kilometer.'
    }`,
  };
  return (
    <div>
      <SectionHeader
        title="Unlimited Travel"
        subtitle="Increase bookings by providing unlimited travel distance! Offering unlimited distance gives guests a sense of comfort, and they are more likely to stay within their desired travel radius, leading them to drive only the necessary distance."
      >
        <div className="ml-24">
          <IosSwitch control={control} registerName="distance.unlimitedTravel" size="large" />
        </div>
      </SectionHeader>
      {/* {!watch('distance.unlimitedTravel') && ( */}
      <>
        <Box className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {!watch('distance.unlimitedTravel') && (
            <>
              <div>
                <SectionHeader title="Maximum Daily Distance" textSize="text-md" fontStyle="font-normal" noMargin={true}>
                  <CommonTooltip title={iconTextMap.maximumDailyDistance} arrow={true} placement="bottom">
                    <IconButton className="bg-transparent">
                      <IoInformationCircleOutline
                        className="text-gray-400 ml-4"
                        size={18}
                        // onClick={() => toggleIcon('maximumDailyDistance')}
                      />
                    </IconButton>
                  </CommonTooltip>
                </SectionHeader>
              </div>
              {/* <div className="w-full md:w-[275px] relative flex"> */}
              <div className="relative flex">
                <SearchableDropdown
                  control={control}
                  registerName="distance.maximumDailyDistance"
                  options={maxDistanceKM}
                  label="Distance"
                  defaultValue={watch('distance.maximumDailyDistance')}
                  required={!watch('distance.unlimitedTravel')}
                />
                <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200 rounded-e-md" position="end">
                  <p>KM</p>
                </InputAdornment>
              </div>

              <div>
                <SectionHeader title="Additional Fee Per Kilometer" textSize="text-md" fontStyle="font-normal" noMargin={true}>
                  <CommonTooltip title={iconTextMap.additionalFeePerKilometer} arrow={true} placement="bottom">
                    <IconButton className="bg-transparent">
                      <IoInformationCircleOutline
                        className="text-gray-400 ml-4"
                        size={18}
                        // onClick={() => toggleIcon('additionalFeePerKilometer')}
                      />
                    </IconButton>
                  </CommonTooltip>
                </SectionHeader>
              </div>
              {/* <div className="w-full md:w-[500px] relative flex"> */}
              <div className="relative flex">
                <TextField
                  fullWidth
                  size="small"
                  label="Additional Fee"
                  // sx={{
                  //   '& fieldset.MuiOutlinedInput-notchedOutline': {
                  //     borderColor: `${watch('distance.additionalFeePerKilometer') ? '' : '#f87272'}`,
                  //   },
                  // }}
                  // InputLabelProps={{
                  //   style: { color: `${watch('distance.additionalFeePerKilometer') ? '' : '#f87272'}` },
                  // }}
                  {...register('distance.additionalFeePerKilometer', {
                    required: !watch('distance.unlimitedTravel'),
                    pattern: {
                      // value: /^\d{1,3}?$/,
                      // value: /^0*\d{0,3}(\.\d+)?$/,
                      value: /^0*\d{0,3}(\.\d{1,4})?$/,
                      message: 'Invalid amount',
                    },
                    validate: (value) => value > 0 || '0 is invalid',
                  })}
                  error={!!errors?.distance?.additionalFeePerKilometer}
                  helperText={errors?.distance?.additionalFeePerKilometer?.message}
                />
                <InputAdornment className="px-2 m-0 h-10 max-h-10 bg-gray-200" position="end">
                  <p>¢/km</p>
                </InputAdornment>
              </div>
            </>
          )}
        </Box>
      </>
      {/* )} */}
    </div>
  );
};

export default UnlimitedTravel;
