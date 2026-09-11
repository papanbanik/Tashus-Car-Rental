'use client';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

interface CommonTooltipProps {
  title: string;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  arrow?: boolean;
  children: React.ReactElement;
  sx?: React.CSSProperties;
}

const CommonTooltip: React.FC<CommonTooltipProps> = ({ title, placement, arrow, children, sx }) => {
  return (
    <Tooltip enterTouchDelay={0} title={title} placement={placement} arrow={arrow} sx={sx}>
      {children}
    </Tooltip>
  );
};

export default CommonTooltip;
