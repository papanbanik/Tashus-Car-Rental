'use client';
import SectionHeader from '@/components/CarListing/SectionHeader';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { getFullAddress, isValidPostalAddressInfo, useWatchedAddressFields } from '@/utils/Functions/verification/verificationFn';
import { ExpandMore } from '@/utils/Functions/verification/verificationStyleFn';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import PostalAddressDetails from './PostalAddressDetails';

const PostalAddressM = ({ register, watch, formState, setValue, handleSubmit, control, reset, getValues, trigger }: HookFormComponentProps) => {
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { errors } = formState;

  const { streetName, countryName, stateName, streetNumber, unitNumber, suburb, postcode } = useWatchedAddressFields('residentialAddressInfo', watch);

  const [sameAsResidential, setSameAsResidential] = useState<boolean>(false);
  //expand
  const [isExpand, setIsExpand] = useState<boolean>(true);

  //const streetAddress = watch('residentialAddressInfo.streetAddress') ?? '';
  const addressValue = getFullAddress(unitNumber, streetNumber, streetName, suburb, stateName, postcode, countryName);
  const handlePostalAddressCopy = () => {
    // const residentialAddressValue = getFullAddress(unitNumber, streetNumber, streetName, suburb, stateName, postcode, countryName);
    setValue('postalAddress', addressValue, { shouldValidate: true });
  };

  useEffect(() => {
    if (sameAsResidential) {
      handlePostalAddressCopy();
    }
  }, [addressValue]);

  useEffect(() => {
    const { postalAddress, postalAddressInfo, residentialAddressInfo } = userProfileVerificationInfo?.guestVerification?.residentialAddress || {};
    if (!!postalAddress) {
      setSameAsResidential(true);
    } else if (!!postalAddressInfo && isValidPostalAddressInfo(postalAddressInfo)) {
      setSameAsResidential(false);
    } else if (!!residentialAddressInfo && isValidPostalAddressInfo(residentialAddressInfo)) {
      setSameAsResidential(false);
    } else {
      setSameAsResidential(true);
    }
  }, [userProfileVerificationInfo?.guestVerification?.residentialAddress]);
  // Handle checkbox toggle
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSameAsResidential(isChecked);
    // setIsExpand(!isChecked);
    if (isChecked) {
      handlePostalAddressCopy();
    } else {
      setValue('postalAddress', '', { shouldValidate: true });
    }
  };
  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
  };
  return (
    <div>
      <div className="mt-4 flex justify-between items-center">
        <SectionHeader title="Postal Address" textSize="text-md" noMargin={true} isOptional={true} />
        <ExpandMore expand={isExpand} onClick={() => setIsExpand(!isExpand)} aria-expanded={isExpand} className="text-md md:text-lg">
          <FaChevronDown />
        </ExpandMore>
      </div>
      <div>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox id="sameAsResidential" size="small" onChange={handleCheckboxChange} checked={sameAsResidential} />}
            label="Same as Residential Address"
            className="text-xs md:text-md whitespace-nowrap my-2"
          />
        </FormGroup>
      </div>
      {isExpand && (
        <>
          {sameAsResidential ? (
            <TextField
              fullWidth
              label="Postal Address"
              size="small"
              variant="outlined"
              value={watch('postalAddress') || ''}
              {...register('postalAddress', {
                required: false,
              })}
              disabled={sameAsResidential}
              error={!!errors?.postalAddress}
              helperText={errors?.postalAddress?.message}
            />
          ) : (
            <PostalAddressDetails {...commonProps} />
          )}
        </>
      )}
    </div>
  );
};

export default PostalAddressM;
