import IosSwitch from '@/components/Common/HookFormFields/IosSwitch';
import SelectRadioBtn from '@/components/Common/HookFormFields/SelectRadioBtn';
import { HookFormComponentProps } from '@/types/componentTypes';
import { peakIncreaseDays, peakIncreaseTypes } from '@/utils/Lists/carListInfo';
import { Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import SectionHeader from '../SectionHeader';

const PeakIncrease = ({ control, register, watch, formState, setValue }: HookFormComponentProps) => {
  const { errors, isDirty, touchedFields, isValid, isSubmitting } = formState;
  const validateIncreaseField = (value: any) => {
    if (watch('peakIncrease')?.length > 0 && watch('peakIncreaseType') === 'percentage' && parseFloat(value) > 100) {
      return 'Invalid percentage';
    }
    if (watch('peakIncrease')?.length > 0) {
      return value > 0 || '0 is invalid';
    }
    if (watch('peakIncrease')?.length === 0) {
      setValue('peakIncreasePercentage', '');
      setValue('peakIncreaseAmount', '');
      setValue('peakIncreaseType', '');
    }
  };
  return (
    <Grid container className="mb-12">
      <Grid item className="mt-8" xs={12} sm={12} md={12} lg={12} xl={12}>
        <SectionHeader
          title="Peak Increase"
          subtitle={`${watch('hasPeakIncrease') ? 'Please select the peak increase days first before applying the increase rate.' : ''}`}
        >
          <div className="ml-4">
            <IosSwitch
              control={control}
              registerName="hasPeakIncrease"
              size="large"
              label=""
              watch={watch}
              // required={!watch('noticeInAdvance.hoursRequired')}
            ></IosSwitch>
          </div>
          <Tooltip
            enterTouchDelay={0}
            title="The daily and hourly rates will rise according to the specified increase rate on the selected days of the week"
            placement="top"
          >
            <IconButton size="small">
              <AiOutlineExclamationCircle className="text-gray-400" size={22} />
            </IconButton>
          </Tooltip>
        </SectionHeader>
      </Grid>
      {watch('hasPeakIncrease') ? (
        <>
          <Grid item xs={12} sm={6} md={5} lg={5} xl={6} className="">
            <SelectRadioBtn control={control} registerName="peakIncrease" options={peakIncreaseDays} exclusive={false}></SelectRadioBtn>
          </Grid>
          <Grid item xs={4} sm={2} md={2} lg={3} xl={2} className="flex md:justify-end justify-start items-start">
            <p className="font-semibold text-lg  md:mt-2 mt-6">Increase</p>
          </Grid>
          <Grid item container xs={8} sm={4} md={5} lg={4} xl={4} className="flex md:justify-end justify-start md:mt-0 mt-4">
            <Grid item className="" xs={7} sm={6} md={5} lg={5} xl={5}>
              <TextField
                size="small"
                label="Rate"
                disabled={watch('peakIncrease')?.length === 0}
                value={watch('peakIncreaseType') === 'percentage' ? watch('peakIncreasePercentage') : watch('peakIncreaseAmount')}
                sx={{
                  '& fieldset.MuiOutlinedInput-notchedOutline': {
                    borderColor: `${watch('peakIncreasePercentage') || watch('peakIncreaseAmount') ? '' : '#800080'}`,
                  },
                  '& .MuiOutlinedInput-root': {
                    paddingRight: 0,
                  },
                }}
                InputLabelProps={{
                  style: { color: `${watch('peakIncreasePercentage') || watch('peakIncreaseAmount') ? '' : '#800080'}` },
                }}
                {...register(watch('peakIncreaseType') === 'percentage' ? 'peakIncreasePercentage' : 'peakIncreaseAmount', {
                  required: watch('peakIncrease')?.length > 0,
                  pattern: {
                    value: /^\d{1,5}(\.\d{1,2})?$/, //includes positive digits (0-9), supports decimal, 5 characters before . and 2 after decimal
                    message: 'Invalid amount',
                  },
                  validate: validateIncreaseField,
                })}
                error={watch('peakIncreaseType') === 'percentage' ? !!errors?.peakIncreasePercentage : !!errors?.peakIncreaseAmount}
                helperText={
                  watch('peakIncreaseType') === 'percentage' ? errors?.peakIncreasePercentage?.message : errors?.peakIncreaseAmount?.message
                }
              />
            </Grid>
            <Grid item xs={5} sm={5} md={6} lg={5} xl={5} className="justify-end">
              <SelectRadioBtn
                control={control}
                registerName="peakIncreaseType"
                options={peakIncreaseTypes}
                exclusive={true}
                lightColor={true}
                required={watch('peakIncrease')?.length > 0}
              ></SelectRadioBtn>
            </Grid>
          </Grid>
        </>
      ) : (
        <p>No peak increase</p>
      )}
    </Grid>
  );
};

export default PeakIncrease;
