import { colorType } from '@/types/user-verification/userVerificationTypes';
import { getTextColorClass } from '@/utils/Functions/verification/verificationStyleFn';
import { Chip } from '@mui/material';

const ProfileStatus = ({ title, status, message }: { title: string; status: string; message?: string }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold">{title}</span>
        <Chip label={`${status}`} size="small" className="capitalize" variant="outlined" color={getTextColorClass(status) as colorType} />
      </div>
      {!!message && <span className="helping_text text-error">{message}</span>}
    </>
  );
};

export default ProfileStatus;
