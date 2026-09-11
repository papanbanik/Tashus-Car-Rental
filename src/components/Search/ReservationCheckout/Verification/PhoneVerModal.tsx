import CommonForm from '@/components/Common/CommonForm';
import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { usePhoneVerificationSave } from '@/hooks/guest-verification/usePhoneVerificationSave';
import { TPhoneVerification } from '@/types/checkout/guestVerificationTypes';
import Alert from '@mui/material/Alert/Alert';
import Button from '@mui/material/Button/Button';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import PhoneOTPVerify from './PhoneOTPVerify';

const PhoneVerModal = () => {
  const { control, register, handleSubmit, watch, formState, reset, getValues, setValue, trigger } = useForm<TPhoneVerification>({
    shouldFocusError: false,
    mode: 'onChange',
    // defaultValues: defaultValues,
  });
  const { errors, isValid } = formState;
  const [isOTPSent, setIsOTPSent] = useState<boolean>(false);
  const { userCred } = useUserCredContext();
  const { mutateAsync, isLoading } = usePhoneVerificationSave();
  const { openModal } = useModalContext();
  const handlePhoneNumChange = (phoneNumber: string, country: any) => {
    // console.log(country);
    // console.log(phoneNumber);
    // const x = validatePhoneNumberLength(`${phoneNumber}`, country?.countryCode?.toUpperCase());
    // console.log(x);
    if (watch('country') !== country?.name) {
      setValue('number', `+${country?.dialCode}`);
      setValue('code', `+${country?.dialCode}`);
      setValue('country', country?.name);
      setValue('shortCode', country?.countryCode);
    } else {
      setValue('number', `+${phoneNumber}`);
      setValue('code', `+${country?.dialCode}`);
      setValue('country', country?.name);
      setValue('shortCode', country?.countryCode);
    }
  };

  const savePhoneData: SubmitHandler<TPhoneVerification> = async (data) => {
    // console.log(data);
    const countryCode = data?.code || '';
    const modifiedData = {
      ...data,
      number: data?.number?.replace(countryCode, '') || '',
    };
    // console.log(modifiedData);
    // const { isVerified, ...others } = data;
    const { isVerified } = data;
    if (userCred?.userId) {
      // mutateAsync({ userId: userCred?.userId, phoneNumberInfo: { ...others } });
      await mutateAsync({ userId: userCred?.userId, phoneNumberInfo: { isVerified, ...modifiedData } });
      setIsOTPSent(true);
    }
  };

  return (
    <CommonForm handleFunction={handleSubmit(savePhoneData)}>
      <PhoneInput
        country={'au'}
        autoFormat={false}
        placeholder="Phone Number"
        enableSearch={true}
        // onlyCountries={['us', 'bd', 'au', 'ru', 'in', 'pk', 'my', 'de', 'pl', 'id', 'fr', 'ie']}
        inputStyle={{ width: '100%', height: '40px' }}
        value={watch('number')}
        onChange={handlePhoneNumChange}
        // isValid={(value: any, country: any) => {
        //   console.log(value, country);
        //   if (value.match(/12345/)) {
        //     return 'Invalid value: ' + value + ', ' + country.name;
        //   } else if (value.match(/1234/)) {
        //     return false;
        //   } else {
        //     return true;
        //   }
        // }}
      />
      {/* {phoneInputError && <span className="text-error text-xs">{phoneInputError}</span>} */}

      <Alert className="mt-4" severity="info">
        {'Please share your available contact number. The host will use it to get in touch with you.'}
      </Alert>
      {isOTPSent ? (
        <PhoneOTPVerify />
      ) : (
        <div className="flex justify-center items-center mt-6">
          <Button variant="contained" type="submit" disabled={watch('number') === watch('code') || (watch('number')?.length || 0) < 6 || isLoading}>
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      )}
    </CommonForm>
  );
};

export default PhoneVerModal;
