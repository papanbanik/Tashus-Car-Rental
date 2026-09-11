'use client';

import { useUserCredContext } from '@/context/UserCredProvider';
import { useAddUser } from '@/hooks/useSignupValidation';
import { genderList } from '@/types/commonTypes';
import { GeneralInfoValues } from '@/types/signUpTypes';
import { validateName } from '@/utils/Functions/randomCommonFn';
import { Button, FormControl, TextField } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import CommonForm from '../Common/CommonForm';
import CheckBox from '../Common/HookFormFields/CheckBox';
import PasswordField from '../Common/HookFormFields/PasswordField';
import SelectableDropdown from '../Common/HookFormFields/SelectableDropdown';

const defaultValues: GeneralInfoValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  password: '',
  confirmPassword: '',
  isAgreed: false,
};

const GeneralInfo = () => {
  const { register, handleSubmit, watch, formState, trigger, control } = useForm<GeneralInfoValues>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { errors, isValid } = formState;
  const { userCred, setSignUpStep } = useUserCredContext();
  const { mutateAsync } = useAddUser();

  useEffect(() => {
    if (watch('confirmPassword')) {
      trigger('confirmPassword');
    }
  }, [watch('password')]);

  const validateDate = (selectedDate: Date): string | boolean => {
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);

    // Calculate age difference in years
    const ageDifference = currentDate.getFullYear() - selectedDateObj.getFullYear();

    // Check if selected date is more than 18 years ago
    if (ageDifference < 18) {
      return false;
    } else if (ageDifference === 18) {
      // If the year difference is exactly 18, compare the month and day
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();
      const selectedMonth = selectedDateObj.getMonth();
      const selectedDay = selectedDateObj.getDate();

      if (currentMonth < selectedMonth) {
        return false;
      } else if (currentMonth === selectedMonth && currentDay < selectedDay) {
        return false;
      }
    }
    return true;
  };

  const onRegister: SubmitHandler<GeneralInfoValues> = async (data) => {
    // console.log('Data', data);
    try {
      const { firstName, middleName, lastName, password, gender } = data;
      const { userId, email } = userCred;
      const payload = {
        email,
        password,
        gender,
        firstName,
        lastName,
        userId,
        ...(middleName && middleName.trim() && { middleName }),
      };

      await mutateAsync(payload);

      if (pathName === '/login') {
        const returnUrl = searchParams.get('return_url') ? `return_url=${searchParams.get('return_url')}&` : '';
        router.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/login?${returnUrl}step=email-resend`);
      } else {
        setSignUpStep({ previous: 'info', current: 'email-resend' });
      }
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  return (
    <>
      <CommonForm handleFunction={handleSubmit(onRegister)}>
        <FormControl fullWidth className="grid gap-3" variant="outlined">
          <TextField fullWidth label="Email" size="small" variant="outlined" value={userCred?.email} disabled />
          {/* <TextField label="First Name" {...register('firstName')} />
          <TextField label="Last Name" {...register('lastName')} /> */}
          <TextField
            label="First Name"
            size="small"
            {...register('firstName', {
              required: true,
              validate: (value) => validateName(value, 'First Name'),
            })}
            error={!!errors?.firstName}
            helperText={errors?.firstName?.message}
          />
          <TextField
            label="Middle Name (Optional)"
            size="small"
            {...register('middleName', {
              required: false,
            })}
            error={!!errors?.middleName}
            helperText={errors?.middleName?.message}
          />

          <TextField
            label="Last Name"
            size="small"
            {...register('lastName', {
              required: true,
              validate: (value) => validateName(value, 'Last Name'),
            })}
            error={!!errors?.lastName}
            helperText={errors?.lastName?.message}
          />
          {/* Added Gender Selectable */}
          <SelectableDropdown control={control} registerName="gender" label="Gender" options={genderList} required={true} />
          <PasswordField
            name="password"
            label="Password"
            size="small"
            register={register}
            minLength={{
              value: 6,
              message: 'Password must be at least 6 characters',
            }}
            pattern={{
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/,
              message: 'Password must include symbol, uppercase, lowercase, and number',
            }}
            // pattern={{
            //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/,
            //   message: 'Password must include symbol, uppercase and lowercase',
            // }}
            errors={errors.password}
          ></PasswordField>

          <PasswordField
            name="confirmPassword"
            label="Repeat Password"
            size="small"
            register={register}
            validate={(currentValue) => {
              return currentValue === watch('password') || 'The passwords do not match';
            }}
            errors={errors.confirmPassword}
          ></PasswordField>
          {/* <CommonRadioGroup
              control={control}
              registerName="gender"
              formLabelText="Gender"
              options={genderList}
              required
              defaultValue="male"
              isRow={true}
            /> */}
          <div className="w-full flex justify-start items-center">
            <CheckBox
              control={control}
              registerName="isAgreed"
              htmlLabel={
                <span className="text-xs inline-block">
                  {'By registering, I agree to the '}
                  <Link target="_blank" href={'/legals/terms-and-conditions'} className="text-primary no-underline">
                    Terms and Conditions
                  </Link>
                  {' and '}{' '}
                  <Link target="_blank" href={'/legals/privacy'} className="text-primary no-underline">
                    Privacy Policy
                  </Link>{' '}
                  {'of Tashus'}.
                </span>
              }
              required={true}
              isCustomIcon={true}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="normal-case font-semibold"
            disabled={!watch('firstName') || !watch('lastName') || !watch('password') || !watch('confirmPassword') || !isValid}
          >
            Join Tashus
          </Button>
        </FormControl>
      </CommonForm>
    </>
  );
};

export default GeneralInfo;
