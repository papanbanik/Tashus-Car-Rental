import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { HookFormComponentProps } from '@/types/componentTypes';
import { TextField } from '@mui/material';

interface ResidentialInfoProps extends HookFormComponentProps {
  isDisabledData?: boolean;
}
const ResidentialInfo = ({
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
  isDisabledData,
}: ResidentialInfoProps) => {
  const { errors } = formState;
  const isIPadPro = useIPadProQuery();
  return (
    <div>
      <TextField
        disabled={isDisabledData}
        label="Residential Address"
        fullWidth
        size="small"
        variant="outlined"
        value={watch('address') || ''}
        {...register('address', {
          required: true,
          pattern: {
            value: /^.{1,100}$/,
            message: 'Address length must be less than or equal to 100 characters long',
          },
        })}
        error={!!errors?.address}
        helperText={errors?.address?.message}
      />
    </div>
  );
};

export default ResidentialInfo;
