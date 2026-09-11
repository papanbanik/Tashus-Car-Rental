'use client';
import Tooltip from '@mui/material/Tooltip';
import React, { ReactNode } from 'react';

interface CustomTTooltipProps {
  title: string | ReactNode;
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

const CustomToolTip: React.FC<CustomTTooltipProps> = ({ title, placement, arrow, children, sx }) => {
  return (
    <Tooltip
      enterTouchDelay={0}
      title={title}
      placement={placement}
      arrow={arrow}
      sx={{ ...sx, zIndex: '10000' }}
      PopperProps={{
        modifiers: [
          {
            name: 'zIndex',
            enabled: true,
            phase: 'main',
            fn: ({ state }) => {
              state.styles.popper.zIndex = '10000';
            },
          },
        ],
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CustomToolTip;
