'use client';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { HookFormComponentProps } from '@/types/componentTypes';
import { Box, TextField, Typography } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SectionHeader from '../SectionHeader';

const SecondaryContact = ({
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
  const firstPointOfContactIsMe = watch('guidelines.firstPointOfContactIsMe');
  const secondPointOfContactOther = watch('guidelines.secondPointOfContactOther');
  // const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const phoneInputError = errors?.guidelines?.secondaryContact?.phoneNumber?.message;
  const firstName = watch('guidelines.secondaryContact.phoneNumber');
  const lastName = watch('guidelines.secondaryContact.lastName');
  const email = watch('guidelines.secondaryContact.email');
  const phoneNumber = watch('guidelines.secondaryContact.phoneNumber');
  const handlePhoneInputChange = (value: any) => {
    setValue('guidelines.secondaryContact.phoneNumber', value);
  };
  // const handleFirstPointOfContactChange = (value:any) => {
  //   if (value) {
  //     setValue('guidelines.secondPointOfContactOther', false);
  //   }
  //   setValue('guidelines.firstPointOfContactIsMe', value);
  // };

  // const handleSecondPointOfContactChange = (value:any) => {
  //   if (value) {
  //     setValue('guidelines.firstPointOfContactIsMe', false);
  //   }
  //   setValue('guidelines.secondPointOfContactOther', value);
  // };
  const ErrorMessage = () => <span style={{ color: 'red' }}>Invalid phone number</span>;
  return (
    <div>
      <SectionHeader
        title="Secondary Contact"
        subtitle="Provide an alternative contact person who can answer questions and make decisions about your car in case you are unavailable or serve as the initial point of contact."
      />
      <Box className="grid grid-cols-2 gap-4">
        <TextField
          label="First Name"
          variant="outlined"
          size="small"
          {...register('guidelines.secondaryContact.firstName', {
            required: secondPointOfContactOther,
            pattern: {
              value: /^[A-Za-z\s]+$/, // Regular expression to allow letters and spaces only
              message: 'Please enter a valid first name',
            },
            maxLength: {
              value: 50,
              message: 'Please write within 50 characters',
            },
            // pattern: {
            //   value: /^[A-Z][a-z]{1,14}$/,
            //   message: 'First letter should be capital, number is not allowed',
            // },
          })}
          error={!!errors?.guidelines?.secondaryContact?.firstName}
          helperText={errors?.guidelines?.secondaryContact?.firstName?.message}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          size="small"
          {...register('guidelines.secondaryContact.lastName', {
            required: secondPointOfContactOther,
            pattern: {
              value: /^[A-Za-z\s]+$/, // Regular expression to allow letters and spaces only
              message: 'Please enter a valid last name',
            },
            maxLength: {
              value: 50,
              message: 'Please write within 50 characters',
            },
            // pattern: {
            //   value: /^[A-Z][a-z]{1,14}$/,
            //   message: 'First letter should be capital, number is not allowed',
            // },
          })}
          error={!!errors?.guidelines?.secondaryContact?.lastName}
          helperText={errors?.guidelines?.secondaryContact?.lastName?.message}
        />
        <TextField
          label="Email"
          variant="outlined"
          size="small"
          {...register('guidelines.secondaryContact.email', {
            required: secondPointOfContactOther,
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
              message: 'Invalid email format',
            },
          })}
          error={!!errors?.guidelines?.secondaryContact?.email}
          helperText={errors?.guidelines?.secondaryContact?.email?.message}
        />
        <div>
          {/* <PhoneInput
            country={'au'}
            autoFormat={false}
            placeholder="Phone Number"
            enableSearch={true}
            onlyCountries={['us', 'bd', 'au', 'ru', 'in', 'pk', 'my', 'de', 'pl', 'id', 'fr', 'ie']}
            inputStyle={{ width: '100%', height: '40px' }}
            value={phoneNumber}
            onChange={handlePhoneInputChange}
            inputProps={{
              ...register('guidelines.secondaryContact.phoneNumber', {
                required: secondPointOfContactOther,
                validate: (value, message) => {
                  if (value) {
                    const parsedPhoneNumber = parsePhoneNumberFromString(value);
                    // if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                    //   message = 'Invalid phone format';
                    // }
                    //@ts-ignore
                    return parsedPhoneNumber || parsedPhoneNumber?.isValid() || 'Invalid phone format';
                  }
                  // if (value) {
                  //   const parsedPhoneNumber = parsePhoneNumberFromString(value);
                  //   if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                  //     message = 'Invalid phone format';
                  //   }
                  //   return message;
                  // }
                },
              }),
            }}
          /> */}
          <PhoneInput
            country={'au'}
            autoFormat={false}
            placeholder="Phone Number"
            enableSearch={true}
            onlyCountries={['us', 'bd', 'au', 'ru', 'in', 'pk', 'my', 'de', 'pl', 'id', 'fr', 'ie']}
            inputStyle={{ width: '100%', height: '40px' }}
            value={watch('guidelines.secondaryContact.phoneNumber')}
            onChange={handlePhoneInputChange}
          />

          {phoneInputError && <span className="text-error text-xs">{phoneInputError}</span>}
        </div>
      </Box>
      <Box className="grid grid-cols-12 items-center gap-2">
        <Box className="md:col-span-7 col-span-12 text-left">
          <Typography>Whom should we or Guest contact as the first point of call?</Typography>
        </Box>
        <Box>
          <div className="md:flex gap-12 items-center">
            <div className="md:w-1/2 p-0">
              <CheckBox
                control={control}
                registerName="guidelines.firstPointOfContactIsMe"
                label="You"
                // onChange={() => {
                //   trigger?.(firstPointOfContactIsMe);
                // }}
                onChange={() => {
                  setValue('guidelines.secondPointOfContactOther', false);
                  setValue('guidelines.firstPointOfContactIsMe', true);
                  trigger?.('guidelines.firstPointOfContactIsMe');
                }}
                required={!secondPointOfContactOther}
              />
            </div>
            <div className="md:w-1/2 p-0 whitespace-nowrap">
              <CheckBox
                control={control}
                registerName="guidelines.secondPointOfContactOther"
                label="Secondary Contact"
                // onChange={() => {
                //   trigger?.(secondPointOfContactOther);
                // }}
                onChange={() => {
                  setValue('guidelines.firstPointOfContactIsMe', false);
                  setValue('guidelines.secondPointOfContactOther', true);
                  trigger?.('guidelines.secondPointOfContactOther');
                }}
                required={!firstPointOfContactIsMe}
              />
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default SecondaryContact;
