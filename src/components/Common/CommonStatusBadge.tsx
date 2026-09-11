'use client';
import { IconButton } from '@mui/material';

import { MdVerified } from 'react-icons/md';
import { VscUnverified } from 'react-icons/vsc';
import CommonTooltip from './CommonTooltip';
export interface CommonStatusBadgeProps {
  status: string;
  showTooltip?: boolean;
  iconSize?: 'small' | 'medium' | 'large';
  isError?: boolean;
}
const CommonStatusBadge = ({ status, showTooltip, iconSize, isError }: CommonStatusBadgeProps) => {
  return (
    <div>
      {showTooltip ? (
        <CommonTooltip
          // title={status
          //   .split(' ')
          //   .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          //   .join(' ')}
          title={
            status === 'pending'
              ? 'Currently, the status is pending since it requires admin approval. If it is not verified within 24 hours, please contact our support team'
              : status
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
          }
          placement="right"
          arrow
          sx={{ textTransform: 'capitalize' }}
        >
          <IconButton size={iconSize ?? 'small'} className="bg-transparent">
            {status === 'pending' && <VscUnverified className="text-info" />}
            {status === 'approved' && <MdVerified className={`${isError ? 'text-error' : 'text-success'}`} />}
            {status === 'declined' && <VscUnverified className="text-error" />}
          </IconButton>
        </CommonTooltip>
      ) : (
        <>
          {status === 'pending' && <VscUnverified className="text-info" />}
          {status === 'approved' && <MdVerified className={`${isError ? 'text-error' : 'text-success'}`} />}
          {status === 'declined' && <VscUnverified className="text-error" />}
        </>
      )}
    </div>
  );
};

export default CommonStatusBadge;
