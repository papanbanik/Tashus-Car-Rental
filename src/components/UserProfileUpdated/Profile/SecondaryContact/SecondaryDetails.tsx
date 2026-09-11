'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { TextField } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
interface SecondaryDetailsProps extends HookFormComponentProps {
  isEdit: boolean;
}
const SecondaryDetails = ({
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
}: SecondaryDetailsProps) => {
  const { errors } = formState;
  const { userProfileInfo } = useUserCredContext();
  const handleSecondaryPhoneInputChange = (phoneNumber: string, country: any) => {
    if (watch('secondaryContact.phone.country') !== country?.name) {
      setValue('secondaryContact.phone.number', `+${country?.dialCode}`);
      setValue('secondaryContact.phone.code', `+${country?.dialCode}`);
      setValue('secondaryContact.phone.country', country?.name);
      setValue('secondaryContact.phone.shortCode', country?.countryCode);
    } else {
      setValue('secondaryContact.phone.number', `+${phoneNumber}`);
      setValue('secondaryContact.phone.code', `+${country?.dialCode}`);
      setValue('secondaryContact.phone.country', country?.name);
      setValue('secondaryContact.phone.shortCode', country?.countryCode);
    }
  };
  const secondaryPhoneInputError = errors?.contactData?.secondaryContact?.phone?.message;
  return (
    <div className="grid grid-cols-1 place-items-center justify-items-start md:w-1/2">
      {/* <span>Full Name</span> */}
      <TextField
        disabled={!isEdit}
        label="Full Name"
        fullWidth
        size="small"
        variant="outlined"
        value={watch('secondaryContact.name') || ''}
        {...register('secondaryContact.name', {
          required: true,
        })}
        error={!!errors?.secondaryContact?.name}
        helperText={errors?.secondaryContact?.name?.message}
        className="mb-2"
      />
      {/* <span>Phone Number</span> */}
      <PhoneInput
        disabled={!isEdit}
        country={'au'}
        autoFormat={false}
        // placeholder="Phone Number"
        enableSearch={true}
        // onlyCountries={['us', 'bd', 'au', 'ru', 'in', 'pk', 'my', 'de', 'pl', 'id', 'fr', 'ie']}
        inputStyle={{ width: '100%', backgroundColor: !isEdit ? '#f0f0f0' : '', color: !isEdit ? '#a0a0a0' : '' }}
        countryCodeEditable={false}
        specialLabel=""
        value={
          userProfileInfo?.secondaryContact?.phone?.code &&
          `+${userProfileInfo?.secondaryContact?.phone?.code || watch('secondaryContact.phone.code')}${
            userProfileInfo?.secondaryContact?.phone?.number || ''
          }`
        }
        onChange={handleSecondaryPhoneInputChange}
      />
      {secondaryPhoneInputError && <span className="text-error">{secondaryPhoneInputError}</span>}
    </div>
  );
};

export default SecondaryDetails;
