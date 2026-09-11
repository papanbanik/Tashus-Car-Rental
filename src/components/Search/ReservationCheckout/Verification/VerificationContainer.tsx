import CommonStatusBadge, { CommonStatusBadgeProps } from '@/components/Common/CommonStatusBadge';
import CommonTooltip from '@/components/Common/CommonTooltip';
import { Button, Chip, IconButton } from '@mui/material';
import { ReactNode } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';

export type VerificationContainerProps = {
  isVerified: boolean;
  isError?: boolean;
  isStatusError?: boolean;
  title: string;
  buttonTitle?: string;
  handleOnClick?: () => void;
  children?: ReactNode;
  verifiedData?: string;
  toolTip?: string;
  isPreviousStepVerified?: boolean;
  showStatus?: boolean;
  statusBadgeProps?: CommonStatusBadgeProps;
  buttonDisabled?: boolean;
  isNotDisabledData?: boolean;
};

const VerificationContainer = ({
  isVerified,
  title,
  buttonTitle,
  handleOnClick,
  children,
  verifiedData,
  isError,
  isStatusError,
  toolTip,
  isPreviousStepVerified,
  showStatus,
  statusBadgeProps,
  buttonDisabled,
  isNotDisabledData,
}: VerificationContainerProps) => {
  return (
    <div className="grid grid-cols-12">
      <p className="md:col-span-4 col-span-6 m-0">
        {title}
        {toolTip && (
          <CommonTooltip title={toolTip} arrow>
            <IconButton className="bg-transparent">
              <IoInformationCircleOutline className="text-primary" size={15} />
            </IconButton>
          </CommonTooltip>
        )}
      </p>
      <div className="md:col-span-8 col-span-6 flex justify-end items-center gap-2">
        {isVerified ? (
          <>
            {title ? (
              <span className="text-gray-400 md:block hidden">
                {verifiedData || `${statusBadgeProps?.status === 'pending' ? 'Pending' : 'Verified'}`}
              </span>
            ) : (
              <span className="text-gray-400 md:block hidden">{`${statusBadgeProps?.status === 'pending' ? 'Pending' : 'Verified'}`}</span>
            )}
            <span className="text-gray-400 md:hidden block">{`${statusBadgeProps?.status === 'pending' ? 'Pending' : 'Verified'}`}</span>

            {showStatus && statusBadgeProps && statusBadgeProps?.status ? (
              <CommonStatusBadge {...statusBadgeProps} isError={isError} />
            ) : (
              <CommonTooltip title={`${isError ? 'Declined' : 'Approved'}`} arrow>
                <IconButton size="small" className="bg-transparent">
                  <MdVerified className={`${isError ? 'text-error' : 'text-success'}`} />
                </IconButton>
              </CommonTooltip>
            )}
            {children}
          </>
        ) : isNotDisabledData ? (
          <div className="flex justify-start items-center">
            <CommonTooltip
              title="You can modify the provided information within 30 minutes. Once the time has expired, you are not able to modify information until our support agent approve/decline it"
              arrow
            >
              <Chip color="info" size="small" variant="outlined" label="Pending" />
            </CommonTooltip>
            <Button
              size="small"
              disabled={!isPreviousStepVerified || buttonDisabled}
              className="normal-case underline text-md font-semibold"
              onClick={handleOnClick}
            >
              {buttonTitle}
            </Button>
          </div>
        ) : isStatusError ? (
          <div className="flex justify-start items-start">
            <CommonTooltip title="Information has been declined by the support team due to a mismatch. Make sure the info you upload is valid." arrow>
              <Chip
                color="error"
                size="small"
                variant="outlined"
                label="Declined"
                // icon={<AiOutlineExclamationCircle className="text-error" size={15} />}
              ></Chip>
            </CommonTooltip>
            <Button
              size="small"
              disabled={!isPreviousStepVerified || buttonDisabled}
              className="normal-case underline text-md font-semibold"
              onClick={handleOnClick}
            >
              {buttonTitle}
            </Button>
          </div>
        ) : (
          <Button
            size="small"
            disabled={!isPreviousStepVerified || buttonDisabled}
            className="normal-case underline text-md font-semibold"
            onClick={handleOnClick}
          >
            {buttonTitle}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VerificationContainer;
