import CommonForm from '@/components/Common/CommonForm';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { usePhoneVerificationSave } from '@/hooks/guest-verification/usePhoneVerificationSave';
import { TPhoneVerification } from '@/types/checkout/guestVerificationTypes';
import { isGuestRestrict, isGuestSuspended, isPartnerRestrict, isPartnerSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Autocomplete, Button, TextField, useMediaQuery } from '@mui/material';
import { Country, ICountry } from 'country-state-city';
import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ContactOTPModal from './ContactOTPModal';

const countryIsoList = ['US', 'BD', 'AU', 'RU', 'IN', 'PK', 'MY', 'DE', 'PL', 'ID', 'FR', 'IE'];

const ContactVerify = () => {
  const defaultCountry = Country.getCountryByCode('AU') || null;
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(defaultCountry); // Default to AU or null
  //const [phoneCode, setPhoneCode] = useState<string>(defaultCountry ? `+${defaultCountry.phonecode}` : '');
  const [phonePrefix, setPhonePrefix] = useState<string>('');
  const [phoneRemainingNumber, setPhoneRemainingNumber] = useState<string>('');
  const filteredCountries = Country.getAllCountries().filter((country) => countryIsoList.includes(country.isoCode));
  // Ref for the remaining phone number input field
  const prefixInputRef = useRef<HTMLInputElement>(null);
  const remainingPhoneInputRef = useRef<HTMLInputElement>(null);
  //To save phone Number
  const { handleSubmit, watch, formState, setValue } = useForm<TPhoneVerification>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { openModal } = useModalContext();
  const { userCred, userProfileInfo } = useUserCredContext();
  const { partnerAccess, guestAccess, timeInterval } = useProfileInfoContext();
  const { mutateAsync: phoneOTPSend, isLoading } = usePhoneVerificationSave();

  const savePhoneData: SubmitHandler<TPhoneVerification> = async (data) => {
    try {
      const phoneNumber = watch('number');
      const countryDialCode = watch('code') || '';
      const countryName = watch('country');
      const countryCode = watch('shortCode');
      const phoneData = {
        isVerified: false,
        number: phoneNumber?.replace(countryDialCode, ''),
        code: countryDialCode,
        country: countryName,
        shortCode: countryCode,
      };
      if (userCred?.userId && phoneNumber) {
        const fullPhoneNumber = `${countryDialCode}${phoneNumber.replace(countryDialCode, '')}`;
        if (timeInterval <= 0) {
          await phoneOTPSend({ userId: userCred?.userId, phoneNumberInfo: phoneData });
        }
        openModal({
          title: 'Phone Verification',
          content: <ContactOTPModal phoneNumber={fullPhoneNumber || ''} />,
        });
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  //Set from Previous Data
  useEffect(() => {
    const getContactNumber = async () => {
      if (userProfileInfo?.verificationInfo?.phone) {
        setValue('code', userProfileInfo?.verificationInfo?.phone?.code);
        setValue('number', userProfileInfo?.verificationInfo?.phone?.number);
        setValue('country', userProfileInfo?.verificationInfo?.phone?.country);
        setValue('shortCode', userProfileInfo?.verificationInfo?.phone?.shortCode);
        //Set Selected country
        const shortCode = userProfileInfo?.verificationInfo?.phone?.shortCode?.toUpperCase();
        if (shortCode) {
          const country = filteredCountries.find((country) => country.isoCode === shortCode) || null;
          setSelectedCountry(country);
        } else {
          setSelectedCountry(null);
        }
        //Set Phone Number
        const phoneNumber = userProfileInfo?.verificationInfo?.phone?.number;
        if (phoneNumber) {
          const prefix = phoneNumber.slice(0, 2);
          const remaining = phoneNumber.slice(2);
          setPhonePrefix(prefix);
          setPhoneRemainingNumber(remaining);
        } else {
          setSelectedCountry(defaultCountry);
          setValue('code', defaultCountry ? `+${defaultCountry.phonecode}` : '+61');
          setValue('country', defaultCountry ? defaultCountry.name : 'Australia');
          setValue('shortCode', defaultCountry ? defaultCountry.isoCode.toLowerCase() : 'au');
        }
      }
    };
    getContactNumber();
  }, [userProfileInfo?.verificationInfo]);
  // Handle country selection
  const handleCountryChange = (event: any, value: ICountry | null) => {
    if (value) {
      setSelectedCountry(value);
      setValue('code', `+${value?.phonecode}`);
      setValue('country', value?.name);
      setValue('shortCode', value?.isoCode?.toLowerCase());
      // setPhoneCode(`+${value.phonecode}`);
    }
  };
  useEffect(() => {
    setValue('number', `${phonePrefix + phoneRemainingNumber}`);
  }, [phonePrefix, phoneRemainingNumber]);

  // Function to handle Reference between prefix and remaining phoneNumber field
  const handlePrefixChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPhonePrefix(value);
    if (value.length === 2) {
      remainingPhoneInputRef.current?.focus();
    }
  };

  const handleRemainingPhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && phoneRemainingNumber === '') {
      prefixInputRef.current?.focus();
    }
  };
  //Matching One
  const isPhoneNumberMatch = () => {
    const countryDialCode = watch('code') ?? '';
    const phoneNumber = watch('number');
    const matchNumber = phoneNumber?.replace(countryDialCode, '') || '';
    const userProfilePhoneNumber = userProfileInfo?.verificationInfo?.phone?.number;
    return matchNumber === userProfilePhoneNumber;
  };
  //Disabled Button
  const isRestrictRSuspend =
    isPartnerRestrict(partnerAccess) || isPartnerSuspended(partnerAccess) || isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess);
  const isButtonDisabled = watch('number') === watch('code') || (watch('number')?.length || 0) < 6 || isLoading || isRestrictRSuspend;

  //Have Previous Number
  const havePreviousContact = userProfileInfo?.verificationInfo?.phone?.number !== '';
  return (
    <CommonForm handleFunction={handleSubmit(savePhoneData)}>
      <div className="flex flex-col md:flex-row md:justify-between gap-2">
        <div className="flex items-center">
          <Autocomplete
            options={filteredCountries}
            getOptionLabel={(option) => option.name}
            value={selectedCountry ?? undefined}
            onChange={handleCountryChange}
            isOptionEqualToValue={(option, value) => option.isoCode === value?.isoCode}
            disableClearable
            renderOption={(props, option) => (
              <li {...props} key={option.isoCode}>
                <Image
                  src={`https://flagcdn.com/w20/${option.isoCode.toLowerCase()}.png`}
                  alt={option.name}
                  width={20}
                  height={15}
                  className="mr-2"
                />
                {/* {option.name} */}
              </li>
            )}
            className="w-20"
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: selectedCountry ? (
                    <Image
                      src={`https://flagcdn.com/w20/${selectedCountry.isoCode.toLowerCase()}.png`}
                      alt={selectedCountry.name}
                      width={20}
                      height={15}
                      style={{ marginRight: 8 }}
                    />
                  ) : null,
                }}
              />
            )}
          />

          {/* Display phone code */}
          <TextField value={watch('code') || ''} variant="outlined" disabled size="small" className="w-16 mx-1" />

          {/* Phone prefix */}
          <TextField
            value={phonePrefix}
            onChange={handlePrefixChange}
            variant="outlined"
            size="small"
            className="w-12 mx-1"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 2,
              onInput: (event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
              },
            }}
            inputRef={prefixInputRef}
          />

          {/* Remaining number */}
          <TextField
            value={phoneRemainingNumber}
            onChange={(e) => setPhoneRemainingNumber(e.target.value)}
            onKeyDown={handleRemainingPhoneKeyDown}
            variant="outlined"
            size="small"
            className="w-40 mx-1"
            inputRef={remainingPhoneInputRef}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 14,
              onInput: (event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
              },
            }}
          />
        </div>
        {/* Conditionally Button Show */}
        {havePreviousContact ? (
          <>
            {isPhoneNumberMatch() && userProfileInfo?.verificationInfo?.phone?.isVerified ? (
              <span className="text-success">{`${isSmallScreen ? '(Verified)' : 'Verified'}`}</span>
            ) : (
              <div className="flex items-center">
                {isPhoneNumberMatch() ? (
                  <Button variant="text" type="submit" disabled={isButtonDisabled} className="normal-case underline">
                    {isLoading ? 'Verifying' : 'Verify'}
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" type="submit" disabled={isButtonDisabled} className="normal-case">
                    {isLoading ? 'Updating' : 'Update'}
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center">
            <Button variant="contained" color="success" type="submit" disabled={isButtonDisabled} className="normal-case">
              {isLoading ? 'Saving' : 'Save'}
            </Button>
          </div>
        )}
      </div>
    </CommonForm>
  );
};

export default ContactVerify;
