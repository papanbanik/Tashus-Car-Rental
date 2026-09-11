import React, { useState } from 'react';

import { Button, IconButton, MenuItem, Popover, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AiOutlineInfoCircle } from 'react-icons/ai';

interface TravelDueAmountCommonProps {
  label: string;
  amount: number;
  isPayable?: boolean;
  buttonText: string;
  redirectUrl: string;
  tooltipText?: string;
  onButtonClick?: () => void;
  disableButton?: boolean;
  isSmall?: boolean;
  enablePopover?: boolean;
  menuOptions?: { label: string; onClick: () => void }[];
}

const TravelDueAmountCommon: React.FC<TravelDueAmountCommonProps> = ({
  label,
  amount,
  isPayable,
  buttonText,
  redirectUrl,
  tooltipText,
  onButtonClick,
  disableButton = false,
  isSmall,
  enablePopover = false,
  menuOptions = [],
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (enablePopover && menuOptions?.length > 0) {
      setAnchorEl(event.currentTarget);
    } else {
      onButtonClick ? onButtonClick() : router.push(redirectUrl);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className={`flex justify-between items-center ${isSmall ? 'w-full' : ''}`}>
      <div className={`flex justify-center  font-bold ${isSmall ? 'text-sm ' : 'text-base'}`}>
        {label}: <span className={`ps-2 ${amount > 0 ? 'text-error' : ''}`}>${amount > 0 ? amount.toFixed(2) : '0.00'}</span>
      </div>
      <div className="flex items-center">
        {tooltipText && (
          <Tooltip enterTouchDelay={0} title={tooltipText} placement="top">
            <IconButton size="small">
              <AiOutlineInfoCircle />
            </IconButton>
          </Tooltip>
        )}
        <Button
          className="me-1 mt-1 rounded-full normal-case px-6"
          variant="contained"
          size="small"
          color="success"
          onClick={handleClick}
          disabled={disableButton}
        >
          {buttonText}
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {menuOptions?.map((option, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                handleClose();
                option.onClick();
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Popover>
      </div>
    </div>
  );
};

export default TravelDueAmountCommon;
