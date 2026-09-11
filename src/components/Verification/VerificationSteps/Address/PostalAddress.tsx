'use client';
import SectionHeader from '@/components/CarListing/SectionHeader';
import { ResidentialAddressDetailsProps } from '@/types/user-verification/verificationListingSteps';
import { countryFullName, stateFullName } from '@/utils/Functions/randomCommonFn';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';

const PostalAddress = ({ register, watch, formState, setValue, isDisabledData }: ResidentialAddressDetailsProps) => {
  const { errors } = formState;
  const streetName = watch('residentialAddressInfo.streetName');
  const countryName = watch('residentialAddressInfo.country');
  const stateName = watch('residentialAddressInfo.state');
  const streetNumber = watch('residentialAddressInfo.streetNumber');
  const unitNumber = watch('residentialAddressInfo.unitNumber');
  const suburb = watch('residentialAddressInfo.suburb');
  const postcode = watch('residentialAddressInfo.postcode');
  const isDisabledTickBox = streetName && countryName && streetNumber && suburb && postcode && streetName;
  const handlePostalAddressCopy = () => {
    const residentialAddressValue = `${!!unitNumber ? `Unit ${unitNumber}` : ''} ${streetNumber} ${streetName} ${suburb}, ${stateFullName(
      stateName
    )}, ${postcode} ${countryFullName(countryName)}`;
    setValue('postalAddress', residentialAddressValue, { shouldValidate: true });
  };
  return (
    <div>
      <SectionHeader title="Postal Address" textSize="text-md" />
      <TextField
        fullWidth
        label="Postal Address"
        size="small"
        variant="outlined"
        value={watch('postalAddress') || ''}
        {...register('postalAddress', {
          required: false,
        })}
        disabled={isDisabledData}
        error={!!errors?.postalAddress}
        helperText={errors?.postalAddress?.message}
      />
      <div>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox id="sameAsResidential" onChange={handlePostalAddressCopy} />}
            disabled={!isDisabledTickBox}
            label="Same as Residential Address"
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default PostalAddress;
