'use client';
import PasswordField from '@/components/Common/HookFormFields/PasswordField';
import { HookFormComponentProps } from '@/types/componentTypes';
const ResetPassword = ({ register, watch, formState }: HookFormComponentProps) => {
  const { errors } = formState;
  return (
    <div className="mt-4">
      <span className="text-md font-semibold">Reset Password</span>
      {/* <div className="grid md:grid-cols-[auto,1fr] mt-4 md:gap-x-24"> */}
      <div>
        {/* <div className="mb-2 md:mb-0 md:flex items-center">
          <span className="text-base">Current Password</span>
        </div> */}
        <div className="my-2 lg:w-2/3">
          <PasswordField
            name="oldPassword"
            label="Current Password"
            size="small"
            register={register}
            // validate={(currentValue) => {
            //   return currentValue === userPassword || 'The current password do not match';
            // }}
            // errors={errors.oldPassword}
          />
        </div>
        {/* <div className="mb-2 md:mb-0 md:flex items-center">
          <span className="text-base">New Password</span>
        </div> */}
        <div className="mb-2 lg:w-2/3">
          <PasswordField
            name="newPassword"
            label="New Password"
            size="small"
            register={register}
            minLength={{
              value: 6,
              message: 'Password must be at least 6 characters',
            }}
            pattern={{
              // value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/,
              // message: 'Password must include symbol, uppercase and lowercase',
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/,
              message: 'Password must include symbol, uppercase, lowercase, and number',
            }}
            // validate={(oldValue) => {
            //   return oldValue === watch('oldPassword') || 'You can not use your current password as your new password';
            // }}
            validate={(value) => {
              if (value === watch('oldPassword')) {
                return 'You cannot use your current password as your new password';
              }
              return true;
            }}
            errors={errors.newPassword}
          />
        </div>
        {/* <div className="mb-2 md:mb-0 md:flex items-center">
          <span className="text-base">Confirm Password</span>
        </div> */}
        <div className="lg:w-2/3">
          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            size="small"
            register={register}
            validate={(currentValue) => {
              return currentValue === watch('newPassword') || 'The password do not match';
            }}
            errors={errors.confirmPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
